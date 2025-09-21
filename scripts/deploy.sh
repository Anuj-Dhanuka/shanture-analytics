#!/bin/bash

# Shanture Analytics Dashboard - Deployment Script
# This script helps with deployment preparation

echo "🚀 Shanture Analytics Dashboard - Deployment Preparation"
echo "=================================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

echo "📦 Installing dependencies..."

# Install root dependencies
npm install

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install
cd ..

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
cd ..

echo "🔧 Building frontend for production..."
cd frontend
npm run build
cd ..

echo "✅ Deployment preparation complete!"
echo ""
echo "📋 Next steps:"
echo "1. Push your code to GitHub"
echo "2. Deploy backend to Render (Web Service)"
echo "3. Deploy frontend to Render (Static Site)"
echo "4. Set environment variables in Render dashboard"
echo "5. Test your deployment"
echo ""
echo "📖 See DEPLOYMENT_GUIDE.md for detailed instructions"


