import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET() {
  const SEEDS = [
    { title: 'OpenAI Releases GPT-4.5 Major Update', description: 'New AI model shows remarkable reasoning improvements', category: 'tech', source: 'hackernews', trending_score: 95 },
    { title: 'Stock Market Reaches New All-Time High', description: 'Tech sector drives major indices surge', category: 'business', source: 'news', trending_score: 88 },
    { title: 'Cancer Treatment Breakthrough Announced', description: 'New immunotherapy increases survival rates significantly', category: 'health', source: 'news', trending_score: 85 },
    { title: 'Remote Work Becomes Industry Standard', description: 'Survey shows permanent shift in workplace culture', category: 'career', source: 'devto', trending_score: 82 },
    { title: 'Quantum Computing Milestone Achieved', description: 'Major breakthrough in quantum error correction', category: 'tech', source: 'hackernews', trending_score: 92 },
    { title: 'GitHub Copilot Enterprise Launch', description: 'Microsoft releases enterprise AI coding assistant', category: 'tech', source: 'devto', trending_score: 89 },
    { title: 'AI Improves Medical Diagnostics Accuracy', description: 'Machine learning model achieves 98% diagnostic accuracy', category: 'health', source: 'hackernews', trending_score: 87 },
    { title: 'Sustainable Fashion Booms in Market', description: 'Eco-friendly brands see record growth', category: 'business', source: 'news', trending_score: 78 },
    { title: 'Carbon Capture Goes Commercial', description: 'New technology removes CO2 at competitive prices', category: 'business', source: 'reddit', trending_score: 79 },
    { title: 'Housing Initiative Launches Nationwide', description: 'New affordable housing program announced', category: 'home', source: 'news', trending_score: 76 },
    { title: 'Fitness Recovery Science Gains Traction', description: 'Cold therapy and recovery protocols validated', category: 'health', source: 'reddit', trending_score: 81 },
    { title: 'Collaboration Tools Market Soars', description: 'Enterprise communication spending reaches $20B', category: 'business', source: 'news', trending_score: 74 },
  ];

  try {
    // Delete existing test data first
    await supabase.from('trends').delete().eq('source', 'hackernews');
    await supabase.from('trends').delete().eq('source', 'devto');
    await supabase.from('trends').delete().eq('source', 'reddit');
    await supabase.from('trends').delete().eq('source', 'news');

    // Insert new data
    const { data, error } = await supabase
      .from('trends')
      .insert(SEEDS)
      .select();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: `Seeded ${data?.length || 0} trends`,
      trends_count: data?.length || 0,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
