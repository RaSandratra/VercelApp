'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  ArrowRightIcon,
  CalendarDaysIcon,
  ClockIcon,
  HeartIcon,
  MapPinIcon,
  UsersIcon,
} from '@heroicons/react/24/outline'
import { useFavorites } from '@/hooks/useFavorites'

function formatDateTime(date) {
  return new Date(date).toLocaleString('fr-FR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function FavoritesPage() {
  const { favorites } = useFavorites()
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (favorites.length === 0) {
      setSessions([])
      setLoading(false)
      return
    }

    setLoading(true)
    fetch(`/api/sessions?ids=${favorites.join(',')}`)
      .then((res) => res.json())
      .then((data) => {
        setSessions(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [favorites])

  return (
    <main className="min-h-screen bg-[#111827] text-[#F9FAFB]">
      <section className="border-b border-white/10 bg-[#1F2937]">
        <div className="container mx-auto px-4 py-10">
          <p className="text-sm font-semibold uppercase tracking-widest text-[#10B981]">SÃ©lection personnelle</p>
          <h1 className="mt-2 text-3xl font-black text-[#F9FAFB] md:text-4xl">Mes sessions favorites</h1>
          <p className="mt-3 text-gray-400">
            Retrouvez rapidement les sessions que vous avez mises de cÃ´tÃ© pendant votre exploration.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-10">
        {loading ? (
          <div className="rounded-lg border border-white/10 bg-[#1F2937] px-6 py-14 text-center shadow-sm">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-2 border-[#10B981] border-t-transparent" />
            <p className="text-gray-400">Chargement de vos sessions favorites...</p>
          </div>
        ) : favorites.length === 0 ? (
          <div className="mx-auto max-w-lg rounded-lg border border-white/10 bg-[#1F2937] px-6 py-14 text-center shadow-sm">
            <HeartIcon className="mx-auto mb-4 h-16 w-16 text-gray-400" />
            <h2 className="text-2xl font-bold text-[#F9FAFB]">Aucune session favorite</h2>
            <p className="mt-3 text-gray-400">
              Ajoutez des sessions Ã  vos favoris pour les retrouver ici en un clic.
            </p>
            <Link
              href="/sessions"
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-lg bg-[#10B981] px-5 py-3 font-semibold text-white shadow-glow hover:bg-[#10B981]"
            >
              Explorer les sessions
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-gray-400">
                {sessions.length} session{sessions.length > 1 ? 's' : ''} dans vos favoris
              </p>
              <Link href="/sessions" className="text-sm font-semibold text-[#10B981] hover:text-[#10B981]">
                Ajouter d'autres sessions
              </Link>
            </div>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {sessions.map((session) => (
                <Link
                  key={session.id}
                  href={`/sessions/${session.id}`}
                  className="group flex min-h-72 flex-col rounded-lg border border-white/10 bg-[#1F2937] p-6 shadow-sm hover:-translate-y-1 hover:border-[#10B981] hover:shadow-md"
                >
                  <div className="mb-4 flex items-start justify-between gap-4">
                    <div>
                      {session.event?.title && (
                        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#10B981]">{session.event.title}</p>
                      )}
                      <h2 className="line-clamp-2 text-xl font-bold text-[#F9FAFB] group-hover:text-[#10B981]">{session.title}</h2>
                    </div>
                    <HeartIcon className="h-6 w-6 shrink-0 fill-[#10B981] text-[#10B981]" />
                  </div>

                  <p className="line-clamp-3 text-sm leading-6 text-gray-400">{session.description}</p>

                  <div className="mt-6 space-y-3 text-sm text-gray-400">
                    <div className="flex items-center gap-2">
                      <CalendarDaysIcon className="h-4 w-4 text-[#10B981]" />
                      <span>{formatDateTime(session.startTime)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ClockIcon className="h-4 w-4 text-[#10B981]" />
                      <span>Session enregistrÃ©e</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPinIcon className="h-4 w-4 text-[#10B981]" />
                      <span>{session.room}</span>
                    </div>
                    {session.speakers?.length > 0 && (
                      <div className="flex items-start gap-2">
                        <UsersIcon className="mt-0.5 h-4 w-4 shrink-0 text-[#10B981]" />
                        <span className="line-clamp-2">{session.speakers.map((speaker) => speaker.name).join(', ')}</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-auto flex items-center justify-between border-t border-white/10 pt-5 text-sm font-semibold text-[#10B981]">
                    <span>Voir la session</span>
                    <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  )
}




