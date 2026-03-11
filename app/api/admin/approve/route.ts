import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { campaignId } = await req.json();

    // 1. Find the pending campaign
    const campaign = db.campaigns.find((c) => c.id === campaignId);
    if (!campaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }
    if (campaign.status !== "pending") {
      return NextResponse.json({ error: "Campaign is not pending" }, { status: 400 });
    }

    // 2. Trigger Meta API Call using Admin's System Token
    // In a real NestJS backend, this would be an HTTP call to Facebook Graph API
    const systemToken = process.env.META_SYSTEM_TOKEN || "mock_admin_system_token_123";
    const adAccountId = process.env.META_AD_ACCOUNT_ID || "act_123456789";
    
    console.log(`[Meta API] POST https://graph.facebook.com/v19.0/${adAccountId}/campaigns`);
    console.log(`[Meta API] Token: ${systemToken}`);
    console.log(`[Meta API] Payload: { name: "${campaign.pageName} Boost", objective: "OUTCOME_TRAFFIC", status: "ACTIVE", daily_budget: ${campaign.budgetUsd * 100} }`); // Meta expects budget in cents

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Mock response from Meta
    const metaResponse = { id: `meta_cmp_${Math.floor(Math.random() * 1000000)}`, success: true };

    // 3. Update Master Wallet (Double-Entry Ledger Logic)
    // In Prisma:
    // await prisma.$transaction([
    //   prisma.ledger.create({ data: { account: 'MASTER_BDT', type: 'CREDIT', amount: campaign.userBdtCharged } }),
    //   prisma.ledger.create({ data: { account: 'META_USD', type: 'DEBIT', amount: campaign.budgetUsd } }),
    //   prisma.campaign.update({ where: { id: campaignId }, data: { status: 'active', metaCampaignId: metaResponse.id } })
    // ])
    
    db.masterWallet.totalBdtCollected += campaign.userBdtCharged;
    db.masterWallet.totalUsdSpent += campaign.budgetUsd;
    campaign.status = "active";

    return NextResponse.json({ success: true, campaign, metaResponse });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
