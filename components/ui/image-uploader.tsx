'use client'

import { useState, useRef } from 'react'
import { Upload, X, Trash2, Image as ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface ImageUploaderProps {
  currentImageUrl?: string
  onUpload: (file: File) => void
  onDelete?: () => void
  isUploading?: boolean
  isDeleting?: boolean
  accept?: string
  maxSizeMB?: number
  disabled?: boolean
  className?: string
  placeholder?: string
}

export function ImageUploader({
  currentImageUrl,
  onUpload,
  onDelete,
  isUploading = false,
  isDeleting = false,
  accept = 'image/*',
  maxSizeMB = 5,
  disabled = false,
  className = '',
  placeholder = 'Ajouter une image',
}: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null)
  const [error, setError] = useState<string | null>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setError(null)

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      setError('Veuillez sélectionner un fichier image valide (JPG, PNG, GIF, WEBP)')
      return
    }

    // Validate file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024
    if (file.size > maxSizeBytes) {
      setError(`La taille du fichier doit être inférieure à ${maxSizeMB} MB`)
      return
    }

    // Create preview
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)

    // Call onUpload
    onUpload(file)

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleDelete = () => {
    if (onDelete) {
      onDelete()
      setPreviewUrl(null)
    }
  }

  const handleClick = () => {
    if (!disabled && !isUploading) {
      fileInputRef.current?.click()
    }
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="relative">
        {previewUrl ? (
          <div className="relative group">
            <div className="aspect-video w-full max-w-sm mx-auto overflow-hidden rounded-lg border bg-gray-50">
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="absolute top-2 right-2 space-x-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={handleClick}
                disabled={disabled || isUploading}
              >
                <Upload className="h-4 w-4" />
              </Button>

              {onDelete && (
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={disabled || isDeleting}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>

            {isUploading && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                <div className="text-white text-sm">Upload en cours...</div>
              </div>
            )}
          </div>
        ) : (
          <div
            onClick={handleClick}
            className={`
              aspect-video w-full max-w-sm mx-auto border-2 border-dashed border-gray-300 rounded-lg
              flex flex-col items-center justify-center cursor-pointer hover:border-gray-400
              transition-colors ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            <ImageIcon className="h-12 w-12 text-gray-400 mb-2" />
            <p className="text-sm text-gray-600">{placeholder}</p>
            <p className="text-xs text-gray-500 mt-1">
              Max {maxSizeMB} MB - Formats acceptés : JPEG, PNG, GIF, WEBP
            </p>
          </div>
        )}
      </div>

      <div className="flex justify-center space-x-2">
        <Button
          variant="outline"
          onClick={handleClick}
          disabled={disabled || isUploading}
          className="w-full max-w-sm"
        >
          <Upload className="h-4 w-4 mr-2" />
          {isUploading ? 'Upload...' : previewUrl ? 'Remplacer' : placeholder}
        </Button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  )
}