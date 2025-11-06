# Deployment Guide for Beacon Dashboard

## Quick Deploy Options

### Option 1: Vercel (Recommended - Easiest)

Vercel is the easiest way to deploy Next.js applications with zero configuration.

#### Steps:

1. **Push to GitHub** (if not already):
   ```bash
   cd /Users/petawilson/Desktop/Beacon/webapp/beacon
   git init  # if not already initialized
   git add .
   git commit -m "Ready for deployment"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Deploy to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Sign up/login with GitHub
   - Click "Add New Project"
   - Import your repository
   - Configure environment variables (see below)
   - Click "Deploy"

3. **Set Environment Variables in Vercel**:
   - Go to Project Settings → Environment Variables
   - Add all variables from `env.template`:
     ```
     NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
     SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
     SUPABASE_ANON_KEY=your_anon_key
     UPSTASH_REDIS_REST_URL=your_redis_url
     UPSTASH_REDIS_REST_TOKEN=your_redis_token
     NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
     ADMIN_PASSWORD=beacon2025
     ADMIN_DASH_TOKEN=your_dashboard_token
     NEXT_PUBLIC_DASHBOARD_CLIENT_ID=your_client_id
     TWILIO_ACCOUNT_SID=your_twilio_sid (optional)
     TWILIO_AUTH_TOKEN=your_twilio_token (optional)
     TWILIO_PHONE_NUMBER=+61xxxxxxxxx (optional)
     ```

4. **Redeploy** after adding environment variables

---

### Option 2: Netlify

#### Steps:

1. **Push to GitHub** (same as above)     NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
     SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
     SUPABASE_ANON_KEY=your_anon_key
     UPSTASH_REDIS_REST_URL=your_redis_url
     UPSTASH_REDIS_REST_TOKEN=your_redis_token
     NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
     ADMIN_PASSWORD=beacon2025
     ADMIN_DASH_TOKEN=your_dashboard_token
     NEXT_PUBLIC_DASHBOARD_CLIENT_ID=your_client_id
     TWILIO_ACCOUNT_SID=your_twilio_sid (optional)
     TWILIO_AUTH_TOKEN=your_twilio_token (optional)
     TWILIO_PHONE_NUMBER=+61xxxxxxxxx (optional)

2. **Deploy to Netlify**:
   - Go to [netlify.com](https://netlify.com)
   - Sign up/login with GitHub
   - Click "Add New Site" → "Import an existing project"
   - Select your repository
   - Build settings:
     - Build command: `npm run build`
     - Publish directory: `.next`
   - Add environment variables (same as Vercel)
   - Click "Deploy site"

---

### Option 3: Railway

#### Steps:

1. Go to [railway.app](https://railway.app)
2. Sign up/login with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Add environment variables
6. Railway will auto-detect Next.js and deploy

---

### Option 4: AWS Amplify

#### Steps:

1. Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify)
2. Click "New App" → "Host web app"
3. Connect your GitHub repository
4. Configure build settings:
   ```
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm install
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: .next
       files:
         - '**/*'
     cache:
       paths:
         - node_modules/**/*
   ```
5. Add environment variables
6. Deploy

---

## Environment Variables Required

Copy these from your `.env.local` or set them in your deployment platform:

```bash
# Supabase (Required)
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_ANON_KEY=

# Redis (Optional - for rate limiting)
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# App URL (Required - update to your deployed URL)
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app

# Admin Access (Required)
ADMIN_PASSWORD=beacon2025
ADMIN_DASH_TOKEN=your_secure_token_here

# Dashboard Client ID (Required for demo)
NEXT_PUBLIC_DASHBOARD_CLIENT_ID=your_client_id

# Twilio (Optional - for SMS)
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=
```

---

## Pre-Deployment Checklist

- [ ] All environment variables are ready
- [ ] Database is set up (Supabase tables created)
- [ ] `NEXT_PUBLIC_APP_URL` is updated to your deployment URL
- [ ] Code is pushed to GitHub
- [ ] All secrets are NOT in the code (check `.gitignore`)

---

## Post-Deployment Steps

1. **Test the dashboard**:
   - Visit: `https://your-app.vercel.app/dashboard`
   - Login if `ADMIN_DASH_TOKEN` is set

2. **Generate demo data**:
   - Go to dashboard → Click "Generate 100 Demo Records"
   - Or use API: `POST /api/demo/seed-with-departments`

3. **Test QR code**:
   - Visit: `https://your-app.vercel.app/demo-qr`
   - Generate a QR code and test survey flow

4. **Test survey flow**:
   - Scan QR code or visit survey URL
   - Complete survey
   - Check participant view
   - Verify dashboard updates

---

## Recommended: Vercel (Fastest Setup)

**Why Vercel?**
- ✅ Zero configuration for Next.js
- ✅ Automatic HTTPS
- ✅ Free tier available
- ✅ Automatic deployments from GitHub
- ✅ Built-in CI/CD
- ✅ Edge network for fast performance

**Quick Command Line Deploy:**

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from project directory
cd /Users/petawilson/Desktop/Beacon/webapp/beacon
vercel

# Follow prompts to set environment variables
```

---

## Troubleshooting

### Build Fails
- Check Node.js version (needs 18+)
- Check environment variables are set
- Review build logs in deployment platform

### Database Connection Issues
- Verify Supabase URL and keys are correct
- Check Supabase project is active
- Verify database tables exist

### Dashboard Not Loading
- Check `NEXT_PUBLIC_DASHBOARD_CLIENT_ID` is set
- Verify admin token if login is required
- Check browser console for errors

---

## Need Help?

- Vercel Docs: https://vercel.com/docs
- Next.js Deployment: https://nextjs.org/docs/deployment
- Supabase Setup: https://supabase.com/docs

---

**Ready to deploy? Start with Vercel for the fastest setup!**




