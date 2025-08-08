import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { CheckCircle, Send, ArrowLeft } from 'lucide-react'
import { Form, Question, CategorizeQuestion, ClozeQuestion, ComprehensionQuestion } from '@/types'
import { formApi, responseApi } from '@/utils/api'
import { toast } from 'react-hot-toast'

const FormPreview = () => {
  const { id } = useParams<{ id: string }>()
  const [form, setForm] = useState<Form | null>(null)
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  useEffect(() => {
    const fetchForm = async () => {
      if (!id) return
      
      try {
        const response = await formApi.getById(id)
        if (response.success && response.data) {
          setForm(response.data)
        }
      } catch (error) {
        toast.error('Failed to load form')
      }
    }

    fetchForm()
  }, [id])

  const handleAnswerChange = (questionId: string, answer: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }))
  }

  const handleSubmit = async () => {
    if (!form || !id) return

    setIsSubmitting(true)
    try {
      const answersArray = Object.entries(answers).map(([questionId, answer]) => ({
        questionId,
        questionType: form.questions.find(q => q._id === questionId)?.type || 'categorize',
        answer
      }))

      const response = await responseApi.submit(id, answersArray)
      if (response.success) {
        setIsSubmitted(true)
        toast.success('Form submitted successfully!')
      } else {
        toast.error(response.error || 'Failed to submit form')
      }
    } catch (error: any) {
      console.error('Submit error:', error)
      toast.error(error.response?.data?.error || 'Failed to submit form')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!form) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    )
  }

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Card className="text-center py-12">
          <CardContent>
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Thank You!</h2>
            <p className="text-gray-600">
              Your response has been submitted successfully.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Form Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            onClick={() => window.history.back()}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </Button>
        </div>
        <h1 className="text-3xl font-bold mb-2">{form.title}</h1>
        {form.description && (
          <p className="text-gray-600">{form.description}</p>
        )}
      </div>

      {/* Questions */}
      <div className="space-y-8">
        {form.questions.map((question, index) => (
          <Card key={question._id || index}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span className="text-lg">Question {index + 1}</span>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {question.type}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <QuestionRenderer
                question={question}
                value={answers[question._id || index]}
                onChange={(value) => handleAnswerChange(question._id || index.toString(), value)}
              />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Submit Button */}
      <div className="mt-8 flex justify-center">
        <Button
          size="lg"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="flex items-center space-x-2"
        >
          <Send className="w-4 h-4" />
          <span>{isSubmitting ? 'Submitting...' : 'Submit Form'}</span>
        </Button>
      </div>
    </div>
  )
}

// Question Renderer Component
const QuestionRenderer = ({ 
  question, 
  value, 
  onChange 
}: { 
  question: Question
  value: any
  onChange: (value: any) => void
}) => {
  switch (question.type) {
    case 'categorize':
      return <CategorizeRenderer question={question as CategorizeQuestion} value={value} onChange={onChange} />
    case 'cloze':
      return <ClozeRenderer question={question as ClozeQuestion} value={value} onChange={onChange} />
    case 'comprehension':
      return <ComprehensionRenderer question={question as ComprehensionQuestion} value={value} onChange={onChange} />
    default:
      return <div>Unsupported question type</div>
  }
}

