import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Plus, Save, Settings } from 'lucide-react'
import { Form, Question, CategorizeQuestion, ClozeQuestion, ComprehensionQuestion } from '@/types'
import { formApi } from '@/utils/api'
import ImageUpload from '@/components/ImageUpload'
import QuestionImageUpload from '@/components/QuestionImageUpload'
import toast from 'react-hot-toast'

const FormBuilder = () => {
  const [form, setForm] = useState<Form>({
    title: '',
    description: '',
    headerImage: '',
    questions: [],
    isPublic: true,
  })

  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    if (!form.title.trim()) {
      toast.error('Please enter a form title')
      return
    }

    if (form.questions.length === 0) {
      toast.error('Please add at least one question')
      return
    }

    setIsSaving(true)
    try {
      const response = await formApi.create(form)
      if (response.success) {
        toast.success('Form saved successfully!')
        console.log('Form saved:', response.data)
        // Optionally redirect to the form preview or dashboard
      } else {
        toast.error(response.error || 'Failed to save form')
      }
    } catch (error: any) {
      console.error('Save error:', error)
      toast.error(error.response?.data?.error || 'Failed to save form')
    } finally {
      setIsSaving(false)
    }
  }

  const addQuestion = (type: Question['type']) => {
    let newQuestion: Question
    
    if (type === 'categorize') {
      newQuestion = {
        type: 'categorize',
        text: '',
        categories: ['Category 1', 'Category 2'],
        items: ['Item 1', 'Item 2'],
        answerKey: {}
      } as CategorizeQuestion
    } else if (type === 'cloze') {
      newQuestion = {
        type: 'cloze',
        text: 'The capital of France is ___.',
        blanks: ['Paris']
      } as ClozeQuestion
    } else if (type === 'comprehension') {
      newQuestion = {
        type: 'comprehension',
        text: '',
        passage: 'Enter your passage here...',
        subQuestions: []
      } as ComprehensionQuestion
    } else {
      throw new Error(`Unknown question type: ${type}`)
    }

    setForm(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion]
    }))
  }

  const removeQuestion = (index: number) => {
    setForm(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index)
    }))
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Create Form</h1>
        <p className="text-muted-foreground">
          Build your custom form with rich question types and beautiful design
        </p>
      </div>

      {/* Form Settings */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Form Settings</CardTitle>
          <CardDescription>
            Configure the basic settings for your form
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="text-sm font-medium mb-2 block">Form Title *</label>
            <Input
              placeholder="Enter form title..."
              value={form.title}
              onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
            />
          </div>
          
          <div>
            <label className="text-sm font-medium mb-2 block">Description</label>
            <Input
              placeholder="Enter form description..."
              value={form.description}
              onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
            />
          </div>

          <div>
            <ImageUpload
              value={form.headerImage}
              onChange={(url) => setForm(prev => ({ ...prev, headerImage: url }))}
            />
          </div>
        </CardContent>
      </Card>

      {/* Questions Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Questions</h2>
          <div className="flex items-center space-x-2">
            <Button
              onClick={() => addQuestion('categorize')}
              variant="outline"
              size="sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Categorize
            </Button>
            <Button
              onClick={() => addQuestion('cloze')}
              variant="outline"
              size="sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Cloze
            </Button>
            <Button
              onClick={() => addQuestion('comprehension')}
              variant="outline"
              size="sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Comprehension
            </Button>
          </div>
        </div>

        {form.questions.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="text-muted-foreground mb-4">
                <Plus className="h-12 w-12 mx-auto mb-4" />
                <p className="text-lg font-medium">No questions yet</p>
                <p className="text-sm">Add your first question to get started</p>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  onClick={() => addQuestion('categorize')}
                  size="sm"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Question
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {form.questions.map((question, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-muted-foreground">
                        Question {index + 1}
                      </span>
                      <span className="px-2 py-1 text-xs bg-primary/10 text-primary rounded">
                        {question.type}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => removeQuestion(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        ×
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Question Text</label>
                    <Input
                      placeholder={`Enter your ${question.type} question...`}
                      value={question.text}
                      onChange={(e) => {
                        const updatedQuestions = [...form.questions]
                        updatedQuestions[index] = { ...question, text: e.target.value }
                        setForm(prev => ({ ...prev, questions: updatedQuestions }))
                      }}
                    />
                  </div>
                  
                  {/* Question Image Upload */}
                  <QuestionImageUpload
                    value={question.image}
                    onChange={(url) => {
                      const updatedQuestions = [...form.questions]
                      updatedQuestions[index] = { ...question, image: url }
                      setForm(prev => ({ ...prev, questions: updatedQuestions }))
                    }}
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t">
        <div className="flex items-center space-x-2">
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Settings className="h-4 w-4" />
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save Form'}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default FormBuilder 