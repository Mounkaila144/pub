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

interface PaginationMeta {
  total?: number
  per_page?: number
  current_page?: number
  last_page?: number
}

export interface ListMeta {
  total?: number
  per_page?: number
  current_page?: number
  last_page?: number
  pagination?: PaginationMeta
}

export interface PaginatedListResponse {
  data: any[]
  meta: ListMeta
}

const extractTotal = (meta: ListMeta | undefined): number => {
  if (!meta) return 0
  if (typeof meta.total === 'number') {
    return meta.total
  }
  if (meta.pagination && typeof meta.pagination.total === 'number') {
    return meta.pagination.total
  }
  return 0
}

const withAuthorization = (token: string | null) =>
  token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : undefined

const fetchWithFallback = async (
  paths: string[],
  token: string | null
): Promise<PaginatedListResponse> => {
  let lastError: unknown

  for (const path of paths) {
    try {
      const headers = path.startsWith('/public') ? undefined : withAuthorization(token)
      const response = await api.get<PaginatedListResponse>(path, {
        headers,
      })
      return response.data
    } catch (error) {
      lastError = error
      continue
    }
  }

  throw lastError ?? new Error('Unable to fetch fallback data')
}

export const statsApi = {
  getStats: async (): Promise<StatsResponse> => {
    const token = tokenStorage.get()
    try {
      const response = await api.get<StatsResponse>('/stats', {
        headers: withAuthorization(token),
      })
      return response.data
    } catch (error) {
      const [authorsResponse, booksResponse, draftBooksResponse, publishedBooksResponse] = await Promise.all([
        fetchWithFallback([
          '/admin/authors?per_page=1',
          '/authors?per_page=1',
          '/public/authors?per_page=1',
        ], token),
        fetchWithFallback([
          '/admin/books?per_page=1',
          '/books?per_page=1',
          '/public/books?per_page=1',
        ], token),
        fetchWithFallback([
          '/admin/books?per_page=1&status=draft',
          '/books?per_page=1&status=draft',
          '/public/books?per_page=1&status=draft',
        ], token),
        fetchWithFallback([
          '/admin/books?per_page=1&status=published',
          '/books?per_page=1&status=published',
          '/public/books?per_page=1&status=published',
        ], token),
      ])

      return {
        total_authors: extractTotal(authorsResponse.meta),
        total_books: extractTotal(booksResponse.meta),
        books_by_status: {
          draft: extractTotal(draftBooksResponse.meta),
          published: extractTotal(publishedBooksResponse.meta),
        },
      }
    }
  },
}
