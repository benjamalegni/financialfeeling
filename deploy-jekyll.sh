#!/bin/bash

echo "🚀 Deploying for Jekyll..."

# Build the project
echo "📦 Building project..."
npm run build

# Create .nojekyll file
echo "📝 Creating .nojekyll file..."
touch out/.nojekyll

# Copy built files to root for Jekyll
echo "📁 Copying built files to root..."
cp -r out/* ./

# Add all files to git
echo "📁 Adding files to git..."
git add .

# Commit changes
echo "💾 Committing changes..."
git commit -m "Deploy for Jekyll - $(date)"

# Push to main branch
echo "📤 Pushing to main branch..."
git push origin main

echo "✅ Jekyll deployment completed!"
echo "🌐 Your site should be available at: https://benjamalegni.github.io/financialfeeling/"
echo "⏰ It may take a few minutes for the changes to appear."
echo ""
echo "📋 Jekyll will now serve the static files from the root directory" 