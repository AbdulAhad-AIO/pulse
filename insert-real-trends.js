// Direct Supabase REST API insertion using native fetch (no SSL issues on Vercel)
const trends = [
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

const supabaseUrl = 'https://szqixewwpkjlixoueeih.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6cWl4ZXd3cGtqbGl4b3VlZWloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ2MDExNDIsImV4cCI6MjA5MDE3NzE0Mn0.PsWTCQ6vercsjfCg9vLwgjDhwfmFGtzizRfGxeevbGw';

async function insertTrends() {
  console.log('📌 Inserting trends via Supabase REST API...');
  
  for (const trend of trends) {
    try {
      const response = await fetch(`${supabaseUrl}/rest/v1/trends`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify(trend)
      });
      
      if (response.ok) {
        console.log(`✅ ${trend.title.substring(0, 50)}...`);
      } else {
        console.log(`⚠️ ${trend.title.substring(0, 50)}... - ${response.status}`);
      }
    } catch (err) {
      console.error(`❌ ${trend.title.substring(0, 50)}...`, err.message);
    }
  }
  
  console.log('\n✅ Done!');
}

insertTrends();
