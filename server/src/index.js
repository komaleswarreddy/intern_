import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import compression from 'compression'
import morgan from 'morgan'
import dotenv from 'dotenv'
import mongoose from 'mongoose'

import formRoutes from './routes/formRoutes.js'
import responseRoutes from './routes/responseRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://n210038:asdf@cluster0.ah6vp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'

// Security middleware
app.use(helmet())
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}))

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
})
app.use('/api/', limiter)

// Body parsing middleware
app.use(compression())
app.use(morgan('combined'))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Static files
app.use('/uploads', express.static('uploads'))

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Custom Form Builder API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  })
})

// API routes
app.use('/api/forms', formRoutes)
app.use('/api', responseRoutes)  // Mount response routes at /api to handle /api/forms/:formId/responses
app.use('/api/upload', uploadRoutes)

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.originalUrl 
  })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  })
})

// Database connection
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB Atlas')
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`)
      console.log(`📊 Health check: http://localhost:${PORT}/health`)
      console.log(`🌐 API Base URL: http://localhost:${PORT}/api`)
    })
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error.message)
    console.error('💡 Please check your MongoDB Atlas connection string')
    process.exit(1)
  })

export default app 