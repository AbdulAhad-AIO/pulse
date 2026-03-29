import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  const SAMPLE_TRENDS = [
    { title: 'AI Model GPT-4.5 Released with Breakthrough Abilities', description: 'OpenAI announces major updates to their flagship AI model with improved reasoning', category: 'tech', source: 'news', trending_score: 95 },
    { title: 'Stock Market Hits Record Highs on Tech Surge', description: 'Major indices surge as artificial intelligence and cloud companies lead market gains', category: 'business', source: 'news', trending_score: 88 },
    { title: 'Cancer Research Shows Major Treatment Breakthrough', description: 'New immunotherapy approach increases survival rates significantly', category: 'health', source: 'news', trending_score: 85 },
    { title: 'Remote Work Becomes Permanent in Tech Industry', description: 'Survey shows lasting shift in workplace culture after hybrid adoption', category: 'career', source: 'news', trending_score: 82 },
    { title: 'Quantum Computing Reaches Major Commercial Milestone', description: 'New quantum processors solve complex problems exponentially faster', category: 'tech', source: 'news', trending_score: 92 },
    { title: 'GitHub Copilot Enterprise Platform Launches Globally', description: 'Microsoft releases AI-powered coding assistant for enterprise teams', category: 'tech', source: 'news', trending_score: 89 },
    { title: 'AI Breakthrough Improves Medical Diagnosis Accuracy', description: 'Machine learning model achieves 98% accuracy in detecting diseases early', category: 'health', source: 'news', trending_score: 87 },
    { title: 'Sustainable Fashion Market Experiences Explosive Growth', description: 'Eco-friendly apparel companies report record revenue growth', category: 'business', source: 'news', trending_score: 78 },
    { title: 'Carbon Capture Technology Goes Mainstream for Industry', description: 'Industrial-scale CO2 removal becomes economically competitive', category: 'business', source: 'news', trending_score: 79 },
    { title: 'New Affordable Housing Initiative Launches Nationwide', description: 'Government and private sector partnership aims to build affordable homes', category: 'home', source: 'news', trending_score: 76 },
    { title: 'Fitness Recovery Science Becomes Mainstream', description: 'Cold therapy and recovery protocols gain scientific validation', category: 'health', source: 'news', trending_score: 81 },
    { title: 'Enterprise Collaboration Tools Market Explodes', description: 'Global spending on team communication platforms reaches $20 billion', category: 'business', source: 'news', trending_score: 74 },
  ];

  try {
    // Delete existing test trends first
    await supabaseAdmin.from('trends').delete().eq('source', 'news');

    // Insert new sample trends
    const { data, error } = await supabaseAdmin
      .from('trends')
      .insert(SAMPLE_TRENDS)
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    console.log(`✅ Successfully inserted ${data?.length || 0} sample trends`);

    return NextResponse.json({
      success: true,
      message: `Seeded ${data?.length || 0} sample trends`,
      trendsCount: data?.length || 0,
      trends: data?.map(t => ({ title: t.title, source: t.source })) || [],
    });
  } catch (err: any) {
    console.error('Seeding error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
