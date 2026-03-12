import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  return NextResponse.json({
    wallet: db.userWallet,
    campaigns: db.campaigns,
    pages: db.pages,
    rate: db.settings.usdToBdtRate,
    feePercentage: db.settings.feePercentage,
  });
}
