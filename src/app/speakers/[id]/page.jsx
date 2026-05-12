import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { SpeakerAvatar } from '@/components/ui'

export default async function SpeakerPage({ params }) {
  const { id } = params

  const speaker = await prisma.speaker.findUnique({
    where: { id },
    include: {
      sessions: {
        include: { event: true },
        orderBy: { startTime: 'asc' },
      },
    },
  })

  if (!speaker) notFound()

  const links =
    speaker.links && typeof speaker.links === 'string'
      ? JSON.parse(speaker.links)
      : (speaker.links || {})

  const allQuestions = await prisma.question.findMany({
    where: {
      session: {
        speakers: { some: { id: speaker.id } }
      }
    },
    include: { session: true },
    orderBy: { upvotes: 'desc' },
  })

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 container mx-auto px-4 py-8 max-w-3xl">

      <div className="bg-[#111827] rounded-xl shadow-lg border border-gray-700 p-6 mb-8 flex gap-6 items-start">
        <SpeakerAvatar
          name={speaker.name}
          photoUrl={speaker.photoUrl}
          size="lg"
        />

        <div className="min-w-0">
          <h1 className="text-3xl font-bold text-white">
            {speaker.name}
          </h1>

          {speaker.bio && (
            <p className="text-gray-300 mt-2 leading-relaxed">
              {speaker.bio}
            </p>
          )}

          {Object.keys(links).length > 0 && (
            <div className="mt-4 flex flex-wrap gap-3">
              {links.twitter && (
                <a
                  href={links.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-emerald-400 hover:text-emerald-300 hover:underline flex items-center gap-1 transition-colors"
                >
                  🐦 Twitter
                </a>
              )}

              {links.github && (
                <a
                  href={links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-300 hover:text-gray-200 hover:underline flex items-center gap-1 transition-colors"
                >
                  🐙 GitHub
                </a>
              )}

              {links.website && (
                <a
                  href={links.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-green-400 hover:text-green-300 hover:underline flex items-center gap-1 transition-colors"
                >
                  🌐 Site web
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Sessions animées */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-white mb-4">
          Sessions animées
        </h2>

        {speaker.sessions.length === 0 ? (
          <p className="text-gray-400">
            Aucune session pour cet intervenant.
          </p>
        ) : (
          <div className="space-y-3">
            {speaker.sessions.map(session => (
              <Link
                key={session.id}
                href={`/sessions/${session.id}`}
                className="block bg-[#111827] border border-gray-700 rounded-xl p-4 hover:shadow-lg hover:border-gray-600 transition"
              >
                <h3 className="font-semibold text-white">
                  {session.title}
                </h3>

                <p className="text-sm text-gray-400 mt-1">
                  {session.event.title} ·{' '}
                  {new Date(session.startTime).toLocaleString('fr-FR', {
                    dateStyle: 'short',
                    timeStyle: 'short',
                  })}

                  {session.room && ` · 📍 ${session.room}`}
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Questions posées */}
      {allQuestions.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-white mb-4">
            Questions posées sur ses sessions
          </h2>

          <div className="space-y-3">
            {allQuestions.map(q => (
              <div
                key={q.id}
                className="bg-[#111827] border border-gray-700 rounded-xl p-4 shadow-lg"
              >
                <p className="font-medium text-white">
                  {q.content}
                </p>

                <div className="flex justify-between items-center mt-2 text-sm text-gray-400">
                  <span>
                    Session :{' '}
                    <Link
                      href={`/sessions/${q.session.id}`}
                      className="text-emerald-400 hover:text-emerald-300 transition-colors"
                    >
                      {q.session.title}
                    </Link>
                  </span>

                  <span className="flex items-center gap-1">
                    👍 {q.upvotes}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  )
}