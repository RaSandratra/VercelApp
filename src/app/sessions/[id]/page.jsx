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
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
      {/* En-tÃªte de la session */}
      <div className="bg-[#111827] rounded-xl shadow-lg border border-gray-700 p-6 mb-6">
        <div className="flex items-start justify-between gap-4 mb-3">
          <h1 className="text-3xl font-bold text-white">{session.title}</h1>
          {isLive && <LiveBadge />}
        </div>
        <p className="text-gray-300 leading-relaxed">{session.description}</p>
      </div>

      {/* Informations de la session */}
      <div className="bg-[#111827] rounded-xl shadow-lg border border-gray-700 p-6 mb-6 space-y-3">
        <div className="flex items-center gap-2 text-gray-300">
          <span className="text-lg">ðŸ•’</span>
          <span>
            {new Date(session.startTime).toLocaleString('fr-FR', { dateStyle: 'medium', timeStyle: 'short' })}
            {' â€“ '}
            {new Date(session.endTime).toLocaleString('fr-FR', { timeStyle: 'short' })}
          </span>
        </div>
        <div className="flex items-center gap-2 text-gray-300">
          <span className="text-lg">ðŸ“</span>
          <Link
            href={`/rooms/${encodeURIComponent(session.room)}`}
            className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
          >
            {session.room}
          </Link>
        </div>
        {session.capacity && (
          <div className="flex items-center gap-2 text-gray-300">
            <span className="text-lg">ðŸ‘¥</span>
            <span>CapacitÃ© : {session.capacity}</span>
          </div>
        )}
        <div className="flex items-center gap-2 text-gray-300">
          <span className="text-lg">ðŸ“…</span>
          <Link
            href={`/events/${session.eventId}`}
            className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
          >
            {session.event.title}
          </Link>
        </div>
      </div>

      {/* Intervenants cliquables */}
      {session.speakers.length > 0 && (
        <div className="bg-[#111827] rounded-xl shadow-lg border border-gray-700 p-6 mb-6">
          <h2 className="text-lg font-bold text-white mb-4">ðŸŽ¤ Intervenants</h2>
          <div className="flex flex-wrap gap-4">
            {session.speakers.map(speaker => (
              <Link
                key={speaker.id}
                href={`/speakers/${speaker.id}`}
                className="flex items-center gap-3 px-4 py-2 rounded-xl border border-gray-600 hover:border-emerald-400 hover:shadow-lg transition bg-gray-700 hover:bg-gray-600 group"
              >
                <SpeakerAvatar name={speaker.name} photoUrl={speaker.photoUrl} size="sm" />
                <div>
                  <p className="font-medium text-white group-hover:text-emerald-300 transition text-sm">
                    {speaker.name}
                  </p>
                  {speaker.bio && (
                    <p className="text-xs text-gray-400 line-clamp-1 max-w-[180px]">{speaker.bio}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      
      <div className="bg-[#111827] rounded-xl shadow-lg border border-gray-700 p-6">
        <QuestionSection sessionId={session.id} isLive={isLive} />
      </div>
      </div>
    </main>
  )
}




