import express from 'express'
import Response from '../models/Response.js'
import Form from '../models/Form.js'
import { body, validationResult } from 'express-validator'
import mongoose from 'mongoose'

const router = express.Router()

// Validation middleware for responses
const validateResponse = [
  body('formId').custom((value) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      throw new Error('Valid form ID is required')
    }
    return true
  }),
  body('answers').isArray().withMessage('Answers must be an array'),
  body('answers.*.questionId').custom((value) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      throw new Error('Valid question ID is required')
    }
    return true
  }),
  body('answers.*.questionType').isIn(['categorize', 'cloze', 'comprehension']).withMessage('Invalid question type'),
  body('answers.*.answer').notEmpty().withMessage('Answer is required')
]

// POST /responses - Submit answers
router.post('/', validateResponse, async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      })
    }

    // Check if form exists
    const form = await Form.findById(req.body.formId)
    if (!form) {
      return res.status(404).json({
        success: false,
        error: 'Form not found'
      })
    }

    const responseData = {
      formId: req.body.formId,
      answers: req.body.answers.map(answer => ({
        questionId: answer.questionId,
        questionType: answer.questionType,
        answer: answer.answer
      }))
    }

    const response = new Response(responseData)
    await response.save()

    res.status(201).json({
      success: true,
      data: response
    })
  } catch (error) {
    console.error('Error submitting response:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to submit response'
    })
  }
})

// GET /responses/:formId - Retrieve responses for a specific form
router.get('/:formId', async (req, res) => {
  try {
    // Check if form exists
    const form = await Form.findById(req.params.formId)
    if (!form) {
      return res.status(404).json({
        success: false,
        error: 'Form not found'
      })
    }

    const responses = await Response.find({ formId: req.params.formId })
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

export default router 