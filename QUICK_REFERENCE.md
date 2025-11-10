# Beacon Dashboard - Quick Reference Guide

## 🚀 Getting Started

### Local Development
```bash
cd /Users/petawilson/Desktop/Beacon/webapp/beacon
npm run dev
```
Access at: `http://localhost:3000`

### Admin Login
1. Navigate to `/dashboard/dash-login`
2. Enter password: `Beacon2100!`
3. Access admin tools in the sidebar

## 🔑 Environment Variables

### Required Variables (Vercel)
- `NEXT_PUBLIC_DASHBOARD_CLIENT_ID` - Default client ID for dashboard
- `NEXT_PUBLIC_APP_URL` - Production URL (https://beacon-mu.vercel.app)
- `NEXT_PUBLIC_ADMIN_DASH_TOKEN` - Admin password for dashboard access
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key (server-side only)

## 📊 Dashboard Features

### Executive Dashboard (`/dashboard`)
- **Filters:** Division → Department → Team hierarchy
- **Time Periods:** Week, Month, Quarter, All Time
- **Data Modes:** Historical vs Live
- **Key Sections:**
  - Overall Wellbeing Score (with gauge)
  - Current Sentiment (5 dimensions)
  - Divisions Heatmap Table
  - Which Teams Need Attention
  - Key Insights (2 per color type)

### Group Leader Dashboard (`/dashboard/group-leader`)
- **Filters:** Division → Department selection
- **Features:**
  - Individual team cards with mini gauges
  - AI-generated insights per team
  - Historical trend sparklines
  - Color-coded status indicators

### Trends Page (`/dashboard/trends`)
- **Filters:** Division → Department → Team hierarchy
- **Features:**
  - Time series charts for all 5 dimensions
  - Automated insights callout
  - Period selection (Week, Month, Quarter)

## 🎲 Demo Data Generation

### Access Admin Tools
1. Login at `/dashboard/dash-login`
2. Admin tools appear in sidebar
3. Click "Generate Balanced Demo Data"

### What It Creates
- **QLD Division:** High scores (green) - thriving teams
- **Sydney Metro - Health:** High scores (green)
- **Sydney Metro - Education:** High scores (green)
- **Sydney Metro - Other Depts:** Mixed scores (yellow/orange)
- **Regional Division:** Lower scores (red/orange) - attention needed

## 🔍 Key Metrics

### Beacon Index Interpretation
- **≥ 80%** (Green) - Strong psychosocial safety
- **65-79%** (Yellow) - Generally positive — monitor
- **< 65%** (Red) - Elevated psychosocial risk

### Weighting Formula
- Sentiment: 25%
- Workload: 25%
- Safety: 20%
- Leadership: 20%
- Clarity: 10%

## 📱 QR Code Generation

### Generate Survey Links
1. Access admin tools (sidebar)
2. Click "Generate QR Code"
3. QR code uses production URL automatically
4. Share via print or digital channels

### Survey Flow
1. Scan QR code or use link
2. Multi-step wizard (5 questions)
3. Progress bar shows completion
4. Back navigation available
5. Submit at end

## 🐛 Troubleshooting

### Build Failures
```bash
# Check for TypeScript errors
npm run build

# Check for linting issues
npm run lint
```

### Data Not Showing
1. Verify `NEXT_PUBLIC_DASHBOARD_CLIENT_ID` is set
2. Generate demo data via admin tools
3. Check Supabase connection
4. Refresh materialized view (done automatically with demo data)

### QR Codes Not Working
1. Verify `NEXT_PUBLIC_APP_URL` is set to production URL
2. Check Vercel environment variables
3. Redeploy after environment variable changes

### Deployment Issues
1. Check Vercel build logs
2. Verify all environment variables are set
3. Ensure no TypeScript errors
4. Check that git push was successful

## 📝 Common Tasks

### Update Survey Questions
File: `src/components/survey/Question.tsx`

### Update Methodology Content
File: `src/app/methodology/page.tsx`

### Adjust Weighting Formula
File: `src/components/dashboard/scoreTheme.ts`

### Modify Heatmap Colors
File: `src/components/dashboard/ExecutiveOverview.tsx`

### Change Insight Generation Logic
File: `src/lib/executiveInsights.tsx`

## 🔗 Important URLs

- **Production:** https://beacon-mu.vercel.app
- **Dashboard:** https://beacon-mu.vercel.app/dashboard
- **Admin Login:** https://beacon-mu.vercel.app/dashboard/dash-login
- **Vercel Project:** https://vercel.com/pwrcc2100s-projects
- **GitHub Repo:** https://github.com/pwrcc2100/beacon

## 💡 Tips

1. **Always test locally** before deploying
2. **Use demo data** for testing and presentations
3. **Clear browser cache** if seeing old content
4. **Check Vercel logs** for deployment issues
5. **Environment variables** require redeploy to take effect

## 🆘 Support

For issues or questions:
1. Check `RECENT_UPDATES.md` for latest changes
2. Review Vercel deployment logs
3. Check browser console for client-side errors
4. Verify Supabase connection and data

---

**Last Updated:** November 10, 2025

