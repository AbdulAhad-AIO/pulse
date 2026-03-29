import axios from 'axios';

// ============================================
// HACKERNEWS API - Most Reliable
// ============================================
export async function fetchHackerNewsTrends() {
  try {
    console.log('🔍 Fetching from HackerNews API...');
    
    // Get top story IDs
    const topStoriesResponse = await axios.get(
      'https://hacker-news.firebaseio.com/v0/topstories.json',
      { timeout: 8000 }
    );
    
    const topStoryIds = topStoriesResponse.data.slice(0, 20) as number[];
    
    // Fetch story details in parallel
    const storyPromises = topStoryIds.map((id: number) =>
      axios.get(`https://hacker-news.firebaseio.com/v0/item/${id}.json`, { timeout: 5000 })
        .catch(() => null)
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
      })
      .filter((t: any) => t.title);
    
    console.log(`✅ Got ${trends.length} trends from HackerNews`);
    return trends;
  } catch (error: any) {
    console.error('❌ HackerNews Error:', error.message);
    return [];
  }
}

// ============================================
// DEV.TO API - Great for Tech Trends
// ============================================
export async function fetchDevToTrends() {
  try {
    console.log('🔍 Fetching from Dev.to API...');
    
    const response = await axios.get('https://dev.to/api/articles?top=7&per_page=20', {
      timeout: 8000,
    });
    
    const trends = response.data
      .map((article: any) => ({
        title: article.title,
        description: article.description || article.excerpt || 'Tech article',
        category: 'tech' as const,
        source: 'devto' as const,
        trending_score: Math.min(100, Math.floor(article.positive_reactions_count / 5)),
        image_url: article.cover_image || null,
        url: article.url,
      }))
      .filter((t: any) => t.title && t.description);
    
    console.log(`✅ Got ${trends.length} trends from Dev.to`);
    return trends;
  } catch (error: any) {
    console.error('❌ Dev.to Error:', error.message);
    return [];
  }
}

// ============================================
// REDDIT API - No Auth Required
// ============================================
export async function fetchRedditTrends() {
  try {
    console.log('🔍 Fetching from Reddit API...');
    
    const subreddits = ['r/news', 'r/worldnews', 'r/technology', 'r/business'];
    const trends: any[] = [];
    
    for (const subreddit of subreddits) {
      try {
        const response = await axios.get(`https://www.reddit.com/${subreddit}/top.json?t=day&limit=5`, {
          headers: { 'User-Agent': 'Mozilla/5.0 (ThePulse/1.0)' },
          timeout: 5000,
        });
        
        const posts = response.data.data.children;
        trends.push(
          ...posts.map((item: any) => ({
            title: item.data.title,
            description: item.data.selftext?.substring(0, 200) || `Reddit post • ${item.data.upvotes} upvotes`,
            category: determinCategory(item.data.title) as any,
            source: 'reddit' as const,
            trending_score: Math.min(100, Math.floor(item.data.upvotes / 100)),
            image_url: null,
            url: `https://reddit.com${item.data.permalink}`,
          }))
        );
      } catch (err) {
        console.warn(`Warning fetching ${subreddit}:`, err);
      }
    }
    
    console.log(`✅ Got ${trends.length} trends from Reddit`);
    return trends;
  } catch (error: any) {
    console.error('❌ Reddit Error:', error.message);
    return [];
  }
}

// ============================================
// NEWS API - Fallback (requires API key)
// ============================================
export async function fetchNewsTrends() {
  try {
    if (!process.env.NEWS_API_KEY) {
      console.warn('⚠️ NEWS_API_KEY not set, skipping NewsAPI');
      return [];
    }

    console.log('🔍 Fetching from NewsAPI...');
    
    const response = await axios.get('https://newsapi.org/v2/top-headlines', {
      params: {
        country: 'us',
        apiKey: process.env.NEWS_API_KEY,
      },
      timeout: 8000,
    });

    const trends = response.data.articles
      .map((article: any) => ({
        title: article.title,
        description: article.description || 'News article',
        category: determinCategory(article.title) as any,
        source: 'news' as const,
        trending_score: 60,
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
// CATEGORY DETECTION
// ============================================
function determinCategory(text: string): 'health' | 'tech' | 'business' | 'home' | 'career' {
  if (!text) return 'business';
  
  const lowerText = text.toLowerCase();

  if (lowerText.includes('health') || lowerText.includes('medical') || lowerText.includes('disease') || lowerText.includes('covid') || lowerText.includes('vaccine')) {
    return 'health';
  }
  if (lowerText.includes('tech') || lowerText.includes('ai') || lowerText.includes('software') || lowerText.includes('apple') || lowerText.includes('google') || lowerText.includes('programming') || lowerText.includes('code') || lowerText.includes('developer')) {
    return 'tech';
  }
  if (lowerText.includes('market') || lowerText.includes('business') || lowerText.includes('economy') || lowerText.includes('stock') || lowerText.includes('finance')) {
    return 'business';
  }
  if (lowerText.includes('home') || lowerText.includes('real estate') || lowerText.includes('housing') || lowerText.includes('property')) {
    return 'home';
  }
  if (lowerText.includes('job') || lowerText.includes('career') || lowerText.includes('employment') || lowerText.includes('hiring')) {
    return 'career';
  }

  return 'business';
}

// ============================================
// MAIN FETCH FUNCTION - Multiple Sources
// ============================================
export async function fetchAllTrends() {
  console.log('📡 Starting trend fetch from multiple sources...');
  
  try {
    // Try HackerNews first (most reliable)
    const hackerNewsTrends = await fetchHackerNewsTrends();
    if (hackerNewsTrends.length > 0) {
      console.log(`✅ SUCCESS: Using ${hackerNewsTrends.length} HackerNews trends`);
      return hackerNewsTrends;
    }
  } catch (err) {
    console.error('⚠️ HackerNews failed, trying next source');
  }

  try {
    // Fallback to Dev.to
    const devToTrends = await fetchDevToTrends();
    if (devToTrends.length > 0) {
      console.log(`✅ SUCCESS: Using ${devToTrends.length} Dev.to trends`);
      return devToTrends;
    }
  } catch (err) {
    console.error('⚠️ Dev.to failed, trying next source');
  }

  try {
    // Fallback to Reddit
    const redditTrends = await fetchRedditTrends();
    if (redditTrends.length > 0) {
      console.log(`✅ SUCCESS: Using ${redditTrends.length} Reddit trends`);
      return redditTrends;
    }
  } catch (err) {
    console.error('⚠️ Reddit failed, trying next source');
  }

  try {
    // Last resort: NewsAPI
    const newsTrends = await fetchNewsTrends();
    if (newsTrends.length > 0) {
      console.log(`✅ SUCCESS: Using ${newsTrends.length} NewsAPI trends`);
      return newsTrends;
    }
  } catch (err) {
    console.error('⚠️ NewsAPI failed too');
  }

  console.log('❌ No trends fetched from any source');
  return [];
}
