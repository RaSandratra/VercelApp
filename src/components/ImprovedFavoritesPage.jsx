'use client'

import { useFavorites } from '@/hooks/useFavorites'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  HeartIcon,
  ClockIcon,
  MapPinIcon,
  UsersIcon,
} from '@heroicons/react/24/outline'

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
      .then((res) => res.json())
      .then((data) => {
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
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>

            <p className="text-gray-600">
              Chargement de vos sessions favorites...
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (favorites.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-12">
          <div className="mx-auto max-w-md text-center">
            <HeartIcon className="mx-auto mb-4 h-16 w-16 text-gray-300" />

            <h1 className="mb-2 text-2xl font-bold text-gray-900">
              Aucune session favorite
            </h1>

            <p className="mb-6 text-gray-600">
              Découvrez des sessions intéressantes
              et ajoutez-les à vos favoris pour les
              retrouver facilement.
            </p>

            <Link
              href="/events"
              className="inline-flex items-center rounded-lg bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700"
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
          <h1 className="mb-2 text-3xl font-bold text-gray-900">
            Mes sessions favorites
          </h1>

          <p className="text-gray-600">
            {sessions.length} session
            {sessions.length > 1 ? 's' : ''} dans
            vos favoris
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sessions.map((session) => (
            <Link
              key={session.id}
              href={`/sessions/${session.id}`}
              className="group overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-all duration-200 hover:border-blue-200 hover:shadow-lg"
            >
              <div className="p-6">
                <div className="mb-3 flex items-start justify-between">
                  <h3 className="line-clamp-2 text-lg font-semibold text-gray-900 transition-colors group-hover:text-blue-600">
                    {session.title}
                  </h3>

                  <HeartIcon className="ml-2 h-5 w-5 flex-shrink-0 text-red-500" />
                </div>

                <p className="mb-4 line-clamp-3 text-sm text-gray-600">
                  {session.description}
                </p>

                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-500">
                    <ClockIcon className="mr-2 h-4 w-4" />

                    {new Date(
                      session.startTime
                    ).toLocaleString('fr-FR', {
                      weekday: 'short',
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>

                  <div className="flex items-center text-sm text-gray-500">
                    <MapPinIcon className="mr-2 h-4 w-4" />
                    {session.room}
                  </div>

                  {session.speakers &&
                    session.speakers.length > 0 && (
                      <div className="flex items-center text-sm text-gray-500">
                        <UsersIcon className="mr-2 h-4 w-4" />

                        {session.speakers
                          .map((s) => s.name)
                          .join(', ')}
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