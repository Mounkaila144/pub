'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { AuthorEditPageClient } from '@/components/admin/author-edit-page-client'

export default function EditAuthorPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [authorId, setAuthorId] = useState<string | null>(null)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const id = searchParams.get('id')
    setAuthorId(id)
    setIsReady(true)
  }, [searchParams])

  useEffect(() => {
    if (!isReady) return
    if (!authorId) {
      router.replace('/admin/auteurs')
    }
  }, [authorId, isReady, router])

  if (!isReady || !authorId) {
    return null
  }

  return <AuthorEditPageClient id={authorId} />
}
