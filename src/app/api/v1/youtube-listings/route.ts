import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/youtube-listings`, {
      params: Object.fromEntries(searchParams)
    });
    
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('YouTube listings API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch YouTube listings' },
      { status: 500 }
    );
  }
} 