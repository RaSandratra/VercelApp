import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import PlanningGrid from '@/components/planning/PlanningGrid'
import {
  CalendarIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline'

export default async function EventPage({
  params,
}) {
  const { id } = await params

  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      sessions: {
        include: {
          speakers: true,
        },
        orderBy: {
          startTime: 'asc',
        },
      },
    },
  })

  if (!event) notFound()

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString(
      'fr-FR',
      {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* En-tête */}
        <div className="mb-8 rounded-xl border border-gray-700 bg-[#111827] p-6 shadow-lg">
          <h1 className="mb-3 text-4xl font-bold text-white">
            {event.title}
          </h1>

          <p className="mb-4 text-lg text-gray-300">
            {event.description}
          </p>

          <div className="flex flex-wrap gap-6 text-gray-400">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />

              <span>
                {formatDate(event.startDate)} —{' '}
                {formatDate(event.endDate)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <MapPinIcon className="h-5 w-5" />

              <span>{event.location}</span>
            </div>
          </div>
        </div>

        {/* Planning multi-track */}
        <div className="rounded-xl border border-gray-700 bg-[#111827] p-6 shadow-lg">
          <h2 className="mb-4 text-2xl font-bold text-white">
            Planning des sessions
          </h2>

          <PlanningGrid
            sessions={event.sessions}
          />
        </div>
      </div>
    </main>
  )
}