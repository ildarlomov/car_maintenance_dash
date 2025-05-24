import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { test } = body;

    if (test === 1) {
      return NextResponse.json({ success: true, message: 'hooray!' });
    }

    return NextResponse.json({ success: false, message: 'not 1 :(' });
  } catch (error) {
    console.error('Test API Error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
} 