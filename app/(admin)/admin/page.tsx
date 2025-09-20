import { StatsCards } from '@/components/admin/stats-cards'

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <StatsCards />
    </div>
  )
}