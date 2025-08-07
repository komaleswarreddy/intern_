import express from 'express'
import Form from '../models/Form.js'
import { body, validationResult } from 'express-validator'

const router = express.Router()

// Validation middleware
const validateForm = [
  body('title').trim().isLength({ min: 1 }).withMessage('Title is required'),
  body('description').optional().trim(),
  body('headerImage').optional().custom((value) => {
    // Allow empty string, null, undefined, or valid URL
    if (value === '' || value === null || value === undefined) {
      return true
    }
    // If it's a string, check if it's a valid URL or local path
    if (typeof value === 'string') {
      // Allow local file paths (starting with http://localhost or file://)
      if (value.startsWith('http://localhost') || value.startsWith('file://')) {
        return true
      }
      // Check if it's a valid URL
      try {
        new URL(value)
        return true
      } catch {
        return true // Allow other string values
      }
    }
    return true
  }).withMessage('Header image must be a valid URL or file path'),
  body('questions').isArray().withMessage('Questions must be an array'),
  body('questions.*.type').isIn(['categorize', 'cloze', 'comprehension']).withMessage('Invalid question type'),
  body('questions.*.text').notEmpty().withMessage('Question text is required'),
  body('questions.*.image').optional().custom((value) => {
    // Allow empty string, null, undefined, or valid URL
    if (value === '' || value === null || value === undefined) {
      return true
    }
    // If it's a string, check if it's a valid URL or local path
    if (typeof value === 'string') {
      // Allow local file paths (starting with http://localhost or file://)
      if (value.startsWith('http://localhost') || value.startsWith('file://')) {
        return true
      }
      // Check if it's a valid URL
      try {
        new URL(value)
        return true
      } catch {
        return true // Allow other string values
      }
    }
    return true
  }).withMessage('Question image must be a valid URL or file path'),
  body('isPublic').optional().isBoolean().withMessage('isPublic must be a boolean'),
  body('responseLimit').optional().isInt({ min: 0 }).withMessage('Response limit must be a positive integer'),
  body('deadline').optional().isISO8601().withMessage('Deadline must be a valid date')
]

// GET /api/forms - Get all forms (for dashboard)
router.get('/', async (req, res) => {
  try {
    const forms = await Form.find({})
      .select('title description questions createdAt updatedAt')
      .sort({ createdAt: -1 })
    
    res.json({
      success: true,
      data: forms
    })
  } catch (error) {
    console.error('Error fetching forms:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch forms'
    })
  }
})

// POST /api/forms - Create a new form
router.post('/', validateForm, async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      })
    }

    const formData = {
      title: req.body.title,
      description: req.body.description || '',
      headerImage: req.body.headerImage || '',
      questions: req.body.questions || [],
      isPublic: req.body.isPublic !== undefined ? req.body.isPublic : true,
      responseLimit: req.body.responseLimit,
      deadline: req.body.deadline
    }

    const form = new Form(formData)
    const savedForm = await form.save()

    res.status(201).json({
      success: true,
      data: savedForm,
      message: 'Form created successfully'
    })
  } catch (error) {
    console.error('Error creating form:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to create form'
    })
  }
})

// GET /api/forms/:id - Get a specific form
router.get('/:id', async (req, res) => {
  try {
    const form = await Form.findById(req.params.id)
    
    if (!form) {
      return res.status(404).json({
        success: false,
        error: 'Form not found'
      })
    }

    res.json({
      success: true,
      data: form
    })
  } catch (error) {
    console.error('Error fetching form:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch form'
    })
  }
})

// PUT /api/forms/:id - Update a form
router.put('/:id', validateForm, async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      })
    }

    const form = await Form.findById(req.params.id)
    
    if (!form) {
      return res.status(404).json({
        success: false,
        error: 'Form not found'
      })
    }

    const updateData = {
      title: req.body.title,
      description: req.body.description || '',
      headerImage: req.body.headerImage || '',
      questions: req.body.questions || [],
      isPublic: req.body.isPublic !== undefined ? req.body.isPublic : true,
      responseLimit: req.body.responseLimit,
      deadline: req.body.deadline
    }

    const updatedForm = await Form.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    )

    res.json({
      success: true,
      data: updatedForm,
      message: 'Form updated successfully'
    })
  } catch (error) {
    console.error('Error updating form:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to update form'
    })
  }
})

// DELETE /api/forms/:id - Delete a form
router.delete('/:id', async (req, res) => {
  try {
    const form = await Form.findById(req.params.id)
    
    if (!form) {
      return res.status(404).json({
        success: false,
        error: 'Form not found'
      })
    }

    await Form.findByIdAndDelete(req.params.id)

    res.json({
      success: true,
      message: 'Form deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting form:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to delete form'
    })
  }
})

export default router 