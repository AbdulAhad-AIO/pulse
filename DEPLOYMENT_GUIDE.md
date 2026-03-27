# The Pulse - Deployment Guide

Complete guide to deploy The Pulse to Vercel within 24 hours.

## Pre-Deployment Checklist

- [ ] All environment variables gathered
- [ ] Supabase database created and schema loaded
- [ ] Clerk app created and configured
- [ ] OpenAI API key obtained
- [ ] GitHub repository created and code pushed
- [ ] Vercel account created

## Step-by-Step Deployment

### Phase 1: Prepare Services (5-10 minutes)

#### 1.1 Create Supabase Project
1. Go to [supabase.com](https://supabase.com) and sign up
2. Create a new project (choose region closest to you)
3. Wait for project to initialize (~2 minutes)
4. Get your credentials:
   - **Project URL**: Copy from Settings > API > Project URL
   - **Anon Key**: Copy from Settings > API > Anon Key (public)
   - **Service Role Key**: Copy from Settings > API > Service Role Key (keep secret!)

#### 1.2 Set Up Database Schema
1. In Supabase, go to SQL Editor
2. Click "New Query"
3. Copy the **entire** content from `supabase_schema.sql` in the project
4. Paste into the SQL editor
5. Click "Run"
6. Wait for completion (~30 seconds)
7. In the Tables tab on left, verify all tables are created

#### 1.3 Create Clerk Application
1. Go to [clerk.com](https://clerk.com) and sign up
2. Create a new "Pulse" application
3. Choose "Web" as the platform
4. Go to API Keys > Copy:
   - **Publishable Key** (starts with `pk_`)
   - **Secret Key** (keep safe!)
5. Go to Settings > Paths and verify:
   - After sign-in: `/dashboard`
   - After sign-up: `/dashboard`
   - Sign-out: `/`

#### 1.4 Get OpenAI API Key
1. Go to [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Click "Create new secret key"
3. Copy and save securely (starts with `sk-`)

#### 1.5 Get NewsAPI Key
1. Go to [newsapi.org](https://newsapi.org)
2. Sign up for free or paid plan
3. In Dashboard, copy your API key
4. Note: Free tier has limits on requests

### Phase 2: Repository & Vercel Setup (10-15 minutes)

#### 2.1 Create GitHub Repository
```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit: The Pulse MVP"

# Create repo on GitHub.com and push
git remote add origin https://github.com/YOUR_USERNAME/pulse.git
git branch -M main
git push -u origin main
```

#### 2.2 Deploy to Vercel
1. Go to [vercel.com](https://vercel.com/new)
2. Click "Import Git Repository"
3. Paste your GitHub repo URL: `https://github.com/YOUR_USERNAME/pulse`
4. Click "Import"
5. Project settings will show (Next.js detected automatically)
6. Click "Deploy"
   - **This will fail** because environment variables are missing - that's OK!

### Phase 3: Environment Variables (10 minutes)

#### 3.1 Add Variables to Vercel
After the failed deployment, go to:
1. Project Settings > Environment Variables
2. Add each variable (from your notes above):

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_... (or pk_test_...)
CLERK_SECRET_KEY=sk_live_... (or sk_test_...)
OPENAI_API_KEY=sk-your-openai-key
NEWS_API_KEY=your_newsapi_key
CRON_SECRET=your-very-random-secret-key-123456
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
NODE_ENV=production
```

**Important**: For `CRON_SECRET`, generate a random string (e.g., use online UUID generator or `openssl rand -hex 32`)

#### 3.2 Redeploy
1. After adding all variables, click "Deployments"
2. Click the failed deployment
3. Click "Redeploy" button
4. Wait for build to complete (3-5 minutes)

### Phase 4: Configure Clerk Redirect URLs (5 minutes)

1. Go back to [Clerk dashboard](https://dashboard.clerk.com)
2. Go to Settings > Paths under your application
3. Add **Allowed redirect URLs**:
   - `https://your-domain.vercel.app/sign-in/sso-callback`
   - `https://your-domain.vercel.app/sign-up/sso-callback`
   - `https://your-domain.vercel.app` (after sign-in)
   - `https://your-domain.vercel.app/dashboard` (after sign-up)

### Phase 5: Enable Cron Jobs (5 minutes)

1. In Vercel project, go to Settings > Cron Jobs
2. You should see three cron jobs listed (from `vercel.json`):
   - **Fetch Trends**: Every 2 hours
   - **Generate Insights**: Daily at 1 AM
   - **Calculate Badges**: Daily at 2 AM
3. Toggle each one to **Enable**
4. Note: Cron jobs only work on Pro plan or higher. [Upgrade](https://vercel.com/pricing) if needed.
   - For free tier, you'll need to manually trigger cron endpoints or use an external scheduler

### Phase 6: Verify Deployment (5-10 minutes)

1. Visit your Vercel deployment URL: `https://your-domain.vercel.app`
2. Check the following:
   - [ ] Homepage loads
   - [ ] Navigation bar appears
   - [ ] Can click "Explore" without auth
   - [ ] Click "Sign Up" redirects to Clerk
   - [ ] Sign up flow works
   - [ ] After sign-up, redirects to dashboard
   - [ ] Dashboard shows profile info
   - [ ] Can navigate to explore page
   - [ ] Home page shows recent trends

### Phase 7: Manual Trigger (Optional but Recommended)

To populate initial trending data without waiting for first cron:

```bash
curl -X GET https://your-domain.vercel.app/api/cron/fetch-trends \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

Then generate initial AI insights:

```bash
curl -X GET https://your-domain.vercel.app/api/cron/generate-insights \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

## Post-Deployment

### Monitor Logs
In Vercel dashboard:
1. Go to Deployments > Select latest
2. Click "Functions" tab
3. Click "Logs" to see real-time logs
4. Check for errors in API routes or cron jobs

### First Trends
- Trends will appear when cron job runs (every 2 hours)
- Or manually trigger the fetch endpoint
- AI insights generate daily at 1 AM UTC

### Troubleshooting

**Deployment fails with database error**
- [ ] Verify Supabase URL and keys are correct
- [ ] Check database is accessible from internet (Supabase auto-allows everywhere)
- [ ] Verify schema was loaded correctly

**Clerk login not working**
- [ ] Check Publishable and Secret keys
- [ ] Verify redirect URLs in Clerk dashboard match your Vercel domain
- [ ] Clear browser cookies and try again

**Trends not showing**
- [ ] Check cron job logs in Vercel
- [ ] Manually trigger fetch endpoint to test
- [ ] Verify NEWS_API_KEY is valid
- [ ] Check error logs

**No AI insights**
- [ ] Verify OPENAI_API_KEY is valid
- [ ] Check account has credits
- [ ] Verify database has trends first
- [ ] Check cron logs for generate-insights

### Custom Domain
1. In Vercel project Settings > Domains
2. Click "Add"
3. Enter your custom domain
4. Follow DNS setup instructions for your domain provider
5. Wait for DNS propagation (5-30 minutes)
6. Update Clerk redirect URLs with new domain
7. Update `NEXT_PUBLIC_APP_URL` in environment variables

## Launch Checklist

- [ ] Application deployed to Vercel
- [ ] All API endpoints tested
- [ ] Environment variables configured
- [ ] Clerk authentication working
- [ ] Database schema loaded
- [ ] Cron jobs enabled
-  [ ] Initial trends fetched
- [ ] Homepage displays content
- [ ] Sign-up flow works end-to-end
- [ ] Navigation functional
- [ ] Mobile responsive
- [ ] Error handling working

## Success!

**The Pulse is now live!** 🎉

Your trending insights platform is accessible at: `https://your-domain.vercel.app`

### Share With World
- Tweet about your launch
- Share GitHub repo
- Gather initial users
- Collect feedback
- Iterate!

## Next Steps (24 hours +)

- [ ] Set up custom email domain
- [ ] Implement email digest notifications
- [ ] Add analytics (Vercel Web Analytics is free)
- [ ] Set up uptime monitoring
- [ ] Create social media accounts
- [ ] Write blog post about launch
- [ ] Gather user feedback
- [ ] Plan Phase 2 features (mobile app, advanced features, etc.)

---

**Happy launching! 🚀**

For questions, check the README.md and SETUP_GUIDE.md in the project root.
