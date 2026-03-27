# The Pulse - Real-Time Trending Insights with AI & Community

A cutting-edge web application that delivers real-time trending insights powered by AI, community engagement, and data from multiple sources (Google Trends, Reddit, news APIs).

**Live Demo:** [Deploy to Vercel]

## ✨ Features

### 🔥 Core Trending Engine
- ✅ Real-time trending data from:
  - Google Trends
  - Reddit (trending posts)
  - News APIs (top headlines)
- ✅ Data refreshed every 2 hours via Vercel Cron Jobs
- ✅ Categorized by: Health, Tech, Business, Home, Career
- ✅ Trending score and engagement metrics

### 🤖 AI-Powered Insights
- ✅ **Automatic Summaries**: Clear, plain-English trend summaries
- ✅ **Context Analysis**: Why each trend is happening
- ✅ **Future Predictions**: 3 predictions with probability scores and timeframes
- ✅ **Persona-Based Impacts**: 
  - Business Owner perspective
  - Job Seeker perspective
  - Consumer perspective
- ✅ **Actionable Steps**: 3 concrete actions for each trend

### 👥 Community Features
- ✅ **Thoughts**: Share perspectives, experiences, solutions, or warnings
- ✅ **Threaded Comments**: Engage in discussions
- ✅ **Upvoting System**: Surface the best insights
- ✅ **User Profiles**: See contribution history and Insight Score

### 💬 AI-Powered Q&A
- ✅ Ask questions about any trend
- ✅ AI provides answers using trend data + top community comments
- ✅ Community can upvote helpful Q&A threads
- ✅ Real-time Q&A display on trend pages

### 🎮 Gamification & Retention
- ✅ **Insight Streaks**: 7-day and 30-day badges
- ✅ **Top Contributor**: Badges for posting quality insights
- ✅ **Insight Score**: Reputation system based on upvotes
- ✅ **Save/Follow Trends**: Bookmark trending topics
- ✅ **Personalized Feed**: Curated by interest categories
- ✅ **Email Digest** (setup ready): Daily top trends and insights

### 👤 User Profiles
- ✅ Contribution history (thoughts, comments)
- ✅ Insight Score display
- ✅ Follower/Following counts
- ✅ Badge showcase
- ✅ Profile customization

## 🚀 Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Node.js
- **Database**: PostgreSQL via Supabase (with Row Level Security)
- **Authentication**: Clerk
- **AI**: OpenAI GPT-4o
- **Deployment**: Vercel (with Cron Jobs)
- **Real-time**: Supabase Realtime
- **Data Sources**: Google Trends API, Reddit API, NewsAPI

## 📋 Prerequisites

Before you start, make sure you have:

- Node.js 18+
- npm or yarn
- Git

And these accounts/keys:

1. **Supabase** - Database
2. **Clerk** - Authentication
3. **OpenAI** - GPT-4o API key
4. **NewsAPI** - For news trends
5. **Reddit API** - Client ID & secret (optional)
6. **Google Trends** - Via unofficial API

## 🔧 Installation & Setup

### 1. Clone & Install

```bash
git clone <repo-url>
cd pulse
npm install
```

### 2. Database Setup

