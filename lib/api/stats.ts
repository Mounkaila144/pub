import { api } from './axios'
import { tokenStorage } from '@/lib/utils/token'

export interface StatsResponse {
  total_authors: number
  total_books: number
  books_by_status: {
    draft: number
    published: number
  }
}

export interface ListMeta {
  total: number
  per_page: number
  current_page: number
  last_page: number
}

export interface AuthorsListResponse {
  data: any[]
  meta: ListMeta
}

export interface BooksListResponse {
  data: any[]
  meta: ListMeta
}

export const statsApi = {
  getStats: async (): Promise<StatsResponse> => {
    const token = tokenStorage.get()
    try {
      const response = await api.get<StatsResponse>('/stats', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return response.data
    } catch (error) {
      const [authorsResponse, booksResponse, draftBooksResponse, publishedBooksResponse] = await Promise.all([
        api.get<AuthorsListResponse>('/authors?per_page=1', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        api.get<BooksListResponse>('/books?per_page=1', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        api.get<BooksListResponse>('/books?per_page=1&status=draft', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        api.get<BooksListResponse>('/books?per_page=1&status=published', {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ])

      return {
        total_authors: authorsResponse.data.meta.total,
        total_books: booksResponse.data.meta.total,
        books_by_status: {
          draft: draftBooksResponse.data.meta.total,
          published: publishedBooksResponse.data.meta.total,
        },
      }
    }
  },
}