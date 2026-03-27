import { NextRequest, NextResponse } from 'next/server';
import { getAllTrends, getTrendsByCategory } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '50', 10);

    let trends;

    if (category) {
      trends = await getTrendsByCategory(category, limit);
    } else {
      trends = await getAllTrends(limit);
    }

    return NextResponse.json(trends);
  } catch (error: any) {
    console.error('Error fetching trends:', error);
    return NextResponse.json(
      { error: 'Failed to fetch trends' },
      { status: 500 }
    );
  }
}
