// BUG FIX: Ce fichier avait 'use client' en haut mais utilisait prisma directement,
// ce qui est impossible côté client. Retiré 'use client' pour en faire un composant serveur.
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

  // BUG FIX: La condition notFound était incorrecte (double requête inutile)
  if (sessions.length === 0) notFound()

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-2">Salle : {roomName}</h1>
      <p className="text-gray-600 mb-6">{sessions.length} session(s)</p>
      <div className="space-y-4">
        {sessions.map(session => {
          const now = new Date()
          const isLive = now >= new Date(session.startTime) && now <= new Date(session.endTime)
          return (
            <Link
              key={session.id}
              href={`/sessions/${session.id}`}
              className="block border rounded-lg p-4 hover:shadow-md transition"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold">{session.title}</h2>
                  <p className="text-gray-600 text-sm">{session.event.title}</p>
                  <p className="text-gray-500 text-sm mt-1">
                    {new Date(session.startTime).toLocaleString('fr-FR')} -{' '}
                    {new Date(session.endTime).toLocaleString('fr-FR')}
                  </p>
                  {session.speakers.length > 0 && (
                    <div className="text-sm text-gray-500 mt-1">
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
