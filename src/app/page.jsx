import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function HomePage() {
  const events = await prisma.event.findMany({
    orderBy: { startDate: 'asc' }
  })

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Événements à venir</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {events.map(event => (
          <Link key={event.id} href={`/events/${event.id}`} className="border p-4 rounded shadow hover:shadow-lg">
            <h2 className="text-xl font-semibold">{event.title}</h2>
            <p className="text-gray-600">{event.description}</p>
            <p className="text-sm text-gray-500">{new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}</p>
            <p className="text-sm">{event.location}</p>
          </Link>
        ))}
      </div>
    </main>
  )
}