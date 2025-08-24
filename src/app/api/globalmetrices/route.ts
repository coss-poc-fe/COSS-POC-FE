import { NextResponse } from "next/server";

export async function GET() {
  try {
    const latencyData = [
      {
        customerName: "CustomerA",
        customerApp: "AppX",
        requestId: "xudh",
        langdetectionLatency: 120,
        nmtLatency: 230,
        llmLatency: 340,
        ttsLatency: 180,
        overallPipelineLatency: 1070
      },
      {
        customerName: "CustomerB",
        customerApp: "AppY",
        requestId: "ytge",
        langdetectionLatency: 100,
        nmtLatency: 200,
        llmLatency: 300,
        ttsLatency: 150,
        overallPipelineLatency: 750
      }
    ];

    return NextResponse.json(latencyData);
  } catch (error) {
    console.error('Latency API error:', error);
    return NextResponse.json({ error: 'Failed to fetch latency data' }, { status: 500 });
  }
}
