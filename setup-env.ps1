# Setup Environment Variables for Custom Form Builder
Write-Host "🚀 Setting up environment variables for Custom Form Builder..." -ForegroundColor Green

# Create server .env file
$serverEnvContent = @"
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration - Using local MongoDB for development
MONGODB_URI=mongodb://localhost:27017/custom-form-builder

# Cloudinary Configuration (placeholder values - you'll need to replace these)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Client URL (for CORS)
CLIENT_URL=http://localhost:3000

# Security
JWT_SECRET=your_jwt_secret_key_here_development_only
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
"@

# Create client .env file
$clientEnvContent = @"
# Backend API URL
VITE_API_URL=http://localhost:5000/api

# Cloudinary Configuration (if needed on frontend)
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
"@

# Write server .env file
$serverEnvPath = "server\.env"
$serverEnvContent | Out-File -FilePath $serverEnvPath -Encoding UTF8
Write-Host "✅ Created server .env file at: $serverEnvPath" -ForegroundColor Green

# Write client .env file
$clientEnvPath = "client\.env"
$clientEnvContent | Out-File -FilePath $clientEnvPath -Encoding UTF8
Write-Host "✅ Created client .env file at: $clientEnvPath" -ForegroundColor Green

Write-Host "`n📝 Next steps:" -ForegroundColor Yellow
Write-Host "1. Install MongoDB locally or use MongoDB Atlas" -ForegroundColor White
Write-Host "2. Update the MONGODB_URI in server\.env if using Atlas" -ForegroundColor White
Write-Host "3. Set up Cloudinary account and update credentials" -ForegroundColor White
Write-Host "4. Run 'npm run dev' in both server and client directories" -ForegroundColor White

Write-Host "`n🔧 For local MongoDB with Docker:" -ForegroundColor Cyan
Write-Host "docker run -d -p 27017:27017 --name mongodb mongo:latest" -ForegroundColor White

Write-Host "`n🎉 Environment setup complete!" -ForegroundColor Green 