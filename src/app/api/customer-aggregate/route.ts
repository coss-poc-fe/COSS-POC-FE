import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { customerName } = await req.json();
    if (!customerName) {
      return NextResponse.json({ error: "customerName is required" }, { status: 400 });
    }

    const apiUrl = `https://coss-ai4x.vercel.app/customer_aggregates?customerName=${encodeURIComponent(customerName)}`;

    const res = await fetch(apiUrl, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store"
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch data" }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
