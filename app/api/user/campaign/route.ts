import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { Campaign } from "@/types";
import { z } from "zod";

const campaignSchema = z.object({
  pageId: z.string().min(1, "Page ID is required"),
  budgetUsd: z.number().positive("Budget must be greater than 0"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = campaignSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 }
      );
    }

    const { pageId, budgetUsd } = result.data;

    const page = db.pages.find((p) => p.id === pageId);
    if (!page) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    const baseBdt = budgetUsd * db.settings.usdToBdtRate;
    const fees = baseBdt * db.settings.feePercentage;
    const totalBdt = baseBdt + fees;

    if (db.userWallet.balanceBdt < totalBdt) {
      return NextResponse.json({ error: "Insufficient balance" }, { status: 400 });
    }

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Deduct from user wallet
    db.userWallet.balanceBdt -= totalBdt;

    // Create new campaign
    const newCampaign: Campaign = {
      id: `CMP-${Math.floor(1000 + Math.random() * 9000)}`,
      pageName: page.name,
      budgetUsd,
      spentUsd: 0,
      status: "pending",
      userBdtCharged: totalBdt,
      createdAt: new Date().toISOString(),
    };

    // Prepend to campaigns list
    db.campaigns.unshift(newCampaign);

    return NextResponse.json({ 
      success: true, 
      campaign: newCampaign,
      balanceBdt: db.userWallet.balanceBdt,
      message: "Campaign launched successfully!"
    });
  } catch (error) {
    console.error("Campaign creation error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
