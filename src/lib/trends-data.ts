import axios from 'axios';

// News API - Fetch trending news (MAIN SOURCE)
export async function fetchNewsTrends() {
  try {
    console.log('🔍 Fetching from NewsAPI...');
    
    if (!process.env.NEWS_API_KEY) {
      console.error('❌ NEWS_API_KEY is not set!');
      return [];
    }

    const response = await axios.get('https://newsapi.org/v2/top-headlines', {
      params: {
        country: 'us',
        apiKey: process.env.NEWS_API_KEY,
      },
      timeout: 10000,
    });

    console.log(`✅ Got ${response.data.articles.length} articles from NewsAPI`);

    return response.data.articles.map((article: any) => ({
      title: article.title || 'Untitled',
      description: article.description || article.content || 'No description',
      category: determinCategory(article.title + ' ' + article.description),
      source: 'news' as const,
      trending_score: 50,
      image_url: article.urlToImage || null,
      url: article.url,
    })).filter((t: any) => t.title && t.description); // Filter out invalid entries
  } catch (error: any) {
    console.error('❌ Error fetching NewsAPI:', error.message || error);
    return [];
  }
}

// Google Trends - OPTIONAL (may fail due to API restrictions)
export async function fetchGoogleTrends() {
  return []; // Skip for MVP - focus on NewsAPI only
}

// Reddit - OPTIONAL (may fail due to rate limiting)
export async function fetchRedditTrends() {
  return []; // Skip for MVP - focus on NewsAPI only
}

// Helper function to categorize content
function determinCategory(text: string): 'health' | 'tech' | 'business' | 'home' | 'career' {
  if (!text) return 'business';
  
  const lowerText = text.toLowerCase();

  if (lowerText.includes('health') || lowerText.includes('medical') || lowerText.includes('disease') || lowerText.includes('covid')) {
    return 'health';
  }
  if (lowerText.includes('tech') || lowerText.includes('ai') || lowerText.includes('software') || lowerText.includes('apple') || lowerText.includes('google')) {
    return 'tech';
  }
  if (lowerText.includes('market') || lowerText.includes('business') || lowerText.includes('economy') || lowerText.includes('stock') || lowerText.includes('economy')) {
    return 'business';
  }
  if (lowerText.includes('home') || lowerText.includes('real estate') || lowerText.includes('housing')) {
    return 'home';
  }
  if (lowerText.includes('job') || lowerText.includes('career') || lowerText.includes('employment')) {
    return 'career';
  }

  return 'business';
}

export async function fetchAllTrends() {
  console.log('📡 Starting trend fetch...');
  
  // Just use NewsAPI for MVP
  const newsTrends = await fetchNewsTrends();
  
  console.log(`✅ Total trends fetched: ${newsTrends.length}`);
  
  return newsTrends;
}
