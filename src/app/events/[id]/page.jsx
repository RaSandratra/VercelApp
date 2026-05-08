import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import PlanningGrid from '@/components/planning/PlanningGrid'
import { CalendarIcon, MapPinIcon } from '@heroicons/react/24/outline'

export default async function EventPage({ params }) {
  const { id } = await params

  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      sessions: {
        include: { speakers: true },
        orderBy: { startTime: 'asc' },
      },
    },
  })

  if (!event) notFound()

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 container mx-auto px-4 py-8">
      {/* En-tÃªte */}
      <div className="bg-[#111827] rounded-xl shadow-lg p-6 mb-8 border border-gray-700">
        <h1 className="text-4xl font-bold text-white mb-3">{event.title}</h1>
        <p className="text-gray-300 text-lg mb-4">{event.description}</p>
        <div className="flex flex-wrap gap-6 text-gray-400">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5" />
            <span>{formatDate(event.startDate)} â€” {formatDate(event.endDate)}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPinIcon className="w-5 h-5" />
            <span>{event.location}</span>
          </div>
        </div>
      </div>

      {/* Planning multi-track */}
      <div className="bg-[#111827] rounded-xl shadow-lg p-6 border border-gray-700">
        <h2 className="text-2xl font-bold text-white mb-4">Planning des sessions</h2>
        <PlanningGrid sessions={event.sessions} />
      </div>
    </main>
  )
}




