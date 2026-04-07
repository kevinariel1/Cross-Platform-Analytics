import { NextResponse } from 'next/server';

/**
 * INSTAGRAM PROXY ROUTE
 * Real API integration has been removed due to commercial use restrictions.
 * This endpoint now acts as a placeholder and returns an error to trigger the frontend mockup fallback.
 */

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username');

  if (!username) {
    return NextResponse.json({ error: 'Username is required' }, { status: 400 });
  }

  // Return an error to gracefully fall back to the mockup data generator in socialApi.ts
  return NextResponse.json(
    { error: 'Instagram API has been disabled for commercial compliance.' }, 
    { status: 403 }
  );
}
