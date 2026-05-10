import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { isSessionLive } from '@/lib/sessionUtils'
import QuestionSection from '@/components/questions/QuestionSection'
import {
  LiveBadge,
  SpeakerAvatar,
} from '@/components/ui'
import Link from 'next/link'
import PlanningToggleButton from '@/components/planning/PlanningToggleButton'

export default async function SessionPage({
  params,
}) {
  const { id } = await params

  const session = await prisma.session.findUnique({
    where: { id },
    include: {
      speakers: true,
      event: true,
    },
  })

  if (!session) notFound()

  const isLive = isSessionLive(
    session.startTime,
    session.endTime
  )

  const sessionSnapshot = {
    id: session.id,
    title: session.title,
    startTime: session.startTime.toISOString(),
    endTime: session.endTime.toISOString(),
    room: session.room,
    eventTitle: session.event.title,
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="container mx-auto max-w-3xl px-4 py-8">
        {/* En-tête de la session */}
        <div className="mb-6 rounded-xl border border-gray-700 bg-[#111827] p-6 shadow-lg">
          <div className="mb-3 flex items-start justify-between gap-4">
            <h1 className="text-3xl font-bold text-white">
              {session.title}
            </h1>

            {isLive && <LiveBadge />}
          </div>

          <p className="leading-relaxed text-gray-300">
            {session.description}
          </p>

          <div className="mt-5 flex flex-wrap gap-3 border-t border-gray-700 pt-5">
            <PlanningToggleButton session={sessionSnapshot} />

            <Link
              href="/planning"
              className="inline-flex items-center justify-center rounded-lg border border-gray-700 px-4 py-2 text-sm font-semibold text-gray-300 hover:border-emerald-400 hover:bg-[#10B981]/15 hover:text-emerald-300"
            >
              Voir mon planning
            </Link>
          </div>
        </div>

        {/* Informations de la session */}
        <div className="mb-6 space-y-3 rounded-xl border border-gray-700 bg-[#111827] p-6 shadow-lg">
          <div className="flex items-center gap-2 text-gray-300">
            <span className="text-lg">🕒</span>

            <span>
              {new Date(
                session.startTime
              ).toLocaleString('fr-FR', {
                dateStyle: 'medium',
                timeStyle: 'short',
              })}
              {' — '}
              {new Date(
                session.endTime
              ).toLocaleString('fr-FR', {
                timeStyle: 'short',
              })}
            </span>
          </div>

          <div className="flex items-center gap-2 text-gray-300">
            <span className="text-lg">📍</span>

            <Link
              href={`/rooms/${encodeURIComponent(
                session.room
              )}`}
              className="font-medium text-emerald-400 transition-colors hover:text-emerald-300"
            >
              {session.room}
            </Link>
          </div>

          {session.capacity && (
            <div className="flex items-center gap-2 text-gray-300">
              <span className="text-lg">👥</span>

              <span>
                Capacité : {session.capacity}
              </span>
            </div>
          )}

          <div className="flex items-center gap-2 text-gray-300">
            <span className="text-lg">📅</span>

            <Link
              href={`/events/${session.eventId}`}
              className="font-medium text-emerald-400 transition-colors hover:text-emerald-300"
            >
              {session.event.title}
            </Link>
          </div>
        </div>

        {/* Intervenants cliquables */}
        {session.speakers.length > 0 && (
          <div className="mb-6 rounded-xl border border-gray-700 bg-[#111827] p-6 shadow-lg">
            <h2 className="mb-4 text-lg font-bold text-white">
              🎤 Intervenants
            </h2>

            <div className="flex flex-wrap gap-4">
              {session.speakers.map(
                (speaker) => (
                  <Link
                    key={speaker.id}
                    href={`/speakers/${speaker.id}`}
                    className="group flex items-center gap-3 rounded-xl border border-gray-600 bg-gray-700 px-4 py-2 transition hover:border-emerald-400 hover:bg-gray-600 hover:shadow-lg"
                  >
                    <SpeakerAvatar
                      name={speaker.name}
                      photoUrl={
                        speaker.photoUrl
                      }
                      size="sm"
                    />

                    <div>
                      <p className="text-sm font-medium text-white transition group-hover:text-emerald-300">
                        {speaker.name}
                      </p>

                      {speaker.bio && (
                        <p className="line-clamp-1 max-w-[180px] text-xs text-gray-400">
                          {speaker.bio}
                        </p>
                      )}
                    </div>
                  </Link>
                )
              )}
            </div>
          </div>
        )}

        {/* Questions */}
        <div className="rounded-xl border border-gray-700 bg-[#111827] p-6 shadow-lg">
          <QuestionSection
            sessionId={session.id}
            isLive={isLive}
            startTime={session.startTime}
            endTime={session.endTime}
          />
        </div>
      </div>
    </main>
  )
}
