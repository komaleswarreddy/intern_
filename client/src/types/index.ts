// Question Types
export type QuestionType = 'categorize' | 'cloze' | 'comprehension'

// Base Question Interface
export interface BaseQuestion {
  _id?: string
  type: QuestionType
}

// Categorize Question
export interface CategorizeQuestion extends BaseQuestion {
  type: 'categorize'
  questionText: string
  description?: string
  categories: string[]
  items: Array<{
    label: string
    correctCategory: string
  }>
}

// Cloze Question - Updated for drag-and-drop
export interface ClozeQuestion extends BaseQuestion {
  type: 'cloze'
  questionText: string
  sentence: string
  blanks: Array<{
    word: string
    position: number
    options: string[]
  }>
}

// Comprehension Question - Updated for MCQ
export interface ComprehensionQuestion extends BaseQuestion {
  type: 'comprehension'
  passage: string
  subQuestions: Array<{
    questionText: string
    options: string[]
    correctAnswer: string
  }>
}

// Union type for all question types
export type Question = CategorizeQuestion | ClozeQuestion | ComprehensionQuestion

// Form Interface
export interface Form {
  _id?: string
  title: string
  description?: string
  questions: Question[]
  createdBy?: string
  createdAt?: Date
  updatedAt?: Date
}

// Response Interfaces
export interface Answer {
  questionId: string
  questionType: QuestionType
  answer: string | Record<string, string> | string[]
}

export interface FormResponse {
  _id?: string
  formId: string
  answers: Answer[]
  submittedAt?: Date
  createdAt?: Date
  updatedAt?: Date
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  details?: any[]
}

// Form Builder State
export interface FormBuilderState {
  form: Form
  currentQuestionIndex: number
  isSaving: boolean
  isDirty: boolean
}

// Form Editor Mode
export interface FormEditorMode {
  mode: 'editor' | 'preview' | 'fill'
  currentQuestion?: Question
}

// Question Editor Props
export interface QuestionEditorProps {
  question: Question
  onUpdate: (question: Question) => void
  onDelete: () => void
  onDuplicate: () => void
}

// Form Fill Mode
export interface FormFillMode {
  form: Form
  responses: Record<string, any>
  onResponseChange: (questionId: string, answer: any) => void
  onSubmit: () => void
} 