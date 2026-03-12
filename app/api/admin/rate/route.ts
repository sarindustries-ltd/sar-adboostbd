import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

const rateSchema = z.object({
  rate: z.number().positive("Rate must be greater than 0"),
});

export async function GET() {
  return NextResponse.json({
    rate: db.settings.usdToBdtRate,
    feePercentage: db.settings.feePercentage,
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = rateSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 }
      );
    }

    const { rate } = result.data;

    // In a real NestJS/Prisma backend, this would be:
    // await prisma.settings.update({ where: { key: 'USD_TO_BDT_RATE' }, data: { value: rate } })
    db.settings.usdToBdtRate = rate;

    return NextResponse.json({ success: true, rate: db.settings.usdToBdtRate });
  } catch (error) {
    console.error("Update rate error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
