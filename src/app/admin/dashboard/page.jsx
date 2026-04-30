import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import {
  CalendarDaysIcon,
  PlayCircleIcon,
  UserGroupIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline'

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')

  // Compteurs en parallèle
  const [eventsCount, sessionsCount, speakersCount] = await Promise.all([
    prisma.event.count(),
    prisma.session.count(),
    prisma.speaker.count(),
  ])

  const stats = [
    { label: 'Événements', count: eventsCount, href: '/admin/events', icon: CalendarDaysIcon, color: 'blue' },
    { label: 'Sessions', count: sessionsCount, href: '/admin/sessions', icon: PlayCircleIcon, color: 'indigo' },
    { label: 'Intervenants', count: speakersCount, href: '/admin/speakers', icon: UserGroupIcon, color: 'violet' },
  ]

  const colorMap = {
    blue: 'bg-blue-100 text-blue-700',
    indigo: 'bg-indigo-100 text-indigo-700',
    violet: 'bg-violet-100 text-violet-700',
  }

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <ChartBarIcon className="w-8 h-8 text-blue-600" />
          Tableau de bord
        </h1>
        <p className="text-gray-500 mt-1">Bienvenue, <span className="font-medium text-gray-700">{session.user.email}</span></p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        {stats.map(({ label, count, href, icon: Icon, color }) => (
          <Link key={href} href={href}>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition group">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-500">{label}</span>
                <div className={`p-2 rounded-lg ${colorMap[color]}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900">{count}</p>
              <p className="text-xs text-blue-600 mt-2 group-hover:underline">Gérer →</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Actions rapides */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">Actions rapides</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/events/new" className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg transition font-medium">
            + Nouvel événement
          </Link>
          <Link href="/admin/sessions/new" className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-4 py-2 rounded-lg transition font-medium">
            + Nouvelle session
          </Link>
          <Link href="/admin/speakers/new" className="bg-violet-600 hover:bg-violet-700 text-white text-sm px-4 py-2 rounded-lg transition font-medium">
            + Nouvel intervenant
          </Link>
        </div>
      </div>
    </div>
  )
}
