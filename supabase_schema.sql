-- Supabase Schema Migration for The Pulse

-- Users Table (extended Clerk user info)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  insight_score INTEGER DEFAULT 0,
  follower_count INTEGER DEFAULT 0,
  following_count INTEGER DEFAULT 0,
  thought_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Trends Table
CREATE TABLE IF NOT EXISTS public.trends (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(500) NOT NULL,
  description TEXT,
  category VARCHAR(50) NOT NULL CHECK (category IN ('health', 'tech', 'business', 'home', 'career')),
  source VARCHAR(50) NOT NULL CHECK (source IN ('google_trends', 'reddit', 'news')),
  trending_score INTEGER DEFAULT 0,
  search_volume INTEGER,
  image_url TEXT,
  external_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(title, source)
);

-- Trend AI Insights Table
CREATE TABLE IF NOT EXISTS public.trend_ai_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trend_id UUID NOT NULL REFERENCES public.trends(id) ON DELETE CASCADE,
  summary TEXT NOT NULL,
  why_happening TEXT NOT NULL,
  predictions JSONB, -- Array of {description, probability, timeframe}
  persona_impacts JSONB, -- Object of {business_owner, job_seeker, consumer} with impacts and opportunities
  actionable_steps TEXT[] NOT NULL,
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Thoughts Table (Community posts on trends)
CREATE TABLE IF NOT EXISTS public.thoughts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trend_id UUID NOT NULL REFERENCES public.trends(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('perspective', 'experience', 'solution', 'warning')),
  upvotes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Comments Table (Threaded comments on Thoughts)
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thought_id UUID NOT NULL REFERENCES public.thoughts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  upvotes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- User Engagement Table
CREATE TABLE IF NOT EXISTS public.user_engagement (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  trend_id UUID NOT NULL REFERENCES public.trends(id) ON DELETE CASCADE,
  saved BOOLEAN DEFAULT FALSE,
  following BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, trend_id)
);

-- Badges Table (Gamification)
CREATE TABLE IF NOT EXISTS public.badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL CHECK (name IN ('insight_streak_7', 'insight_streak_30', 'top_contributor_1', 'top_contributor_5')),
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, name)
);

-- Q&A Thread Table
CREATE TABLE IF NOT EXISTS public.qa_threads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trend_id UUID NOT NULL REFERENCES public.trends(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  ai_answer TEXT NOT NULL,
  upvotes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_trends_category ON public.trends(category);
CREATE INDEX IF NOT EXISTS idx_trends_source ON public.trends(source);
CREATE INDEX IF NOT EXISTS idx_trends_created_at ON public.trends(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_thoughts_trend_id ON public.thoughts(trend_id);
CREATE INDEX IF NOT EXISTS idx_thoughts_user_id ON public.thoughts(user_id);
CREATE INDEX IF NOT EXISTS idx_thoughts_upvotes ON public.thoughts(upvotes DESC);
CREATE INDEX IF NOT EXISTS idx_comments_thought_id ON public.comments(thought_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON public.comments(user_id);
CREATE INDEX IF NOT EXISTS idx_user_engagement_user_id ON public.user_engagement(user_id);
CREATE INDEX IF NOT EXISTS idx_user_engagement_trend_id ON public.user_engagement(trend_id);
CREATE INDEX IF NOT EXISTS idx_qa_threads_trend_id ON public.qa_threads(trend_id);
CREATE INDEX IF NOT EXISTS idx_badges_user_id ON public.badges(user_id);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trends ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.thoughts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_engagement ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qa_threads ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Users Table
CREATE POLICY "Users can read all profiles" ON public.users
  FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for Trends Table
CREATE POLICY "Anyone can read trends" ON public.trends
  FOR SELECT USING (true);

-- RLS Policies for Thoughts Table
CREATE POLICY "Anyone can read thoughts" ON public.thoughts
  FOR SELECT USING (true);

CREATE POLICY "Users can create thoughts" ON public.thoughts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own thoughts" ON public.thoughts
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for Comments Table
CREATE POLICY "Anyone can read comments" ON public.comments
  FOR SELECT USING (true);

CREATE POLICY "Users can create comments" ON public.comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for User Engagement Table
CREATE POLICY "Users can manage their engagement" ON public.user_engagement
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for Badges Table
CREATE POLICY "Users can read all badges" ON public.badges
  FOR SELECT USING (true);

-- RLS Policies for Q&A Table
CREATE POLICY "Anyone can read Q&A threads" ON public.qa_threads
  FOR SELECT USING (true);

CREATE POLICY "Users can create Q&A threads" ON public.qa_threads
  FOR INSERT WITH CHECK (auth.uid() = user_id);
