import mongoose from 'mongoose'

const answerSchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  questionType: {
    type: String,
    enum: ['categorize', 'cloze', 'comprehension'],
    required: true
  },
  answer: {
    type: mongoose.Schema.Types.Mixed, // Can be string, object, or array
    required: true
  }
}, {
  timestamps: true
})

const responseSchema = new mongoose.Schema({
  formId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Form',
    required: true
  },
  answers: [answerSchema],
  submittedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
})

// Index for better query performance
responseSchema.index({ formId: 1, submittedAt: -1 })
responseSchema.index({ submittedAt: -1 })

const Response = mongoose.model('Response', responseSchema)

export default Response 