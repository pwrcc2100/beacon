# Installing Vercel CLI

You're getting a permissions error. Here are the solutions:

## Option 1: Install with sudo (Requires Password)

Run this in your Terminal (it will ask for your Mac password):

```bash
sudo npm install -g vercel
```

---

## Option 2: Fix npm Permissions (Recommended)

This is better long-term. Run these commands:

```bash
# Create a directory for global packages
mkdir ~/.npm-global

# Configure npm to use this directory
npm config set prefix '~/.npm-global'

# Add to your PATH (add this line to ~/.zshrc)
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.zshrc

# Reload your shell configuration
source ~/.zshrc

# Now install Vercel CLI (no sudo needed!)
npm install -g vercel
```

---

## Option 3: Use npx (No Install Needed)

You can use Vercel without installing it globally:

```bash
# Use npx to run vercel commands
npx vercel login
npx vercel
```

---

## Option 4: Use Vercel Web Interface (Easiest)

You can skip the CLI entirely and deploy via the web:
1. Go to https://vercel.com
2. Sign up/login with GitHub
3. Click "Add New Project"
4. Import your GitHub repository
5. Deploy directly from the web interface!

---

## Quick Check

After installing, verify it works:

```bash
vercel --version
```

Then login:

```bash
vercel login
```

---

## Recommended: Use Web Interface

For your first deployment, using the Vercel web interface is actually easier:
- No CLI installation needed
- Visual setup
- Easier environment variable management
- Same end result

Then you can install CLI later if needed.




