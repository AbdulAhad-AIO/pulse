import axios from 'axios';

// Google Trends - Using unofficial API
export async function fetchGoogleTrends() {
  try {
    // Using google-trends-api or similar alternative
    // For MVP, we'll use a placeholder structure
    const response = await axios.get(
      'https://trends.google.com/trends/api/dailytrends?hl=en-US&geo=US&ns=15&tz=300'
    );
    
    const data = JSON.parse(response.data.slice(6)); // Remove )]}' prefix
    return data.default.trends.map((trend: any) => ({
      title: trend.title.query,
      description: trend.title.exploringQueries?.[0]?.query || trend.title.query,
      category: 'tech', // Would need better categorization
      source: 'google_trends' as const,
      trending_score: trend.traffic,
    }));
  } catch (error) {
    console.error('Error fetching Google Trends:', error);
    return [];
  }
}

// Reddit - Fetch trending from popular subreddits
export async function fetchRedditTrends() {
  try {
    const subreddits = ['r/worldnews', 'r/technology', 'r/news', 'r/business'];
    const trends = [];

    for (const subreddit of subreddits) {
      const response = await axios.get(`https://www.reddit.com/${subreddit}/hot.json?limit=5`, {
        headers: {
          'User-Agent': 'ThePulse/1.0',
        },
      });

      const posts = response.data.data.children;
      trends.push(
        ...posts.map((item: any) => ({
          title: item.data.title,
          description: item.data.selftext || item.data.url,
          category: subreddit.includes('tech') ? 'tech' : 'business',
          source: 'reddit' as const,
          trending_score: item.data.upvotes,
          url: `https://reddit.com${item.data.permalink}`,
        }))
      );
    }

    return trends;
  } catch (error) {
    console.error('Error fetching Reddit trends:', error);
    return [];
  }
}

// News API - Fetch trending news
export async function fetchNewsTrends() {
  try {
    const response = await axios.get('https://newsapi.org/v2/top-headlines', {
      params: {
        country: 'us',
        sortBy: 'publishedAt',
        apiKey: process.env.NEWS_API_KEY,
      },
    });

    return response.data.articles.map((article: any) => ({
      title: article.title,
      description: article.description,
      category: determinCategory(article.description),
      source: 'news' as const,
      trending_score: 50, // Default score
      image_url: article.urlToImage,
      url: article.url,
    }));
  } catch (error) {
    console.error('Error fetching news trends:', error);
    return [];
  }
}

// Helper function to categorize content
function determinCategory(text: string): 'health' | 'tech' | 'business' | 'home' | 'career' {
  const lowerText = text.toLowerCase();

  if (lowerText.includes('health') || lowerText.includes('medical') || lowerText.includes('disease')) {
    return 'health';
  }
  if (lowerText.includes('tech') || lowerText.includes('ai') || lowerText.includes('software')) {
    return 'tech';
  }
  if (lowerText.includes('market') || lowerText.includes('business') || lowerText.includes('economy')) {
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
  const [googleTrends, redditTrends, newsTrends] = await Promise.all([
    fetchGoogleTrends(),
    fetchRedditTrends(),
    fetchNewsTrends(),
  ]);

  return [...googleTrends, ...redditTrends, ...newsTrends];
}
