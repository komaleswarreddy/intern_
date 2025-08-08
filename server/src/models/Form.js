import mongoose from 'mongoose'

// Categorize question schema
const categorizeSchema = new mongoose.Schema({
  type: {
    type: String,
    default: 'categorize'
  },
  questionText: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  categories: [{
    type: String,
    required: true
  }],
  items: [{
    label: {
      type: String,
      required: true
    },
    correctCategory: {
      type: String,
      required: true
    }
  }]
}, { _id: true })

// Cloze question schema - Updated for drag-and-drop
const clozeSchema = new mongoose.Schema({
  type: {
    type: String,
    default: 'cloze'
  },
  questionText: {
    type: String,
    required: true,
    trim: true
  },
  sentence: {
    type: String,
    required: true,
    trim: true
  },
  blanks: [{
    word: {
      type: String,
      required: true
    },
    position: {
      type: Number,
      required: true
    },
    options: [{
      type: String,
      required: true
    }]
  }]
}, { _id: true })

// Comprehension question schema - Updated for MCQ
const comprehensionSchema = new mongoose.Schema({
  type: {
    type: String,
    default: 'comprehension'
  },
  passage: {
    type: String,
    required: true,
    trim: true
  },
  subQuestions: [{
    questionText: {
      type: String,
      required: true
    },
    options: [{
      type: String,
      required: true
    }],
    correctAnswer: {
      type: String,
      required: true
    }
  }]
}, { _id: true })

// Main question schema that can be any of the three types
const questionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['categorize', 'cloze', 'comprehension'],
    required: true
  },
  // For categorize questions
  questionText: String,
  description: String,
  categories: [String],
  items: [{
    label: String,
    correctCategory: String
  }],
  // For cloze questions
  sentence: String,
  blanks: [{
    word: String,
    position: Number,
    options: [String]
  }],
  // For comprehension questions
  passage: String,
  subQuestions: [{
    questionText: String,
    options: [String],
    correctAnswer: String
  }]
}, {
  timestamps: true,
  _id: true
})

const formSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    default: 'Untitled Quiz'
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  questions: {
    type: [questionSchema],
    default: []
  },
  createdBy: {
    type: String,
    default: 'anonymous'
  }
}, {
  timestamps: true
})

// Index for better query performance
formSchema.index({ createdAt: -1 })
formSchema.index({ createdBy: 1 })

const Form = mongoose.model('Form', formSchema)

export default Form 