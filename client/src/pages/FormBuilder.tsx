import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Save, Eye, Copy, Trash2, GripVertical } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { Form, Question, QuestionType } from '@/types'
import { formApi } from '@/utils/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import CategorizeQuestionEditor from '@/components/CategorizeQuestionEditor'
import ClozeQuestionEditor from '@/components/ClozeQuestionEditor'
import ComprehensionQuestionEditor from '@/components/ComprehensionQuestionEditor'

const FormBuilder: React.FC = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState<Form>({
    title: 'Untitled Quiz',
    description: '',
    questions: []
  })
  const [isSaving, setIsSaving] = useState(false)
  const [isDirty, setIsDirty] = useState(false)

  // Auto-save functionality
  useEffect(() => {
    if (isDirty) {
      const timeoutId = setTimeout(() => {
        handleSave()
      }, 2000)
      return () => clearTimeout(timeoutId)
    }
  }, [form, isDirty])

  const handleSave = async () => {
    if (!isDirty) return
    
    setIsSaving(true)
    try {
      if (form._id) {
        await formApi.update(form._id, form)
        toast.success('Form saved successfully!')
      } else {
        const response = await formApi.create(form)
        if (response.success && response.data) {
          setForm(response.data)
          toast.success('Form created successfully!')
        }
      }
      setIsDirty(false)
    } catch (error) {
      toast.error('Failed to save form')
      console.error('Save error:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleSaveAndProceed = async () => {
    await handleSave()
    if (form._id) {
      navigate(`/form/${form._id}`)
    }
  }

  const addQuestion = (type: QuestionType) => {
    const newQuestion: Question = (() => {
      switch (type) {
        case 'categorize':
          return {
            type: 'categorize',
            questionText: '',
            description: '',
            categories: ['Category 1', 'Category 2'],
            items: [
              { label: 'Item 1', correctCategory: 'Category 1' },
              { label: 'Item 2', correctCategory: 'Category 2' }
            ]
          }
        case 'cloze':
          return {
            type: 'cloze',
            questionText: '',
            sentence: '',
            blanks: []
          }
        case 'comprehension':
          return {
            type: 'comprehension',
            passage: 'Enter your passage here...',
            subQuestions: [
              { 
                questionText: 'Question 1', 
                options: ['Option A', 'Option B', 'Option C', 'Option D'],
                correctAnswer: 'Option A'
              }
            ]
          }
      }
    })()

    setForm(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion]
    }))
    setIsDirty(true)
  }

  const updateQuestion = (index: number, question: Question) => {
    setForm(prev => ({
      ...prev,
      questions: prev.questions.map((q, i) => i === index ? question : q)
    }))
    setIsDirty(true)
  }

  const deleteQuestion = (index: number) => {
    setForm(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index)
    }))
    setIsDirty(true)
  }

  const duplicateQuestion = (index: number) => {
    const question = form.questions[index]
    const duplicatedQuestion = {
      ...question,
      _id: undefined // Remove ID for new question
    }
    
    setForm(prev => ({
      ...prev,
      questions: [...prev.questions, duplicatedQuestion]
    }))
    setIsDirty(true)
  }

  const renderQuestionEditor = (question: Question, index: number) => {
    const props = {
      question,
      onUpdate: (updatedQuestion: Question) => updateQuestion(index, updatedQuestion),
      onDelete: () => deleteQuestion(index),
      onDuplicate: () => duplicateQuestion(index)
    }

    switch (question.type) {
      case 'categorize':
        return <CategorizeQuestionEditor key={index} {...props} />
      case 'cloze':
        return <ClozeQuestionEditor key={index} {...props} />
      case 'comprehension':
        return <ComprehensionQuestionEditor key={index} {...props} />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Input
                value={form.title}
                onChange={(e) => {
                  setForm(prev => ({ ...prev, title: e.target.value }))
                  setIsDirty(true)
                }}
                className="text-xl font-semibold border-none bg-transparent p-0 focus:ring-0"
                placeholder="Untitled Quiz"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/form/${form._id}`)}
                disabled={!form._id}
              >
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSave}
                disabled={isSaving}
              >
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? 'Saving...' : 'Save'}
              </Button>
              <Button
                size="sm"
                onClick={handleSaveAndProceed}
                disabled={isSaving}
              >
                Save & Proceed
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Questions Area */}
          <div className="lg:col-span-2 space-y-6">
            {form.questions.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <div className="text-gray-500 mb-4">
                    <Plus className="w-12 h-12 mx-auto mb-4" />
                    <h3 className="text-lg font-medium">No questions yet</h3>
                    <p className="text-sm">Add your first question to get started</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              form.questions.map((question, index) => (
                <Card key={index} className="relative">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <GripVertical className="w-4 h-4 text-gray-400 cursor-move" />
                        <CardTitle className="text-lg">
                          Question {index + 1}
                        </CardTitle>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => duplicateQuestion(index)}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteQuestion(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {renderQuestionEditor(question, index)}
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Add Questions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Add Questions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => addQuestion('categorize')}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Categorize
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => addQuestion('cloze')}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Cloze
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => addQuestion('comprehension')}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Comprehension
                </Button>
              </CardContent>
            </Card>

            {/* Form Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Form Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <Input
                    value={form.description}
                    onChange={(e) => {
                      setForm(prev => ({ ...prev, description: e.target.value }))
                      setIsDirty(true)
                    }}
                    placeholder="Form description (optional)"
                  />
                </div>
                <div className="text-sm text-gray-500">
                  <p>Questions: {form.questions.length}</p>
                  <p>Last saved: {isDirty ? 'Unsaved changes' : 'Saved'}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FormBuilder 