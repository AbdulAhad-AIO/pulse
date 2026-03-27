import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createThought, upvoteThought, getThoughtsByTrend } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { trend_id, content, type } = await request.json();

    if (!trend_id || !content || !type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const thought = await createThought(trend_id, userId, content, type);
    return NextResponse.json(thought, { status: 201 });
  } catch (error: any) {
    console.error('Error creating thought:', error);
    return NextResponse.json(
      { error: 'Failed to create thought' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const trend_id = searchParams.get('trend_id');

    if (!trend_id) {
      return NextResponse.json(
        { error: 'trend_id is required' },
        { status: 400 }
      );
    }

    const thoughts = await getThoughtsByTrend(trend_id);
    return NextResponse.json(thoughts);
  } catch (error: any) {
    console.error('Error fetching thoughts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch thoughts' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { thought_id, action } = await request.json();

    if (!thought_id || action !== 'upvote') {
      return NextResponse.json(
        { error: 'Invalid request' },
        { status: 400 }
      );
    }

    const result = await upvoteThought(thought_id);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error upvoting thought:', error);
    return NextResponse.json(
      { error: 'Failed to upvote thought' },
      { status: 500 }
    );
  }
}
