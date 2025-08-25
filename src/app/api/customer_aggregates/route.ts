import { NextRequest, NextResponse } from "next/server";

interface Aggregate {
  customerApp: string;
  langdetectionLatency: number;
  nmtLatency: number;
  llmLatency: number;
  ttsLatency: number;
  overallPipelineLatency: number;
  nmtUsage: number;
  llmUsage: number;
  ttsUsage: number;
}

interface AggregateResponse {
  customerName: string;
  aggregates: Aggregate[];
}

export async function POST(req: NextRequest) {
  try {
    const { customerName } = await req.json();

    if (!customerName) {
      return NextResponse.json(
        { error: "customerName is required" },
        { status: 400 }
      );
    }

    // Mock data (replace this with DB call or real API call later)
    const mockData: Aggregate[] = [
      {
        customerApp: "mobile",
        langdetectionLatency: 123.45,
        nmtLatency: 456.78,
        llmLatency: 234.56,
        ttsLatency: 345.67,
        overallPipelineLatency: 789.12,
        nmtUsage: 12.34,
        llmUsage: 23.45,
        ttsUsage: 34.56,
      },
      {
        customerApp: "web",
        langdetectionLatency: 111.11,
        nmtLatency: 222.22,
        llmLatency: 333.33,
        ttsLatency: 444.44,
        overallPipelineLatency: 555.55,
        nmtUsage: 10.0,
        llmUsage: 20.0,
        ttsUsage: 30.0,
      },
    ];

    const response: AggregateResponse = {
      customerName,
      aggregates: mockData,
    };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
