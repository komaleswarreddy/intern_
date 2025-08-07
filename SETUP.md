# 🚀 Custom Form Builder - Setup Guide

This guide will help you set up the Custom Form Builder project locally and deploy it to production.

## 📋 Prerequisites

Before you begin, make sure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Git**
- **MongoDB Atlas** account (for database)
- **Cloudinary** account (for image uploads)

## 🛠 Local Development Setup

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone <your-repo-url>
cd custom-form-builder

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Environment Configuration

#### Server Environment (.env)

Create a `.env` file in the `server` directory:

```bash
cd server
cp env.example .env
```

Edit the `.env` file with your credentials:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/custom-form-builder

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Client URL (for CORS)
CLIENT_URL=http://localhost:3000

# Security
JWT_SECRET=your_jwt_secret_key_here
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

#### Client Environment (.env)

Create a `.env` file in the `client` directory:

```bash
cd client
cp env.example .env
```

Edit the `.env` file:

```env
# Backend API URL
VITE_API_URL=http://localhost:5000/api

# Cloudinary Configuration (if needed on frontend)
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

### 3. Database Setup

#### MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Create a new cluster (free tier is fine)
3. Create a database user with read/write permissions
4. Get your connection string
5. Add your IP address to the whitelist
6. Update the `MONGODB_URI` in your server `.env` file

### 4. Cloudinary Setup

1. Go to [Cloudinary](https://cloudinary.com/)
2. Create a free account
3. Get your Cloud Name, API Key, and API Secret
4. Update the Cloudinary credentials in your server `.env` file

### 5. Run the Application

#### Start the Server

```bash
cd server
npm run dev
```

The server will start on `http://localhost:5000`

#### Start the Client

```bash
cd client
npm run dev
```

The client will start on `http://localhost:3000`

## 🚀 Production Deployment

### Frontend Deployment (Vercel)

1. **Push your code to GitHub**

2. **Connect to Vercel**
   - Go to [Vercel](https://vercel.com/)
   - Import your GitHub repository
   - Set the root directory to `client`
   - Add environment variables:
     ```
     VITE_API_URL=https://your-backend-url.com/api
     ```

3. **Deploy**
   - Vercel will automatically build and deploy your frontend
   - Your app will be available at `https://your-app.vercel.app`

### Backend Deployment (Render)

1. **Push your code to GitHub**

2. **Connect to Render**
   - Go to [Render](https://render.com/)
   - Create a new Web Service
   - Connect your GitHub repository
   - Set the root directory to `server`

3. **Configure the service**
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: `Node`

4. **Add Environment Variables**
   ```
   MONGODB_URI=your_mongodb_atlas_connection_string
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   CLIENT_URL=https://your-frontend-url.com
   JWT_SECRET=your_jwt_secret
   NODE_ENV=production
   ```

5. **Deploy**
   - Render will automatically build and deploy your backend
   - Your API will be available at `https://your-app.onrender.com`

## 🔧 Development Workflow

### Project Structure

```
custom-form-builder/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/        # Page components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── utils/        # Utility functions
│   │   └── types/        # TypeScript types
│   └── public/
├── server/                # Node.js backend
│   ├── src/
│   │   ├── controllers/  # Route controllers
│   │   ├── models/       # MongoDB schemas
│   │   ├── routes/       # API routes
│   │   ├── middleware/   # Custom middleware
│   │   └── utils/        # Utility functions
│   └── uploads/          # Temporary file storage
└── README.md
```

### Available Scripts

#### Client (React)
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

#### Server (Node.js)
```bash
npm run dev          # Start development server with nodemon
npm start            # Start production server
```

### API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/forms` | Create new form |
| GET | `/api/forms/:id` | Get full form schema |
| POST | `/api/forms/:id/responses` | Submit a form response |
| GET | `/api/forms/:id/responses` | Get all responses of a form |
| POST | `/api/upload/image` | Upload header/question image |

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Check your connection string
   - Ensure your IP is whitelisted in MongoDB Atlas
   - Verify your database user credentials

2. **Cloudinary Upload Error**
   - Verify your Cloudinary credentials
   - Check file size limits (5MB max)
   - Ensure you're uploading image files only

3. **CORS Error**
   - Check your `CLIENT_URL` in server `.env`
   - Ensure the frontend URL matches exactly

4. **Build Errors**
   - Clear node_modules and reinstall: `rm -rf node_modules && npm install`
   - Check Node.js version compatibility
   - Verify all environment variables are set

### Development Tips

1. **Hot Reload**: Both client and server support hot reloading
2. **API Testing**: Use tools like Postman or Thunder Client to test API endpoints
3. **Database**: Use MongoDB Compass for database management
4. **Logs**: Check server console for detailed error messages

## 📚 Next Steps

1. **Add Authentication**: Implement JWT-based user authentication
2. **Add Analytics**: Implement response analytics and charts
3. **Add Themes**: Create multiple UI themes
4. **Add Templates**: Pre-built form templates
5. **Add Collaboration**: Multi-user form editing
6. **Add Notifications**: Email notifications for responses

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**Happy Building! 🎉** 