# Connect GitHub to Vercel - Step by Step

## Current Status
✅ Git repository initialized
✅ Code committed locally
❌ GitHub repository needs to be created and connected

## Step 1: Create GitHub Repository

1. **Go to GitHub**: https://github.com/new
2. **Repository name**: `beacon-dashboard` (or your preferred name)
3. **Description**: "Beacon Wellbeing Dashboard - Executive Demo Platform"
4. **Visibility**: 
   - Choose **Private** (recommended for business code)
   - Or **Public** if you want it open
5. **DO NOT** initialize with README, .gitignore, or license (we already have these)
6. Click **"Create repository"**

## Step 2: Connect Local Repository to GitHub

After creating the repository, GitHub will show you commands. Use these:

```bash
cd /Users/petawilson/Desktop/Beacon/webapp/beacon

# Add GitHub remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/beacon-dashboard.git

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

**OR if you already have a repository at:** https://github.com/peta-collab/beacon

```bash
cd /Users/petawilson/Desktop/Beacon/webapp/beacon
git remote add origin https://github.com/peta-collab/beacon.git
git branch -M main
git push -u origin main
```

## Step 3: Connect to Vercel

### Option A: Via Vercel Dashboard (Easiest)

1. **Go to**: https://vercel.com/beacon1/beacon/settings/git
2. Click **"Connect Git Repository"**
3. Select **GitHub**
4. Authorize Vercel to access your GitHub
5. Select your repository (`beacon-dashboard` or `beacon`)
6. Click **"Connect"**
7. Vercel will automatically detect the framework

### Option B: Via Vercel CLI

```bash
cd /Users/petawilson/Desktop/Beacon/webapp/beacon
vercel link
# Follow prompts to connect to existing project
```

## Step 4: Verify Connection

After connecting:
- ✅ Pushes to GitHub will automatically trigger Vercel deployments
- ✅ You can see deployment status in Vercel dashboard
- ✅ Pull requests will create preview deployments

## Troubleshooting

### "Repository not found"
- Make sure you've pushed the code to GitHub first
- Verify the repository URL is correct
- Check that you have access to the repository

### "Authentication failed"
- Go to Vercel Settings → Git → Disconnect and reconnect
- Make sure GitHub OAuth is authorized

### "Branch not found"
- Make sure you've pushed to the default branch (usually `main` or `master`)
- Check branch name matches in GitHub and Vercel settings

## Next Steps After Connection

1. **Enable Auto-Deploy**: 
   - Vercel will automatically deploy when you push to GitHub
   - Production branch: `main` (or as configured)

2. **Preview Deployments**:
   - Every pull request gets a preview URL
   - Test changes before merging to main

3. **Environment Variables**:
   - Add them in Vercel Dashboard
   - They'll be available to all deployments

---

**Current Project URL**: https://beacon-5tffcd7v0-beacon1.vercel.app
**Vercel Dashboard**: https://vercel.com/beacon1/beacon



