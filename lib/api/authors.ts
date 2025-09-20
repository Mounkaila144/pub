import { api } from './axios'
import { tokenStorage } from '@/lib/utils/token'

export interface Author {
  id: string
  first_name: string
  last_name: string
  email: string
  bio: string
  website_url: string
  socials: {
    twitter?: string
    facebook?: string
    instagram?: string
    linkedin?: string
  }
  photo_url?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface AuthorsListParams {
  page?: number
  per_page?: number
  search?: string
  is_active?: boolean
  sort_by?: string
  sort_order?: 'asc' | 'desc'
}

export interface AuthorsListResponse {
  data: Author[]
  meta: {
    total: number
    per_page: number
    current_page: number
    last_page: number
  }
}

export interface CreateAuthorRequest {
  first_name: string
  last_name: string
  email: string
  bio?: string
  website_url?: string
  socials?: {
    twitter?: string
    facebook?: string
    instagram?: string
    linkedin?: string
  }
  is_active?: boolean
}

export interface UpdateAuthorRequest {
  first_name?: string
  last_name?: string
  email?: string
  bio?: string
  website_url?: string
  socials?: {
    twitter?: string
    facebook?: string
    instagram?: string
    linkedin?: string
  }
  is_active?: boolean
}

export const authorsApi = {
  list: async (params: AuthorsListParams = {}): Promise<AuthorsListResponse> => {
    const token = tokenStorage.get()
    const searchParams = new URLSearchParams()

    if (params.page) searchParams.append('page', params.page.toString())
    if (params.per_page) searchParams.append('per_page', params.per_page.toString())
    if (params.search) searchParams.append('search', params.search)
    if (params.is_active !== undefined) searchParams.append('is_active', params.is_active.toString())
    if (params.sort_by) searchParams.append('sort_by', params.sort_by)
    if (params.sort_order) searchParams.append('sort_order', params.sort_order)

    const response = await api.get<AuthorsListResponse>(`/authors?${searchParams.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data
  },

  create: async (data: CreateAuthorRequest): Promise<Author> => {
    const token = tokenStorage.get()
    const response = await api.post<Author>('/authors', data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data
  },

  update: async (id: string, data: UpdateAuthorRequest): Promise<Author> => {
    const token = tokenStorage.get()
    const response = await api.patch<Author>(`/authors/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data
  },

  delete: async (id: string): Promise<void> => {
    const token = tokenStorage.get()
    await api.delete(`/authors/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  },

  toggleActive: async (id: string, is_active: boolean): Promise<Author> => {
    const token = tokenStorage.get()
    const response = await api.patch<Author>(`/authors/${id}`, { is_active }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data
  },

  get: async (id: string): Promise<Author> => {
    const token = tokenStorage.get()
    const response = await api.get<Author>(`/authors/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data
  },

  uploadPhoto: async (id: string, file: File): Promise<Author> => {
    const token = tokenStorage.get()
    const formData = new FormData()
    formData.append('photo', file)

    const response = await api.post<Author>(`/authors/${id}/photo`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  deletePhoto: async (id: string): Promise<Author> => {
    const token = tokenStorage.get()
    const response = await api.delete<Author>(`/authors/${id}/photo`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data
  },
}