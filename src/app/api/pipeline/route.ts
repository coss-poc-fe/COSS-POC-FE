// src/app/api/processPipeline/route.ts
import { NextRequest, NextResponse } from "next/server";

interface PipelineRequest {
  customerName: string;
  customerAppName: string;
  input: {
    text: string;
    language?: string;
  };
}

interface PipelineApiResponse {
  requestId: string;
  status: string;
  pipelineOutput: Record<string, string>;
  responseData: string;
  latency: Record<string, string>;
  timestamp: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: PipelineRequest = await request.json();

    if (!body.customerName || !body.customerAppName || !body.input?.text) {
      return NextResponse.json(
        { error: "customerName, customerAppName, and input.text are required" },
        { status: 400 }
      );
    }

    const payload = {
      customerName: body.customerName,
      customerAppName: body.customerAppName,
      input: {
        text: body.input.text,
        language: body.input.language || "en",
      },
    };

    const headers = {
      "Accept": "*/*",
      "User-Agent": "Pipeline-App",
      "Authorization": "Bearer your-api-key",
      "Content-Type": "application/json",
    };

    // Replace 'https://pipeline-url' with your actual backend pipeline API URL
    const response = await fetch("https://pipeline-url", {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Pipeline API error: ${response.status}`);
    }

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
