import { useState, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import { uploadApi } from '@/utils/api'
import toast from 'react-hot-toast'

interface QuestionImageUploadProps {
  value?: string
  onChange: (url: string) => void
  className?: string
}

const QuestionImageUpload = ({ value, onChange, className = "" }: QuestionImageUploadProps) => {
  const [isDragOver, setIsDragOver] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(value || null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = useCallback(async (file: File) => {
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB')
      return
    }

    setIsUploading(true)
    try {
      const response = await uploadApi.uploadImage(file)
      if (response.success && response.data) {
        const imageUrl = response.data.url
        setPreview(imageUrl)
        onChange(imageUrl)
        toast.success('Image uploaded successfully!')
      } else {
        toast.error(response.error || 'Failed to upload image')
      }
    } catch (error: any) {
      console.error('Upload error:', error)
      toast.error(error.response?.data?.error || 'Failed to upload image')
    } finally {
      setIsUploading(false)
    }
  }, [onChange])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileUpload(files[0])
    }
  }, [handleFileUpload])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileUpload(files[0])
    }
  }, [handleFileUpload])

  const handleRemoveImage = useCallback(() => {
    setPreview(null)
    onChange('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [onChange])

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="text-sm font-medium">Question Image (Optional)</label>
      
      {preview ? (
        <div className="relative">
          <img 
            src={preview} 
            alt="Question preview" 
            className="w-full h-32 object-cover rounded-lg border"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-1 right-1 h-6 w-6"
            onClick={handleRemoveImage}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      ) : (
        <Card 
          className={`border-2 border-dashed transition-colors cursor-pointer ${
            isDragOver 
              ? 'border-primary bg-primary/5' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <CardContent className="p-4">
            <div className="text-center space-y-2">
              <div className="mx-auto w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                <ImageIcon className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs font-medium">
                  {isDragOver ? 'Drop image here' : 'Add image'}
                </p>
                <p className="text-xs text-muted-foreground">
                  Drag & drop or click
                </p>
              </div>
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </CardContent>
        </Card>
      )}

      {/* Upload Progress */}
      {isUploading && (
        <div className="text-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mx-auto"></div>
          <p className="text-xs text-muted-foreground mt-1">Uploading...</p>
        </div>
      )}
    </div>
  )
}

export default QuestionImageUpload 