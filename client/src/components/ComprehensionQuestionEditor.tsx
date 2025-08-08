import React, { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { ComprehensionQuestion, QuestionEditorProps } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'

const ComprehensionQuestionEditor: React.FC<QuestionEditorProps> = ({
  question,
  onUpdate
}) => {
  const comprehensionQuestion = question as ComprehensionQuestion
  const [newSubQuestion, setNewSubQuestion] = useState('')
  const [newOption, setNewOption] = useState('')

  const handleAddSubQuestion = () => {
    if (newSubQuestion.trim()) {
      const updatedQuestion: ComprehensionQuestion = {
        ...comprehensionQuestion,
        subQuestions: [...comprehensionQuestion.subQuestions, {
          questionText: newSubQuestion.trim(),
          options: ['Option A', 'Option B', 'Option C', 'Option D'],
          correctAnswer: 'Option A'
        }]
      }
      onUpdate(updatedQuestion)
      setNewSubQuestion('')
    }
  }

  const handleRemoveSubQuestion = (index: number) => {
    const updatedQuestion: ComprehensionQuestion = {
      ...comprehensionQuestion,
      subQuestions: comprehensionQuestion.subQuestions.filter((_, i) => i !== index)
    }
    onUpdate(updatedQuestion)
  }

  const handleAddOption = (subQuestionIndex: number) => {
    if (newOption.trim()) {
      const updatedQuestion: ComprehensionQuestion = {
        ...comprehensionQuestion,
        subQuestions: comprehensionQuestion.subQuestions.map((subQuestion, i) => 
          i === subQuestionIndex 
            ? { ...subQuestion, options: [...subQuestion.options, newOption.trim()] }
            : subQuestion
        )
      }
      onUpdate(updatedQuestion)
      setNewOption('')
    }
  }

  const handleRemoveOption = (subQuestionIndex: number, optionIndex: number) => {
    const updatedQuestion: ComprehensionQuestion = {
      ...comprehensionQuestion,
      subQuestions: comprehensionQuestion.subQuestions.map((subQuestion, i) => 
        i === subQuestionIndex 
          ? { ...subQuestion, options: subQuestion.options.filter((_, j) => j !== optionIndex) }
          : subQuestion
      )
    }
    onUpdate(updatedQuestion)
  }

  return (
    <div className="space-y-6">
      {/* Question Type Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
            Comprehension (MCQ)
          </span>
        </div>
      </div>

      {/* Passage */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Passage *
        </label>
        <textarea
          value={comprehensionQuestion.passage}
          onChange={(e) => onUpdate({
            ...comprehensionQuestion,
            passage: e.target.value
          })}
          placeholder="Enter the reading passage..."
          className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical"
        />
      </div>

      {/* Sub Questions */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Sub Questions (MCQ) *
        </label>
        <div className="space-y-4">
          {comprehensionQuestion.subQuestions.map((subQuestion, index) => (
            <Card key={index} className="bg-gray-50">
              <CardContent className="pt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Sub Question {index + 1}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveSubQuestion(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="space-y-4">
                  <Input
                    value={subQuestion.questionText}
                    onChange={(e) => {
                      const updatedSubQuestions = [...comprehensionQuestion.subQuestions]
                      updatedSubQuestions[index] = {
                        ...subQuestion,
                        questionText: e.target.value
                      }
                      const updatedQuestion: ComprehensionQuestion = {
                        ...comprehensionQuestion,
                        subQuestions: updatedSubQuestions
                      }
                      onUpdate(updatedQuestion)
                    }}
                    placeholder="Enter sub question..."
                    className="w-full"
                  />
                  
                  {/* Options */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Options:
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {subQuestion.options.map((option, optionIndex) => (
                        <div key={optionIndex} className="flex items-center space-x-2">
                          <Input
                            value={option}
                            onChange={(e) => {
                              const updatedSubQuestions = [...comprehensionQuestion.subQuestions]
                              updatedSubQuestions[index] = {
                                ...subQuestion,
                                options: subQuestion.options.map((opt, j) => 
                                  j === optionIndex ? e.target.value : opt
                                )
                              }
                              const updatedQuestion: ComprehensionQuestion = {
                                ...comprehensionQuestion,
                                subQuestions: updatedSubQuestions
                              }
                              onUpdate(updatedQuestion)
                            }}
                            className="flex-1"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveOption(index, optionIndex)}
                            className="text-red-500 hover:text-red-700"
                            disabled={subQuestion.options.length <= 1}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    
                    {/* Add new option */}
                    <div className="flex items-center space-x-2">
                      <Input
                        value={newOption}
                        onChange={(e) => setNewOption(e.target.value)}
                        placeholder="Add new option..."
                        className="flex-1"
                        onKeyPress={(e) => e.key === 'Enter' && handleAddOption(index)}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAddOption(index)}
                        disabled={!newOption.trim()}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Correct Answer */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Correct Answer:
                    </label>
                    <select
                      value={subQuestion.correctAnswer}
                      onChange={(e) => {
                        const updatedSubQuestions = [...comprehensionQuestion.subQuestions]
                        updatedSubQuestions[index] = {
                          ...subQuestion,
                          correctAnswer: e.target.value
                        }
                        const updatedQuestion: ComprehensionQuestion = {
                          ...comprehensionQuestion,
                          subQuestions: updatedSubQuestions
                        }
                        onUpdate(updatedQuestion)
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {subQuestion.options.map((option, optionIndex) => (
                        <option key={optionIndex} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {/* Add New Sub Question */}
          <Card className="border-dashed border-gray-300">
            <CardContent className="pt-4">
              <div className="space-y-2">
                <Input
                  value={newSubQuestion}
                  onChange={(e) => setNewSubQuestion(e.target.value)}
                  placeholder="New sub question..."
                  className="w-full"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAddSubQuestion}
                  disabled={!newSubQuestion.trim()}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Sub Question
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Preview */}
      {comprehensionQuestion.passage && (
        <Card className="bg-gray-50">
          <CardContent className="pt-6">
            <h4 className="font-medium mb-4">Preview</h4>
            <div className="bg-white p-4 rounded-lg border">
              <div className="prose max-w-none">
                <h5 className="font-medium text-gray-900 mb-2">Passage:</h5>
                <p className="text-gray-700 leading-relaxed mb-4">
                  {comprehensionQuestion.passage}
                </p>
                
                {comprehensionQuestion.subQuestions.length > 0 && (
                  <>
                    <h5 className="font-medium text-gray-900 mb-2">Questions:</h5>
                    <div className="space-y-2">
                      {comprehensionQuestion.subQuestions.map((subQuestion, index) => (
                        <div key={index} className="border-l-4 border-blue-500 pl-4">
                          <p className="font-medium text-gray-900">
                            {index + 1}. {subQuestion.questionText}
                          </p>
                          <div className="mt-2 space-y-1">
                            {subQuestion.options.map((option, optionIndex) => (
                              <div key={optionIndex} className="flex items-center space-x-2">
                                <input
                                  type="radio"
                                  name={`question-${index}`}
                                  value={option}
                                  checked={option === subQuestion.correctAnswer}
                                  readOnly
                                  className="text-blue-600"
                                />
                                <span className="text-sm text-gray-700">{option}</span>
                                {option === subQuestion.correctAnswer && (
                                  <span className="text-green-600 text-xs">✓ Correct</span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default ComprehensionQuestionEditor
