# Deployment Guide - Custom Form Builder on Render

This guide provides detailed step-by-step instructions for deploying your Custom Form Builder application to Render.

## 🚀 Prerequisites

1. **GitHub Repository**: Your code should be pushed to GitHub
2. **Render Account**: Sign up at [render.com](https://render.com)
3. **MongoDB Atlas**: Free cluster for database

## 📋 Step-by-Step Deployment

### Step 1: Prepare Your Repository

1. **Ensure your repository is up to date**
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

2. **Verify your project structure**
   ```
   your-repo/
   ├── client/          # React frontend
   ├── server/          # Node.js backend
   ├── .gitignore
   └── README.md
   ```

### Step 2: Deploy Backend to Render

#### 2.1 Create Backend Service

1. **Go to Render Dashboard**
   - Visit [render.com](https://render.com)
   - Sign in to your account
   - Click "New +" button
   - Select "Web Service"

2. **Connect Repository**
   - Click "Connect a repository"
   - Select your GitHub repository
   - Authorize Render to access your repositories

3. **Configure Backend Service**
   - **Name**: `custom-form-builder-backend`
   - **Environment**: `Node`
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

4. **Add Environment Variables**
   Click "Environment" tab and add:
   ```
   NODE_ENV=production
   PORT=10000
   MONGODB_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/your_database?retryWrites=true&w=majority
   CLIENT_URL=https://your-frontend-service.onrender.com
   ```

5. **Deploy Backend**
   - Click "Create Web Service"
   - Wait for deployment to complete (2-3 minutes)
   - Note your backend URL: `https://your-backend-service.onrender.com`

#### 2.2 Verify Backend Deployment

1. **Test Health Endpoint**
   ```bash
   curl https://your-backend-service.onrender.com/health
   ```
   Should return: `{"status":"OK","message":"Custom Form Builder API is running"}`

2. **Test API Endpoint**
   ```bash
   curl https://your-backend-service.onrender.com/api/forms
   ```
   Should return: `{"success":true,"data":[]}`

### Step 3: Deploy Frontend to Render

#### 3.1 Create Frontend Service

1. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect the same repository

2. **Configure Frontend Service**
   - **Name**: `custom-form-builder-frontend`
   - **Environment**: `Node`
   - **Region**: Same as backend
   - **Branch**: `main`
   - **Root Directory**: `client`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run preview` (or use static site hosting)

3. **Add Environment Variables**
   ```
   VITE_API_URL=https://your-backend-service.onrender.com/api
   ```

4. **Deploy Frontend**
   - Click "Create Web Service"
   - Wait for deployment

#### 3.2 Alternative: Use Static Site Hosting

For better performance, use Render's Static Site hosting:

1. **Create Static Site**
   - Click "New +" → "Static Site"
   - Connect your repository

2. **Configure Static Site**
   - **Name**: `custom-form-builder-frontend`
   - **Root Directory**: `client`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

3. **Add Environment Variables**
   ```
   VITE_API_URL=https://your-backend-service.onrender.com/api
   ```

### Step 4: Update Backend CORS Settings

1. **Go to Backend Service**
   - Navigate to your backend service in Render dashboard
   - Go to "Environment" tab

2. **Update CLIENT_URL**
   ```
   CLIENT_URL=https://your-frontend-service.onrender.com
   ```

3. **Redeploy Backend**
   - Click "Manual Deploy" → "Deploy latest commit"

### Step 5: Test Your Application

1. **Test Frontend**
   - Visit your frontend URL
   - Try creating a form
   - Test form submission

2. **Test Backend API**
   ```bash
   # Test forms endpoint
   curl https://your-backend-service.onrender.com/api/forms
   
   # Test health endpoint
   curl https://your-backend-service.onrender.com/health
   ```

## 🔧 Environment Variables Reference

### Backend Environment Variables
```bash
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
CLIENT_URL=https://your-frontend-service.onrender.com
```

### Frontend Environment Variables
```bash
VITE_API_URL=https://your-backend-service.onrender.com/api
```

## 🗄️ MongoDB Atlas Setup

1. **Create MongoDB Atlas Account**
   - Go to [mongodb.com](https://mongodb.com)
   - Sign up for free account

2. **Create Cluster**
   - Click "Build a Database"
   - Choose "FREE" tier
   - Select cloud provider and region
   - Click "Create"

3. **Configure Database Access**
   - Go to "Database Access"
   - Click "Add New Database User"
   - Create username and password
   - Select "Read and write to any database"
   - Click "Add User"

4. **Configure Network Access**
   - Go to "Network Access"
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
   - Click "Confirm"

5. **Get Connection String**
   - Go to "Database"
   - Click "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your actual password

## 🚀 Quick Deployment Commands

### 1. Push to GitHub
```bash
git add .
git commit -m "Deploy to Render"
git push origin main
```

### 2. Deploy Backend
- Go to Render → New Web Service
- Connect repository
- Set root directory: `server`
- Add environment variables
- Deploy

### 3. Deploy Frontend
- Go to Render → New Static Site
- Connect same repository
- Set root directory: `client`
- Set publish directory: `dist`
- Add environment variables
- Deploy

## 📊 Monitoring and Logs

### View Logs
1. **Backend Logs**
   - Go to backend service in Render dashboard
   - Click "Logs" tab
   - View real-time logs

2. **Frontend Logs**
   - Go to frontend service in Render dashboard
   - Click "Logs" tab
   - View build and deployment logs

### Health Checks
- Backend health: `https://your-backend.onrender.com/health`
- Frontend: Visit your frontend URL

## 🔄 Continuous Deployment

Render automatically deploys when you push to your main branch:
1. Push code to GitHub
2. Render detects changes
3. Automatically rebuilds and deploys
4. No manual intervention needed

## 🆘 Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies are in package.json
   - Check build logs in Render dashboard

2. **CORS Errors**
   - Verify CLIENT_URL in backend environment variables
   - Ensure frontend URL is correct
   - Check browser console for CORS errors

3. **Database Connection Issues**
   - Verify MongoDB connection string
   - Check network access in MongoDB Atlas
   - Ensure database user has correct permissions

4. **Environment Variables Not Working**
   - Verify variable names are correct
   - Check for typos in values
   - Redeploy after changing environment variables

### Debug Commands
```bash
# Test backend locally
cd server
npm start

# Test frontend locally
cd client
npm run dev

# Check API endpoints
curl http://localhost:5000/health
curl http://localhost:5000/api/forms
```

## 📞 Support

If you encounter issues:
1. Check Render deployment logs
2. Verify environment variables
3. Test locally first
4. Check MongoDB Atlas connection
5. Review Render documentation at [render.com/docs](https://render.com/docs)

## 🎉 Success Checklist

- [ ] Backend deployed and accessible
- [ ] Frontend deployed and accessible
- [ ] Database connected and working
- [ ] Forms can be created
- [ ] Forms can be submitted
- [ ] CORS issues resolved
- [ ] Environment variables configured
- [ ] Health endpoints responding
- [ ] Application fully functional 