import { api } from './axios'
import { tokenStorage } from '@/lib/utils/token'

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  access_token: string
  user: {
    id: string
    email: string
    name: string
  }
}

export interface User {
  id: string
  email: string
  name: string
}

export const authApi = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/auth/login', credentials)
    tokenStorage.set(response.data.access_token)
    return response.data
  },

  refresh: async (): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/auth/refresh')
    tokenStorage.set(response.data.access_token)
    return response.data
  },

  me: async (): Promise<User> => {
    const token = tokenStorage.get()
    const response = await api.get<User>('/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data
  },

  logout: async (): Promise<void> => {
    const token = tokenStorage.get()
    try {
      await api.post('/auth/logout', {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
    } finally {
      tokenStorage.remove()
    }
  },
}