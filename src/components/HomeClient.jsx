'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  CalendarIcon,
  MapPinIcon,
  ArrowRightIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline'
import { useParticipant } from '@/context/AuthContext'
import toast from 'react-hot-toast'

export default function HomeClient({ events }) {
  const { participant, loaded } = useParticipant()

  const [search, setSearch] = useState('')
  const [welcomed, setWelcomed] = useState(false)

  // Toast de bienvenue une fois par session participant
  useEffect(() => {
    if (loaded && participant && !welcomed) {
      const key = `welcomed_${participant.userId}`

      if (!sessionStorage.getItem(key)) {
        toast.success(`Bienvenue, ${participant.pseudo} !`, {
          duration: 4000,
          icon: '👋',
        })

        sessionStorage.setItem(key, '1')
      }

      setWelcomed(true)
    }
  }, [loaded, participant, welcomed])

  const formatDate = (date) =>
    new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })

  const filtered = events.filter(
    (e) =>
      !search ||
      e.title?.toLowerCase().includes(search.toLowerCase()) ||
      e.location?.toLowerCase().includes(search.toLowerCase()) ||
      e.description?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero */}
      <section className="bg-gradient-to-r from-emerald-700 to-emerald-800 px-4 py-16 text-center text-white">
        <h1 className="mb-3 text-5xl font-extrabold">
          EventSync
        </h1>

        <p className="mx-auto mb-6 max-w-2xl text-xl opacity-90">
          Découvrez et participez à des événements interactifs
          en direct
        </p>

        {/* Barre de recherche dans le hero */}
        <div className="relative mx-auto max-w-lg">
          <MagnifyingGlassIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un événement, un lieu..."
            className="w-full rounded-xl py-3 pl-11 pr-4 text-sm text-[#111827] shadow-lg outline-none focus:ring-2 focus:ring-emerald-300"
          />
        </div>
      </section>

      {/* Liste des événements */}
      <main className="container mx-auto px-4 py-12">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-3xl font-bold text-[#111827]">
            <CalendarIcon className="h-7 w-7 text-[#10B981]" />
            Événements à venir
          </h2>

          {search && (
            <span className="text-sm text-gray-400">
              {filtered.length} résultat
              {filtered.length !== 1 ? 's' : ''} pour «{' '}
              {search} »
            </span>
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-xl border bg-[#1F2937] p-12 text-center text-gray-400 shadow-sm">
            {search
              ? `Aucun événement correspondant à "${search}".`
              : 'Aucun événement programmé pour le moment.'}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((event) => (
              <Link
                key={event.id}
                href={`/events/${event.id}`}
              >
                <div className="group flex h-full flex-col overflow-hidden rounded-xl border border-white/10 bg-[#1F2937] shadow-md transition-shadow duration-300 hover:shadow-xl">
                  <div className="flex-1 p-6">
                    <h3 className="mb-2 line-clamp-1 text-xl font-bold text-[#F9FAFB]">
                      {event.title}
                    </h3>

                    <p className="mb-4 line-clamp-2 text-sm text-gray-400">
                      {event.description}
                    </p>

                    <div className="space-y-2 text-sm text-gray-400">
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4 flex-shrink-0" />

                        <span>
                          {formatDate(event.startDate)} –{' '}
                          {formatDate(event.endDate)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <MapPinIcon className="h-4 w-4 flex-shrink-0" />

                        <span className="line-clamp-1">
                          {event.location}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-white/10 bg-[#111827] px-6 py-3 text-right transition group-hover:bg-[#10B981]/15">
                    <span className="inline-flex items-center gap-1 text-sm font-medium text-[#10B981]">
                      Voir les sessions

                      <ArrowRightIcon className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}