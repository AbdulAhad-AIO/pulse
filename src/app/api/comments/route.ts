import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createComment, upvoteComment, getCommentsByThought } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { thought_id, content } = await request.json();

    if (!thought_id || !content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const comment = await createComment(thought_id, userId, content);
    return NextResponse.json(comment, { status: 201 });
  } catch (error: any) {
    console.error('Error creating comment:', error);
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const thought_id = searchParams.get('thought_id');

    if (!thought_id) {
      return NextResponse.json(
        { error: 'thought_id is required' },
        { status: 400 }
      );
    }

    const comments = await getCommentsByThought(thought_id);
    return NextResponse.json(comments);
  } catch (error: any) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
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

    const { comment_id, action } = await request.json();

    if (!comment_id || action !== 'upvote') {
      return NextResponse.json(
        { error: 'Invalid request' },
        { status: 400 }
      );
    }

    const result = await upvoteComment(comment_id);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error upvoting comment:', error);
    return NextResponse.json(
      { error: 'Failed to upvote comment' },
      { status: 500 }
    );
  }
}
