import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PaymentProvider, TransactionType, TransactionStatus, Prisma } from '@prisma/client';

@Injectable()
export class WalletService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Validates an SSLCommerz transaction and adds BDT to the user's available balance.
   * Uses Double-Entry Ledger logic to record the transaction and update the balance atomically.
   */
  async topUp(userId: string, trxId: string, amountBdt: number): Promise<any> {
    // 1. Validate SSLCommerz transaction (Mocked for this example)
    const isValid = await this.validateSslCommerz(trxId, amountBdt);
    if (!isValid) {
      throw new BadRequestException('Invalid SSLCommerz transaction');
    }

    // Convert to Prisma Decimal to prevent floating-point precision issues
    const amountBdtDec = new Prisma.Decimal(amountBdt);

    // 2. Execute Double-Entry Ledger transaction atomically
    return this.prisma.$transaction(async (tx) => {
      // Check if transaction already processed to prevent double-crediting
      const existingTx = await tx.transaction.findUnique({
        where: { providerTrxId: trxId },
      });
      
      if (existingTx) {
        throw new BadRequestException('Transaction already processed');
      }

      // Create transaction record (DEPOSIT)
      const transaction = await tx.transaction.create({
        data: {
          userId,
          amountBdt: amountBdtDec,
          type: TransactionType.DEPOSIT,
          provider: PaymentProvider.SSLCOMMERZ,
          providerTrxId: trxId,
          status: TransactionStatus.SUCCESS,
        },
      });

      // Update user available balance
      const user = await tx.user.update({
        where: { id: userId },
        data: {
          availableBalanceBdt: {
            increment: amountBdtDec,
          },
        },
      });

      return { 
        transaction, 
        availableBalanceBdt: user.availableBalanceBdt 
      };
    });
  }

  /**
   * Moves the required BDT from 'Available Balance' to 'Locked Balance' 
   * when a user starts an ad campaign to prevent double-spending.
   * Formula: Amount_BDT = Amount_USD * ExchangeRate
   */
  async lockFunds(userId: string, campaignId: string, amountUsd: number): Promise<any> {
    return this.prisma.$transaction(async (tx) => {
      // 1. Get System Settings for Exchange Rate
      const settings = await tx.systemSettings.findUnique({
        where: { id: 'default' },
      });

      if (!settings) {
        throw new InternalServerErrorException('System settings not configured. Exchange rate missing.');
      }

      // 2. Calculate BDT Amount: Amount_BDT = Amount_USD * ExchangeRate
      // Using Prisma Decimal for precise calculation (No floating-point math)
      const exchangeRate = new Prisma.Decimal(settings.exchangeRate);
      const amountUsdDec = new Prisma.Decimal(amountUsd);
      const amountBdtDec = amountUsdDec.mul(exchangeRate);

      // 3. Get User Balance
      const user = await tx.user.findUnique({
        where: { id: userId },
        select: { availableBalanceBdt: true },
      });

      if (!user) {
        throw new BadRequestException('User not found');
      }

      // Check if user has enough available balance
      if (user.availableBalanceBdt.lessThan(amountBdtDec)) {
        throw new BadRequestException('Insufficient available balance to start this campaign');
      }

      // 4. Move funds from Available to Locked
      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: {
          availableBalanceBdt: {
            decrement: amountBdtDec,
          },
          lockedBalanceBdt: {
            increment: amountBdtDec,
          },
        },
      });

      // 5. Log the LOCK transaction
      const transaction = await tx.transaction.create({
        data: {
          userId,
          amountBdt: amountBdtDec, // Positive amount representing the locked value
          type: TransactionType.LOCK,
          provider: PaymentProvider.SYSTEM,
          status: TransactionStatus.SUCCESS,
          metadata: { 
            campaignId, 
            amountUsd: amountUsdDec.toNumber(), 
            exchangeRate: exchangeRate.toNumber() 
          },
        },
      });

      return { 
        transaction, 
        availableBalanceBdt: updatedUser.availableBalanceBdt, 
        lockedBalanceBdt: updatedUser.lockedBalanceBdt 
      };
    });
  }

  /**
   * Mock validation for SSLCommerz.
   * In production, this would call the SSLCommerz validation API.
   */
  private async validateSslCommerz(trxId: string, amount: number): Promise<boolean> {
    // Example: fetch(`https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php?val_id=${trxId}...`)
    return true; 
  }
}
