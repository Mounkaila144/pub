import { useMutation, useQueryClient } from '@tanstack/react-query'
import { authApi } from '@/lib/api/auth'

export function useLogout() {
  const queryClient = useQueryClient()

  return useMutation<void, Error>({
    mutationFn: authApi.logout,
    onSuccess: () => {
      queryClient.clear()
    },
  })
}