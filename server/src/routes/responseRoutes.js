import express from 'express'
import Response from '../models/Response.js'
import Form from '../models/Form.js'
import { body, validationResult } from 'express-validator'

const router = express.Router()

// Validation middleware
const validateResponse = [
  body('answers').isArray().withMessage('Answers must be an array'),
  body('answers.*.questionId').notEmpty().withMessage('Question ID is required'),
  body('answers.*.answer').notEmpty().withMessage('Answer is required')
]

// POST /api/forms/:id/responses - Submit a form response
router.post('/forms/:formId/responses', validateResponse, async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      })
    }

    const { formId } = req.params
    const { answers } = req.body

    // Check if form exists
    const form = await Form.findById(formId)
    if (!form) {
      return res.status(404).json({
        success: false,
        error: 'Form not found'
      })
    }

    // Check if form is public
    if (!form.isPublic) {
      return res.status(403).json({
        success: false,
        error: 'Form is not public'
      })
    }

    // Check response limit if set
    if (form.responseLimit) {
      const responseCount = await Response.countDocuments({ formId })
      if (responseCount >= form.responseLimit) {
        return res.status(429).json({
          success: false,
          error: 'Form response limit reached'
        })
      }
    }

    // Check deadline if set
    if (form.deadline && new Date() > new Date(form.deadline)) {
      return res.status(400).json({
        success: false,
        error: 'Form deadline has passed'
      })
    }

    // Map question IDs to actual MongoDB ObjectIds if they're string indices
    const mappedAnswers = answers.map(answer => {
      let questionId = answer.questionId
      
      // If questionId is a string number (index), convert it to actual question ID
      if (typeof questionId === 'string' && !isNaN(questionId)) {
        const index = parseInt(questionId)
        if (form.questions[index]) {
          questionId = form.questions[index]._id
        }
      }
      
      return {
        questionId,
        answer: answer.answer
      }
    })

    const response = new Response({
      formId,
      answers: mappedAnswers,
      submittedAt: new Date()
    })

    const savedResponse = await response.save()

    res.status(201).json({
      success: true,
      data: savedResponse,
      message: 'Response submitted successfully'
    })
  } catch (error) {
    console.error('Error submitting response:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to submit response'
    })
  }
})

// GET /api/forms/:id/responses - Get all responses for a form
router.get('/forms/:formId/responses', async (req, res) => {
  try {
    const { formId } = req.params

    // Check if form exists
    const form = await Form.findById(formId)
    if (!form) {
      return res.status(404).json({
        success: false,
        error: 'Form not found'
      })
    }

    const responses = await Response.find({ formId })
      .sort({ submittedAt: -1 })

    res.json({
      success: true,
      data: responses
    })
  } catch (error) {
    console.error('Error fetching responses:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch responses'
    })
  }
})

// GET /api/responses/:id - Get a specific response
router.get('/:id', async (req, res) => {
  try {
    const response = await Response.findById(req.params.id)
      .populate('formId', 'title description')

    if (!response) {
      return res.status(404).json({
        success: false,
        error: 'Response not found'
      })
    }

    res.json({
      success: true,
      data: response
    })
  } catch (error) {
    console.error('Error fetching response:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch response'
    })
  }
})

export default router 