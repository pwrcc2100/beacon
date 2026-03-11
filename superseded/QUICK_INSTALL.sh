#!/bin/bash

# Quick Install Script for Beacon Dashboard
# Run this script to install all necessary tools

echo "🚀 Beacon Dashboard - Quick Setup Script"
echo "=========================================="
echo ""

# Check if Homebrew is installed
if ! command -v brew &> /dev/null; then
    echo "📦 Installing Homebrew..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    echo "✅ Homebrew installed"
else
    echo "✅ Homebrew already installed"
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "📦 Installing Node.js..."
    echo "Please download Node.js from https://nodejs.org/ and install the .pkg file"
    echo "Or install via Homebrew: brew install node"
    read -p "Press Enter after Node.js is installed to continue..."
else
    echo "✅ Node.js already installed: $(node --version)"
fi

# Check if Git is installed
if ! command -v git &> /dev/null; then
    echo "📦 Installing Git (via Xcode Command Line Tools)..."
    xcode-select --install
    echo "⚠️  Please complete the Xcode Command Line Tools installation, then run this script again"
    exit 1
else
    echo "✅ Git already installed: $(git --version)"
fi

# Install Vercel CLI
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
    echo "✅ Vercel CLI installed"
else
    echo "✅ Vercel CLI already installed"
fi

# Install project dependencies
echo ""
echo "📦 Installing project dependencies..."
cd "$(dirname "$0")"
npm install

echo ""
echo "✅ Setup Complete!"
echo ""
echo "📋 Next Steps:"
echo "1. Create a .env.local file (copy from env.template)"
echo "2. Add your Supabase credentials"
echo "3. Run 'npm run dev' to start development server"
echo "4. Run 'vercel login' to set up deployment"
echo ""
echo "📖 See NEW_LAPTOP_SETUP.md for detailed instructions"




