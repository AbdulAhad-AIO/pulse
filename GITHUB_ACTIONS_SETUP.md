# GitHub Actions Cron Setup (Free Alternative)

Use this guide if you're on **Vercel Hobby (Free)** to replace the every-2-hour cron job that requires Pro.

## ✅ 5-Minute Setup

### Step 1: Update Domain in Workflow
Edit `.github/workflows/fetch-trends.yml`:
- Replace `your-domain.vercel.app` with your actual deployed domain
- Example: `https://pulse-ui-five.vercel.app`

### Step 2: Add GitHub Secret
1. Go to your GitHub repo
2. Click **Settings** (top menu)
3. Click **Secrets and variables** > **Actions**
4. Click **New repository secret**
5. Create:
   - **Name:** `CRON_SECRET`
   - **Value:** [same value as `CRON_SECRET` in your Vercel env vars]
6. Click **Add secret**

### Step 3: Commit & Push
```bash
git add .github/workflows/fetch-trends.yml
git commit -m "Add GitHub Actions cron for free tier"
git push origin main
```

### Step 4: Verify
1. Go to your GitHub repo > **Actions** tab
2. Look for workflow named "Fetch Trends Every 2 Hours"
3. Click it - you should see:
   - ✅ Status: "scheduled"
   - Next run times listed

**Done!** Trends will fetch automatically every 2 hours.

## 📊 What's Running Now

| Task | Schedule | Method |
|------|----------|--------|
| Fetch Trends | Every 2 hours | GitHub Actions ✅ |
| Generate Insights | Daily 1 AM UTC | Vercel cron |
| Calculate Badges | Daily 2 AM UTC | Vercel cron |

## 🆘 Troubleshooting

**Workflow not showing in Actions tab?**
→ Push `.github/workflows/fetch-trends.yml` to main branch again

**Errors in GitHub Actions?**
→ Check:
1. Domain in workflow matches your Vercel deployment
2. `CRON_SECRET` secret is set correctly in GitHub
3. Vercel logs show API endpoint exists

**Want to test manually?**
→ Go to Actions tab > Click workflow > **Run workflow** button

## 💡 Future Options

- **Upgrade to Vercel Pro** ($20/month) - use Vercel crons instead, remove GitHub Actions
- **Switch to external service** (EasyCron) - still free but less reliable
- **Use AWS Lambda** (free tier) - more complex setup

---

GitHub Actions is completely free and runs reliably for the MVP. ✅
