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

# Create gh-pages branch and push
echo "🌿 Setting up gh-pages branch..."
git subtree push --prefix out origin gh-pages || {
    echo "⚠️  First time setup - creating gh-pages branch..."
    git push origin `git subtree split --prefix out main`:gh-pages --force
}

echo "✅ Deployment completed!"
echo "🌐 Your site should be available at: https://benjamalegni.github.io/financialfeeling/"
echo "⏰ It may take a few minutes for the changes to appear." 