// Categorize Question Renderer - Updated with drag-and-drop
const CategorizeRenderer = ({ 
  question, 
  value, 
  onChange 
}: { 
  question: CategorizeQuestion
  value: any
  onChange: (value: any) => void
}) => {
  const handleItemDrop = (itemIndex: number, category: string) => {
    const newValue = { ...value, [itemIndex]: category }
    onChange(newValue)
  }

  return (
    <div className="space-y-6">
      {question.description && (
        <p className="text-gray-600">{question.description}</p>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Categories */}
        <div>
          <h4 className="font-medium mb-4">Categories</h4>
          <div className="space-y-2">
            {question.categories.map((category) => (
              <div
                key={category}
                className="p-4 border-2 border-dashed border-gray-300 rounded-lg min-h-[60px] bg-gray-50 transition-colors hover:border-blue-400 hover:bg-blue-50"
                onDragOver={(e) => {
                  e.preventDefault()
                  e.currentTarget.classList.add('border-blue-400', 'bg-blue-50')
                }}
                onDragLeave={(e) => {
                  e.currentTarget.classList.remove('border-blue-400', 'bg-blue-50')
                }}
                onDrop={(e) => {
                  e.preventDefault()
                  e.currentTarget.classList.remove('border-blue-400', 'bg-blue-50')
                  
                  const itemId = e.dataTransfer.getData('text/plain')
                  if (itemId.startsWith('item-')) {
                    const itemIndex = parseInt(itemId.replace('item-', ''))
                    if (!isNaN(itemIndex)) {
                      handleItemDrop(itemIndex, category)
                    }
                  }
                }}
              >
                <h5 className="font-medium text-gray-900 mb-2">{category}</h5>
                <div className="space-y-1">
                  {question.items.map((item, itemIndex) => {
                    if (value?.[itemIndex] === category) {
                      return (
                        <div key={itemIndex} className="p-2 bg-blue-100 text-blue-800 rounded text-sm">
                          {item.label}
                        </div>
                      )
                    }
                    return null
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Items */}
        <div>
          <h4 className="font-medium mb-4">Items to Categorize</h4>
          <div className="space-y-2">
            {question.items.map((item, index) => (
              <div
                key={`item-${index}`}
                className={`p-3 border rounded-lg cursor-move transition-colors ${
                  value?.[index] 
                    ? 'bg-blue-100 border-blue-300' 
                    : 'bg-white border-gray-300 hover:bg-gray-50'
                }`}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('text/plain', `item-${index}`)
                  e.dataTransfer.effectAllowed = 'move'
                }}
              >
                {item.label}
                {value?.[index] && (
                  <span className="ml-2 text-sm text-blue-600">
                    → {value[index]}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Cloze Question Renderer - Drag and Drop Implementation
const ClozeRenderer = ({ 
  question, 
  value, 
  onChange 
}: { 
  question: ClozeQuestion
  value: any
  onChange: (value: any) => void
}) => {
  // Handle empty or invalid sentences
  if (!question.sentence || !question.sentence.trim()) {
    return (
      <div className="space-y-4">
        <p className="text-gray-500 italic">No sentence provided for this cloze question.</p>
      </div>
    )
  }

  const words = question.sentence.split(' ').filter(word => word.trim() !== '')
  
  // Get all unique options from all blanks
  const allOptions = question.blanks?.flatMap(blank => blank.options || []) || []
  const uniqueOptions = [...new Set(allOptions)].filter(option => option && option.trim() !== '')

  return (
    <div className="space-y-6">
      {/* Question Text */}
      {question.questionText && (
        <div className="mb-4">
          <h3 className="text-lg font-medium text-gray-900 mb-2">{question.questionText}</h3>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <div className="text-2xl">🎯</div>
          <div>
            <h4 className="font-semibold text-blue-900 mb-2">How to Complete This Question:</h4>
            <div className="text-blue-800 text-sm space-y-1">
              <p>• <strong>Drag</strong> options from the box below</p>
              <p>• <strong>Drop</strong> them into the blanks in the sentence</p>
              <p>• <strong>Double-click</strong> a filled blank to clear it</p>
              <p>• Watch the progress bar fill up as you complete blanks!</p>
            </div>
          </div>
        </div>
      </div>

      {/* Options to drag */}
      <div>
        <h4 className="font-medium mb-4 text-gray-700">📝 Available Options</h4>
        <div className="bg-gray-50 p-4 rounded-lg border">
          <div className="flex flex-wrap gap-3">
            {uniqueOptions.length > 0 ? (
              uniqueOptions.map((option, optionIndex) => {
                const isUsed = Object.values(value || {}).includes(option)
                return (
                  <div
                    key={optionIndex}
                    className={`px-4 py-3 border-2 rounded-lg transition-all transform ${
                      isUsed
                        ? 'bg-gray-200 border-gray-300 opacity-50 cursor-not-allowed'
                        : 'bg-white border-blue-300 hover:bg-blue-50 hover:border-blue-400 shadow-sm cursor-move hover:scale-105 hover:shadow-md active:scale-95'
                    }`}
                    draggable={!isUsed}
                    onDragStart={(e) => {
                      if (!isUsed) {
                        e.dataTransfer.setData('text/plain', option)
                        e.dataTransfer.effectAllowed = 'move'
                        e.currentTarget.classList.add('opacity-75', 'scale-95')
                      }
                    }}
                    onDragEnd={(e) => {
                      e.currentTarget.classList.remove('opacity-75', 'scale-95')
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`font-medium ${isUsed ? 'text-gray-500' : 'text-blue-800'}`}>
                        {option}
                      </span>
                      {isUsed ? (
                        <span className="ml-2 text-xs text-gray-400 bg-gray-300 px-2 py-1 rounded-full">✓ Used</span>
                      ) : (
                        <span className="ml-2 text-xs text-blue-500 bg-blue-100 px-2 py-1 rounded-full">Drag me</span>
                      )}
                    </div>
                  </div>
                )
              })
            ) : (
              <p className="text-gray-500 italic">No options available. Please add options in the editor.</p>
            )}
          </div>
        </div>
      </div>

      {/* Sentence with blanks */}
      <div>
        <h4 className="font-medium mb-4 text-gray-700">🎯 Fill in the Blanks</h4>
        <div className="bg-white p-6 rounded-lg border-2 border-gray-200">
          <div className="text-xl leading-relaxed">
            {words.map((word, index) => {
              const isBlank = question.blanks?.some(blank => blank.position === index) || false
              
              return (
                <span key={index} className="inline-block mx-1 my-1">
                  {isBlank ? (
                    <div
                      className={`inline-block min-w-[160px] h-12 border-2 border-dashed rounded-lg mx-1 transition-all cursor-pointer ${
                        value?.[index] 
                          ? 'border-green-400 bg-green-50 hover:bg-green-100' 
                          : 'border-blue-300 bg-blue-50 hover:border-blue-400 hover:bg-blue-100'
                      }`}
                      onDragOver={(e) => {
                        e.preventDefault()
                        e.currentTarget.classList.add('border-green-500', 'bg-green-100', 'scale-105', 'shadow-lg')
                        e.currentTarget.classList.remove('border-blue-300', 'border-blue-400')
                      }}
                      onDragLeave={(e) => {
                        e.currentTarget.classList.remove('border-green-500', 'bg-green-100', 'scale-105', 'shadow-lg')
                        if (!value?.[index]) {
                          e.currentTarget.classList.add('border-blue-300')
                        }
                      }}
                      onDrop={(e) => {
                        e.preventDefault()
                        e.currentTarget.classList.remove('border-green-500', 'bg-green-100', 'scale-105', 'shadow-lg')
                        
                        const droppedOption = e.dataTransfer.getData('text/plain')
                        if (droppedOption) {
                          const newValue = { ...value, [index]: droppedOption }
                          onChange(newValue)
                          // Add success animation
                          e.currentTarget.classList.add('animate-pulse')
                          setTimeout(() => {
                            e.currentTarget.classList.remove('animate-pulse')
                          }, 600)
                        }
                      }}
                      onDoubleClick={() => {
                        // Clear the blank on double-click
                        if (value?.[index]) {
                          const newValue = { ...value }
                          delete newValue[index]
                          onChange(newValue)
                        }
                      }}
                      title={value?.[index] ? "Double-click to clear" : "Drop an option here"}
                    >
                      {value?.[index] ? (
                        <div className="flex items-center justify-center h-full text-green-800 font-semibold px-3">
                          <span className="mr-2">{value[index]}</span>
                          <span className="text-green-600">✓</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full text-blue-500 text-xs">
                          <span className="font-medium">Drop Here</span>
                          <span className="text-blue-400">📥</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <span className="text-gray-800">{word}</span>
                  )}
                </span>
              )
            })}
          </div>
        </div>
      </div>

      {/* Progress indicator */}
      {question.blanks && question.blanks.length > 0 && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Progress:</span>
            <span className="text-sm font-medium text-blue-600">
              {Object.keys(value || {}).length} / {question.blanks.length} blanks filled
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ 
                width: `${question.blanks.length > 0 ? (Object.keys(value || {}).length / question.blanks.length) * 100 : 0}%` 
              }}
            ></div>
          </div>
        </div>
      )}
    </div>
  )
}

// Comprehension Question Renderer - Updated for MCQ
const ComprehensionRenderer = ({ 
  question, 
  value, 
  onChange 
}: { 
  question: ComprehensionQuestion
  value: any
  onChange: (value: any) => void
}) => {
  return (
    <div className="space-y-6">
      {/* Passage */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium mb-2">Passage</h4>
        <p className="text-gray-700 leading-relaxed">{question.passage}</p>
      </div>
      
      {/* Sub Questions */}
      <div className="space-y-4">
        {question.subQuestions.map((subQuestion, index) => (
          <div key={index} className="border-l-4 border-blue-500 pl-4">
            <h5 className="font-medium mb-2">
              {index + 1}. {subQuestion.questionText}
            </h5>
            <div className="space-y-2">
              {subQuestion.options.map((option, optionIndex) => (
                <label key={optionIndex} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name={`comprehension-${index}`}
                    value={option}
                    checked={value?.[index] === option}
                    onChange={(e) => {
                      const newValue = { ...value, [index]: e.target.value }
                      onChange(newValue)
                    }}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default FormPreview 