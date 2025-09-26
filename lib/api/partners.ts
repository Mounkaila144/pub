import { api } from './axios'
import { tokenStorage } from '@/lib/utils/token'

export interface Partner {
  id: string
  name: string
  slug: string
  description?: string
  website_url?: string
  logo_path?: string
  logo_url?: string
  is_active: boolean
  display_order: number
  created_at: string
  updated_at: string
}

export interface PartnersListParams {
  page?: number
  per_page?: number
  search?: string
  is_active?: boolean
  sort_by?: string
  sort_order?: 'asc' | 'desc'
}

export interface PartnersListResponse {
  data: Partner[]
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

export interface CreatePartnerRequest {
  name: string
  slug?: string
  description?: string
  website_url?: string
  logo?: File
  is_active?: boolean
  display_order?: number
}

export interface UpdatePartnerRequest {
  name?: string
  slug?: string
  description?: string
  website_url?: string
  logo?: File
  is_active?: boolean
  display_order?: number
}

export interface UpdatePartnersOrderRequest {
  partners: Array<{
    id: string
    display_order: number
  }>
}

const ADMIN_PARTNERS_ENDPOINT = '/admin/partners'
const PUBLIC_PARTNERS_ENDPOINT = '/public/partners'

const buildAuthHeaders = (token: string | null) =>
  token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : undefined

const normalizeMeta = (meta: PartnersListResponse['meta']): Required<PartnersListResponse['meta']> => {
  const pagination = meta?.pagination || {}
  return {
    total: meta?.total ?? pagination.total ?? 0,
    per_page: meta?.per_page ?? pagination.per_page ?? 10,
    current_page: meta?.current_page ?? pagination.current_page ?? 1,
    last_page: meta?.last_page ?? pagination.last_page ?? 1,
    pagination,
  }
}

export const partnersApi = {
  // Public endpoints
  list: async (params: PartnersListParams = {}): Promise<PartnersListResponse> => {
    const searchParams = new URLSearchParams()

    if (params.page) searchParams.append('page', params.page.toString())
    if (params.per_page) searchParams.append('per_page', params.per_page.toString())
    if (params.search) searchParams.append('search', params.search)
    if (params.is_active !== undefined) searchParams.append('is_active', params.is_active.toString())
    if (params.sort_by) searchParams.append('sort_by', params.sort_by)
    if (params.sort_order) searchParams.append('sort_order', params.sort_order)

    const queryString = searchParams.toString()
    const url = queryString ? `${PUBLIC_PARTNERS_ENDPOINT}?${queryString}` : PUBLIC_PARTNERS_ENDPOINT

    const response = await api.get<PartnersListResponse>(url)
    const payload = response.data
    return {
      ...payload,
      data: payload.data || [],
      meta: normalizeMeta(payload.meta || {}),
    }
  },

  get: async (id: string): Promise<Partner> => {
    const response = await api.get<Partner>(`${PUBLIC_PARTNERS_ENDPOINT}/${id}`)
    return response.data
  },

  // Admin endpoints
  listAdmin: async (params: PartnersListParams = {}): Promise<PartnersListResponse> => {
    const token = tokenStorage.get()
    const searchParams = new URLSearchParams()

    if (params.page) searchParams.append('page', params.page.toString())
    if (params.per_page) searchParams.append('per_page', params.per_page.toString())
    if (params.search) searchParams.append('search', params.search)
    if (params.is_active !== undefined) searchParams.append('is_active', params.is_active.toString())
    if (params.sort_by) searchParams.append('sort_by', params.sort_by)
    if (params.sort_order) searchParams.append('sort_order', params.sort_order)

    const queryString = searchParams.toString()
    const url = queryString ? `${ADMIN_PARTNERS_ENDPOINT}?${queryString}` : ADMIN_PARTNERS_ENDPOINT

    const response = await api.get<PartnersListResponse>(url, {
      headers: buildAuthHeaders(token),
    })
    const payload = response.data
    return {
      ...payload,
      data: payload.data || [],
      meta: normalizeMeta(payload.meta || {}),
    }
  },

  create: async (data: CreatePartnerRequest | FormData): Promise<Partner> => {
    const token = tokenStorage.get()
    const headers = buildAuthHeaders(token)

    // If data is FormData, don't set Content-Type header (let browser set it)
    const config = data instanceof FormData
      ? { headers: { Authorization: headers?.Authorization } }
      : { headers }

    const response = await api.post<Partner>(ADMIN_PARTNERS_ENDPOINT, data, config)
    return response.data
  },

  update: async (id: string, data: UpdatePartnerRequest | FormData): Promise<Partner> => {
    const token = tokenStorage.get()
    const headers = buildAuthHeaders(token)

    // If data is FormData, don't set Content-Type header (let browser set it)
    const config = data instanceof FormData
      ? { headers: { Authorization: headers?.Authorization } }
      : { headers }

    const response = await api.put<Partner>(`${ADMIN_PARTNERS_ENDPOINT}/${id}`, data, config)
    return response.data
  },

  delete: async (id: string): Promise<void> => {
    const token = tokenStorage.get()
    await api.delete(`${ADMIN_PARTNERS_ENDPOINT}/${id}`, {
      headers: buildAuthHeaders(token),
    })
  },

  getAdmin: async (id: string): Promise<Partner> => {
    const token = tokenStorage.get()
    const response = await api.get<Partner>(`${ADMIN_PARTNERS_ENDPOINT}/${id}`, {
      headers: buildAuthHeaders(token),
    })
    return response.data
  },

  toggleActive: async (id: string): Promise<Partner> => {
    const token = tokenStorage.get()
    const response = await api.patch<Partner>(`${ADMIN_PARTNERS_ENDPOINT}/${id}/toggle-active`, {}, {
      headers: buildAuthHeaders(token),
    })
    return response.data
  },

  updateOrder: async (data: UpdatePartnersOrderRequest): Promise<void> => {
    const token = tokenStorage.get()
    await api.post(`${ADMIN_PARTNERS_ENDPOINT}/update-order`, data, {
      headers: buildAuthHeaders(token),
    })
  },
}