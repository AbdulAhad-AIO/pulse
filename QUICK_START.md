# The Pulse - Quick Start Guide

Get The Pulse running locally in 5 minutes, or deployed in 20 minutes.

## 🚀 Launch in 5 Minutes (Local Development)

### Prerequisites
- Node.js 18+
- Git
- `.env.local` file with all credentials

### Steps

```bash
# 1. Clone and install
git clone YOUR_REPO_URL
cd pulse
npm install

# 2. Set up environment
cp .env.local.example .env.local
# Edit .env.local with your credentials

# 3. Run dev server
npm run dev

# 4. Open browser
open http://localhost:3000
```

**Done!** The app is running locally.

## 🔑 Required Environment Variables

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_key
CLERK_SECRET_KEY=your_secret

# OpenAI
OPENAI_API_KEY=your_api_key

# News
NEWS_API_KEY=your_newsapi_key

# Cron
CRON_SECRET=random_secret

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## ⚡ Deploy to Vercel in 20 Minutes

### 1. Prepare (5 min)
- [ ] Create Supabase project → get URL + keys
- [ ] Load schema from `supabase_schema.sql`
- [ ] Create Clerk app → get keys
- [ ] Get OpenAI API key
- [ ] Get NewsAPI key

### 2. GitHub (5 min)
```bash
git add .
git commit -m "Launch The Pulse"
git push origin main
```

### 3. Vercel (10 min)
1. Go to [vercel.com/new](https://vercel.com/new)
2. Import GitHub repo
3. Click Deploy
4. Go to Settings > Environment Variables
5. Add all variables from `.env.local`
6. Redeploy

**Done!** Your app is live.

## 📚 Key Files

| File | Purpose |
|------|---------|
| `README.md` | Full documentation |
| `SETUP_GUIDE.md` | Detailed setup instructions |
| `DEPLOYMENT_GUIDE.md` | Complete deployment walkthrough |
| `supabase_schema.sql` | Database schema |
| `vercel.json` | Cron job config |
| `.env.local` | Environment variables |

## 🔧 Common Commands

```bash
npm run dev          # Local dev server (http://localhost:3000)
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Check code quality
npm run type-check   # Type checking
```

## 📖 Next Steps

1. **Local Testing**
   - Sign up with Clerk
   - Explore trends
   - Create a thought
   - Check dashboard

2. **Deploy**
   - Follow DEPLOYMENT_GUIDE.md

3 **Monitor**
   - Check Vercel logs
   - Verify cron jobs run
   - Test API endpoints

4. **Launch**
   - Share with friends
   - Gather feedback
   - Iterate!

## ❓ Troubleshooting

**Build fails?**
→ Check `.env.local` has all required variables

**Login doesn't work?**
→ Verify Clerk keys and redirect URLs

**No trends showing?**
→ Manual trigger: POST to `/api/cron/fetch-trends` or wait 2 hours

**Database errors?**
→ Verify Supabase URL and keys

## 📞 Support

- Check README.md for full docs
- See DEPLOYMENT_GUIDE.md for step-by-step
- Review GitHub issues/discussions
- Check Vercel logs for errors

---

**Ready to launch?** Start with the DEPLOYMENT_GUIDE.md! 🎉
