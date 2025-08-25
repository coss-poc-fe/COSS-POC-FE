// src/types/pipeline.ts
export interface PipelineRequest {
  customerName: string;
  customerAppName: string;
  input: {
    text: string;
    language?: string;
  };
}

export interface PipelineApiResponse {
  requestId: string;
  status: string;
  pipelineOutput: {
    NMT?: string;
    LLM?: string;
    TTS?: string; // base64 audio string
  };
  latency: Record<string, number>; // Change to number for processing time
  timestamp: string;
}
