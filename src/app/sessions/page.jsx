import Link from 'next/link'
import {
  ArrowRightIcon,
  CalendarDaysIcon,
  ChatBubbleLeftRightIcon,
  ClockIcon,
  MapPinIcon,
  UsersIcon,
} from '@heroicons/react/24/outline'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

function formatDate(date) {
  return new Date(date).toLocaleDateString('fr-FR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })
}

function formatTime(date) {
  return new Date(date).toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default async function SessionsPage() {
  const sessions = await prisma.session.findMany({
    include: {
      speakers: true,
      event: true,
      _count: {
        select: { questions: true },
      },
    },
    orderBy: { startTime: 'asc' },
  })

  return (
    <main className="min-h-screen bg-[#111827] text-[#F9FAFB]">
      <section className="border-b border-white/10 bg-[#1F2937]">
        <div className="container mx-auto px-4 py-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-[#10B981]">
                Programme complet
              </p>

              <h1 className="mt-2 text-3xl font-black text-[#F9FAFB] md:text-4xl">
                Toutes les sessions
              </h1>

              <p className="mt-3 text-gray-400">
                {sessions.length} session
                {sessions.length > 1 ? 's' : ''} disponible
                {sessions.length > 1 ? 's' : ''},
                classée
                {sessions.length > 1 ? 's' : ''} par
                heure de début.
              </p>
            </div>

            <Link
              href="/favourites"
              className="inline-flex items-center justify-center rounded-lg border border-white/15 px-4 py-2 text-sm font-semibold text-[#F9FAFB] hover:border-[#10B981] hover:bg-[#10B981]/15"
            >
              Mes favoris
            </Link>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-10">
        {sessions.length === 0 ? (
          <div className="rounded-lg border border-white/10 bg-[#1F2937] px-6 py-14 text-center shadow-sm">
            <CalendarDaysIcon className="mx-auto mb-4 h-14 w-14 text-gray-400" />

            <h3 className="text-xl font-semibold text-[#F9FAFB]">
              Aucune session disponible
            </h3>

            <p className="mt-2 text-gray-400">
              Revenez plus tard pour découvrir les
              nouvelles sessions.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {sessions.map((session) => (
              <Link
                key={session.id}
                href={`/sessions/${session.id}`}
                className="group flex min-h-80 flex-col rounded-lg border border-white/10 bg-[#1F2937] p-6 shadow-sm hover:-translate-y-1 hover:border-[#10B981] hover:shadow-md"
              >
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#10B981]">
                      {session.event.title}
                    </p>

                    <h2 className="line-clamp-2 text-xl font-bold text-[#F9FAFB] group-hover:text-[#10B981]">
                      {session.title}
                    </h2>
                  </div>

                  {session._count.questions > 0 && (
                    <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-[#10B981]/30 bg-[#10B981]/15 px-2.5 py-1 text-xs font-semibold text-[#10B981]">
                      <ChatBubbleLeftRightIcon className="h-3.5 w-3.5" />
                      {session._count.questions}
                    </span>
                  )}
                </div>

                <p className="line-clamp-3 text-sm leading-6 text-gray-400">
                  {session.description}
                </p>

                <div className="mt-6 space-y-3 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <CalendarDaysIcon className="h-4 w-4 text-[#10B981]" />

                    <span>
                      {formatDate(session.startTime)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <ClockIcon className="h-4 w-4 text-[#10B981]" />

                    <span>
                      {formatTime(session.startTime)} -{' '}
                      {formatTime(session.endTime)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPinIcon className="h-4 w-4 text-[#10B981]" />

                    <span>{session.room}</span>
                  </div>

                  {session.speakers?.length > 0 && (
                    <div className="flex items-start gap-2">
                      <UsersIcon className="mt-0.5 h-4 w-4 shrink-0 text-[#10B981]" />

                      <span className="line-clamp-2">
                        {session.speakers
                          .map((speaker) => speaker.name)
                          .join(', ')}
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-auto flex items-center justify-between border-t border-white/10 pt-5 text-sm font-semibold text-[#10B981]">
                  <span>Ouvrir la session</span>

                  <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}