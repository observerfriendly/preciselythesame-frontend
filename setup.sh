#!/bin/bash

echo "🚀 Setting up Precisely The Same Frontend Project"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

echo "✅ Dependencies installed successfully"

# Create database directory if it doesn't exist
mkdir -p database

echo "📁 Project structure created"

echo ""
echo "🎉 Project setup complete!"
echo ""
echo "Next steps:"
echo "1. Your .env.local file is already configured with your API keys"
echo "2. Run 'npm run dev' to start development server"
echo "3. Deploy to Vercel with 'vercel --prod'"
echo "4. Set up your Neon database and run 'npm run db:setup'"
echo ""
echo "Happy coding! 🚀"
