import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, supabase } from '@/lib/supabase';
import { generateTrendInsights } from '@/lib/ai';

// This endpoint generates AI insights for trends that don't have them yet
// Can be called hourly
export async function GET(request: NextRequest) {
  try {
    // Verify the request is from Vercel Cron or internal
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Find trends without AI insights
    const { data: trendsWithoutInsights, error: queryError } = await supabase
      .from('trends')
      .select('id, title, description')
      .not('id', 'in', `(SELECT trend_id FROM trend_ai_insights)`)
      .order('created_at', { ascending: false })
      .limit(5); // Process 5 at a time to avoid timeout

    if (queryError) {
      throw queryError;
    }

    if (!trendsWithoutInsights || trendsWithoutInsights.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'All trends have AI insights',
      });
    }

    const results = [];

    for (const trend of trendsWithoutInsights) {
      try {
        // Get community comments for context
        const { data: thoughts } = await supabase
          .from('thoughts')
          .select('content')
          .eq('trend_id', trend.id)
          .limit(5);

        const communityComments = thoughts?.map(t => t.content) || [];

        // Generate insights
        const insights = await generateTrendInsights(
          trend.title,
          trend.description,
          communityComments
        );

        // Store AI insights
        const { error: insertError } = await supabaseAdmin
          .from('trend_ai_insights')
          .insert({
            trend_id: trend.id,
            summary: insights.summary || `Trending: ${trend.title}`,
            why_happening: insights.why_happening || '',
            predictions: insights.predictions || [],
            persona_impacts: insights.persona_impacts || {},
            actionable_steps: insights.actionable_steps || [],
          });

        if (insertError) {
          console.error(`Error storing insights for trend ${trend.id}:`, insertError);
        } else {
          results.push({ trend_id: trend.id, status: 'success' });
        }
      } catch (error) {
        console.error(`Error generating insights for trend ${trend.id}:`, error);
        results.push({ trend_id: trend.id, status: 'failed', error: String(error) });
      }
    }

    return NextResponse.json({
      success: true,
      message: `Generated insights for ${trendsWithoutInsights.length} trends`,
      results,
    });
  } catch (error: any) {
    console.error('Error in AI insights cron:', error);
    return NextResponse.json(
      { error: 'Cron job failed', details: error.message },
      { status: 500 }
    );
  }
}

export const runtime = 'nodejs';
export const maxDuration = 300;
