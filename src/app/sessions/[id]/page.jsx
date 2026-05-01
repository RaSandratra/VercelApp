import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { isSessionLive } from '@/lib/sessionUtils'
import QuestionSection from '@/components/questions/QuestionSection'
import { LiveBadge, SpeakerAvatar } from '@/components/ui'
import Link from 'next/link'

export default async function SessionPage({ params }) {
  const { id } = await params
  const session = await prisma.session.findUnique({
    where: { id },
    include: { speakers: true, event: true }
  })
  if (!session) notFound()
  const isLive = isSessionLive(session.startTime, session.endTime)

  return (
    <main className="container mx-auto px-4 py-8 max-w-3xl">
      {/* En-tête de la session */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex items-start justify-between gap-4 mb-3">
          <h1 className="text-3xl font-bold text-gray-900">{session.title}</h1>
          {isLive && <LiveBadge />}
        </div>
        <p className="text-gray-600 leading-relaxed">{session.description}</p>
      </div>

      {/* Informations de la session */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6 space-y-3">
        <div className="flex items-center gap-2 text-gray-700">
          <span className="text-lg">🕒</span>
          <span>
            {new Date(session.startTime).toLocaleString('fr-FR', { dateStyle: 'medium', timeStyle: 'short' })}
            {' – '}
            {new Date(session.endTime).toLocaleString('fr-FR', { timeStyle: 'short' })}
          </span>
        </div>
        <div className="flex items-center gap-2 text-gray-700">
          <span className="text-lg">📍</span>
          <Link
            href={`/rooms/${encodeURIComponent(session.room)}`}
            className="text-blue-600 hover:underline font-medium"
          >
            {session.room}
          </Link>
        </div>
        {session.capacity && (
          <div className="flex items-center gap-2 text-gray-700">
            <span className="text-lg">👥</span>
            <span>Capacité : {session.capacity}</span>
          </div>
        )}
        <div className="flex items-center gap-2 text-gray-700">
          <span className="text-lg">📅</span>
          <Link
            href={`/events/${session.eventId}`}
            className="text-blue-600 hover:underline"
          >
            {session.event.title}
          </Link>
        </div>
      </div>

      {/* Intervenants cliquables */}
      {session.speakers.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">🎤 Intervenants</h2>
          <div className="flex flex-wrap gap-4">
            {session.speakers.map(speaker => (
              <Link
                key={speaker.id}
                href={`/speakers/${speaker.id}`}
                className="flex items-center gap-3 px-4 py-2 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-sm transition bg-gray-50 hover:bg-blue-50 group"
              >
                <SpeakerAvatar name={speaker.name} photoUrl={speaker.photoUrl} size="sm" />
                <div>
                  <p className="font-medium text-gray-800 group-hover:text-blue-700 transition text-sm">
                    {speaker.name}
                  </p>
                  {speaker.bio && (
                    <p className="text-xs text-gray-500 line-clamp-1 max-w-[180px]">{speaker.bio}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <QuestionSection sessionId={session.id} isLive={isLive} />
      </div>
    </main>
  )
}