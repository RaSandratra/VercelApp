'use client'
import { useFavorites } from '@/hooks/useFavorites'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { HeartIcon, ClockIcon, MapPinIcon, UsersIcon } from '@heroicons/react/24/outline'

export default function ImprovedFavoritesPage() {
  const { favorites } = useFavorites()
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (favorites.length === 0) {
      setLoading(false)
      return
    }
    fetch(`/api/sessions?ids=${favorites.join(',')}`)
      .then(res => res.json())
      .then(data => {
        setSessions(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [favorites])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement de vos sessions favorites...</p>
          </div>
        </div>
      </div>
    )
  }

  if (favorites.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-md mx-auto text-center">
            <HeartIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Aucune session favorite</h1>
            <p className="text-gray-600 mb-6">Découvrez des sessions intéressantes et ajoutez-les à vos favoris pour les retrouver facilement.</p>
            <Link
              href="/events"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Explorer les événements
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mes sessions favorites</h1>
          <p className="text-gray-600">{sessions.length} session{sessions.length > 1 ? 's' : ''} dans vos favoris</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sessions.map(session => (
            <Link
              key={session.id}
              href={`/sessions/${session.id}`}
              className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 border border-gray-100 hover:border-blue-200 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {session.title}
                  </h3>
                  <HeartIcon className="h-5 w-5 text-red-500 flex-shrink-0 ml-2" />
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {session.description}
                </p>

                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-500">
                    <ClockIcon className="h-4 w-4 mr-2" />
                    {new Date(session.startTime).toLocaleString('fr-FR', {
                      weekday: 'short',
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>

                  <div className="flex items-center text-sm text-gray-500">
                    <MapPinIcon className="h-4 w-4 mr-2" />
                    {session.room}
                  </div>

                  {session.speakers && session.speakers.length > 0 && (
                    <div className="flex items-center text-sm text-gray-500">
                      <UsersIcon className="h-4 w-4 mr-2" />
                      {session.speakers.map(s => s.name).join(', ')}
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}