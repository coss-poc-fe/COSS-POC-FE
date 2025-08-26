import { NextRequest, NextResponse } from "next/server";

interface Aggregate {
  customerName: string;
  customerApp: string;
  avg_langdetectionLatency: number | null;
  avg_nmtLatency: number | null;
  avg_llmLatency: number | null;
  avg_ttsLatency: number | null;
  avg_overallPipelineLatency: number | null;
  avg_nmtUsage: number | null;
  avg_llmUsage: number | null;
  avg_ttsUsage: number | null;
  p90_langdetectionLatency: number | null;
  p95_langdetectionLatency: number | null;
  p99_langdetectionLatency: number | null;
  p90_nmtLatency: number | null;
  p95_nmtLatency: number | null;
  p99_nmtLatency: number | null;
  p90_llmLatency: number | null;
  p95_llmLatency: number | null;
  p99_llmLatency: number | null;
  p90_ttsLatency: number | null;
  p95_ttsLatency: number | null;
  p99_ttsLatency: number | null;
  p90_overallPipelineLatency: number | null;
  p95_overallPipelineLatency: number | null;
  p99_overallPipelineLatency: number | null;
}

interface AggregateResponse {
  customerName: string;
  aggregates: Aggregate[];
}

export async function POST(req: NextRequest) {
  try {
    const { customerName } = await req.json();
    if (!customerName) {
      return NextResponse.json({ error: "customerName is required" }, { status: 400 });
    }

    // Mock data with consistent float values
    const mockResponses: Record<string, AggregateResponse> = {
      cust1: {
        customerName: "cust1",
        aggregates: [
          {
            customerName: "cust1",
            customerApp: "cust1app",
            avg_langdetectionLatency: 0.0,
            avg_nmtLatency: 1669.0,
            avg_llmLatency: 1737.0,
            avg_ttsLatency: 2420.0,
            avg_overallPipelineLatency: 5828.0,
            avg_nmtUsage: 36.0,
            avg_llmUsage: 1099.0,
            avg_ttsUsage: 127.0,
            p90_langdetectionLatency: 0.0,
            p95_langdetectionLatency: 0.0,
            p99_langdetectionLatency: 0.0,
            p90_nmtLatency: 1669.0,
            p95_nmtLatency: 1669.0,
            p99_nmtLatency: 1669.0,
            p90_llmLatency: 1737.0,
            p95_llmLatency: 1737.0,
            p99_llmLatency: 1737.0,
            p90_ttsLatency: 2420.0,
            p95_ttsLatency: 2420.0,
            p99_ttsLatency: 2420.0,
            p90_overallPipelineLatency: 5828.0,
            p95_overallPipelineLatency: 5828.0,
            p99_overallPipelineLatency: 5828.0
          }
        ]
      },
      cust2: {
        customerName: "cust2",
        aggregates: [
          {
            customerName: "cust2",
            customerApp: "cust2app",
            avg_langdetectionLatency: 0.0,
            avg_nmtLatency: 1698.0,
            avg_llmLatency: 2873.0,
            avg_ttsLatency: null,
            avg_overallPipelineLatency: 4571.0,
            avg_nmtUsage: 36.0,
            avg_llmUsage: 1106.0,
            avg_ttsUsage: null,
            p90_langdetectionLatency: 0.0,
            p95_langdetectionLatency: 0.0,
            p99_langdetectionLatency: 0.0,
            p90_nmtLatency: 1698.0,
            p95_nmtLatency: 1698.0,
            p99_nmtLatency: 1698.0,
            p90_llmLatency: 2873.0,
            p95_llmLatency: 2873.0,
            p99_llmLatency: 2873.0,
            p90_ttsLatency: null,
            p95_ttsLatency: null,
            p99_ttsLatency: null,
            p90_overallPipelineLatency: 4571.0,
            p95_overallPipelineLatency: 4571.0,
            p99_overallPipelineLatency: 4571.0
          }
        ]
      }
    };

    return NextResponse.json(mockResponses[customerName] || { error: "Customer not found" });
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
