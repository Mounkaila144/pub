import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { booksApi, publicBooksApi, BooksListParams, BooksListResponse, Book, CreateBookRequest, UpdateBookRequest } from '@/lib/api/books'
import { toast } from 'sonner'

export function useBooksList(params: BooksListParams = {}) {
  return useQuery<BooksListResponse, Error>({
    queryKey: ['books', 'list', params],
    queryFn: () => booksApi.list(params),
    staleTime: 1000 * 60 * 5,
  })
}

export function useCreateBook() {
  const queryClient = useQueryClient()

  return useMutation<Book, Error, CreateBookRequest>({
    mutationFn: booksApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] })
      queryClient.invalidateQueries({ queryKey: ['stats'] })
      toast.success('Livre créé avec succès')
    },
    onError: (error) => {
      toast.error('Erreur lors de la création du livre')
    },
  })
}

export function useUpdateBook() {
  const queryClient = useQueryClient()

  return useMutation<Book, Error, { id: string; data: UpdateBookRequest }>({
    mutationFn: ({ id, data }) => booksApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] })
      toast.success('Livre modifié avec succès')
    },
    onError: (error) => {
      toast.error('Erreur lors de la modification du livre')
    },
  })
}

export function useDeleteBook() {
  const queryClient = useQueryClient()

  return useMutation<void, Error, string>({
    mutationFn: booksApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] })
      queryClient.invalidateQueries({ queryKey: ['stats'] })
      toast.success('Livre supprimé avec succès')
    },
    onError: (error) => {
      toast.error('Erreur lors de la suppression du livre')
    },
  })
}

export function useUploadBookCover() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, file }: { id: string; file: File }) => booksApi.uploadCover(id, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] })
      toast.success('Couverture téléversée avec succès')
    },
    onError: (error) => {
      toast.error('Erreur lors du téléversement de la couverture')
    },
  })
}

export function useDeleteBookCover() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => booksApi.deleteCover(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] })
      toast.success('Couverture supprimée avec succès')
    },
    onError: (error) => {
      toast.error('Erreur lors de la suppression de la couverture')
    },
  })
}

export function useBook(id: string) {
  return useQuery<Book, Error>({
    queryKey: ['books', id],
    queryFn: () => booksApi.get(id),
    enabled: !!id,
  })
}

// Public hooks (no authentication required)
export function usePublicBooksList(params: BooksListParams = {}) {
  return useQuery<BooksListResponse, Error>({
    queryKey: ['public', 'books', 'list', params],
    queryFn: () => publicBooksApi.list(params),
    staleTime: 1000 * 60 * 5,
  })
}

export function usePublicBook(slugOrId: string) {
  return useQuery<Book, Error>({
    queryKey: ['public', 'books', slugOrId],
    queryFn: () => publicBooksApi.get(slugOrId),
    enabled: !!slugOrId,
  })
}