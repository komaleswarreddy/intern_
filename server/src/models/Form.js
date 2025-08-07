import mongoose from 'mongoose'

const questionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['categorize', 'cloze', 'comprehension'],
    required: true
  },
  text: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String,
    default: ''
  },
  // For categorize questions
  categories: [{
    type: String,
    default: []
  }],
  items: [{
    type: String,
    default: []
  }],
  answerKey: {
    type: Map,
    of: String,
    default: new Map()
  },
  // For cloze questions
  blanks: [{
    type: String,
    default: []
  }],
  // For comprehension questions
  passage: {
    type: String,
    default: ''
  },
  subQuestions: [{
    text: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['multiple-choice', 'fill-in-the-blank'],
      required: true
    },
    options: [{
      type: String,
      default: []
    }],
    correctAnswer: {
      type: mongoose.Schema.Types.Mixed // Can be string or array
    }
  }]
}, {
  timestamps: true,
  _id: true // Let MongoDB auto-generate _id
})

const formSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  headerImage: {
    type: String,
    default: ''
  },
  questions: {
    type: [questionSchema],
    default: []
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  responseLimit: {
    type: Number,
    min: 0
  },
  deadline: {
    type: Date
  }
}, {
  timestamps: true
})

// Index for better query performance
formSchema.index({ createdAt: -1 })
formSchema.index({ isPublic: 1 })

const Form = mongoose.model('Form', formSchema)

export default Form 