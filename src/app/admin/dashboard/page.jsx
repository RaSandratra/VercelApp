import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowRightIcon,
  BuildingOfficeIcon,
  CalendarDaysIcon,
  ChartBarIcon,
  PlayCircleIcon,
  PlusIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline'
import { authOptions } from '@/lib/authOptions'
import { prisma } from '@/lib/prisma'

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')

  const [eventsCount, sessionsCount, speakersCount, roomsRaw, upcomingSessions] = await Promise.all([
    prisma.event.count(),
    prisma.session.count(),
    prisma.speaker.count(),
    prisma.session.findMany({ select: { room: true }, distinct: ['room'] }),
    prisma.session.findMany({
      take: 5,
      orderBy: { startTime: 'asc' },
      include: { event: true },
    }),
  ])

  const roomsCount = roomsRaw.filter((room) => room.room).length

  const stats = [
    { label: 'Ã‰vÃ©nements', count: eventsCount, href: '/admin/events', icon: CalendarDaysIcon, tone: 'bg-[#10B981]/15 text-[#10B981] ring-[#10B981]/30' },
    { label: 'Sessions', count: sessionsCount, href: '/admin/sessions', icon: PlayCircleIcon, tone: 'bg-[#10B981]/15 text-[#10B981] ring-[#10B981]/30' },
    { label: 'Intervenants', count: speakersCount, href: '/admin/speakers', icon: UserGroupIcon, tone: 'bg-[#10B981]/15 text-[#10B981] ring-[#10B981]/30' },
    { label: 'Salles', count: roomsCount, href: '/admin/rooms', icon: BuildingOfficeIcon, tone: 'bg-[#10B981]/15 text-[#10B981] ring-[#10B981]/30' },
  ]

  const actions = [
    { href: '/admin/events/new', label: 'Nouvel Ã©vÃ©nement', tone: 'bg-[#10B981] hover:bg-emerald-700' },
    { href: '/admin/sessions/new', label: 'Nouvelle session', tone: 'bg-[#10B981] hover:bg-emerald-700' },
    { href: '/admin/speakers/new', label: 'Nouvel intervenant', tone: 'bg-[#10B981] hover:bg-emerald-700' },
  ]

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-lg border border-white/10 bg-[#1F2937] shadow-sm">
        <div className="flex flex-col gap-5 px-6 py-6 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#111827] px-3 py-1 text-xs font-bold uppercase tracking-wide text-gray-400">
              <ChartBarIcon className="h-4 w-4" />
              Console admin
            </div>
            <h1 className="text-3xl font-black tracking-tight text-[#F9FAFB]">Tableau de bord</h1>
            <p className="mt-2 text-sm text-gray-400">
              ConnectÃ© avec <span className="font-semibold text-gray-400">{session.user.email}</span>
            </p>
          </div>
          <Link
            href="/admin/events/new"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#111827] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#243244]"
          >
            <PlusIcon className="h-4 w-4" />
            CrÃ©er un Ã©vÃ©nement
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, count, href, icon: Icon, tone }) => (
          <Link
            key={href}
            href={href}
            className="group rounded-lg border border-white/10 bg-[#1F2937] p-5 shadow-sm hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-400">{label}</p>
                <p className="mt-3 text-3xl font-black text-[#F9FAFB]">{count}</p>
              </div>
              <div className={`rounded-lg p-2 ring-1 ${tone}`}>
                <Icon className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-gray-400 group-hover:text-[#F9FAFB]">
              GÃ©rer
              <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-lg border border-white/10 bg-[#1F2937] p-6 shadow-sm">
          <h2 className="text-sm font-bold uppercase tracking-wide text-gray-400">Actions rapides</h2>
          <div className="mt-4 grid gap-3">
            {actions.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className={`inline-flex items-center justify-between rounded-lg px-4 py-3 text-sm font-semibold text-white ${action.tone}`}
              >
                {action.label}
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-white/10 bg-[#1F2937] p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 className="text-sm font-bold uppercase tracking-wide text-gray-400">Prochaines sessions</h2>
            <Link href="/admin/sessions" className="text-sm font-semibold text-gray-400 hover:text-[#F9FAFB]">
              Voir tout
            </Link>
          </div>
          <div className="divide-y divide-white/10">
            {upcomingSessions.length === 0 ? (
              <p className="py-6 text-sm text-gray-400">Aucune session planifiÃ©e.</p>
            ) : (
              upcomingSessions.map((item) => (
                <Link
                  key={item.id}
                  href={`/admin/sessions/${item.id}/edit`}
                  className="flex items-center justify-between gap-4 py-3 hover:bg-[#243244]"
                >
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-[#F9FAFB]">{item.title}</p>
                    <p className="truncate text-sm text-gray-400">{item.event?.title || 'Sans Ã©vÃ©nement'} Â· {item.room}</p>
                  </div>
                  <p className="shrink-0 text-sm font-medium text-gray-400">
                    {new Date(item.startTime).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })}
                  </p>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  )
}





