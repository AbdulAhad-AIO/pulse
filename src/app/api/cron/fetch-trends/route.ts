import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { fetchAllTrends } from '@/lib/trends-data';

// This endpoint is meant to be called by Vercel Cron Jobs
// Every 2 hours: 0 */2 * * *
export async function GET(request: NextRequest) {
  try {
    // Verify the request is from Vercel Cron
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Fetch trends from all sources
    const trends = await fetchAllTrends();

    if (!trends || trends.length === 0) {
      return NextResponse.json(
        { message: 'No new trends found' },
        { status: 200 }
      );
    }

    // Store trends in database, handling duplicates
    const { error } = await supabaseAdmin
      .from('trends')
      .upsert(
        trends.map(t => ({
          title: t.title,
          description: t.description,
          category: t.category,
          source: t.source,
          trending_score: t.trending_score,
          image_url: t.image_url || null,
          search_volume: t.search_volume || null,
        })),
        { onConflict: 'title,source' }
      );

    if (error) {
      console.error('Error storing trends:', error);
      return NextResponse.json(
        { error: 'Failed to store trends', details: error.message },
        { status: 500 }
      );
    }

    console.log(`Successfully fetched and stored ${trends.length} trends`);

    return NextResponse.json({
      success: true,
      message: `Fetched ${trends.length} trends`,
      trendsStored: trends.length,
    });
  } catch (error: any) {
    console.error('Error in trend fetch cron:', error);
    return NextResponse.json(
      { error: 'Cron job failed', details: error.message },
      { status: 500 }
    );
  }
}

export const runtime = 'nodejs';
export const maxDuration = 300;
