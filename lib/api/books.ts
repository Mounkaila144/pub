import { api } from './axios'
import { tokenStorage } from '@/lib/utils/token'

export interface Book {
  id: string
  title: string
  subtitle?: string
  slug: string
  isbn_10?: string
  isbn_13?: string
  synopsis?: string
  language: string
  publication_date: string
  pages: number
  status: 'draft' | 'published'
  cover_path?: string
  price_cfa: number
  currency: string
  cover_url?: string
  authors: Array<{
    id: string
    first_name: string
    last_name: string
    contribution_role: string
    contribution_order: number
  }>
  created_at: string
  updated_at: string
}

export interface BooksListParams {
  page?: number
  per_page?: number
  search?: string
  status?: string
  language?: string
  author_id?: string
  year?: string
  sort_by?: string
  sort_order?: 'asc' | 'desc'
}

export interface BooksListResponse {
  data: Book[]
  meta: {
    total?: number
    per_page?: number
    current_page?: number
    last_page?: number
    pagination?: {
      total?: number
      per_page?: number
      current_page?: number
      last_page?: number
      [key: string]: number | null | undefined
    }
    [key: string]: any
  }
}

export interface CreateBookRequest {
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
  authors: Array<{
    id: string
    contribution_role?: string
    contribution_order?: number
  }>
}

export interface UpdateBookRequest {
  title?: string
  subtitle?: string
  isbn_10?: string
  isbn_13?: string
  synopsis?: string
  language?: string
  publication_date?: string
  pages?: number
  status?: 'draft' | 'published'
  price_cfa?: number
  currency?: string
  authors?: Array<{
    id: string
    contribution_role?: string
    contribution_order?: number
  }>
}

const ADMIN_BOOKS_ENDPOINT = '/admin/books'
const PUBLIC_BOOKS_ENDPOINT = '/books'

const buildAuthHeaders = (token: string | null) =>
  token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : undefined

const normalizeMeta = (meta: BooksListResponse['meta']): Required<BooksListResponse['meta']> => {
  const pagination = meta?.pagination || {}
  return {
    total: meta?.total ?? pagination.total ?? 0,
    per_page: meta?.per_page ?? pagination.per_page ?? 10,
    current_page: meta?.current_page ?? pagination.current_page ?? 1,
    last_page: meta?.last_page ?? pagination.last_page ?? 1,
    pagination,
  }
}

export const booksApi = {
  list: async (params: BooksListParams = {}): Promise<BooksListResponse> => {
    const token = tokenStorage.get()
    const searchParams = new URLSearchParams()

    if (params.page) searchParams.append('page', params.page.toString())
    if (params.per_page) searchParams.append('per_page', params.per_page.toString())
    if (params.search) searchParams.append('search', params.search)
    if (params.status) searchParams.append('status', params.status)
    if (params.language) searchParams.append('language', params.language)
    if (params.author_id) searchParams.append('author_id', params.author_id)
    if (params.year) searchParams.append('year', params.year)
    if (params.sort_by) searchParams.append('sort_by', params.sort_by)
    if (params.sort_order) searchParams.append('sort_order', params.sort_order)

    const queryString = searchParams.toString()
    const url = queryString ? `${ADMIN_BOOKS_ENDPOINT}?${queryString}` : ADMIN_BOOKS_ENDPOINT

    const response = await api.get<BooksListResponse>(url, {
      headers: buildAuthHeaders(token),
    })
    const payload = response.data
    return {
      ...payload,
      data: payload.data || [],
      meta: normalizeMeta(payload.meta || {}),
    }
  },

  create: async (data: CreateBookRequest | FormData): Promise<Book> => {
    const token = tokenStorage.get()
    const headers = buildAuthHeaders(token)

    // If data is FormData, don't set Content-Type header (let browser set it)
    const config = data instanceof FormData
      ? { headers: { Authorization: headers?.Authorization } }
      : { headers }

    const response = await api.post<Book>(ADMIN_BOOKS_ENDPOINT, data, config)
    return response.data
  },

  update: async (id: string, data: UpdateBookRequest | FormData): Promise<Book> => {
    const token = tokenStorage.get()
    const headers = buildAuthHeaders(token)

    // If data is FormData, don't set Content-Type header (let browser set it)
    const config = data instanceof FormData
      ? { headers: { Authorization: headers?.Authorization } }
      : { headers }

    const response = await api.put<Book>(`${ADMIN_BOOKS_ENDPOINT}/${id}`, data, config)
    return response.data
  },

  delete: async (id: string): Promise<void> => {
    const token = tokenStorage.get()
    await api.delete(`${ADMIN_BOOKS_ENDPOINT}/${id}`, {
      headers: buildAuthHeaders(token),
    })
  },

  get: async (id: string): Promise<Book> => {
    const token = tokenStorage.get()
    const response = await api.get<Book>(`${ADMIN_BOOKS_ENDPOINT}/${id}`, {
      headers: buildAuthHeaders(token),
    })
    return response.data
  },

  uploadCover: async (id: string, file: File): Promise<Book> => {
    const token = tokenStorage.get()
    const formData = new FormData()
    formData.append('cover', file)

    const response = await api.post<Book>(`${ADMIN_BOOKS_ENDPOINT}/${id}/cover`, formData, {
      headers: {
        ...buildAuthHeaders(token),
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  deleteCover: async (id: string): Promise<Book> => {
    const token = tokenStorage.get()
    const response = await api.delete<Book>(`${ADMIN_BOOKS_ENDPOINT}/${id}/cover`, {
      headers: buildAuthHeaders(token),
    })
    return response.data
  },
}

// Public API endpoints (no authentication required)
export const publicBooksApi = {
  list: async (params: BooksListParams = {}): Promise<BooksListResponse> => {
    const searchParams = new URLSearchParams()

    if (params.page) searchParams.append('page', params.page.toString())
    if (params.per_page) searchParams.append('per_page', params.per_page.toString())
    if (params.search) searchParams.append('search', params.search)
    if (params.status) searchParams.append('status', params.status)
    if (params.language) searchParams.append('language', params.language)
    if (params.author_id) searchParams.append('author_id', params.author_id)
    if (params.year) searchParams.append('year', params.year)
    if (params.sort_by) searchParams.append('sort_by', params.sort_by)
    if (params.sort_order) searchParams.append('sort_order', params.sort_order)

    const queryString = searchParams.toString()
    const url = queryString ? `${PUBLIC_BOOKS_ENDPOINT}?${queryString}` : PUBLIC_BOOKS_ENDPOINT

    const response = await api.get<BooksListResponse>(url)
    const payload = response.data
    return {
      ...payload,
      data: payload.data || [],
      meta: normalizeMeta(payload.meta || {}),
    }
  },

  get: async (slugOrId: string): Promise<Book> => {
    const response = await api.get<Book>(`${PUBLIC_BOOKS_ENDPOINT}/${slugOrId}`)
    return response.data
  },
}