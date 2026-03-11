# New Laptop Setup Guide for Beacon Dashboard

## 🚀 Essential Applications to Download

### 1. **Node.js & npm** (Required)
**What it is:** JavaScript runtime needed to run the Next.js application

**Download:**
- Go to: https://nodejs.org/
- Download the **LTS version** (Long Term Support)
- Install the `.pkg` file
- This also installs `npm` (Node Package Manager)

**Verify Installation:**
```bash
node --version  # Should show v20.x.x or higher
npm --version   # Should show 10.x.x or higher
```

---

### 2. **Git** (Required)
**What it is:** Version control system for managing code and deploying

**Download:**
- Option A (Recommended): Install Xcode Command Line Tools
  ```bash
  xcode-select --install
  ```
- Option B: Download from https://git-scm.com/download/mac

**Verify Installation:**
```bash
git --version
```

---

### 3. **VS Code (Visual Studio Code)** (Highly Recommended)
**What it is:** Code editor for editing your project files

**Download:**
- Go to: https://code.visualstudio.com/
- Download macOS version
- Drag to Applications folder

**Recommended Extensions (after installing):**
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript and JavaScript Language Features (built-in)

---

### 4. **Vercel CLI** (For Deployment)
**What it is:** Command-line tool to deploy to Vercel

**Install after Node.js is installed:**
```bash
npm install -g vercel
```

**Or use web interface:** You can skip this if you prefer to deploy via Vercel website

---

### 5. **Homebrew** (Optional but Recommended)
**What it is:** Package manager for macOS - makes installing development tools easier

**Install:**
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

**Verify:**
```bash
brew --version
```

---

### 6. **Supabase CLI** (Optional - for local development)
**What it is:** Command-line tool for managing Supabase

**Install:**
```bash
npm install -g supabase
```

**Or via Homebrew:**
```bash
brew install supabase/tap/supabase
```

---

### 7. **GitHub Desktop** (Optional but Recommended)
**What it is:** GUI for Git - easier than command line for beginners

**Download:**
- Go to: https://desktop.github.com/
- Download macOS version
- Login with your GitHub account

**Alternative:** Use VS Code's built-in Git features

---

### 8. **Postgres/PostgreSQL Client** (Optional - for database management)
**What it is:** If you want to directly manage your Supabase database

**Options:**
- **TablePlus** (Free): https://tableplus.com/ (User-friendly)
- **pgAdmin** (Free): https://www.pgadmin.org/ (More advanced)
- **DBeaver** (Free): https://dbeaver.io/ (Cross-platform)

**Note:** You can also use Supabase web dashboard instead

---

### 9. **Chrome or Firefox** (Recommended)
**What it is:** For testing your deployed application

**Already installed?** Great! Just make sure it's updated.

---

## 📋 Setup Checklist

### Step 1: Install Core Tools
- [ ] Install Node.js (from nodejs.org)
- [ ] Install Git (via Xcode Command Line Tools)
- [ ] Verify both work in Terminal

### Step 2: Install Development Tools
- [ ] Install VS Code
- [ ] Install GitHub Desktop (optional)
- [ ] (Optional) Install Homebrew

### Step 3: Install Deployment Tools
- [ ] Install Vercel CLI: `npm install -g vercel`
- [ ] Login to Vercel: `vercel login`

### Step 4: Set Up Your Project
- [ ] Clone or navigate to your project folder
- [ ] Install dependencies: `npm install`
- [ ] Set up environment variables (see below)

---

## 🛠️ First-Time Project Setup

After installing the applications above, run these commands:

```bash
# 1. Navigate to your project
cd /Users/petawilson/Desktop/Beacon/webapp/beacon

# 2. Install project dependencies
npm install

# 3. Create environment file
cp env.template .env.local

# 4. Edit .env.local with your credentials
# (Use VS Code or any text editor)
```

---

## 🌐 Browser Extensions (Optional)

### For VS Code:
- ESLint
- Prettier - Code formatter
- Tailwind CSS IntelliSense
- GitLens
- Auto Rename Tag

### For Chrome:
- React Developer Tools (if using React)
- Redux DevTools (if using Redux)

---

## 🔑 Accounts You'll Need

### Required:
1. **GitHub Account** (for code hosting)
   - Sign up at: https://github.com/

2. **Vercel Account** (for deployment)
   - Sign up at: https://vercel.com/ (can use GitHub to sign in)

3. **Supabase Account** (for database)
   - Sign up at: https://supabase.com/ (can use GitHub to sign in)

### Optional:
4. **Twilio Account** (for SMS features)
   - Sign up at: https://www.twilio.com/

---

## 📝 Quick Terminal Commands Reference

Once everything is installed, here are the commands you'll use:

```bash
# Check Node.js version
node --version

# Check npm version
npm --version

# Check Git version
git --version

# Navigate to project
cd /Users/petawilson/Desktop/Beacon/webapp/beacon

# Install dependencies (first time)
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Deploy to Vercel
vercel

# Login to Vercel
vercel login
```

---

## 🚨 Troubleshooting

### "Command not found" errors:
- Make sure you've installed Node.js and Git
- Restart Terminal after installing
- Check if applications are in your PATH

### "Permission denied" errors:
- You may need to use `sudo` for some installations
- For npm global packages, you might need to fix npm permissions

### "Xcode Command Line Tools" errors:
- Run: `xcode-select --install`
- This is a large download (a few GB)

---

## ✅ Verification Test

After installing everything, run this test:

```bash
# Test Node.js
node --version
# Should show: v20.x.x or higher

# Test npm
npm --version
# Should show: 10.x.x or higher

# Test Git
git --version
# Should show: git version 2.x.x

# Test Vercel CLI (after installing)
vercel --version
# Should show: 32.x.x or similar

# Test project setup
cd /Users/petawilson/Desktop/Beacon/webapp/beacon
npm install
npm run dev
# Should start development server on http://localhost:3000
```

---

## 🎯 Installation Order (Recommended)

1. **Node.js** (most important)
2. **Git** (via Xcode Command Line Tools)
3. **VS Code** (for editing code)
4. **GitHub Account** (create account, then install GitHub Desktop if desired)
5. **Vercel CLI** (via npm: `npm install -g vercel`)
6. **Supabase Account** (create account online)
7. **Vercel Account** (create account online)

---

## 📞 Need Help?

If you run into issues:
1. Check the error message in Terminal
2. Search error message on Google/Stack Overflow
3. Check application documentation
4. Verify all prerequisites are installed

---

## 🎉 Once Everything is Installed

You'll be ready to:
1. ✅ Run the development server locally
2. ✅ Deploy to Vercel
3. ✅ Manage your code with Git
4. ✅ Edit code in VS Code
5. ✅ Access your database via Supabase

**Next Steps:** See `DEPLOYMENT_GUIDE.md` for deployment instructions!




