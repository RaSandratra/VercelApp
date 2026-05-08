import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { CalendarDaysIcon, MapPinIcon, ClockIcon } from '@heroicons/react/24/outline'

export default async function ImprovedHomePage() {
  const events = await prisma.event.findMany({
    orderBy: { startDate: 'asc' },
    include: {
      sessions: {
        select: { id: true },
        take: 1 // Just to check if there are sessions
      }
    }
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative container mx-auto px-4 py-20">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Découvrez les événements
              <span className="block text-blue-200">qui comptent</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8">
              Restez connecté avec les dernières sessions et conférences en temps réel
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="#events"
                className="inline-flex items-center px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors shadow-lg"
              >
                Explorer les événements
              </Link>
              <Link
                href="/favourites"
                className="inline-flex items-center px-8 py-4 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
              >
                Mes favoris
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section id="events" className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Événements à venir
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Découvrez une sélection d'événements passionnants et inscrivez-vous aux sessions qui vous intéressent
            </p>
          </div>

          {events.length === 0 ? (
            <div className="text-center py-12">
              <CalendarDaysIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun événement prévu</h3>
              <p className="text-gray-600">Revenez bientôt pour découvrir de nouveaux événements.</p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {events.map(event => (
                <Link
                  key={event.id}
                  href={`/events/${event.id}`}
                  className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200 overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {event.title}
                      </h3>
                      <div className="flex items-center text-sm text-gray-500">
                        <CalendarDaysIcon className="h-4 w-4 mr-1" />
                        {event.sessions.length > 0 ? `${event.sessions.length} session${event.sessions.length > 1 ? 's' : ''}` : 'À venir'}
                      </div>
                    </div>

                    <p className="text-gray-600 mb-6 line-clamp-3">
                      {event.description}
                    </p>

                    <div className="space-y-3">
                      <div className="flex items-center text-sm text-gray-500">
                        <CalendarDaysIcon className="h-4 w-4 mr-2 text-blue-500" />
                        <span>
                          {new Date(event.startDate).toLocaleDateString('fr-FR', {
                            weekday: 'long',
                            day: 'numeric',
                            month: 'long'
                          })}
                        </span>
                      </div>

                      <div className="flex items-center text-sm text-gray-500">
                        <ClockIcon className="h-4 w-4 mr-2 text-green-500" />
                        <span>
                          Du {new Date(event.startDate).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} au {new Date(event.endDate).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      <div className="flex items-center text-sm text-gray-500">
                        <MapPinIcon className="h-4 w-4 mr-2 text-red-500" />
                        <span>{event.location}</span>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-gray-100">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                          Cliquez pour voir les détails
                        </span>
                        <div className="text-blue-600 group-hover:text-blue-700 transition-colors">
                          →
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">
            © 2024 EventSync. Restez connecté avec vos événements préférés.
          </p>
        </div>
      </footer>
    </div>
  )
}