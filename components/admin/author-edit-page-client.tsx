'use client'

import { useAuthor } from '@/lib/hooks/use-authors'
import { AuthorForm } from '@/components/forms/author-form'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface AuthorEditPageClientProps {
  id: string
}

export function AuthorEditPageClient({ id }: AuthorEditPageClientProps) {
  const { data: author, isLoading, error } = useAuthor(id)

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-9 w-48" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-64" />
            <Skeleton className="h-48" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-64" />
            <Skeleton className="h-32" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !author) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Modifier l&apos;auteur</h1>
        <Alert variant="destructive">
          <AlertDescription>
            Erreur lors du chargement de l&apos;auteur
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Modifier l&apos;auteur</h1>
      <AuthorForm author={author} mode="edit" />
    </div>
  )
}
