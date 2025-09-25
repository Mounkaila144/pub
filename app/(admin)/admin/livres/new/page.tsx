'use client'

import { useRouter } from 'next/navigation'
import { BookForm } from '@/components/forms/book-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export default function NewBookPage() {
  const router = useRouter()

  const handleCancel = () => {
    router.push('/admin/livres')
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

        <h1 className="text-3xl font-bold">Nouveau livre</h1>
        <p className="text-gray-600 mt-2">Créez un nouveau livre dans votre catalogue</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informations du livre</CardTitle>
        </CardHeader>
        <CardContent>
          <BookForm
            mode="create"
            onSuccess={() => router.push('/admin/livres')}
            onCancel={() => router.push('/admin/livres')}
          />
        </CardContent>
      </Card>
    </div>
  )
}