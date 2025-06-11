
import { NextResponse } from 'next/server';
import { get } from '@vercel/edge-config';

export const config = { matcher: '/welcome' };

export async function middleware() {
  try {
    const greeting = await get('greeting');
    // NextResponse.json works in Next.js 13.1+ (your project uses 15.x)
    return NextResponse.json(greeting ?? { error: "Greeting not found in Edge Config" });
  } catch (error) {
    console.error("Error fetching from Edge Config:", error);
    return NextResponse.json({ error: "Failed to retrieve greeting" }, { status: 500 });
  }
}
