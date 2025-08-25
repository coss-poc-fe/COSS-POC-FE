// src/app/api/processPipeline/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PipelineRequest, PipelineApiResponse } from "@/types/pipeline";




export async function POST(request: NextRequest) {
  try {
    const body: PipelineRequest = await request.json();

    // Basic validation
    if (!body.customerName || !body.customerAppName || !body.input?.text) {
      return NextResponse.json(
        { error: "customerName, customerAppName, and input.text are required" },
        { status: 400 }
      );
    }

    // Build payload
    const payload = {
      customerName: body.customerName,
      customerAppName: body.customerAppName,
      input: {
        text: body.input.text,
        language: body.input.language || "en",
      },
    };

    // Call your real pipeline endpoint
    const response = await fetch("https://coss-ai4x.vercel.app/pipeline", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Pipeline API error: ${response.status}`);
    }

    // Parse API response
    const data: PipelineApiResponse = await response.json();

    return NextResponse.json(data);

  } catch (error) {
    console.error("Pipeline API error:", error);
    return NextResponse.json(
      {
        error: "Failed to process pipeline",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
