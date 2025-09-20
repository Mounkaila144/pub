'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useLogout } from '@/lib/hooks/use-logout'
import { useAuthMe } from '@/lib/hooks/use-auth-me'
import { Button } from '@/components/ui/button'
import { LogOut, Book, Users, BarChart3 } from 'lucide-react'

export function AdminHeader() {
  const router = useRouter()
  const { data: user } = useAuthMe()
  const { mutate: logout, isPending } = useLogout()

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        router.push('/login')
      },
    })
  }

  return (
    <header className="border-b bg-white">
      <div className="flex items-center justify-between px-4 py-4 max-w-7xl mx-auto">
        <div className="flex items-center space-x-8">
          <Link href="/admin" className="text-xl font-bold text-gray-900">
            Admin
          </Link>
          <nav className="flex items-center space-x-6">
            <Link
              href="/admin"
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <BarChart3 className="h-4 w-4" />
              <span>Dashboard</span>
            </Link>
            <Link
              href="/admin/auteurs"
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <Users className="h-4 w-4" />
              <span>Auteurs</span>
            </Link>
            <Link
              href="/admin/livres"
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <Book className="h-4 w-4" />
              <span>Livres</span>
            </Link>
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">
            Bonjour, {user?.name}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            disabled={isPending}
            className="flex items-center space-x-2"
          >
            <LogOut className="h-4 w-4" />
            <span>{isPending ? 'Déconnexion...' : 'Se déconnecter'}</span>
          </Button>
        </div>
      </div>
    </header>
  )
}