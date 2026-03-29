import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const SEEDS = [
  {
    title: 'OpenAI Releases GPT-4.5 with Breakthrough AI Abilities',
    description: 'Latest artificial intelligence model shows remarkable improvements in problem-solving and code generation',
    category: 'tech',
    source: 'hackernews',
    trending_score: 95,
  },
  {
    title: 'Stock Market Surges as AI Companies Lead Rally',
    description: 'Tech sector drives major indices to new records with strong quarterly earnings',
    category: 'business',
    source: 'news',
    trending_score: 88,
  },
  {
    title: 'Scientists Announce Major Breakthrough in Cancer Treatment',
    description: 'New immunotherapy approach shows 40% improvement in survival rates for patients',
    category: 'health',
    source: 'news',
    trending_score: 85,
  },
  {
    title: 'Remote Work Becomes Permanent Reality for Tech Industry',
    description: 'Major survey shows 60% of technology workers now work permanently from home',
    category: 'career',
    source: 'devto',
    trending_score: 82,
  },
  {
    title: 'Quantum Computing Reaches Commercial Milestone',
    description: 'New quantum processors solve complex problems in minutes instead of years',
    category: 'tech',
    source: 'hackernews',
    trending_score: 92,
  },
  {
    title: 'GitHub Copilot Enterprise Doubles Developer Productivity',
    description: 'Microsoft releases latest AI coding assistant with 2x speed improvements',
    category: 'tech',
    source: 'devto',
    trending_score: 89,
  },
  {
    title: 'Machine Learning Model Achieves Medical Diagnosis Breakthrough',
    description: 'AI system demonstrates 98% accuracy in detecting rare medical conditions',
    category: 'health',
    source: 'hackernews',
    trending_score: 87,
  },
  {
    title: 'Sustainable Fashion Market Experiences Explosive Growth',
    description: 'Eco-friendly clothing brands report 150% year-over-year revenue growth',
    category: 'business',
    source: 'news',
    trending_score: 78,
  },
  {
    title: 'Carbon Capture Technology Goes Mainstream for Energy Companies',
    description: 'Industrial-scale CO2 removal now economically competitive with fossil fuels',
    category: 'business',
    source: 'reddit',
    trending_score: 79,
  },
  {
    title: 'Affordable Housing Initiative Launches in 50 Major Cities',
    description: 'Public-private partnership aims to build 100,000 affordable homes nationwide',
    category: 'home',
    source: 'news',
    trending_score: 76,
  },
  {
    title: 'Recovery Science Becomes Mainstream Among Athletes and Fitness Enthusiasts',
    description: 'Cold exposure therapy and recovery protocols gain scientific validation',
    category: 'health',
    source: 'reddit',
    trending_score: 81,
  },
  {
    title: 'Enterprise Collaboration Tools Market Hits $20 Billion Milestone',
    description: 'Global spending on team communication platforms reaches record levels',
    category: 'business',
    source: 'news',
    trending_score: 74,
  },
];

export async function POST(request: NextRequest) {
  // Simple security check
  const authHeader = request.headers.get('x-seed-key');
  if (authHeader !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    console.log('🌱 Starting trend seeding...');

    const { data, error } = await supabase
      .from('trends')
      .insert(SEEDS)
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: error.message, details: error },
        { status: 400 }
      );
    }

    console.log(`✅ Successfully seeded ${data?.length || 0} trends`);

    return NextResponse.json(
      {
        message: `Successfully seeded ${data?.length || 0} trends`,
        trends: data,
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error('Seeding error:', err);
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
