import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch("https://coss-ai4x.vercel.app/customers");

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status}`);
    }

    const data = await response.json();

    // Return API response directly
    return NextResponse.json(data);
  } catch (error) {
    console.error("Latency API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch latency data" },
      { status: 500 }
    );
  }
}
