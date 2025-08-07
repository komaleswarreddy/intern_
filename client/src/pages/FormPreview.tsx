import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { CheckCircle, Send } from 'lucide-react'
import { Form, Question } from '@/types'
import { formApi, responseApi } from '@/utils/api'
import toast from 'react-hot-toast'

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
      <div className="max-w-2xl mx-auto">
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
      <div className="max-w-2xl mx-auto">
        <Card className="text-center py-12">
          <CardContent>
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Thank You!</h2>
            <p className="text-muted-foreground">
              Your response has been submitted successfully.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Form Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{form.title}</h1>
        {form.description && (
          <p className="text-muted-foreground">{form.description}</p>
        )}
        {form.headerImage && (
          <img 
            src={form.headerImage} 
            alt="Form header" 
            className="w-full h-48 object-cover rounded-lg mt-4"
          />
        )}
      </div>

      {/* Questions */}
      <div className="space-y-6">
        {form.questions.map((question, index) => (
          <Card key={question._id || index}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <span className="mr-2">Q{index + 1}.</span>
                {question.text}
              </CardTitle>
              {question.image && (
                <img 
                  src={question.image} 
                  alt="Question" 
                  className="w-full max-h-64 object-contain rounded"
                />
              )}
            </CardHeader>
            <CardContent>
              <QuestionRenderer
                question={question}
                value={answers[question._id || index.toString()]}
                onChange={(answer) => handleAnswerChange(question._id || index.toString(), answer)}
              />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Submit Button */}
      <div className="mt-8 pt-6 border-t">
        <Button 
          onClick={handleSubmit} 
          disabled={isSubmitting}
          className="w-full"
          size="lg"
        >
          <Send className="h-4 w-4 mr-2" />
          {isSubmitting ? 'Submitting...' : 'Submit Response'}
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
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Categories</h4>
              <div className="space-y-2">
                {question.categories?.map((category, index) => (
                  <div key={index} className="p-3 border rounded bg-muted/50">
                    {category}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Items to Categorize</h4>
              <div className="space-y-2">
                {question.items?.map((item, index) => (
                  <div key={index} className="p-3 border rounded bg-background">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )

    case 'cloze':
      return (
        <div className="space-y-4">
          <div className="text-lg">
            {question.text.split('___').map((part, index, array) => (
              <span key={index}>
                {part}
                {index < array.length - 1 && (
                  <Input
                    className="inline-block w-32 mx-2"
                    placeholder="Answer"
                    value={value?.[index] || ''}
                    onChange={(e) => {
                      const newValue = { ...value, [index]: e.target.value }
                      onChange(newValue)
                    }}
                  />
                )}
              </span>
            ))}
          </div>
        </div>
      )

    case 'comprehension':
      return (
        <div className="space-y-6">
          <div className="p-4 bg-muted/50 rounded-lg">
            <h4 className="font-medium mb-2">Passage</h4>
            <p className="text-sm leading-relaxed">{question.passage}</p>
          </div>
          
          <div className="space-y-4">
            {question.subQuestions?.map((subQ, index) => (
              <div key={index} className="border-l-2 pl-4">
                <h5 className="font-medium mb-2">
                  {index + 1}. {subQ.text}
                </h5>
                {subQ.type === 'multiple-choice' ? (
                  <div className="space-y-2">
                    {subQ.options?.map((option, optIndex) => (
                      <label key={optIndex} className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name={`subQ-${index}`}
                          value={option}
                          checked={value?.[index] === option}
                          onChange={(e) => {
                            const newValue = { ...value, [index]: e.target.value }
                            onChange(newValue)
                          }}
                        />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <Input
                    placeholder="Your answer"
                    value={value?.[index] || ''}
                    onChange={(e) => {
                      const newValue = { ...value, [index]: e.target.value }
                      onChange(newValue)
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )

    default:
      return <div>Unsupported question type</div>
  }
}

export default FormPreview 