import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const response = await fetch('https://coss-ai4x.vercel.app/metrics/requests', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
        
    return NextResponse.json(data, {
      status: 200,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error) {
    console.error('Error fetching requests data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch requests data' },
      { status: 500 }
    );
  }
}