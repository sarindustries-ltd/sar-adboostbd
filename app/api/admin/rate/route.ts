import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  return NextResponse.json({
    rate: db.settings.usdToBdtRate,
    feePercentage: db.settings.feePercentage,
  });
}

export async function POST(req: Request) {
  try {
    const { rate } = await req.json();
    
    if (!rate || typeof rate !== "number" || rate <= 0) {
      return NextResponse.json({ error: "Invalid rate" }, { status: 400 });
    }

    // In a real NestJS/Prisma backend, this would be:
    // await prisma.settings.update({ where: { key: 'USD_TO_BDT_RATE' }, data: { value: rate } })
    db.settings.usdToBdtRate = rate;

    return NextResponse.json({ success: true, rate: db.settings.usdToBdtRate });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
