// Question Types
export type QuestionType = 'categorize' | 'cloze' | 'comprehension'

// Base Question Interface
export interface BaseQuestion {
  _id?: string
  type: QuestionType
  text: string
  image?: string
}

// Categorize Question
export interface CategorizeQuestion extends BaseQuestion {
  type: 'categorize'
  categories: string[]
  items: string[]
  answerKey: Record<string, string> // item -> category mapping
}

// Cloze Question
export interface ClozeQuestion extends BaseQuestion {
  type: 'cloze'
  text: string // Contains ___ placeholders
  blanks: string[] // Array of correct answers
}

// Comprehension Question
export interface ComprehensionQuestion extends BaseQuestion {
  type: 'comprehension'
  passage: string
  subQuestions: Array<{
    _id?: string
    text: string
    type: 'multiple-choice' | 'fill-in-the-blank'
    options?: string[] // For multiple choice
    correctAnswer?: string | string[] // For fill-in-the-blank
  }>
}

// Union type for all question types
export type Question = CategorizeQuestion | ClozeQuestion | ComprehensionQuestion

// Form Interface
export interface Form {
  _id?: string
  title: string
  description?: string
  headerImage?: string
  questions: Question[]
  isPublic: boolean
  responseLimit?: number
  deadline?: Date
  createdAt?: Date
  updatedAt?: Date
}

// Response Interfaces
export interface Answer {
  questionId: string
  answer: string | Record<string, string> | string[]
}

export interface FormResponse {
  _id?: string
  formId: string
  answers: Answer[]
  submittedAt?: Date
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

// Form Builder State
export interface FormBuilderState {
  form: Form
  currentQuestionIndex: number
  isSaving: boolean
  isDirty: boolean
}

// Upload Response
export interface UploadResponse {
  url: string
  publicId: string
}

// Dashboard Stats
export interface FormStats {
  totalResponses: number
  averageCompletionTime: number
  responseRate: number
} 