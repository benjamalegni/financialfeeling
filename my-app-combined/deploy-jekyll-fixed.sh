#!/bin/bash

echo "🚀 Deploying Next.js app for Jekyll (Fixed Version)..."

# Set production environment and static export
export NODE_ENV=production
export USE_STATIC_EXPORT=true

# Build the project
echo "📦 Building project with production config..."
npm run build

# Create .nojekyll file
echo "📝 Creating .nojekyll file..."
touch out/.nojekyll

# Copy all built files to repository root
echo "📁 Copying all built files to repository root..."
cp -r out/* ../

# Copy _config.yml to root
echo "📄 Copying _config.yml to root..."
cp _config.yml ../_config.yml

# Create .nojekyll in root to prevent Jekyll processing
echo "📝 Creating .nojekyll in root..."
touch ../.nojekyll

# Go to root directory
cd ..

# Verify static files are present
echo "🔍 Verifying static files..."
ls -la _next/static/css/ 2>/dev/null && echo "✅ CSS files present"
ls -la _next/static/chunks/ 2>/dev/null && echo "✅ JS files present"

# Add all files to git
echo "📁 Adding files to git..."
git add .

# Commit changes
echo "💾 Committing changes..."
git commit -m "Deploy Next.js app for Jekyll with static files - $(date)"

# Push to main branch
echo "📤 Pushing to main branch..."
git push origin main

echo "✅ Next.js app deployed for Jekyll!"
echo "🌐 Your site should be available at: https://benjamalegni.github.io/financialfeeling/"
echo "⏰ It may take a few minutes for the changes to appear."
echo ""
echo "📋 This will show your complete Next.js application with all static files." 