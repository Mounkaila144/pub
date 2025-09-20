import { api } from './axios'
import { tokenStorage } from '@/lib/utils/token'

export interface AuthorSocialLinks {
  twitter?: string
  facebook?: string
  instagram?: string
  linkedin?: string
  [key: string]: string | undefined
}

export interface Author {
  id: string
  first_name: string
  last_name: string
  full_name?: string
  email?: string
  bio?: string
  website_url?: string
  socials?: AuthorSocialLinks
  photo_url?: string | null
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

export interface CreateAuthorRequest {
  first_name: string
  last_name: string
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

const ADMIN_AUTHORS_ENDPOINT = '/admin/authors'

const buildAuthHeaders = (token: string | null) =>
  token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : undefined

const normalizeMeta = (meta: AuthorsListResponse['meta']): Required<AuthorsListResponse['meta']> => {
  const pagination = meta?.pagination || {}
  return {
    total: meta?.total ?? pagination.total ?? 0,
    per_page: meta?.per_page ?? pagination.per_page ?? 10,
    current_page: meta?.current_page ?? pagination.current_page ?? 1,
    last_page: meta?.last_page ?? pagination.last_page ?? 1,
    pagination,
  }
}

const normalizeAuthor = (author: any): Author => {
  const rawSocials = author?.socials
  let socials: AuthorSocialLinks | undefined

  if (Array.isArray(rawSocials)) {
    socials = rawSocials.reduce<AuthorSocialLinks>((acc, item) => {
      if (item && typeof item.platform === 'string' && typeof item.url === 'string') {
        acc[item.platform] = item.url
      }
      return acc
    }, {})
  } else if (rawSocials && typeof rawSocials === 'object') {
    socials = { ...rawSocials }
  }

  return {
    ...author,
    socials,
  }
}

const serializeSocials = (socials?: AuthorSocialLinks) => {
  if (!socials) return undefined

  const entries = Object.entries(socials).filter(([, url]) => typeof url === 'string' && url.trim().length > 0)
  if (entries.length === 0) return undefined

  return entries.map(([platform, url]) => ({
    platform,
    url: (url as string).trim(),
  }))
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

    const queryString = searchParams.toString()
    const url = queryString ? `${ADMIN_AUTHORS_ENDPOINT}?${queryString}` : ADMIN_AUTHORS_ENDPOINT

    const response = await api.get<AuthorsListResponse>(url, {
      headers: buildAuthHeaders(token),
    })
    const payload = response.data
    const authors = Array.isArray(payload.data) ? payload.data.map(normalizeAuthor) : []
    return {
      ...payload,
      data: authors,
      meta: normalizeMeta(payload.meta || {}),
    }
  },

  create: async (data: CreateAuthorRequest): Promise<Author> => {
    const token = tokenStorage.get()
    const payload = {
      ...data,
      socials: serializeSocials(data.socials),
    }

    const response = await api.post<Author>(ADMIN_AUTHORS_ENDPOINT, payload, {
      headers: buildAuthHeaders(token),
    })
    return normalizeAuthor(response.data)
  },

  update: async (id: string, data: UpdateAuthorRequest): Promise<Author> => {
    const token = tokenStorage.get()
    const payload = {
      ...data,
      socials: serializeSocials(data.socials),
    }

    const response = await api.patch<Author>(`${ADMIN_AUTHORS_ENDPOINT}/${id}`, payload, {
      headers: buildAuthHeaders(token),
    })
    return normalizeAuthor(response.data)
  },

  delete: async (id: string): Promise<void> => {
    const token = tokenStorage.get()
    await api.delete(`${ADMIN_AUTHORS_ENDPOINT}/${id}`, {
      headers: buildAuthHeaders(token),
    })
  },

  toggleActive: async (id: string, is_active: boolean): Promise<Author> => {
    const token = tokenStorage.get()
    const response = await api.patch<Author>(
      `${ADMIN_AUTHORS_ENDPOINT}/${id}`,
      { is_active },
      {
        headers: buildAuthHeaders(token),
      }
    )
    return normalizeAuthor(response.data)
  },

  get: async (id: string): Promise<Author> => {
    const token = tokenStorage.get()
    const response = await api.get<Author>(`${ADMIN_AUTHORS_ENDPOINT}/${id}`, {
      headers: buildAuthHeaders(token),
    })
    return normalizeAuthor(response.data)
  },

  uploadPhoto: async (id: string, file: File): Promise<Author> => {
    const token = tokenStorage.get()
    const formData = new FormData()
    formData.append('photo', file)

    const response = await api.post<Author>(`${ADMIN_AUTHORS_ENDPOINT}/${id}/photo`, formData, {
      headers: {
        ...buildAuthHeaders(token),
        'Content-Type': 'multipart/form-data',
      },
    })
    return normalizeAuthor(response.data)
  },

  deletePhoto: async (id: string): Promise<Author> => {
    const token = tokenStorage.get()
    const response = await api.delete<Author>(`${ADMIN_AUTHORS_ENDPOINT}/${id}/photo`, {
      headers: buildAuthHeaders(token),
    })
    return normalizeAuthor(response.data)
  },
}
