import { AuthorForm } from '@/components/forms/author-form'

export default function NewAuthorPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Nouvel auteur</h1>
      <AuthorForm mode="create" />
    </div>
  )
}