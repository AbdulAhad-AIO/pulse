-- ============================================
-- The Pulse - Database Schema (Fixed)
-- ============================================

-- Create trends table (if not exists)
CREATE TABLE IF NOT EXISTS trends (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  source TEXT,
  trending_score INT,
  image_url TEXT,
  search_volume INT,
  url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(title, source)
);

-- Create thoughts table (if not exists)
CREATE TABLE IF NOT EXISTS thoughts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trend_id UUID NOT NULL REFERENCES trends(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT DEFAULT 'perspective',
  upvotes INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create comments table (if not exists)
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thought_id UUID NOT NULL REFERENCES thoughts(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  content TEXT NOT NULL,
  upvotes INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create qa_threads table (if not exists)
CREATE TABLE IF NOT EXISTS qa_threads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trend_id UUID NOT NULL REFERENCES trends(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  question TEXT NOT NULL,
  ai_answer TEXT,
  upvotes INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create users table (if not exists)
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE,
  name TEXT,
  avatar_url TEXT,
  insight_score INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create badges table (if not exists)
CREATE TABLE IF NOT EXISTS badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  badge_name TEXT NOT NULL,
  earned_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, badge_name)
);

-- Create indexes (if not exists)
CREATE INDEX IF NOT EXISTS idx_trends_category ON trends(category);
CREATE INDEX IF NOT EXISTS idx_trends_source ON trends(source);
CREATE INDEX IF NOT EXISTS idx_thoughts_trend_id ON thoughts(trend_id);
CREATE INDEX IF NOT EXISTS idx_thoughts_user_id ON thoughts(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_thought_id ON comments(thought_id);
CREATE INDEX IF NOT EXISTS idx_qa_trend_id ON qa_threads(trend_id);
CREATE INDEX IF NOT EXISTS idx_badges_user_id ON badges(user_id);

-- Enable RLS (Row Level Security)
ALTER TABLE trends ENABLE ROW LEVEL SECURITY;
ALTER TABLE thoughts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE qa_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;

-- RLS Policies (Public read, authenticated write)
CREATE POLICY "Trends are viewable by everyone" ON trends
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert thoughts" ON thoughts
  FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Thoughts are viewable by everyone" ON thoughts
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert comments" ON comments
  FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Comments are viewable by everyone" ON comments
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can ask questions" ON qa_threads
  FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "QA is viewable by everyone" ON qa_threads
  FOR SELECT USING (true);

CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid()::text = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid()::text = id);

CREATE POLICY "Badges are viewable by everyone" ON badges
  FOR SELECT USING (true);
