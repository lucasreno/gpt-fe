import { NextResponse } from 'next/server';

// The actual backend URL
const API_URL = process.env.API_BASE_URL || 'http://localhost:3000/api';

export async function POST(request: Request) {
  try {
    // Forward the request to the actual backend
    const response = await fetch(`${API_URL}/conversation/start`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: await request.text(),
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error proxying to backend:', error);
    return NextResponse.json(
      { error: 'Failed to communicate with backend service' },
      { status: 500 }
    );
  }
}
