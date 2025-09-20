import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function BooksPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Livres</h1>

      <Card>
        <CardHeader>
          <CardTitle>Gestion des livres</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Interface de gestion des livres à venir...
          </p>
        </CardContent>
      </Card>
    </div>
  )
}