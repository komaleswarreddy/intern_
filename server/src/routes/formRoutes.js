import express from 'express'
import Form from '../models/Form.js'
import { body, validationResult } from 'express-validator'

const router = express.Router()

// Validation middleware for forms
const validateForm = [
  body('title').optional().trim(),
  body('description').optional().trim(),
  body('questions').isArray().withMessage('Questions must be an array'),
  body('questions.*.type').isIn(['categorize', 'cloze', 'comprehension']).withMessage('Invalid question type'),
  
  // Categorize question validation
  body('questions.*.questionText').custom((value, { req, path }) => {
    const questionIndex = path.split('.')[1]
    const questionType = req.body.questions?.[questionIndex]?.type
    if (questionType === 'categorize' && !value) {
      throw new Error('Question text is required for categorize questions')
    }
    return true
  }),
  body('questions.*.categories').custom((value, { req, path }) => {
    const questionIndex = path.split('.')[1]
    const questionType = req.body.questions?.[questionIndex]?.type
    if (questionType === 'categorize' && (!Array.isArray(value) || value.length === 0)) {
      throw new Error('Categories are required for categorize questions')
    }
    return true
  }),
  body('questions.*.items').custom((value, { req, path }) => {
    const questionIndex = path.split('.')[1]
    const questionType = req.body.questions?.[questionIndex]?.type
    if (questionType === 'categorize' && (!Array.isArray(value) || value.length === 0)) {
      throw new Error('Items are required for categorize questions')
    }
    return true
  }),
  body('questions.*.items.*.label').custom((value, { req, path }) => {
    const questionIndex = path.split('.')[1]
    const questionType = req.body.questions?.[questionIndex]?.type
    if (questionType === 'categorize' && !value) {
      throw new Error('Item label is required')
    }
    return true
  }),
  body('questions.*.items.*.correctCategory').custom((value, { req, path }) => {
    const questionIndex = path.split('.')[1]
    const questionType = req.body.questions?.[questionIndex]?.type
    if (questionType === 'categorize' && !value) {
      throw new Error('Correct category is required')
    }
    return true
  }),
  
  // Cloze question validation - Updated for drag-and-drop
  body('questions.*.questionText').custom((value, { req, path }) => {
    const questionIndex = path.split('.')[1]
    const questionType = req.body.questions?.[questionIndex]?.type
    if (questionType === 'cloze' && !value) {
      throw new Error('Question text is required for cloze questions')
    }
    return true
  }),
  body('questions.*.sentence').custom((value, { req, path }) => {
    const questionIndex = path.split('.')[1]
    const questionType = req.body.questions?.[questionIndex]?.type
    if (questionType === 'cloze' && !value) {
      throw new Error('Sentence is required for cloze questions')
    }
    return true
  }),
  body('questions.*.blanks').custom((value, { req, path }) => {
    const questionIndex = path.split('.')[1]
    const questionType = req.body.questions?.[questionIndex]?.type
    if (questionType === 'cloze' && (!Array.isArray(value) || value.length === 0)) {
      throw new Error('Blanks are required for cloze questions')
    }
    return true
  }),
  body('questions.*.blanks.*.word').custom((value, { req, path }) => {
    const questionIndex = path.split('.')[1]
    const questionType = req.body.questions?.[questionIndex]?.type
    if (questionType === 'cloze' && !value) {
      throw new Error('Blank word is required')
    }
    return true
  }),
  body('questions.*.blanks.*.position').custom((value, { req, path }) => {
    const questionIndex = path.split('.')[1]
    const questionType = req.body.questions?.[questionIndex]?.type
    if (questionType === 'cloze' && (typeof value !== 'number' || value < 0)) {
      throw new Error('Blank position must be a non-negative integer')
    }
    return true
  }),
  body('questions.*.blanks.*.options').custom((value, { req, path }) => {
    const questionIndex = path.split('.')[1]
    const questionType = req.body.questions?.[questionIndex]?.type
    if (questionType === 'cloze' && (!Array.isArray(value) || value.length === 0)) {
      throw new Error('Options are required for cloze blanks')
    }
    return true
  }),
  
  // Comprehension question validation - Updated for MCQ
  body('questions.*.passage').custom((value, { req, path }) => {
    const questionIndex = path.split('.')[1]
    const questionType = req.body.questions?.[questionIndex]?.type
    if (questionType === 'comprehension' && !value) {
      throw new Error('Passage is required for comprehension questions')
    }
    return true
  }),
  body('questions.*.subQuestions').custom((value, { req, path }) => {
    const questionIndex = path.split('.')[1]
    const questionType = req.body.questions?.[questionIndex]?.type
    if (questionType === 'comprehension' && (!Array.isArray(value) || value.length === 0)) {
      throw new Error('Sub-questions are required for comprehension questions')
    }
    return true
  }),
  body('questions.*.subQuestions.*.questionText').custom((value, { req, path }) => {
    const questionIndex = path.split('.')[1]
    const questionType = req.body.questions?.[questionIndex]?.type
    if (questionType === 'comprehension' && !value) {
      throw new Error('Sub-question text is required')
    }
    return true
  }),
  body('questions.*.subQuestions.*.options').custom((value, { req, path }) => {
    const questionIndex = path.split('.')[1]
    const questionType = req.body.questions?.[questionIndex]?.type
    if (questionType === 'comprehension' && (!Array.isArray(value) || value.length === 0)) {
      throw new Error('Options are required for comprehension sub-questions')
    }
    return true
  }),
  body('questions.*.subQuestions.*.correctAnswer').custom((value, { req, path }) => {
    const questionIndex = path.split('.')[1]
    const questionType = req.body.questions?.[questionIndex]?.type
    if (questionType === 'comprehension' && !value) {
      throw new Error('Correct answer is required for comprehension sub-questions')
    }
    return true
  })
]

// POST /forms - Create a new form
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
      title: req.body.title || 'Untitled Quiz',
      description: req.body.description || '',
      questions: req.body.questions || [],
      createdBy: req.body.createdBy || 'anonymous'
    }

    const form = new Form(formData)
    await form.save()

    res.status(201).json({
      success: true,
      data: form
    })
  } catch (error) {
    console.error('Error creating form:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to create form'
    })
  }
})

// GET /forms/:id - Fetch form structure
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

// PUT /forms/:id - Update form
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
      title: req.body.title || form.title,
      description: req.body.description !== undefined ? req.body.description : form.description,
      questions: req.body.questions || form.questions
    }

    const updatedForm = await Form.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    )

    res.json({
      success: true,
      data: updatedForm
    })
  } catch (error) {
    console.error('Error updating form:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to update form'
    })
  }
})

// GET /forms - Get all forms (for dashboard)
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

export default router 