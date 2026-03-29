const axios = require('axios');

// Test HackerNews API
async function testHackerNews() {
  try {
    console.log('\n🔍 Testing HackerNews...');
    const topStoriesResponse = await axios.get(
      'https://hacker-news.firebaseio.com/v0/topstories.json',
      { timeout: 8000 }
    );
    
    const topStoryIds = topStoriesResponse.data.slice(0, 5);
    console.log('✅ Top story IDs:', topStoryIds.length);
    return true;
  } catch (err) {
    console.error('❌ HackerNews Error:', err.message);
    return false;
  }
}

// Test Dev.to API
async function testDevTo() {
  try {
    console.log('\n🔍 Testing Dev.to...');
    const response = await axios.get('https://dev.to/api/articles?top=7&per_page=20', {
      timeout: 8000,
    });
    
    console.log('✅ Dev.to articles:', response.data.length);
    if (response.data[0]) {
      console.log('   Sample:', response.data[0].title?.substring(0, 50));
    }
    return true;
  } catch (err) {
    console.error('❌ Dev.to Error:', err.message);
    return false;
  }
}

// Test Reddit API
async function testReddit() {
  try {
    console.log('\n🔍 Testing Reddit...');
    const response = await axios.get('https://www.reddit.com/r/news/top.json?t=day&limit=5', {
      headers: { 'User-Agent': 'Mozilla/5.0 (ThePulse/1.0)' },
      timeout: 5000,
    });
    
    const posts = response.data.data.children;
    console.log('✅ Reddit posts:', posts.length);
    if (posts[0]) {
      console.log('   Sample:', posts[0].data.title?.substring(0, 50));
    }
    return true;
  } catch (err) {
    console.error('❌ Reddit Error:', err.message);
    return false;
  }
}

// Test NewsAPI
async function testNewsAPI() {
  try {
    console.log('\n🔍 Testing NewsAPI...');
    const response = await axios.get('https://newsapi.org/v2/top-headlines', {
      params: {
        country: 'us',
        apiKey: 'ade5d13699ef4480aae21e10b75f25b0',
      },
      timeout: 8000,
    });

    console.log('✅ NewsAPI articles:', response.data.articles.length);
    if (response.data.articles[0]) {
      console.log('   Sample:', response.data.articles[0].title?.substring(0, 50));
    }
    return true;
  } catch (err) {
    console.error('❌ NewsAPI Error:', err.message);
    return false;
  }
}

// Run all tests
async function runAll() {
  console.log('🧪 Testing all trend sources...');
  
  const results = await Promise.all([
    testHackerNews(),
    testDevTo(),
    testReddit(),
    testNewsAPI(),
  ]);
  
  console.log('\n📊 Results:', {
    hackernews: results[0] ? '✅' : '❌',
    devto: results[1] ? '✅' : '❌',
    reddit: results[2] ? '✅' : '❌',
    newsapi: results[3] ? '✅' : '❌',
  });
}

runAll();
