'use client'

import { useState, useRef, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuthorsList } from '@/lib/hooks/use-authors'
import { useCreateBook, useUpdateBook, useUploadBookCover, useDeleteBookCover } from '@/lib/hooks/use-books'
import { useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AuthorsMultiSelect, SelectedAuthor } from '@/components/ui/authors-multi-select'
import { Upload, Trash2 } from 'lucide-react'
import { compressMultipleImages, getImageInfo } from '@/lib/image-compression'
import { toast } from 'sonner'

interface BookFormData {
  title: string
  subtitle?: string
  isbn_10?: string
  isbn_13?: string
  synopsis?: string
  language: string
  publication_date: string
  pages: number
  status: 'draft' | 'published'
  price_cfa: number
  currency: string
  authors: SelectedAuthor[]
  cover?: File
  cover_url?: string
}

interface BookFormProps {
  book?: any
  mode: 'create' | 'edit'
  onSuccess?: () => void
  onCancel?: () => void
}

export function BookForm({ book, mode, onSuccess, onCancel }: BookFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(book?.cover_url || null)
  const previewObjectUrlRef = useRef<string | null>(null)
  const [pendingCover, setPendingCover] = useState<File | null>(null)
  const [compressing, setCompressing] = useState(false)
  const queryClient = useQueryClient()

  const { data: authorsData } = useAuthorsList({ per_page: 100 })

  const { mutate: createBook, isPending: isCreating, error: createError } = useCreateBook()
  const { mutate: updateBook, isPending: isUpdating, error: updateError } = useUpdateBook()
  const { mutate: uploadCover, isPending: isUploading } = useUploadBookCover()
  const { mutate: deleteCover, isPending: isDeleting } = useDeleteBookCover()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<BookFormData>({
    defaultValues: {
      title: book?.title || '',
      subtitle: book?.subtitle || '',
      isbn_10: book?.isbn_10 || '',
      isbn_13: book?.isbn_13 || '',
      synopsis: book?.synopsis || '',
      language: book?.language || 'fr',
      publication_date: book?.publication_date || '',
      pages: book?.pages || 0,
      status: book?.status || 'draft',
      price_cfa: book?.price_cfa || 0,
      currency: book?.currency || 'XOF',
      authors: book?.authors?.map((author: any) => ({
        id: author.id,
        first_name: author.first_name,
        last_name: author.last_name,
        contribution_role: author.contribution_role,
        contribution_order: author.contribution_order,
      })) || [],
    },
  })

  const watchedAuthors = watch('authors')
  const isPending = isCreating || isUpdating

  useEffect(() => {
    return () => {
      if (previewObjectUrlRef.current) {
        URL.revokeObjectURL(previewObjectUrlRef.current)
        previewObjectUrlRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (mode !== 'edit' || !book) return

    if (previewObjectUrlRef.current) {
      URL.revokeObjectURL(previewObjectUrlRef.current)
      previewObjectUrlRef.current = null
    }

    setPendingCover(null)
    setPreviewUrl(book.cover_url || null)

    reset({
      title: book.title || '',
      subtitle: book.subtitle || '',
      isbn_10: book.isbn_10 || '',
      isbn_13: book.isbn_13 || '',
      synopsis: book.synopsis || '',
      language: book.language || 'fr',
      publication_date: book.publication_date || '',
      pages: book.pages || 0,
      status: book.status || 'draft',
      price_cfa: book.price_cfa || 0,
      currency: book.currency || 'XOF',
      authors: book.authors?.map((author: any) => ({
        id: author.id,
        first_name: author.first_name,
        last_name: author.last_name,
        contribution_role: author.contribution_role,
        contribution_order: author.contribution_order,
      })) || [],
    })
  }, [book, mode, reset])

  const onSubmit = (data: BookFormData) => {
    if (mode === 'create') {
      createBook(data, {
        onSuccess: (newBook) => {
          queryClient.invalidateQueries({ queryKey: ['books'] })
          queryClient.invalidateQueries({ queryKey: ['stats'] })

          if (pendingCover) {
            uploadCover(
              { id: newBook.id, file: pendingCover },
              {
                onSuccess: (updatedBook) => {
                  if (previewObjectUrlRef.current) {
                    URL.revokeObjectURL(previewObjectUrlRef.current)
                    previewObjectUrlRef.current = null
                  }
                  setPendingCover(null)
                  setPreviewUrl(updatedBook.cover_url || null)
                  queryClient.invalidateQueries({ queryKey: ['books'] })
                  queryClient.invalidateQueries({ queryKey: ['books', updatedBook.id] })
                  onSuccess?.()
                },
                onError: () => {
                  if (previewObjectUrlRef.current) {
                    URL.revokeObjectURL(previewObjectUrlRef.current)
                    previewObjectUrlRef.current = null
                  }
                  setPendingCover(null)
                  queryClient.invalidateQueries({ queryKey: ['books'] })
                  onSuccess?.()
                },
              }
            )
          } else {
            onSuccess?.()
          }
        },
      })
    } else if (book) {
      updateBook({ id: book.id, data }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['books'] })
          queryClient.invalidateQueries({ queryKey: ['books', book.id] })
          onSuccess?.()
        },
      })
    }
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      setCompressing(true)

      // Afficher les informations de l'image originale
      const info = getImageInfo(file)
      console.log(`Image originale: ${info.name} - ${info.sizeFormatted}`)

      // Notification de début de compression
      toast.info('Compression de l\'image en cours...')

      // COMPRESSION DE L'IMAGE
      const compressedFile = await compressMultipleImages([file], {
        maxSizeMB: 0.2,
        maxWidthOrHeight: 1920,
        quality: 0.7,
      })

      // Afficher les informations de l'image compressée
      const compressedInfo = getImageInfo(compressedFile[0])
      console.log(`Image compressée: ${compressedInfo.name} - ${compressedInfo.sizeFormatted}`)

      setCompressing(false)

      // Calculer l'espace économisé
      const savedSize = file.size - compressedFile[0].size
      const savedSizeMB = (savedSize / (1024 * 1024)).toFixed(2)

      if (previewObjectUrlRef.current) {
        URL.revokeObjectURL(previewObjectUrlRef.current)
        previewObjectUrlRef.current = null
      }

      const objectUrl = URL.createObjectURL(compressedFile[0])
      previewObjectUrlRef.current = objectUrl
      setPreviewUrl(objectUrl)

      if (mode === 'edit' && book) {
        uploadCover({ id: book.id, file: compressedFile[0] }, {
          onSuccess: (updatedBook) => {
            if (previewObjectUrlRef.current) {
              URL.revokeObjectURL(previewObjectUrlRef.current)
              previewObjectUrlRef.current = null
            }
            setPendingCover(null)
            setPreviewUrl(updatedBook.cover_url || null)
            queryClient.invalidateQueries({ queryKey: ['books'] })
          },
          onError: () => {
            if (previewObjectUrlRef.current) {
              URL.revokeObjectURL(previewObjectUrlRef.current)
              previewObjectUrlRef.current = null
            }
            setPendingCover(null)
            setPreviewUrl(book.cover_url || null)
            queryClient.invalidateQueries({ queryKey: ['books'] })
          },
        })
      } else {
        setPendingCover(compressedFile[0])
      }

      // Notification de succès avec économie d'espace
      toast.success(
        `Image compressée avec succès (${savedSizeMB} MB économisés)`
      )

    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erreur lors de la compression de l\'image')
    } finally {
      setCompressing(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleDeleteCover = () => {
    if (mode === 'create') {
      setPendingCover(null)
      setPreviewUrl(null)
      if (previewObjectUrlRef.current) {
        URL.revokeObjectURL(previewObjectUrlRef.current)
        previewObjectUrlRef.current = null
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      return
    }

    if (book?.cover_url) {
      deleteCover(book.id, {
        onSuccess: () => {
          setPreviewUrl(null)
          queryClient.invalidateQueries({ queryKey: ['books'] })
        },
      })
    }
  }

  const handleAuthorsChange = (authors: SelectedAuthor[]) => {
    setValue('authors', authors)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Informations générales</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Titre *</Label>
              <Input
                id="title"
                {...register('title', { required: 'Le titre est requis' })}
                className={errors.title ? 'border-red-500' : ''}
              />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="subtitle">Sous-titre</Label>
              <Input
                id="subtitle"
                {...register('subtitle')}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="synopsis">Synopsis</Label>
            <Textarea
              id="synopsis"
              {...register('synopsis')}
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="language">Langue *</Label>
              <Select onValueChange={(value) => setValue('language', value)} defaultValue="fr">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="en">Anglais</SelectItem>
                  <SelectItem value="es">Espagnol</SelectItem>
                  <SelectItem value="de">Allemand</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="publication_date">Date de publication *</Label>
              <Input
                id="publication_date"
                type="date"
                {...register('publication_date', { required: 'La date de publication est requise' })}
                className={errors.publication_date ? 'border-red-500' : ''}
              />
              {errors.publication_date && (
                <p className="text-sm text-red-500">{errors.publication_date.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="pages">Nombre de pages *</Label>
              <Input
                id="pages"
                type="number"
                {...register('pages', { required: 'Le nombre de pages est requis', min: 1 })}
                className={errors.pages ? 'border-red-500' : ''}
              />
              {errors.pages && (
                <p className="text-sm text-red-500">{errors.pages.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="isbn_10">ISBN-10</Label>
              <Input
                id="isbn_10"
                {...register('isbn_10')}
                placeholder="0-123456-78-9"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="isbn_13">ISBN-13</Label>
              <Input
                id="isbn_13"
                {...register('isbn_13')}
                placeholder="978-0-123456-78-9"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Couverture</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col items-center space-y-4">
            {previewUrl ? (
              <div className="relative">
                <img
                  src={previewUrl}
                  alt="Couverture"
                  className="w-48 h-64 object-cover rounded-lg border"
                />
                {isUploading && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                    <div className="text-white text-sm">Upload en cours...</div>
                  </div>
                )}
              </div>
            ) : (
              <div className="w-48 h-64 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <div className="text-4xl mb-2">📖</div>
                  <p>Aucune couverture</p>
                </div>
              </div>
            )}

            <div className="flex flex-col space-y-2 w-full max-w-xs">
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading || compressing}
                className="w-full"
              >
                <Upload className="h-4 w-4 mr-2" />
                {compressing ? 'Compression...' : isUploading ? 'Upload...' : previewUrl ? 'Remplacer' : 'Ajouter'}
              </Button>

              {previewUrl && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleDeleteCover}
                  disabled={mode === 'edit' ? (isDeleting || isUploading) : false}
                  className="w-full text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Supprimer
                </Button>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
              onChange={handleFileChange}
              className="hidden"
            />

            <div className="text-xs text-gray-500 text-center space-y-1">
              <p>• Formats acceptés : JPEG, PNG, WebP</p>
              <p>• Les images seront automatiquement compressées à moins de 200KB</p>
              <p>• Résolution maximale : 1920px, qualité optimisée à 70%</p>
              {mode === 'create' && (
                <p>• La couverture sera téléversée une fois le livre créé</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Auteurs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label>Auteurs *</Label>
            <AuthorsMultiSelect
              value={watchedAuthors}
              onChange={handleAuthorsChange}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Prix et statut</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price_cfa">Prix (FCFA) *</Label>
              <Input
                id="price_cfa"
                type="number"
                {...register('price_cfa', { required: 'Le prix est requis', min: 0 })}
                className={errors.price_cfa ? 'border-red-500' : ''}
              />
              {errors.price_cfa && (
                <p className="text-sm text-red-500">{errors.price_cfa.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency">Devise *</Label>
              <Select onValueChange={(value) => setValue('currency', value)} defaultValue="XOF">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="XOF">FCFA (XOF)</SelectItem>
                  <SelectItem value="EUR">Euro (EUR)</SelectItem>
                  <SelectItem value="USD">Dollar (USD)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Statut *</Label>
              <Select onValueChange={(value: 'draft' | 'published') => setValue('status', value)} defaultValue="draft">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Brouillon</SelectItem>
                  <SelectItem value="published">Publié</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col space-y-2">
        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? 'Enregistrement...' : mode === 'create' ? 'Créer le livre' : 'Mettre à jour'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="w-full"
        >
          Annuler
        </Button>
      </div>
    </form>
  )
}