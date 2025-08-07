import express from 'express'
import multer from 'multer'
import fs from 'fs'
import path from 'path'

const router = express.Router()

// Configure Cloudinary (only if credentials are available)
let cloudinary = null
if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
  try {
    const { v2 } = await import('cloudinary')
    cloudinary = v2
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
    })
    console.log('✅ Cloudinary configured successfully')
  } catch (error) {
    console.warn('⚠️ Cloudinary not available, using local storage only')
  }
} else {
  console.warn('⚠️ Cloudinary credentials not found, using local storage only')
}

// Configure multer for local storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads'
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
  }
})

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check file type
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new Error('Only image files are allowed'), false)
    }
  }
})

// Helper function to upload to Cloudinary or return local path
const uploadToCloudinary = async (filePath) => {
  try {
    if (cloudinary) {
      const result = await cloudinary.uploader.upload(filePath, {
        folder: 'form-builder',
        transformation: [
          { width: 1000, height: 1000, crop: 'limit' },
          { quality: 'auto' }
        ]
      })
      
      // Delete local file after upload
      fs.unlinkSync(filePath)
      
      return {
        url: result.secure_url,
        publicId: result.public_id
      }
    } else {
      // Return local file path for development
      return {
        url: `http://localhost:5000/uploads/${path.basename(filePath)}`,
        publicId: path.basename(filePath)
      }
    }
  } catch (error) {
    // Clean up local file if upload fails
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
    }
    throw error
  }
}

// POST /api/upload/image - Upload a single image
router.post('/image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No image file provided'
      })
    }

    const result = await uploadToCloudinary(req.file.path)

    res.json({
      success: true,
      data: result,
      message: 'Image uploaded successfully'
    })
  } catch (error) {
    console.error('Error uploading image:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to upload image'
    })
  }
})

// POST /api/upload/images - Upload multiple images
router.post('/images', upload.array('images', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No image files provided'
      })
    }

    const uploadPromises = req.files.map(file => uploadToCloudinary(file.path))
    const uploadedImages = await Promise.all(uploadPromises)

    res.json({
      success: true,
      data: uploadedImages,
      message: `${uploadedImages.length} images uploaded successfully`
    })
  } catch (error) {
    console.error('Error uploading images:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to upload images'
    })
  }
})

// DELETE /api/upload/:publicId - Delete an image
router.delete('/:publicId', async (req, res) => {
  try {
    const { publicId } = req.params

    if (cloudinary) {
      const result = await cloudinary.uploader.destroy(publicId)

      if (result.result === 'ok') {
        res.json({
          success: true,
          message: 'Image deleted successfully'
        })
      } else {
        res.status(400).json({
          success: false,
          error: 'Failed to delete image'
        })
      }
    } else {
      // For local files, just return success
      res.json({
        success: true,
        message: 'Image deleted successfully (local storage)'
      })
    }
  } catch (error) {
    console.error('Error deleting image:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to delete image'
    })
  }
})

// Error handling middleware for multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: 'File size too large. Maximum size is 5MB.'
      })
    }
  }
  
  if (error.message === 'Only image files are allowed') {
    return res.status(400).json({
      success: false,
      error: 'Only image files are allowed'
    })
  }

  next(error)
})

export default router 