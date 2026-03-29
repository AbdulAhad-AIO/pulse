import axios from 'axios';

// ============================================
// NEWS API - Primary Source
// ============================================
export async function fetchNewsTrends() {
  try {
    if (!process.env.NEWS_API_KEY) {
      console.warn('⚠️ NEWS_API_KEY not set');
      return [];
    }

    console.log('🔍 Fetching from NewsAPI...');
    const response = await axios.get('https://newsapi.org/v2/top-headlines', {
      params: { country: 'us', apiKey: process.env.NEWS_API_KEY },
      timeout: 10000,
    });

    const trends = response.data.articles
      .slice(0, 15)
      .map((article: any) => ({
        title: article.title,
        description: article.description || 'News article',
        category: determinCategory(article.title) as any,
        source: 'news' as const,
        trending_score: 70,
        image_url: article.urlToImage || null,
        url: article.url,
      }))
      .filter((t: any) => t.title && t.description);

    console.log(`✅ Got ${trends.length} trends from NewsAPI`);
    return trends;
  } catch (error: any) {
    console.error('❌ NewsAPI Error:', error.message);
    return [];
  }
}

// ============================================
// HACKERNEWS API - Fallback Source
// ============================================
export async function fetchHackerNewsTrends() {
  try {
    console.log('🔍 Fetching from HackerNews...');
    const topStoriesResponse = await axios.get(
      'https://hacker-news.firebaseio.com/v0/topstories.json',
      { timeout: 8000 }
    );

    const topStoryIds = topStoriesResponse.data.slice(0, 15) as number[];
    const storyPromises = topStoryIds.map((id: number) =>
      axios.get(`https://hacker-news.firebaseio.com/v0/item/${id}.json`, { timeout: 5000 }).catch(() => null)
    );

    const stories = await Promise.all(storyPromises);
    const trends = stories
      .filter((s): s is any => s !== null && s.data)
      .map((response: any) => {
        const story = response.data;
        return {
          title: story.title || 'Untitled',
          description: `${story.score} upvotes • ${story.descendants || 0} comments`,
          category: determinCategory(story.title) as any,
          source: 'hackernews' as const,
          trending_score: Math.min(100, Math.floor(story.score / 10)),
          image_url: null,
          url: story.url || `https://news.ycombinator.com/item?id=${story.id}`,
        };
      });

    console.log(`✅ Got ${trends.length} trends from HackerNews`);
    return trends;
  } catch (error: any) {
    console.error('❌ HackerNews Error:', error.message);
    return [];
  }
}



// ============================================
// CATEGORY HELPER
// ============================================
function determinCategory(text: string): 'health' | 'tech' | 'business' | 'home' | 'career' {
  if (!text) return 'business';
  const lowerText = text.toLowerCase();

  if (lowerText.includes('health') || lowerText.includes('medical') || lowerText.includes('disease') || lowerText.includes('covid')) {
    return 'health';
  }
  if (lowerText.includes('tech') || lowerText.includes('ai') || lowerText.includes('software') || lowerText.includes('apple') || lowerText.includes('google')) {
    return 'tech';
  }
  if (lowerText.includes('market') || lowerText.includes('business') || lowerText.includes('economy') || lowerText.includes('stock')) {
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

// ============================================
// MAIN FETCH - Try NewsAPI first, then HackerNews
// ============================================
export async function fetchAllTrends() {
  console.log('📡 Starting trend fetch...');

  // Try NewsAPI first
  try {
    const newsTrends = await fetchNewsTrends();
    if (newsTrends.length > 0) {
      console.log(`✅ Using ${newsTrends.length} NewsAPI trends`);
      return newsTrends;
    }
  } catch (err) {
    console.error('NewsAPI failed, trying fallback...');
  }

  // Fallback to HackerNews
  try {
    const hackerNewsTrends = await fetchHackerNewsTrends();
    if (hackerNewsTrends.length > 0) {
      console.log(`✅ Using ${hackerNewsTrends.length} HackerNews trends`);
      return hackerNewsTrends;
    }
  } catch (err) {
    console.error('HackerNews also failed');
  }

  console.log('❌ No trends fetched from any source');
  return [];
}
