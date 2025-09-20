import { useQuery } from '@tanstack/react-query'
import { authApi, User } from '@/lib/api/auth'
import { tokenStorage } from '@/lib/utils/token'

export function useAuthMe() {
  return useQuery<User, Error>({
    queryKey: ['auth', 'me'],
    queryFn: authApi.me,
    enabled: !!tokenStorage.get(),
    retry: false,
  })
}