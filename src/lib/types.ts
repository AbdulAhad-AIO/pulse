// Trend types
export interface Trend {
  id: string;
  title: string;
  description: string;
  category: 'health' | 'tech' | 'business' | 'home' | 'career';
  source: 'google_trends' | 'reddit' | 'news';
  trending_score: number;
  created_at: string;
  updated_at: string;
  search_volume?: number;
  image_url?: string;
}

export interface TrendAIInsight {
  id: string;
  trend_id: string;
  summary: string;
  why_happening: string;
  predictions: Prediction[];
  persona_impacts: PersonaImpact[];
  actionable_steps: string[];
  generated_at: string;
}

export interface Prediction {
  description: string;
  probability: number;
  timeframe: string;
}

export interface PersonaImpact {
  persona: 'business_owner' | 'job_seeker' | 'consumer';
  impact: string;
  opportunities: string[];
}

export interface Thought {
  id: string;
  trend_id: string;
  user_id: string;
  content: string;
  type: 'perspective' | 'experience' | 'solution' | 'warning';
  upvotes: number;
  created_at: string;
  user?: User;
}

export interface Comment {
  id: string;
  thought_id: string;
  user_id: string;
  content: string;
  upvotes: number;
  created_at: string;
  user?: User;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  bio?: string;
  insight_score: number;
  created_at: string;
  follower_count: number;
  following_count: number;
  thought_count: number;
}

export interface UserEngagement {
  id: string;
  user_id: string;
  trend_id: string;
  saved: boolean;
  following: boolean;
  created_at: string;
}

export interface Badge {
  id: string;
  user_id: string;
  name: 'insight_streak_7' | 'insight_streak_30' | 'top_contributor_1' | 'top_contributor_5';
  earned_at: string;
}

export interface QAThread {
  id: string;
  trend_id: string;
  user_id: string;
  question: string;
  ai_answer: string;
  upvotes: number;
  created_at: string;
}
