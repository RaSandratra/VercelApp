import Link from 'next/link'
import {
  ArrowRightIcon,
  CalendarDaysIcon,
  ClockIcon,
  MapPinIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

function formatDate(date) {
  return new Date(date).toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
}

function formatTime(date) {
  return new Date(date).toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default async function HomePage() {
  const events = await prisma.event.findMany({
    orderBy: { startDate: 'asc' },
    include: {
      _count: {
        select: { sessions: true },
      },
    },
  })

  const totalSessions = events.reduce((total, event) => total + event._count.sessions, 0)

  return (
    <main className="min-h-screen bg-[#111827] text-[#F9FAFB]">
      <section className="border-b border-white/10 bg-[#1F2937]">
        <div className="container mx-auto grid gap-10 px-4 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-20">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#10B981]/30 bg-[#10B981]/15 px-4 py-2 text-sm font-semibold text-[#10B981]">
              <SparklesIcon className="h-4 w-4" />
              Conferences, sessions live et favoris au meme endroit
            </div>
            <h1 className="max-w-4xl text-4xl font-black tracking-tight text-[#F9FAFB] sm:text-5xl lg:text-6xl">
              EventSync rend vos evenements plus simples a suivre.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-400">
              Explorez le programme, retrouvez les salles, gardez vos sessions favorites et rejoignez les Ã©changes en temps rÃ©el.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="#events"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#10B981] px-6 py-3 font-semibold text-white shadow-glow hover:bg-[#10B981]"
              >
                Explorer les evenements
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
              <Link
                href="/sessions"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/15 px-6 py-3 font-semibold text-[#F9FAFB] hover:border-[#10B981] hover:bg-[#10B981]/15"
              >
                Voir les sessions
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            <div className="rounded-lg border border-white/10 bg-[#111827] p-5">
              <p className="text-sm font-semibold text-gray-400">Ã‰vÃ©nements</p>
              <p className="mt-2 text-3xl font-black text-[#F9FAFB]">{events.length}</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-[#111827] p-5">
              <p className="text-sm font-semibold text-gray-400">Sessions</p>
              <p className="mt-2 text-3xl font-black text-[#F9FAFB]">{totalSessions}</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-[#111827] p-5">
              <p className="text-sm font-semibold text-gray-400">AccÃ¨s</p>
              <p className="mt-2 text-3xl font-black text-[#F9FAFB]">Live</p>
            </div>
          </div>
        </div>
      </section>

      <section id="events" className="container mx-auto px-4 py-14">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-[#10B981]">Programme</p>
            <h2 className="mt-2 text-3xl font-bold text-[#F9FAFB]">Ã‰vÃ©nements Ã  venir</h2>
          </div>
          <Link href="/sessions" className="inline-flex items-center gap-2 text-sm font-semibold text-[#10B981] hover:text-[#10B981]">
            Toutes les sessions
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>

        {events.length === 0 ? (
          <div className="rounded-lg border border-white/10 bg-[#1F2937] px-6 py-14 text-center shadow-sm">
            <CalendarDaysIcon className="mx-auto mb-4 h-14 w-14 text-gray-400" />
            <h3 className="text-xl font-semibold text-[#F9FAFB]">Aucun Ã©vÃ©nement prÃ©vu</h3>
            <p className="mt-2 text-gray-400">Revenez bientÃ´t pour dÃ©couvrir les prochaines dates.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {events.map((event) => (
              <Link
                key={event.id}
                href={`/events/${event.id}`}
                className="group flex min-h-80 flex-col overflow-hidden rounded-lg border border-white/10 bg-[#1F2937] shadow-sm hover:-translate-y-1 hover:border-[#10B981] hover:shadow-md"
              >
                <div className="h-2 bg-[#10B981]" />
                <div className="flex flex-1 flex-col p-6">
                  <div className="mb-4 flex items-start justify-between gap-4">
                    <h3 className="text-xl font-bold text-[#F9FAFB] group-hover:text-[#10B981]">{event.title}</h3>
                    <span className="shrink-0 rounded-full border border-[#10B981]/30 bg-[#10B981]/15 px-3 py-1 text-xs font-semibold text-[#10B981]">
                      {event._count.sessions} session{event._count.sessions > 1 ? 's' : ''}
                    </span>
                  </div>

                  <p className="line-clamp-3 text-sm leading-6 text-gray-400">{event.description}</p>

                  <div className="mt-6 space-y-3 text-sm text-gray-400">
                    <div className="flex items-center gap-2">
                      <CalendarDaysIcon className="h-4 w-4 text-[#10B981]" />
                      <span>{formatDate(event.startDate)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ClockIcon className="h-4 w-4 text-[#10B981]" />
                      <span>De {formatTime(event.startDate)} Ã  {formatTime(event.endDate)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPinIcon className="h-4 w-4 text-[#10B981]" />
                      <span className="line-clamp-1">{event.location}</span>
                    </div>
                  </div>

                  <div className="mt-auto flex items-center justify-between border-t border-white/10 pt-5 text-sm font-semibold text-[#10B981]">
                    <span>Voir les dÃ©tails</span>
                    <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}




