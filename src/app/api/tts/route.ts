import { NextRequest, NextResponse } from 'next/server';

interface TTSRequest {
  text: string;
  language: string;
  gender: string;
}

interface TTSApiResponse {
  taskType: string;
  audio: Array<{
    audioContent: string;
    audioUri: string | null;
  }>;
  config: {
    audioFormat: string;
    language: {
      sourceLanguage: string;
      sourceScriptCode: string;
    };
    encoding: string;
    samplingRate: number;
  };
}

export async function POST(request: NextRequest) {
  try {
    const { text, language, gender }: TTSRequest = await request.json();

    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    const payload = {
      taskType: "tts",
      config: {
        language: {
          sourceLanguage: language || "en"
        },
        gender: gender || "male"
      },
      input: [
        {
          source: text
        }
      ]
    };

    const headers = {
      'Accept': '*/*',
      'User-Agent': 'TTS-App',
      'Authorization': 'a7oDZPwaQoo4-Enr4QuXirLC4V0e6-3GDfK1HgX2nwpoyxsOurrlJg__wIJ4YvO3',
      'Content-Type': 'application/json'
    };

    const response = await fetch(
      'https://dhruva-api.bhashini.gov.in/services/inference/tts?serviceId=ai4bharat/indic-tts-coqui-misc-gpu--t4',
      {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      }
    );

    if (!response.ok) {
      throw new Error(`TTS API error: ${response.status}`);
    }

    const data: TTSApiResponse = await response.json();

    // Extract the audio content
    const audioContent = data.audio?.[0]?.audioContent;
    
    if (!audioContent) {
      throw new Error('No audio content received from TTS API');
    }

    return NextResponse.json({
      success: true,
      audioContent,
      config: data.config
    });

  } catch (error) {
    console.error('TTS API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate speech',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
