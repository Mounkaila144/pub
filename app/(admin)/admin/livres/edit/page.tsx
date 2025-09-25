'use client'

import { useParams, useRouter } from 'next/navigation'
import { useBook } from '@/lib/hooks/use-books'
import { BookForm } from '@/components/forms/book-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export default function EditBookPage() {
  const params = useParams()
  const router = useRouter()
  const bookId = params.id as string

  const { data: book, isLoading } = useBook(bookId)

  const handleCancel = () => {
    router.push('/admin/livres')
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Chargement...</div>
      </div>
    )
  }

  if (!book) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-red-500">Livre non trouvé</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={handleCancel}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour aux livres
        </Button>

        <h1 className="text-3xl font-bold">Modifier le livre</h1>
        <p className="text-gray-600 mt-2">Modifiez les informations du livre</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informations du livre</CardTitle>
        </CardHeader>
        <CardContent>
          <BookForm
            mode="edit"
            book={book}
            onSuccess={() => router.push('/admin/livres')}
            onCancel={() => router.push('/admin/livres')}
          />
        </CardContent>
      </Card>
    </div>
  )
}