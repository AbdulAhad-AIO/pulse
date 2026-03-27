import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { supabase, supabaseAdmin } from '@/lib/supabase';
import { answerTrendQuestion } from '@/lib/ai';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { trend_id, question } = await request.json();

    if (!trend_id || !question) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get trend data
    const { data: trend } = await supabase
      .from('trends')
      .select('*')
      .eq('id', trend_id)
      .single();

    if (!trend) {
      return NextResponse.json(
        { error: 'Trend not found' },
        { status: 404 }
      );
    }

    // Get top upvoted comments for context
    const { data: topComments } = await supabase
      .from('thoughts')
      .select('content')
      .eq('trend_id', trend_id)
      .order('upvotes', { ascending: false })
      .limit(5);

    const communityComments = topComments?.map(c => c.content) || [];
    const trendData = `${trend.title}: ${trend.description}`;

    // Generate AI answer
    const ai_answer = await answerTrendQuestion(question, trendData, communityComments);

    // Store Q&A thread
    const { data: qaThread, error } = await supabaseAdmin
      .from('qa_threads')
      .insert({
        trend_id,
        user_id: userId,
        question,
        ai_answer,
        upvotes: 0,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json(qaThread, { status: 201 });
  } catch (error: any) {
    console.error('Error answering question:', error);
    return NextResponse.json(
      { error: 'Failed to answer question', details: error.message },
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

    const { data: qa_threads, error } = await supabase
      .from('qa_threads')
      .select('*, users(*)')
      .eq('trend_id', trend_id)
      .order('upvotes', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json(qa_threads);
  } catch (error: any) {
    console.error('Error fetching Q&A threads:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Q&A threads' },
      { status: 500 }
    );
  }
}
