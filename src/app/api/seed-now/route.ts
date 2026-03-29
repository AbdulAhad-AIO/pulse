import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Use fetch to call Supabase REST API directly
    const trends = [
      { title: 'OpenAI Releases GPT-4.5', description: 'Major AI breakthrough announced', category: 'tech', source: 'news', trending_score: 95 },
      { title: 'Stock Market Surge', description: 'Tech stocks lead market rally', category: 'business', source: 'news', trending_score: 88 },
      { title: 'Medical Breakthrough', description: 'New cancer treatment shows promise', category: 'health', source: 'news', trending_score: 85 },
    ];

    const results = [];
    for (const trend of trends) {
      try {
        const res = await fetch('https://szqixewwpkjlixoueeih.supabase.co/rest/v1/trends', {
          method: 'POST',
          headers: {
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6cWl4ZXd3cGtqbGl4b3VlZWloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ2MDExNDIsImV4cCI6MjA5MDE3NzE0Mn0.PsWTCQ6vercsjfCg9vLwgjDhwfmFGtzizRfGxeevbGw',
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal',
          },
          body: JSON.stringify(trend),
        });
        
        if (res.ok) {
          results.push({ success: true, title: trend.title });
        } else {
          results.push({ success: false, title: trend.title, status: res.status });
        }
      } catch (err) {
        results.push({ success: false, title: trend.title, error: (err as Error).message });
      }
    }

    return NextResponse.json({ message: 'Seeding complete', results });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
