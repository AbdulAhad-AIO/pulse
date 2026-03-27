# 🎯 The Pulse - Pre-Deployment Checklist

Complete this checklist before deploying to Vercel. **Estimated time: 20-30 minutes**

## Phase 1: External Services Setup (10 min)

### Supabase
- [ ] Create project at https://supabase.com
- [ ] Copy Project URL → `NEXT_PUBLIC_SUPABASE_URL`
- [ ] Copy Anon Key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Copy Service Role Key → `SUPABASE_SERVICE_ROLE_KEY`
- [ ] Go to SQL Editor, paste `supabase_schema.sql` contents, run
- [ ] Verify 8 tables created (users, trends, trend_ai_insights, etc)
- [ ] Check RLS policies are enabled on all tables

### Clerk
- [ ] Create app at https://dashboard.clerk.com
- [ ] Get Publishable Key → `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- [ ] Get Secret Key → `CLERK_SECRET_KEY`
- [ ] Go to Settings > Domains, add your Vercel domain
- [ ] Go to Settings > Redirect URLs:
  - Add `https://your-domain.vercel.app/sign-in/sso-callback`
  - Add `https://your-domain.vercel.app/sign-up/sso-callback`

### OpenAI
- [ ] Create account at https://platform.openai.com
- [ ] Generate API key → `OPENAI_API_KEY`
- [ ] Set up billing (GPT-4o is ~$15/1M tokens)

### NewsAPI
- [ ] Sign up at https://newsapi.org
- [ ] Copy API key → `NEWS_API_KEY`

## Phase 2: GitHub Setup (5 min)

- [ ] Create public GitHub repo: `https://github.com/YOUR_USERNAME/pulse`
- [ ] Clone repo locally: `git clone https://github.com/YOUR_USERNAME/pulse`
- [ ] Copy all files from this project into the cloned directory
- [ ] Initialize git:
  ```bash
  cd pulse
  git add .
  git commit -m "Initial commit: The Pulse MVP"
  git push origin main
  ```
- [ ] Verify files visible on GitHub

## Phase 3: Vercel Deployment (10 min)

### Create Vercel Project
- [ ] Go to https://vercel.com/new
- [ ] Click "Import Git Repository"
- [ ] Select your GitHub repo (connect GitHub if needed)
- [ ] Click Import

### Configure Build & Environment
- [ ] Keep default settings (Framework: Next.js)
- [ ] Scroll to "Environment Variables"
- [ ] Add each variable:
  ```
  NEXT_PUBLIC_SUPABASE_URL = [from Supabase]
  NEXT_PUBLIC_SUPABASE_ANON_KEY = [from Supabase]
  SUPABASE_SERVICE_ROLE_KEY = [from Supabase]
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = [from Clerk]
  CLERK_SECRET_KEY = [from Clerk]
  OPENAI_API_KEY = [from OpenAI]
  NEWS_API_KEY = [from NewsAPI]
  CRON_SECRET = [random string, e.g., abc123xyz789]
  NEXT_PUBLIC_APP_URL = https://your-domain.vercel.app
  NODE_ENV = production
  ```
- [ ] Click "Deploy"
- [ ] Wait for build to complete (5-7 minutes)
- [ ] Get domain URL from Vercel dashboard

### Post-Deployment Setup
- [ ] Copy domain → go to Clerk, add to Redirect URLs
- [ ] Test homepage loads: `https://your-domain.vercel.app`
- [ ] Test sign-up flow (you should see Clerk UI)

## Phase 4: Cron Job Setup 

### ✅ If using Vercel Hobby (Free Tier) - Recommended Solution:

**GitHub Actions Setup** (completely free, better than EasyCron):
- [ ] Update `.github/workflows/fetch-trends.yml` - replace `your-domain` with your actual Vercel domain
- [ ] Go to your GitHub repo > Settings > Secrets and variables > Actions
- [ ] Create new secret:
  - Name: `CRON_SECRET`
  - Value: [same value you used in Vercel env vars]
- [ ] Commit and push `.github/workflows/fetch-trends.yml` to main branch
- [ ] Go to Actions tab > see "Fetch Trends Every 2 Hours" workflow
- [ ] Status should show as scheduled
- [ ] Verify by clicking the workflow - should show next scheduled run times

**How it works:**
- Trends fetch: Every 2 hours (GitHub Actions)
- Insights generate: Daily 1 AM via Vercel cron
- Badges calculate: Daily 2 AM via Vercel cron

### OR If upgrading to Vercel Pro (Optional):
- [ ] Go to Project Settings > Cron Jobs
- [ ] Verify `vercel.json` cron jobs appear:
  - Fetch Trends: `0 */2 * * *` (every 2 hours)
  - Generate Insights: `0 1 * * *` (daily 1 AM)
  - Calculate Badges: `0 2 * * *` (daily 2 AM)
- [ ] Note: Keep GitHub Actions workflow disabled or remove it to avoid conflicts

### OR Use External Service (Free but Limited):
- [ ] Go to EasyCron.com
- [ ] Create 3 free cron tasks pointing to your API endpoints with Bearer token
- [ ] Disable GitHub Actions workflow if using this method

## Phase 5: Initial Data Population (2 min)

Option A: **Wait for scheduled cron**
- [ ] First cron runs in max 2 hours, will populate database

Option B: **Manual trigger** (if you can't wait)
- [ ] Get your CRON_SECRET from env vars
- [ ] Make POST request with curl/Postman:
  ```bash
  curl -X POST https://your-domain.vercel.app/api/cron/fetch-trends \
    -H "Authorization: Bearer YOUR_CRON_SECRET"
  ```
- [ ] Refresh homepage - trends should appear

## Phase 6: Functionality Testing (5 min)

Test core features:
- [ ] Homepage loads with hero section
- [ ] Explore page shows trends
- [ ] Click trend → detail page loads
- [ ] Click Sign Up → Clerk modal appears
- [ ] Create account successfully
- [ ] Create thought on a trend (requires sign-in)
- [ ] Upvote thoughts/comments
- [ ] Ask Q&A question (AI should answer)
- [ ] Visit dashboard → see profile stats
- [ ] Trends update every 2 hours (verify after first cron)

## Phase 7: Production Verification (5 min)

### Vercel Dashboard
- [ ] Check recent deployments - green checkmark ✅
- [ ] View build logs - look for errors
- [ ] Check Analytics if available

### Application Logs
- [ ] Vercel Logs tab - no 5xx errors
- [ ] Check API response times - should be <500ms

### Database  
- [ ] Supabase > Table Editor > trends > verify rows exist
- [ ] Check trend_ai_insights > rows have summaries + insights
- [ ] Check user is created after sign-up

## ✅ You're Live!

When all boxes are checked:
- ✅ App is running on `https://your-domain.vercel.app`
- ✅ Users can sign up and create content
- ✅ AI is generating insights
- ✅ Cron jobs are scheduling trends
- ✅ Database is storing data properly

---

## 🆘 Troubleshooting

| Issue | Fix |
|-------|-----|
| Build fails | Check Vercel logs, verify env vars set |
| Sign-up broken | Verify Clerk domain + redirect URLs |
| No trends show | Manually call `/api/cron/fetch-trends` with CRON_SECRET |
| AI not working | Check OPENAI_API_KEY set, test API separately |
| Database errors | Verify Supabase keys, check RLS policies |
| Cron not running | Verify Vercel Pro, or use external service |

---

**Deployed successfully?** Share your link and celebrate! 🎉
