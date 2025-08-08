import React, { useState } from 'react'
import { Plus, X, GripVertical } from 'lucide-react'
import { CategorizeQuestion, QuestionEditorProps } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'

const CategorizeQuestionEditor: React.FC<QuestionEditorProps> = ({
  question,
  onUpdate,
  onDelete,
  onDuplicate
}) => {
  const categorizeQuestion = question as CategorizeQuestion
  const [newCategory, setNewCategory] = useState('')
  const [newItem, setNewItem] = useState('')
  const [newItemCategory, setNewItemCategory] = useState('')

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      const updatedQuestion: CategorizeQuestion = {
        ...categorizeQuestion,
        categories: [...categorizeQuestion.categories, newCategory.trim()]
      }
      onUpdate(updatedQuestion)
      setNewCategory('')
    }
  }

  const handleRemoveCategory = (index: number) => {
    const updatedQuestion: CategorizeQuestion = {
      ...categorizeQuestion,
      categories: categorizeQuestion.categories.filter((_, i) => i !== index),
      items: categorizeQuestion.items.filter(item => 
        item.correctCategory !== categorizeQuestion.categories[index]
      )
    }
    onUpdate(updatedQuestion)
  }

  const handleAddItem = () => {
    if (newItem.trim() && newItemCategory) {
      const updatedQuestion: CategorizeQuestion = {
        ...categorizeQuestion,
        items: [...categorizeQuestion.items, {
          label: newItem.trim(),
          correctCategory: newItemCategory
        }]
      }
      onUpdate(updatedQuestion)
      setNewItem('')
      setNewItemCategory('')
    }
  }

  const handleRemoveItem = (index: number) => {
    const updatedQuestion: CategorizeQuestion = {
      ...categorizeQuestion,
      items: categorizeQuestion.items.filter((_, i) => i !== index)
    }
    onUpdate(updatedQuestion)
  }

  const handleUpdateItemCategory = (index: number, category: string) => {
    const updatedQuestion: CategorizeQuestion = {
      ...categorizeQuestion,
      items: categorizeQuestion.items.map((item, i) => 
        i === index ? { ...item, correctCategory: category } : item
      )
    }
    onUpdate(updatedQuestion)
  }

  return (
    <div className="space-y-6">
      {/* Question Type Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
            Categorize
          </span>
        </div>
      </div>

      {/* Question Text */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Question Text *
        </label>
        <Input
          value={categorizeQuestion.questionText}
          onChange={(e) => onUpdate({
            ...categorizeQuestion,
            questionText: e.target.value
          })}
          placeholder="Enter your categorize question..."
          className="w-full"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description (Optional)
        </label>
        <Input
          value={categorizeQuestion.description || ''}
          onChange={(e) => onUpdate({
            ...categorizeQuestion,
            description: e.target.value
          })}
          placeholder="Add a description..."
          className="w-full"
        />
      </div>

      {/* Categories */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Categories *
        </label>
        <div className="space-y-2">
          {categorizeQuestion.categories.map((category, index) => (
            <div key={index} className="flex items-center space-x-2">
              <GripVertical className="w-4 h-4 text-gray-400" />
              <Input
                value={category}
                onChange={(e) => {
                  const updatedCategories = [...categorizeQuestion.categories]
                  updatedCategories[index] = e.target.value
                  const updatedQuestion: CategorizeQuestion = {
                    ...categorizeQuestion,
                    categories: updatedCategories,
                    items: categorizeQuestion.items.map(item => ({
                      ...item,
                      correctCategory: item.correctCategory === category ? e.target.value : item.correctCategory
                    }))
                  }
                  onUpdate(updatedQuestion)
                }}
                className="flex-1"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveCategory(index)}
                className="text-red-500 hover:text-red-700"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
          <div className="flex items-center space-x-2">
            <Input
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Add new category..."
              className="flex-1"
              onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={handleAddCategory}
              disabled={!newCategory.trim()}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Items */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Items *
        </label>
        <div className="space-y-2">
          {categorizeQuestion.items.map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              <GripVertical className="w-4 h-4 text-gray-400" />
              <Input
                value={item.label}
                onChange={(e) => {
                  const updatedItems = [...categorizeQuestion.items]
                  updatedItems[index] = { ...item, label: e.target.value }
                  const updatedQuestion: CategorizeQuestion = {
                    ...categorizeQuestion,
                    items: updatedItems
                  }
                  onUpdate(updatedQuestion)
                }}
                placeholder="Item label"
                className="flex-1"
              />
              <select
                value={item.correctCategory}
                onChange={(e) => handleUpdateItemCategory(index, e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categorizeQuestion.categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveItem(index)}
                className="text-red-500 hover:text-red-700"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
          <div className="flex items-center space-x-2">
            <Input
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              placeholder="Add new item..."
              className="flex-1"
            />
            <select
              value={newItemCategory}
              onChange={(e) => setNewItemCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select category</option>
              {categorizeQuestion.categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <Button
              variant="outline"
              size="sm"
              onClick={handleAddItem}
              disabled={!newItem.trim() || !newItemCategory}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Preview */}
      {categorizeQuestion.categories.length > 0 && categorizeQuestion.items.length > 0 && (
        <Card className="bg-gray-50">
          <CardContent className="pt-6">
            <h4 className="font-medium mb-4">Preview</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categorizeQuestion.categories.map((category) => (
                <div key={category} className="bg-white p-4 rounded-lg border">
                  <h5 className="font-medium text-gray-900 mb-2">{category}</h5>
                  <div className="space-y-1">
                    {categorizeQuestion.items
                      .filter(item => item.correctCategory === category)
                      .map((item, index) => (
                        <div key={index} className="bg-gray-100 px-3 py-2 rounded text-sm">
                          {item.label}
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default CategorizeQuestionEditor
