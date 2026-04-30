import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { isSessionLive } from '@/lib/sessionUtils'
import QuestionSection from '@/components/questions/QuestionSection'
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
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold">{session.title}</h1>
      <p className="text-gray-600 mt-2">{session.description}</p>
      <div className="mt-4 space-y-1">
        <p>🕒 {new Date(session.startTime).toLocaleString()} - {new Date(session.endTime).toLocaleString()}</p>
        <p>📍 {session.room}</p>
        {session.capacity && <p>👥 Capacité : {session.capacity}</p>}
        <p>🎤 {session.speakers.map(s => s.name).join(', ')}</p>
        <p>📅 <Link href={`/events/${session.eventId}`} className="text-blue-600">{session.event.title}</Link></p>
      </div>
      <QuestionSection sessionId={session.id} isLive={isLive} />
    </main>
  )
}