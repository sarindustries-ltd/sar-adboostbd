import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  // In a real NestJS/Prisma backend, this would aggregate the Master Wallet ledger:
  // const bdtCollected = await prisma.transaction.aggregate({ _sum: { amountBdt: true }, where: { type: 'CREDIT_MASTER' } })
  // const usdSpent = await prisma.transaction.aggregate({ _sum: { amountUsd: true }, where: { type: 'DEBIT_META' } })
  
  return NextResponse.json({
    totalBdtCollected: db.masterWallet.totalBdtCollected,
    totalUsdSpent: db.masterWallet.totalUsdSpent,
    currentRate: db.settings.usdToBdtRate,
    campaigns: db.campaigns,
  });
}
