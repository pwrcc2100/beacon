# Beacon Index Site - Deployment Guide

## Separate Deployment Setup

This Beacon Index marketing site is configured to deploy **separately** from the main Beacon Advisory site.

## Step 1: Add the Pilot Pack File

Before deploying, add the PowerPoint file to the `public/` folder:

1. Copy `MASTER_Beacon Pilot Information Pack Dec 4 2025.pptx` into `beacon-index-site/public/`
2. The download link on the site will automatically work once the file is there

**Optional:** If the filename has spaces and causes issues, rename it to something URL-friendly like:
- `beacon-index-pilot-pack.pptx`
- Then update the link in `src/app/page.tsx` line 509 to match

## Step 2: Deploy to Vercel

### Option A: Via Vercel Dashboard (Recommended)

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New Project"
3. Import the `beacon-index-site` folder (or connect your Git repo if you've pushed it)
4. Vercel will auto-detect Next.js and configure it
5. Click "Deploy"

### Option B: Via CLI

```bash
cd beacon-index-site
npm i -g vercel
vercel login
vercel
```

For production:
```bash
vercel --prod
```

## Step 3: Configure Custom Domain

**Target Domain:** `beaconindex.com.au`

Once deployed:

1. Go to your project in Vercel dashboard
2. Settings → Domains
3. Add `beaconindex.com.au` (and optionally `www.beaconindex.com.au`)
4. Follow Vercel's DNS instructions to add the required records at your registrar:
   - **A record** for `beaconindex.com.au` pointing to Vercel's IP (Vercel will provide this)
   - **CNAME record** for `www.beaconindex.com.au` pointing to Vercel's CNAME target (Vercel will provide this)
   - Or use Vercel's nameservers if you prefer to manage DNS entirely through Vercel

## What's Different from Main Site?

- **Separate codebase:** Lives in `beacon-index-site/` folder
- **Separate deployment:** Has its own Vercel project
- **Separate domain:** Can use a subdomain or different domain entirely
- **No shared dependencies:** Completely independent Next.js app

This means you can update and deploy the Beacon Index site without affecting the Beacon Advisory site, and vice versa.
