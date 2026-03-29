-- Populate trends table with realistic trending data
INSERT INTO trends (title, description, category, source, trending_score, image_url, url, created_at, updated_at)
VALUES
  ('OpenAI Releases GPT-4.5 with 10x Performance Boost', 'Latest AI model shows groundbreaking improvements in reasoning and coding capabilities', 'tech', 'hackernews', 95, NULL, 'https://openai.com', NOW(), NOW()),
  ('Stock Market Hits Record High Amid Tech Boom', 'Major indices surge as AI and cloud technology companies lead market gains this quarter', 'business', 'news', 88, NULL, 'https://finance.example.com', NOW(), NOW()),
  ('New Breakthrough in Cancer Research Treatment', 'Scientists announce promising immunotherapy results that increase survival rates by 40%', 'health', 'news', 85, NULL, 'https://health.example.com', NOW(), NOW()),
  ('Remote Work Becomes Permanent for 60% of Tech Workers', 'Survey shows lasting shift in employment practices after pandemic era', 'career', 'devto', 82, NULL, 'https://dev.to/example', NOW(), NOW()),
  ('Carbon Capture Technology Reaches Commercial Scale', 'New industrial process removes CO2 directly from atmosphere at competitive cost', 'business', 'reddit', 79, NULL, 'https://reddit.com/r/technology', NOW(), NOW()),
  ('Quantum Computer Solves Complex Encryption Problem', 'Researchers achieve major milestone in quantum computing security implications', 'tech', 'hackernews', 92, NULL, 'https://hackernews.com', NOW(), NOW()),
  ('New Affordable Housing Initiative Launches in 50 Cities', 'Government and private sector combine efforts to address housing crisis', 'home', 'news', 76, NULL, 'https://housing.example.com', NOW(), NOW()),
  ('Fitness Trend: Science-Backed Recovery Methods Go Mainstream', 'Cold plunges and recovery protocols gain popularity among health enthusiasts', 'health', 'reddit', 81, NULL, 'https://reddit.com/r/fitness', NOW(), NOW()),
  ('GitHub Copilot Enterprise Doubles Productivity Claims', 'Microsoft announces 2x coding speed improvements in latest enterprise study', 'tech', 'devto', 89, NULL, 'https://dev.to/example', NOW(), NOW()),
  ('Sustainable Fashion Brands See Record Growth', 'Eco-friendly apparel companies report 150% YoY growth as consumers shift priorities', 'business', 'news', 78, NULL, 'https://fashion.example.com', NOW(), NOW()),
  ('Machine Learning Breakthrough Improves Medical Diagnosis', 'New AI model achieves 98% accuracy in detecting rare diseases from imaging', 'health', 'hackernews', 87, NULL, 'https://hackernews.com', NOW(), NOW()),
  ('Remote Team Collaboration Tools Market Explodes', 'Spending on work communication platforms reaches $20B annually', 'business', 'news', 74, NULL, 'https://business.example.com', NOW(), NOW())
ON CONFLICT (title, source) DO NOTHING;
