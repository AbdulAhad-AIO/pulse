import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getTrendById, getThoughtsByTrend } from '@/lib/db';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Get trend details
    const trend = await getTrendById(id);
    if (!trend) {
      return NextResponse.json({ error: 'Trend not found' }, { status: 404 });
    }

    // Get AI insights
    const { data: insights } = await supabase
      .from('trend_ai_insights')
      .select('*')
      .eq('trend_id', id)
      .single();

    // Get thoughts/community posts
    const thoughts = await getThoughtsByTrend(id);

    // Get Q&A threads
    const { data: qa_threads } = await supabase
      .from('qa_threads')
      .select(`*, users(*)`)
      .eq('trend_id', id)
      .order('upvotes', { ascending: false });

    return NextResponse.json({
      trend,
      insights,
      thoughts,
      qa_threads,
    });
  } catch (error: any) {
    console.error('Error fetching trend details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch trend details' },
      { status: 500 }
    );
  }
}
