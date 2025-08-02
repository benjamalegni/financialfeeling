#!/bin/bash

echo "🚀 Starting deployment to GitHub Pages..."

# Build the project
echo "📦 Building project..."
npm run build

# Create .nojekyll file
echo "📝 Creating .nojekyll file..."
touch out/.nojekyll

# Add all files to git
echo "📁 Adding files to git..."
git add .

# Commit changes
echo "💾 Committing changes..."
git commit -m "Deploy to GitHub Pages - $(date)"

# Push to main branch
echo "📤 Pushing to main branch..."
git push origin main

# Create gh-pages branch
echo "🌿 Creating gh-pages branch..."
git checkout --orphan gh-pages
git rm -rf .
git checkout main -- out
git add out/
git commit -m "Deploy to GitHub Pages"

# Push gh-pages branch
echo "📤 Pushing gh-pages branch..."
git push origin gh-pages --force

# Go back to main branch
echo "🔄 Switching back to main branch..."
git checkout main

echo "✅ Deployment completed!"
echo "🌐 Your site should be available at: https://benjamalegni.github.io/financialfeeling/"
echo "⏰ It may take a few minutes for the changes to appear." 