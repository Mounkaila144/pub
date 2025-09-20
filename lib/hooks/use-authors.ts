import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { authorsApi, AuthorsListParams, AuthorsListResponse, Author, CreateAuthorRequest, UpdateAuthorRequest } from '@/lib/api/authors'
import { toast } from 'sonner'

export function useAuthorsList(params: AuthorsListParams = {}) {
  return useQuery<AuthorsListResponse, Error>({
    queryKey: ['authors', 'list', params],
    queryFn: () => authorsApi.list(params),
    staleTime: 1000 * 60 * 5,
  })
}

export function useCreateAuthor() {
  const queryClient = useQueryClient()

  return useMutation<Author, Error, CreateAuthorRequest>({
    mutationFn: authorsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['authors'] })
      queryClient.invalidateQueries({ queryKey: ['stats'] })
      toast.success('Auteur créé avec succès')
    },
    onError: (error) => {
      toast.error('Erreur lors de la création de l\'auteur')
    },
  })
}

export function useUpdateAuthor() {
  const queryClient = useQueryClient()

  return useMutation<Author, Error, { id: string; data: UpdateAuthorRequest }>({
    mutationFn: ({ id, data }) => authorsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['authors'] })
      toast.success('Auteur modifié avec succès')
    },
    onError: (error) => {
      toast.error('Erreur lors de la modification de l\'auteur')
    },
  })
}

export function useDeleteAuthor() {
  const queryClient = useQueryClient()

  return useMutation<void, Error, string>({
    mutationFn: authorsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['authors'] })
      queryClient.invalidateQueries({ queryKey: ['stats'] })
      toast.success('Auteur supprimé avec succès')
    },
    onError: (error) => {
      toast.error('Erreur lors de la suppression de l\'auteur')
    },
  })
}

export function useToggleAuthorActive() {
  const queryClient = useQueryClient()

  return useMutation<Author, Error, { id: string; is_active: boolean }>({
    mutationFn: ({ id, is_active }) => authorsApi.toggleActive(id, is_active),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['authors'] })
      toast.success(`Auteur ${data.is_active ? 'activé' : 'désactivé'} avec succès`)
    },
    onError: (error) => {
      toast.error('Erreur lors de la modification du statut')
    },
  })
}

export function useAuthor(id: string) {
  return useQuery<Author, Error>({
    queryKey: ['authors', id],
    queryFn: () => authorsApi.get(id),
    enabled: !!id,
  })
}

export function useUploadAuthorPhoto() {
  const queryClient = useQueryClient()

  return useMutation<Author, Error, { id: string; file: File }>({
    mutationFn: ({ id, file }) => authorsApi.uploadPhoto(id, file),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['authors', data.id] })
      queryClient.invalidateQueries({ queryKey: ['authors'] })
      toast.success('Photo mise à jour avec succès')
    },
    onError: (error) => {
      toast.error('Erreur lors de l\'upload de la photo')
    },
  })
}

export function useDeleteAuthorPhoto() {
  const queryClient = useQueryClient()

  return useMutation<Author, Error, string>({
    mutationFn: authorsApi.deletePhoto,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['authors', data.id] })
      queryClient.invalidateQueries({ queryKey: ['authors'] })
      toast.success('Photo supprimée avec succès')
    },
    onError: (error) => {
      toast.error('Erreur lors de la suppression de la photo')
    },
  })
}