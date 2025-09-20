import { AuthorEditPageClient } from '@/components/admin/author-edit-page-client'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export function generateStaticParams() {
  return []
}

interface EditAuthorPageProps {
  params: { id: string }
}

export default function EditAuthorPage({ params }: EditAuthorPageProps) {
  return <AuthorEditPageClient id={params.id} />
}
