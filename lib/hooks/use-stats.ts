import { useQuery } from '@tanstack/react-query'
import { statsApi, StatsResponse } from '@/lib/api/stats'

export function useStats() {
  return useQuery<StatsResponse, Error>({
    queryKey: ['stats'],
    queryFn: statsApi.getStats,
    staleTime: 1000 * 60 * 5,
  })
}