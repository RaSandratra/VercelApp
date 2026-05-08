import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export default async function RoomPage({ params }) {
  const { name } = await params
  const roomName = decodeURIComponent(name)
  const sessions = await prisma.session.findMany({
    where: { room: roomName },
    include: { speakers: true, event: true },
    orderBy: { startTime: 'asc' },
  })
  
  if (sessions.length === 0) notFound()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-2 text-white">Salle : {roomName}</h1>
      <p className="text-gray-300 mb-6">{sessions.length} session(s)</p>
      <div className="space-y-4">
        {sessions.map(session => {
          const now = new Date()
          const isLive = now >= new Date(session.startTime) && now <= new Date(session.endTime)
          return (
            <Link
              key={session.id}
              href={`/sessions/${session.id}`}
              className="block bg-[#111827] border border-gray-700 rounded-lg p-4 hover:shadow-lg hover:border-gray-600 transition"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold text-white">{session.title}</h2>
                  <p className="text-gray-300 text-sm">{session.event.title}</p>
                  <p className="text-gray-400 text-sm mt-1">
                    {new Date(session.startTime).toLocaleString('fr-FR')} -{' '}
                    {new Date(session.endTime).toLocaleString('fr-FR')}
                  </p>
                  {session.speakers.length > 0 && (
                    <div className="text-sm text-gray-400 mt-1">
                      Intervenants : {session.speakers.map(s => s.name).join(', ')}
                    </div>
                  )}
                </div>
                {isLive && (
                  <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                    LIVE
                  </span>
                )}
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}





