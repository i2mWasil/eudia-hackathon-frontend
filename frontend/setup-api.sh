#!/bin/bash

# Setup script for API integration

echo "🚀 Setting up API integration..."

# 1. Copy folderlist.csv to public directory
echo "📋 Copying folderlist.csv to public directory..."
cp src/cache/folderlist.csv public/folderlist.csv

if [ $? -eq 0 ]; then
    echo "✅ Successfully copied folderlist.csv"
else
    echo "❌ Failed to copy folderlist.csv"
    exit 1
fi

# 2. Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from example.env..."
    cp example.env .env
    echo "✅ Created .env file"
else
    echo "ℹ️  .env file already exists"
fi

# 3. Verify .env configuration
echo ""
echo "🔍 Current configuration:"
cat .env
echo ""

# 4. Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
else
    echo "✅ Dependencies already installed"
fi

echo ""
echo "✨ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Review your .env file and update VITE_SERVER_URL if needed"
echo "2. Run 'npm run dev' to start the development server"
echo "3. Open the ExplorePage to see companies loaded from the API"
echo ""
