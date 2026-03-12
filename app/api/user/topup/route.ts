import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

const topupSchema = z.object({
  amount: z.number().positive("Amount must be greater than 0"),
  method: z.enum(["bkash", "nagad", "sslcommerz"], {
    message: "Invalid payment method",
  }),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = topupSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 }
      );
    }

    const { amount, method } = result.data;

    // Simulate Payment Gateway processing delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Update user wallet balance
    db.userWallet.balanceBdt += amount;

    return NextResponse.json({ 
      success: true, 
      balanceBdt: db.userWallet.balanceBdt,
      message: `Successfully added ৳${amount.toLocaleString("en-IN")} via ${method.toUpperCase()}`
    });
  } catch (error) {
    console.error("Top-up error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
