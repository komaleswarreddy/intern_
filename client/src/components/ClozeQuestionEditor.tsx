import React, { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { ClozeQuestion, QuestionEditorProps } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'

const ClozeQuestionEditor: React.FC<QuestionEditorProps> = ({
  question,
  onUpdate
}) => {
  const clozeQuestion = question as ClozeQuestion
  const [newOption, setNewOption] = useState('')
  const [editingBlankIndex, setEditingBlankIndex] = useState<number | null>(null)

  const handleWordClick = (word: string, position: number) => {
    const isAlreadyBlank = clozeQuestion.blanks.some(blank => blank.position === position)
    
    if (isAlreadyBlank) {
      // Remove blank
      const updatedQuestion: ClozeQuestion = {
        ...clozeQuestion,
        blanks: clozeQuestion.blanks.filter(blank => blank.position !== position)
      }
      onUpdate(updatedQuestion)
    } else {
      // Add blank with the word as the correct answer and some default options
      const cleanWord = word.replace(/[^\w]/g, '') || word
      const updatedQuestion: ClozeQuestion = {
        ...clozeQuestion,
        blanks: [...clozeQuestion.blanks, { 
          word: cleanWord, 
          position,
          options: [cleanWord] // Start with just the correct answer
        }]
      }
      onUpdate(updatedQuestion)
    }
  }

  const handleAddOption = (blankIndex: number) => {
    if (newOption.trim()) {
      const updatedQuestion: ClozeQuestion = {
        ...clozeQuestion,
        blanks: clozeQuestion.blanks.map((blank, i) => 
          i === blankIndex 
            ? { ...blank, options: [...blank.options, newOption.trim()] }
            : blank
        )
      }
      onUpdate(updatedQuestion)
      setNewOption('')
      setEditingBlankIndex(null)
    }
  }

  const handleRemoveOption = (blankIndex: number, optionIndex: number) => {
    const updatedQuestion: ClozeQuestion = {
      ...clozeQuestion,
      blanks: clozeQuestion.blanks.map((blank, i) => 
        i === blankIndex 
          ? { ...blank, options: blank.options.filter((_, j) => j !== optionIndex) }
          : blank
      )
    }
    onUpdate(updatedQuestion)
  }

  const handleUpdateOption = (blankIndex: number, optionIndex: number, newValue: string) => {
    const updatedQuestion: ClozeQuestion = {
      ...clozeQuestion,
      blanks: clozeQuestion.blanks.map((blank, i) => 
        i === blankIndex 
          ? { ...blank, options: blank.options.map((opt, j) => 
              j === optionIndex ? newValue : opt
            )}
          : blank
      )
    }
    onUpdate(updatedQuestion)
  }

  const handleRemoveBlank = (index: number) => {
    const updatedQuestion: ClozeQuestion = {
      ...clozeQuestion,
      blanks: clozeQuestion.blanks.filter((_, i) => i !== index)
    }
    onUpdate(updatedQuestion)
  }

  const renderSentence = () => {
    if (!clozeQuestion.sentence) return null
    
    const words = clozeQuestion.sentence.split(' ')
    return words.map((word, index) => {
      const isBlank = clozeQuestion.blanks.some(blank => blank.position === index)
      return (
        <span
          key={index}
          onClick={() => handleWordClick(word, index)}
          className={`inline-block px-2 py-1 mx-1 rounded cursor-pointer transition-colors ${
            isBlank 
              ? 'bg-blue-100 text-blue-800 font-medium border border-blue-300' 
              : 'hover:bg-gray-100 border border-transparent'
          }`}
        >
          {isBlank ? `[${word}]` : word}
        </span>
      )
    })
  }

  return (
    <div className="space-y-6">
      {/* Question Type Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
            Cloze (Drag & Drop)
          </span>
        </div>
      </div>

      {/* Question Text */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Question Text *
        </label>
        <Input
          value={clozeQuestion.questionText}
          onChange={(e) => onUpdate({
            ...clozeQuestion,
            questionText: e.target.value
          })}
          placeholder="Enter your cloze question..."
          className="w-full"
        />
      </div>

      {/* Sentence */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Sentence *
        </label>
        <Input
          value={clozeQuestion.sentence}
          onChange={(e) => {
            const updatedQuestion: ClozeQuestion = {
              ...clozeQuestion,
              sentence: e.target.value,
              blanks: [] // Reset blanks when sentence changes
            }
            onUpdate(updatedQuestion)
          }}
          placeholder='Type your sentence here, e.g., "The capital of India is Delhi and France is Paris"'
          className="w-full mb-4"
        />
        
        {/* Interactive Sentence */}
        {clozeQuestion.sentence && (
          <div className="border-2 border-blue-200 rounded-lg p-4 bg-blue-50">
            <div className="mb-3">
              <h4 className="text-sm font-medium text-blue-900 mb-2">📝 Interactive Sentence Editor</h4>
              <p className="text-xs text-blue-700 mb-3">
                Click on any word below to turn it into a blank. Clicked words will be highlighted in blue.
              </p>
            </div>
            <div className="bg-white p-4 rounded-md border border-blue-200">
              <div className="text-lg leading-relaxed">
                {renderSentence()}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Blanks with Options */}
      {clozeQuestion.blanks.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Blanks & Options
          </label>
          <div className="space-y-4">
            {clozeQuestion.blanks.map((blank, index) => (
              <Card key={index} className="bg-gray-50">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-gray-700">
                      Blank {index + 1}: "{blank.word}" (Position {blank.position + 1})
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveBlank(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  {/* Options */}
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Options for this blank:
                    </label>
                    <div className="grid grid-cols-1 gap-2">
                      {blank.options.map((option, optionIndex) => (
                        <div key={optionIndex} className="flex items-center space-x-2">
                          <Input
                            value={option}
                            onChange={(e) => handleUpdateOption(index, optionIndex, e.target.value)}
                            className="flex-1"
                            placeholder="Enter option..."
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveOption(index, optionIndex)}
                            className="text-red-500 hover:text-red-700"
                            disabled={blank.options.length <= 1}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    
                    {/* Add new option */}
                    <div className="flex items-center space-x-2">
                      <Input
                        value={editingBlankIndex === index ? newOption : ''}
                        onChange={(e) => {
                          setNewOption(e.target.value)
                          setEditingBlankIndex(index)
                        }}
                        placeholder="Add new option..."
                        className="flex-1"
                        onKeyPress={(e) => e.key === 'Enter' && handleAddOption(index)}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAddOption(index)}
                        disabled={!newOption.trim() || editingBlankIndex !== index}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Preview */}
      {clozeQuestion.sentence && clozeQuestion.blanks.length > 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <h4 className="font-medium mb-4 text-blue-900">Preview</h4>
            <div className="bg-white p-4 rounded-lg border">
              <p className="text-gray-700 leading-relaxed mb-4">
                {clozeQuestion.sentence.split(' ').map((word, index) => {
                  const isBlank = clozeQuestion.blanks.some(blank => blank.position === index)
                  return (
                    <span key={index} className="inline-block mx-1">
                      {isBlank ? (
                        <span className="inline-block w-24 h-6 border-b-2 border-blue-400 mx-1 bg-blue-50"></span>
                      ) : (
                        word
                      )}
                    </span>
                  )
                })}
              </p>
              
              {/* Show all options */}
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-600 mb-2">Available options:</p>
                <div className="flex flex-wrap gap-2">
                  {clozeQuestion.blanks.flatMap(blank => blank.options).map((option, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                      {option}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Getting Started Guide */}
      {!clozeQuestion.sentence && (
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">🚀 How to Create a Cloze Question</h3>
            <div className="space-y-2 text-sm text-blue-800">
              <p><strong>Step 1:</strong> Write your question above (e.g., "Fill in the blanks")</p>
              <p><strong>Step 2:</strong> Type a sentence (e.g., "The capital of India is Delhi and France is Paris")</p>
              <p><strong>Step 3:</strong> Click on words like "Delhi" and "Paris" to make them blanks</p>
              <p><strong>Step 4:</strong> Add multiple options for each blank</p>
              <p><strong>Step 5:</strong> Save your form and test it!</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      {clozeQuestion.sentence && clozeQuestion.blanks.length === 0 && (
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="pt-4">
            <p className="text-yellow-800 text-sm">
              💡 <strong>Next Step:</strong> Click on words in your sentence above to create blanks, then add multiple options for each blank.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Success Message */}
      {clozeQuestion.blanks.length > 0 && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-4">
            <p className="text-green-800 text-sm">
              ✅ <strong>Great!</strong> You have {clozeQuestion.blanks.length} blank(s) created. Add options for each blank below, then save your form!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default ClozeQuestionEditor