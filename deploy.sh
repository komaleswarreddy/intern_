#!/bin/bash

# Custom Form Builder Deployment Script
echo "🚀 Starting deployment process..."

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -d "client" ] || [ ! -d "server" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

echo "📦 Building frontend..."
cd client
npm install
npm run build
cd ..

echo "✅ Frontend build completed!"
echo ""
echo "🎯 Next steps:"
echo "1. Deploy frontend to Netlify:"
echo "   - Go to netlify.com"
echo "   - Drag and drop the 'client/dist' folder"
echo "   - Or connect your GitHub repository"
echo ""
echo "2. Deploy backend to Render:"
echo "   - Go to render.com"
echo "   - Create a new Web Service"
echo "   - Connect your GitHub repository"
echo "   - Set root directory to 'server'"
echo "   - Add environment variables:"
echo "     - NODE_ENV=production"
echo "     - MONGODB_URI=your_mongodb_connection_string"
echo "     - CLIENT_URL=your_frontend_url"
echo ""
echo "3. Update frontend environment:"
echo "   - Set VITE_API_URL to your backend URL"
echo ""
echo "📖 See DEPLOYMENT.md for detailed instructions" 