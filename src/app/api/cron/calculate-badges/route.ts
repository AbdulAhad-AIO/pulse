import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, supabase } from '@/lib/supabase';

// Calculate and assign gamification badges
// Runs daily
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

    const results: any = {
      insight_streak_7: 0,
      insight_streak_30: 0,
      top_contributor_1: 0,
      top_contributor_5: 0,
    };

    // Get all users with their insight scores
    const { data: users } = await supabase
      .from('users')
      .select('id, insight_score, thought_count');

    if (!users) {
      return NextResponse.json({ success: true, results });
    }

    // Award badges based on criteria
    for (const user of users) {
      const badges_to_award = [];

      // Insight streak badges (based on insight_score)
      if (user.insight_score >= 70) {
        badges_to_award.push('insight_streak_7');
      }
      if (user.insight_score >= 300) {
        badges_to_award.push('insight_streak_30');
      }

      // Top contributor badges (based on thought_count and upvotes)
      if (user.thought_count >= 5) {
        badges_to_award.push('top_contributor_1');
      }
      if (user.thought_count >= 25) {
        badges_to_award.push('top_contributor_5');
      }

      // Insert new badges
      for (const badge_name of badges_to_award) {
        const { error } = await supabaseAdmin
          .from('badges')
          .upsert(
            {
              user_id: user.id,
              name: badge_name,
            },
            { onConflict: 'user_id,name' }
          );

        if (!error) {
          results[badge_name]++;
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Badges calculated',
      results,
    });
  } catch (error: any) {
    console.error('Error in badge calculation cron:', error);
    return NextResponse.json(
      { error: 'Cron job failed', details: error.message },
      { status: 500 }
    );
  }
}

export const runtime = 'nodejs';
export const maxDuration = 60;
