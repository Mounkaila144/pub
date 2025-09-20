import { useMutation } from '@tanstack/react-query'
import { authApi, LoginRequest, LoginResponse } from '@/lib/api/auth'

export function useLogin() {
  return useMutation<LoginResponse, Error, LoginRequest>({
    mutationFn: authApi.login,
  })
}