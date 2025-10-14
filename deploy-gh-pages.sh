#!/bin/bash

set -e

echo "🚀 Deploying to gh-pages..."

# Navegar al directorio de my-app-combined
cd my-app-combined

# Limpiar archivos anteriores
echo "🧹 Cleaning previous builds..."
rm -rf out .next

# Build the project
echo "📦 Building project..."
NODE_ENV=production npm run build

if [ ! -d "out" ]; then
  echo "❌ Build failed: 'out' directory not found"
  exit 1
fi

# Create .nojekyll file
echo "📝 Creating .nojekyll file..."
touch out/.nojekyll

# Create CNAME file if it doesn't exist
if [ ! -f "out/CNAME" ] && [ -f "../CNAME" ]; then
  echo "📝 Copying CNAME file..."
  cp ../CNAME out/CNAME
fi

# Navigate to out directory
cd out

# Initialize git if not already initialized
if [ ! -d ".git" ]; then
  echo "📝 Initializing git repository..."
  git init
  git remote add origin https://github.com/benjamalegni/financialfeeling.git
fi

# Add all files
echo "📁 Adding files to git..."
git add -A

# Commit changes
echo "💾 Committing changes..."
git commit -m "Deploy to gh-pages - $(date)" || echo "No changes to commit"

# Push to gh-pages branch (force push to replace history)
echo "📤 Pushing to gh-pages branch..."
git push -f origin HEAD:gh-pages

echo ""
echo "✅ Deployment completed!"
echo "🌐 Your site should be available at: https://benjamalegni.github.io/financialfeeling/"
echo "⏰ It may take a few minutes for the changes to appear."
