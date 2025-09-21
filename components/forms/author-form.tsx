'use client'

import { useState, useRef, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { Author } from '@/lib/api/authors'
import { useCreateAuthor, useUpdateAuthor, useUploadAuthorPhoto, useDeleteAuthorPhoto } from '@/lib/hooks/use-authors'
import { authorFormSchema, AuthorFormData } from '@/lib/validations/author'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Upload, Trash2 } from 'lucide-react'

interface AuthorFormProps {
  author?: Author
  mode: 'create' | 'edit'
}

export function AuthorForm({ author, mode }: AuthorFormProps) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(author?.photo_url || null)
  const previewObjectUrlRef = useRef<string | null>(null)
  const [pendingPhoto, setPendingPhoto] = useState<File | null>(null)

  const { mutate: createAuthor, isPending: isCreating, error: createError } = useCreateAuthor()
  const { mutate: updateAuthor, isPending: isUpdating, error: updateError } = useUpdateAuthor()
  const { mutate: uploadPhoto, isPending: isUploading } = useUploadAuthorPhoto()
  const { mutate: deletePhoto, isPending: isDeleting } = useDeleteAuthorPhoto()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<AuthorFormData>({
    resolver: zodResolver(authorFormSchema),
    defaultValues: {
      first_name: author?.first_name || '',
      last_name: author?.last_name || '',
      bio: author?.bio || '',
      website_url: author?.website_url || '',
      socials: {
        twitter: author?.socials?.twitter || '',
        facebook: author?.socials?.facebook || '',
        instagram: author?.socials?.instagram || '',
        linkedin: author?.socials?.linkedin || '',
      },
      is_active: author?.is_active ?? true,
    },
  })

  const isActive = watch('is_active')
  const isPending = isCreating || isUpdating

  useEffect(() => {
    return () => {
      if (previewObjectUrlRef.current) {
        URL.revokeObjectURL(previewObjectUrlRef.current)
        previewObjectUrlRef.current = null
      }
    }
  }, [])

  const onSubmit = (data: AuthorFormData) => {
    if (mode === 'create') {
      createAuthor(data, {
        onSuccess: (newAuthor) => {
          const redirectTo = `/admin/auteurs/edit?id=${newAuthor.id}`

          if (pendingPhoto) {
            uploadPhoto(
              { id: newAuthor.id, file: pendingPhoto },
              {
                onSuccess: (updatedAuthor) => {
                  if (previewObjectUrlRef.current) {
                    URL.revokeObjectURL(previewObjectUrlRef.current)
                    previewObjectUrlRef.current = null
                  }
                  setPendingPhoto(null)
                  setPreviewUrl(updatedAuthor.photo_url || null)
                  router.push(redirectTo)
                },
                onError: () => {
                  if (previewObjectUrlRef.current) {
                    URL.revokeObjectURL(previewObjectUrlRef.current)
                    previewObjectUrlRef.current = null
                  }
                  setPendingPhoto(null)
                  router.push(redirectTo)
                },
              }
            )
          } else {
            router.push(redirectTo)
          }
        },
      })
    } else if (author) {
      updateAuthor({ id: author.id, data }, {
        onSuccess: () => {
          router.push('/admin/auteurs')
        },
      })
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (previewObjectUrlRef.current) {
      URL.revokeObjectURL(previewObjectUrlRef.current)
      previewObjectUrlRef.current = null
    }

    const objectUrl = URL.createObjectURL(file)
    previewObjectUrlRef.current = objectUrl
    setPreviewUrl(objectUrl)

    if (mode === 'edit' && author) {
      uploadPhoto({ id: author.id, file }, {
        onSuccess: (updatedAuthor) => {
          if (previewObjectUrlRef.current) {
            URL.revokeObjectURL(previewObjectUrlRef.current)
            previewObjectUrlRef.current = null
          }
          setPendingPhoto(null)
          setPreviewUrl(updatedAuthor.photo_url || null)
        },
        onError: () => {
          if (previewObjectUrlRef.current) {
            URL.revokeObjectURL(previewObjectUrlRef.current)
            previewObjectUrlRef.current = null
          }
          setPendingPhoto(null)
          setPreviewUrl(author.photo_url || null)
        },
      })
    } else {
      setPendingPhoto(file)
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleDeletePhoto = () => {
    if (mode === 'create') {
      setPendingPhoto(null)
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

    if (author?.photo_url) {
      deletePhoto(author.id, {
        onSuccess: () => {
          setPreviewUrl(null)
        },
      })
    }
  }

  const error = createError || updateError

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>
            {error.message || 'Une erreur est survenue'}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informations générales</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first_name">Prénom *</Label>
                  <Input
                    id="first_name"
                    {...register('first_name')}
                    className={errors.first_name ? 'border-red-500' : ''}
                  />
                  {errors.first_name && (
                    <p className="text-sm text-red-500">{errors.first_name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="last_name">Nom *</Label>
                  <Input
                    id="last_name"
                    {...register('last_name')}
                    className={errors.last_name ? 'border-red-500' : ''}
                  />
                  {errors.last_name && (
                    <p className="text-sm text-red-500">{errors.last_name.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Biographie</Label>
                <Textarea
                  id="bio"
                  rows={4}
                  {...register('bio')}
                  className={errors.bio ? 'border-red-500' : ''}
                />
                {errors.bio && (
                  <p className="text-sm text-red-500">{errors.bio.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="website_url">Site web</Label>
                <Input
                  id="website_url"
                  type="url"
                  placeholder="https://example.com"
                  {...register('website_url')}
                  className={errors.website_url ? 'border-red-500' : ''}
                />
                {errors.website_url && (
                  <p className="text-sm text-red-500">{errors.website_url.message}</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Réseaux sociaux</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="twitter">Twitter</Label>
                  <Input
                    id="twitter"
                    placeholder="@username"
                    {...register('socials.twitter')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="facebook">Facebook</Label>
                  <Input
                    id="facebook"
                    placeholder="facebook.com/username"
                    {...register('socials.facebook')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input
                    id="instagram"
                    placeholder="@username"
                    {...register('socials.instagram')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <Input
                    id="linkedin"
                    placeholder="linkedin.com/in/username"
                    {...register('socials.linkedin')}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Photo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="w-32 h-32">
                  <AvatarImage src={previewUrl || undefined} />
                  <AvatarFallback className="text-2xl">
                    {author?.first_name?.[0]}{author?.last_name?.[0]}
                  </AvatarFallback>
                </Avatar>

                <div className="flex flex-col space-y-2 w-full">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="w-full"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {isUploading ? 'Upload...' : previewUrl ? 'Remplacer' : 'Ajouter'}
                  </Button>

                  {previewUrl && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleDeletePhoto}
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
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {mode === 'create' && (
                  <p className="text-sm text-gray-500 text-center">
                    La photo sera téléversée une fois l&apos;auteur créé
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Statut</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={isActive}
                  onCheckedChange={(checked) => setValue('is_active', checked)}
                />
                <Label htmlFor="is_active">
                  {isActive ? 'Actif' : 'Inactif'}
                </Label>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col space-y-2">
            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? 'Enregistrement...' : mode === 'create' ? 'Créer' : 'Mettre à jour'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/admin/auteurs')}
              className="w-full"
            >
              Annuler
            </Button>
          </div>
        </div>
      </div>
    </form>
  )
}
