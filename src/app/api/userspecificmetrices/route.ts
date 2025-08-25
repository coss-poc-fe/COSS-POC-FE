import { NextResponse } from 'next/server';

export async function GET() {
  // Example static response for now
  return NextResponse.json({ message: 'Userspecific metrics endpoint' });
}
