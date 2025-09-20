import { AuthGuard } from '@/components/auth/auth-guard'
import { AdminHeader } from '@/components/admin/admin-header'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        <AdminHeader />
        <main className="max-w-7xl mx-auto py-6 px-4">
          {children}
        </main>
      </div>
    </AuthGuard>
  )
}