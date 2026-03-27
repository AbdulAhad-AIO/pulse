# The Pulse - Setup Guide

A real-time trending insights web application with AI-powered analysis and community engagement.

## Quick Setup

### 1. Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account
- Clerk account
- OpenAI API key
- NewsAPI key
- Reddit API credentials

### 2. Database Setup

1. Create a new project on [Supabase](https://supabase.com)
2. Copy the project URL and anon key to `.env.local`
3. Go to SQL Editor and run all commands from `supabase_schema.sql`
4. Enable realtime for `thoughts` and `comments` tables in Supabase dashboard

### 3. Authentication Setup

1. Create a Clerk application at [clerk.com](https://clerk.com)
2. Add your publishable and secret keys to `.env.local`
3. Configure allowed redirect URIs in Clerk dashboard

### 4. Environment Variables

Copy and fill in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
SUPABASE_SERVICE_ROLE_KEY=your_key
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_key
CLERK_SECRET_KEY=your_key
OPENAI_API_KEY=your_key
NEWS_API_KEY=your_key
```

### 5. Installation & Running

```bash
npm install
npm run dev
```

Visit http://localhost:3000

## Features

### Core
- ✅ Trending data from Google Trends, Reddit, and News APIs
- ✅ AI-powered summaries and predictions
- ✅ Community thoughts and threaded comments
- ✅ Upvoting system
- ✅ User profiles with contribution history

### Community
- Thoughts categorized as perspective, experience, solution, warning
- Upvoting on thoughts and comments
- Real-time comment threads

### AI Features
- Automatic trend summaries and insights
- 3 future predictions with probabilities
- Persona-based impact analysis
- Actionable step recommendations
- AI-powered Q&A on trend pages

### Gamification
- Insight streaks (7-day, 30-day badges)
- Top contributor levels
- Insight Score based on upvotes

### User Features
- Personalized feed by interests
- Save/follow trends
- View contribution history
- User profiles with Insight Score

## API Routes

### Public Routes
- `GET /api/trends` - Get trending data
- `GET /api/trends/[id]` - Get trend details with AI insights
- `GET /api/trends/[id]/thoughts` - Get community thoughts
- `GET /api/trends/[id]/qa` - Get Q&A threads

### Protected Routes
- `POST /api/thoughts` - Create thought
- `POST /api/comments` - Create comment
- `POST /api/trends/[id]/save` - Save trend
- `POST /api/trends/[id]/qa` - Ask question
- `PUT /api/profile` - Update user profile

## Deployment

1. Push to GitHub
2. Connect to Vercel
3. Add environment variables in Vercel dashboard
4. Set up cron job for `/api/cron/fetch-trends` (runs every 2 hours)
5. Deploy!

## Cron Jobs

- **Fetch Trends**: Every 2 hours - fetches and stores new trending data
- **Generate Insights**: Daily - generates AI insights for new trends
- **Calculate Badges**: Daily - checks and assigns gamification badges

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Supabase
- **Database**: PostgreSQL (via Supabase)
- **Auth**: Clerk
- **AI**: OpenAI GPT-4o
- **Deployment**: Vercel
