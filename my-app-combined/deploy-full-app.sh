#!/bin/bash

echo "🚀 Deploying full Next.js application..."

# Set production environment
export NODE_ENV=production

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

# Go to root directory
cd ..

# Add all files to git
echo "📁 Adding files to git..."
git add .

# Commit changes
echo "💾 Committing changes..."
git commit -m "Deploy full Next.js application - $(date)"

# Push to main branch
echo "📤 Pushing to main branch..."
git push origin main

echo "✅ Full Next.js application deployed!"
echo "🌐 Your site should be available at: https://benjamalegni.github.io/financialfeeling/"
echo "⏰ It may take a few minutes for the changes to appear."
echo ""
echo "📋 This will show your complete Next.js application with all features." 