1. Create a **Supabase project** at [supabase.com](https://supabase.com)
2. Copy your project URL and Anon Key
3. In Supabase SQL Editor, run the entire `supabase_schema.sql` file
4. Enable realtime for `thoughts` and `comments` tables

### 3. Environment Variables

Create `.env.local`:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
CLERK_SECRET_KEY=your_clerk_secret

# OpenAI
OPENAI_API_KEY=sk-your-openai-key

# External APIs
NEWS_API_KEY=your_newsapi_key
GOOGLE_TRENDS_API_KEY=optional
REDDIT_CLIENT_ID=optional
REDDIT_CLIENT_SECRET=optional

# Vercel Cron Security
CRON_SECRET=your_random_secret_key

# App Config
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### 4. Run Locally

```bash
npm run dev
```

Visit http://localhost:3000

## 📦 Project Structure

```
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── cron/              # Scheduled jobs
│   │   │   ├── trends/            # Trending data endpoints
│   │   │   ├── thoughts/          # Community posts
│   │   │   ├── comments/          # Threaded responses
│   │   │   ├── qa/                # Q&A threads
│   │   │   └── profile/           # User profile management
│   │   ├── trends/[id]/           # Trend detail page
│   │   ├── explore/               # Browse trends
│   │   ├── dashboard/             # User dashboard
│   │   ├── sign-in/               # Clerk auth
│   │   ├── sign-up/               # Clerk auth
│   │   ├── page.tsx               # Home page
│   │   ├── layout.tsx             # Root layout
│   │   └── globals.css            # Global styles
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   └── Footer.tsx
│   │   ├── trends/
│   │   │   ├── TrendCard.tsx
│   │   │   └── TrendDetail.tsx
│   │   └── ui/
│   │       └── Tabs.tsx
│   └── lib/
│       ├── types.ts               # TypeScript interfaces
│       ├── supabase.ts            # Supabase client
│       ├── ai.ts                  # OpenAI integration
│       ├── db.ts                  # Database operations
│       └── trends-data.ts         # API data fetching
├── middleware.ts                  # Clerk middleware
├── supabase_schema.sql            # Database schema
├── vercel.json                    # Cron job config
└── SETUP_GUIDE.md                 # Detailed setup guide
```

## 🌐 API Endpoints

### Public Routes

- `GET /api/trends` - Get all trends (with `?category=tech` filter)
- `GET /api/trends/[id]` - Get trend details with AI insights
- `GET /api/qa?trend_id=[id]` - Get Q&A threads

### Protected Routes (Require Authentication)

- `POST /api/thoughts` - Create a thought
- `PATCH /api/thoughts` - Upvote a thought
- `POST /api/comments` - Add a comment
- `PATCH /api/comments` - Upvote a comment
- `POST /api/qa` - Ask a question
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update profile

### Cron Jobs

- `GET /api/cron/fetch-trends` - Every 2 hours
- `GET /api/cron/generate-insights` - Daily at 1 AM
- `GET /api/cron/calculate-badges` - Daily at 2 AM

## 🚀 Deployment to Vercel

### Option 1: Vercel Dashboard

1. Push code to GitHub
2. Import project in [Vercel](https://vercel.com/new)
3. Add environment variables
4. Deploy!

### Option 2: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add production environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
# ... add all other variables

# Redeploy with variables
vercel --prod
```

### Enable Cron Jobs

1. In Vercel dashboard, go to Settings → Cron Jobs
2. Check to ensure `vercel.json` is properly configured
3. Cron jobs will run automatically on the schedule specified

## 📧 Email Digest Setup (Optional)

To add daily email digest:

1. Install email library: `npm install nodemailer`
2. Create `/api/cron/send-digest` endpoint
3. Use Supabase to query top trends
4. Send via email service (SendGrid, Mailgun, etc.)
5. Add to `vercel.json` cron schedule

## 🔐 Security

- ✅ Row-level security enabled on all tables
- ✅ Clerk handles authentication
- ✅ API routes protected with `auth.protect()`
- ✅ Cron endpoints protected with secret token
- ✅ No sensitive data in `.env.local`
- ✅ HTTPS enforced in production

## 🧪 Testing

```bash
# Type check
npm run type-check

# Lint
npm run lint

# Build
npm run build

# Start production server
npm run start
```

## 📊 Database Schema

Key tables:
- `users` - User profiles with scores
- `trends` - Trending topics
- `trend_ai_insights` - AI-generated analysis
- `thoughts` - Community posts
- `comments` - Threaded responses
- `user_engagement` - Saves, follows
- `qa_threads` - Q&A threads
- `badges` - Gamification achievements

## 🐛 Troubleshooting

### Trends Not Showing
- Ensure Supabase is running
- Check cron jobs in Vercel logs
- Verify API keys in `.env.local`

### AI Insights Not Generating
- Check OpenAI API key
- Verify Cron job execution in Vercel
- Check Supabase for trends without insights

### Authentication Issues
- Verify Clerk keys
- Check redirect URLs in Clerk dashboard
- Ensure middleware.ts is present

## 🗺️ Roadmap

- [ ] Email digest notifications
- [ ] Advanced analytics dashboard
- [ ] Trend prediction model
- [ ] Community moderation tools
- [ ] Trend export (PDF, CSV)
- [ ] Mobile app (React Native)
- [ ] WebSocket real-time updates
- [ ] API for third-party integrations

## 📝 License

MIT License - See LICENSE file

## 🤝 Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push to your fork
5. Submit a pull request

## 📞 Support

- 📧 Email: support@thepulse.dev
- 💬 Discord: [Join Community](https://discord.gg/example)
- 🐛 Issues: [GitHub Issues](https://github.com/yourrepo/issues)

---

**Built with ❤️ by Your Team**

**Launch Date:** March 27, 2026 ✨
