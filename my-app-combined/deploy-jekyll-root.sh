#!/bin/bash

echo "🚀 Deploying for Jekyll (root directory)..."

# Build the project
echo "📦 Building project..."
npm run build

# Create .nojekyll file
echo "📝 Creating .nojekyll file..."
touch out/.nojekyll

# Copy built files to repository root
echo "📁 Copying built files to repository root..."
cp -r out/* ../

# Copy _config.yml to root if it doesn't exist
echo "📄 Copying _config.yml to root..."
cp _config.yml ../_config.yml

# Go to root directory
cd ..

# Add all files to git
echo "📁 Adding files to git..."
git add .

# Commit changes
echo "💾 Committing changes..."
git commit -m "Deploy for Jekyll root - $(date)"

# Push to main branch
echo "📤 Pushing to main branch..."
git push origin main

echo "✅ Jekyll deployment completed!"
echo "🌐 Your site should be available at: https://benjamalegni.github.io/financialfeeling/"
echo "⏰ It may take a few minutes for the changes to appear."
echo ""
echo "📋 Jekyll will now serve the static files from the repository root" 