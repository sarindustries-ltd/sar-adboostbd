import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    // In a real app, we would use the session.accessToken to fetch pages from Facebook Graph API
    // const response = await fetch(`https://graph.facebook.com/v19.0/me/accounts?access_token=${session?.accessToken}`);
    // const data = await response.json();

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock response
    const mockPages = [
      { id: "1", name: "Tech Store BD", category: "Electronics" },
      { id: "2", name: "Style Dhaka", category: "Clothing" },
      { id: "3", name: "Gadget BD", category: "Electronics" },
    ];

    return NextResponse.json({ data: mockPages });
  } catch (error) {
    console.error("Fetch Facebook pages error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
