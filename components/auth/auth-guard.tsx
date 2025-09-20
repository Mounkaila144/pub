'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthMe } from '@/lib/hooks/use-auth-me'
import { tokenStorage } from '@/lib/utils/token'
import { Skeleton } from '@/components/ui/skeleton'

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter()
  const { data: user, isLoading, error } = useAuthMe()

  useEffect(() => {
    const token = tokenStorage.get()

    if (!token) {
      router.push('/login')
      return
    }

    if (error) {
      tokenStorage.remove()
      router.push('/login')
    }
  }, [error, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="border-b bg-white px-4 py-4">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
        <div className="max-w-7xl mx-auto p-6">
          <div className="space-y-4">
            <Skeleton className="h-8 w-48" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return <>{children}</>
}