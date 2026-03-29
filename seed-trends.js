const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://szqixewwpkjlixoueeih.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6cWl4ZXd3cGtqbGl4b3VlZWloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ2MDExNDIsImV4cCI6MjA5MDE3NzE0Mn0.PsWTCQ6vercsjfCg9vLwgjDhwfmFGtzizRfGxeevbGw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedTrends() {
  const trends = [
    {
      title: 'OpenAI Releases GPT-4.5 with 10x Performance Boost',
      description: 'Latest AI model shows groundbreaking improvements in reasoning and coding capabilities',
      category: 'tech',
      source: 'hackernews',
      trending_score: 95,
      image_url: null,
      url: 'https://openai.com',
    },
    {
      title: 'Stock Market Hits Record High Amid Tech Boom',
      description: 'Major indices surge as AI and cloud technology companies lead market gains this quarter',
      category: 'business',
      source: 'news',
      trending_score: 88,
      image_url: null,
      url: 'https://finance.example.com',
    },
    {
      title: 'New Breakthrough in Cancer Research Treatment',
      description: 'Scientists announce promising immunotherapy results that increase survival rates by 40%',
      category: 'health',
      source: 'news',
      trending_score: 85,
      image_url: null,
      url: 'https://health.example.com',
    },
    {
      title: 'Remote Work Becomes Permanent for 60% of Tech Workers',
      description: 'Survey shows lasting shift in employment practices after pandemic era',
      category: 'career',
      source: 'devto',
      trending_score: 82,
      image_url: null,
      url: 'https://dev.to/example',
    },
    {
      title: 'Carbon Capture Technology Reaches Commercial Scale',
      description: 'New industrial process removes CO2 directly from atmosphere at competitive cost',
      category: 'business',
      source: 'reddit',
      trending_score: 79,
      image_url: null,
      url: 'https://reddit.com/r/technology',
    },
    {
      title: 'Quantum Computer Solves Complex Encryption Problem',
      description: 'Researchers achieve major milestone in quantum computing security implications',
      category: 'tech',
      source: 'hackernews',
      trending_score: 92,
      image_url: null,
      url: 'https://hackernews.com',
    },
    {
      title: 'New Affordable Housing Initiative Launches in 50 Cities',
      description: 'Government and private sector combine efforts to address housing crisis',
      category: 'home',
      source: 'news',
      trending_score: 76,
      image_url: null,
      url: 'https://housing.example.com',
    },
    {
      title: 'Fitness Trend: Science-Backed Recovery Methods Go Mainstream',
      description: 'Cold plunges and recovery protocols gain popularity among health enthusiasts',
      category: 'health',
      source: 'reddit',
      trending_score: 81,
      image_url: null,
      url: 'https://reddit.com/r/fitness',
    },
    {
      title: 'GitHub Copilot Enterprise Doubles Productivity Claims',
      description: 'Microsoft announces 2x coding speed improvements in latest enterprise study',
      category: 'tech',
      source: 'devto',
      trending_score: 89,
      image_url: null,
      url: 'https://dev.to/example',
    },
    {
      title: 'Sustainable Fashion Brands See Record Growth',
      description: 'Eco-friendly apparel companies report 150% YoY growth as consumers shift priorities',
      category: 'business',
      source: 'news',
      trending_score: 78,
      image_url: null,
      url: 'https://fashion.example.com',
    },
    {
      title: 'Machine Learning Breakthrough Improves Medical Diagnosis',
      description: 'New AI model achieves 98% accuracy in detecting rare diseases from imaging',
      category: 'health',
      source: 'hackernews',
      trending_score: 87,
      image_url: null,
      url: 'https://hackernews.com',
    },
    {
      title: 'Remote Team Collaboration Tools Market Explodes',
      description: 'Spending on work communication platforms reaches $20B annually',
      category: 'business',
      source: 'news',
      trending_score: 74,
      image_url: null,
      url: 'https://business.example.com',
    },
  ];

  console.log('🌱 Seeding trends database...');
  
  for (const trend of trends) {
    try {
      const { data, error } = await supabase
        .from('trends')
        .insert([trend])
        .select();
      
      if (error) {
        console.log(`⚠️  ${trend.title}: ${error.message}`);
      } else {
        console.log(`✅ ${trend.title}`);
      }
    } catch (err) {
      console.error(`❌ Error inserting ${trend.title}:`, err.message);
    }
  }

  console.log('\n✅ Seeding complete!');
}

seedTrends();
