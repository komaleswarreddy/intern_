# Deployment Guide - Custom Form Builder

This guide will help you deploy your Custom Form Builder application to production.

## 🚀 Frontend Deployment (Netlify)

### Step 1: Prepare Frontend for Production

1. **Create Environment Variables**
   Create a `.env.production` file in the `client/` directory:
   ```bash
   # client/.env.production
   VITE_API_URL=https://your-backend-domain.com/api
   ```

2. **Build the Frontend**
   ```bash
   cd client
   npm run build
   ```

### Step 2: Deploy to Netlify

#### Option A: Deploy via Netlify UI
1. Go to [netlify.com](https://netlify.com) and sign up/login
2. Click "New site from Git"
3. Connect your GitHub account
4. Select your repository
5. Configure build settings:
   - **Build command**: `cd client && npm install && npm run build`
   - **Publish directory**: `client/dist`
6. Add environment variables in Netlify dashboard:
   - `VITE_API_URL`: Your backend URL (e.g., `https://your-backend.herokuapp.com/api`)

#### Option B: Deploy via Netlify CLI
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy
cd client
netlify deploy --prod --dir=dist
```

## 🔧 Backend Deployment Options

### Option 1: Render (Recommended - Free Tier)

1. **Sign up at [render.com](https://render.com)**
2. **Create a new Web Service**
3. **Connect your GitHub repository**
4. **Configure the service:**
   - **Name**: `custom-form-builder-backend`
   - **Environment**: `Node`
   - **Build Command**: `cd server && npm install`
   - **Start Command**: `cd server && npm start`
   - **Root Directory**: `server`

5. **Add Environment Variables:**
   ```
   NODE_ENV=production
   PORT=10000
   MONGODB_URI=your_mongodb_connection_string
   CLIENT_URL=https://your-frontend-domain.netlify.app
   ```

### Option 2: Railway

1. **Sign up at [railway.app](https://railway.app)**
2. **Create a new project**
3. **Deploy from GitHub**
4. **Set environment variables**
5. **Deploy**

### Option 3: Heroku

1. **Install Heroku CLI**
2. **Create Heroku app**
3. **Add MongoDB addon**
4. **Deploy**

## 🔗 Connect Frontend to Backend

After deploying your backend, update your frontend environment variable:

1. **Get your backend URL** (e.g., `https://your-app.onrender.com`)
2. **Update Netlify environment variable:**
   - Go to Netlify Dashboard → Site Settings → Environment Variables
   - Add: `VITE_API_URL` = `https://your-app.onrender.com/api`

## 📝 Environment Variables Checklist

### Frontend (Netlify)
- `VITE_API_URL`: Your backend API URL

### Backend (Render/Railway/Heroku)
- `NODE_ENV`: `production`
- `PORT`: `10000` (or let the platform set it)
- `MONGODB_URI`: Your MongoDB connection string
- `CLIENT_URL`: Your frontend URL (for CORS)

## 🗄️ Database Setup

### MongoDB Atlas (Recommended)
1. Create a free cluster at [mongodb.com](https://mongodb.com)
2. Get your connection string
3. Add it to your backend environment variables

## 🔒 Security Considerations

1. **CORS Configuration**: Update your backend CORS settings
2. **Environment Variables**: Never commit sensitive data
3. **Rate Limiting**: Already configured in your backend
4. **Helmet**: Security headers already configured

## 🚀 Quick Deployment Commands

### Frontend (Netlify)
```bash
cd client
npm run build
netlify deploy --prod --dir=dist
```

### Backend (Render)
1. Push to GitHub
2. Connect repository to Render
3. Set environment variables
4. Deploy

## 📊 Monitoring

- **Frontend**: Netlify provides analytics and monitoring
- **Backend**: Render/Railway provide logs and monitoring
- **Database**: MongoDB Atlas provides monitoring

## 🔄 Continuous Deployment

Both Netlify and Render support automatic deployments:
- Push to `main` branch → Automatic deployment
- Preview deployments for pull requests

## 🆘 Troubleshooting

### Common Issues:
1. **CORS Errors**: Check `CLIENT_URL` in backend environment
2. **Build Failures**: Check Node.js version compatibility
3. **Database Connection**: Verify MongoDB connection string
4. **Environment Variables**: Ensure all required variables are set

### Debug Commands:
```bash
# Check frontend build
cd client && npm run build

# Check backend locally
cd server && npm start

# Test API endpoints
curl https://your-backend-url.com/api/health
```

## 📞 Support

If you encounter issues:
1. Check the logs in your deployment platform
2. Verify environment variables
3. Test locally first
4. Check the platform's documentation 