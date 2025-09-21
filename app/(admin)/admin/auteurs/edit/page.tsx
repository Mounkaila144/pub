'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { AuthorEditPageClient } from '@/components/admin/author-edit-page-client'

export default function EditAuthorPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const authorId = searchParams.get('id')

  useEffect(() => {
    if (!authorId) {
      router.replace('/admin/auteurs')
    }
  }, [authorId, router])

  if (!authorId) {
    return null
  }

  return <AuthorEditPageClient id={authorId} />
}
