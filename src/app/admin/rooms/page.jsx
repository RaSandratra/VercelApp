'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import {
  ArrowTopRightOnSquareIcon,
  BuildingOfficeIcon,
} from '@heroicons/react/24/outline'
import { LoadingSpinner } from '@/components/ui'

export default function AdminRoomsPage() {
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [sessionsByRoom, setSessionsByRoom] = useState({})

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/rooms', {
        credentials: 'include',
      }).then((res) => res.json()),

      fetch('/api/sessions').then((res) => res.json()),
    ])
      .then(([roomsData, sessionsData]) => {
        setRooms(Array.isArray(roomsData) ? roomsData : [])

        const grouped = {}

        ;(Array.isArray(sessionsData) ? sessionsData : []).forEach(
          (session) => {
            if (!session.room) return

            if (!grouped[session.room]) {
              grouped[session.room] = []
            }

            grouped[session.room].push(session)
          }
        )

        setSessionsByRoom(grouped)
        setLoading(false)
      })
      .catch(() => {
        toast.error('Erreur de chargement')
        setLoading(false)
      })
  }, [])

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-white/10 bg-[#1F2937] p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-[#10B981]">
              Espaces
            </p>

            <h1 className="mt-1 flex items-center gap-2 text-3xl font-black text-[#F9FAFB]">
              <BuildingOfficeIcon className="h-8 w-8 text-[#10B981]" />
              Salles
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-gray-400">
              Les salles sont générées automatiquement depuis le
              champ salle des sessions.
            </p>
          </div>

          <Link
            href="/admin/sessions/new"
            className="inline-flex items-center justify-center rounded-lg bg-[#10B981] px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            Créer une session
          </Link>
        </div>
      </section>

      {loading ? (
        <div className="rounded-lg border border-white/10 bg-[#1F2937] shadow-sm">
          <LoadingSpinner />
        </div>
      ) : rooms.length === 0 ? (
        <div className="rounded-lg border border-white/10 bg-[#1F2937] p-12 text-center text-gray-400 shadow-sm">
          Aucune salle définie. Créez des sessions avec un champ
          salle pour les voir apparaître ici.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {rooms.map((room) => {
            const sessions = sessionsByRoom[room.name] || []

            return (
              <div
                key={room.name}
                className="rounded-lg border border-white/10 bg-[#1F2937] p-5 shadow-sm hover:shadow-md"
              >
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="rounded-lg bg-[#10B981]/15 p-2 text-[#10B981] ring-1 ring-[#10B981]/30">
                      <BuildingOfficeIcon className="h-5 w-5" />
                    </div>

                    <h2 className="truncate font-bold text-[#F9FAFB]">
                      {room.name}
                    </h2>
                  </div>

                  <span className="shrink-0 rounded-full bg-[#111827] px-2.5 py-1 text-xs font-bold text-gray-400">
                    {sessions.length} session
                    {sessions.length !== 1 ? 's' : ''}
                  </span>
                </div>

                <div className="space-y-2">
                  {sessions.length === 0 ? (
                    <p className="text-sm text-gray-400">
                      Aucune session liée.
                    </p>
                  ) : (
                    sessions.slice(0, 4).map((session) => (
                      <Link
                        key={session.id}
                        href={`/admin/sessions/${session.id}/edit`}
                        className="block truncate rounded-md px-2 py-1.5 text-sm text-gray-400 hover:bg-[#111827] hover:text-[#F9FAFB]"
                      >
                        {session.title}
                      </Link>
                    ))
                  )}

                  {sessions.length > 4 && (
                    <p className="px-2 text-xs font-medium text-gray-400">
                      +{sessions.length - 4} autre
                      {sessions.length - 4 > 1 ? 's' : ''}
                    </p>
                  )}
                </div>

                <div className="mt-5 border-t border-white/10 pt-4">
                  <Link
                    href={`/rooms/${encodeURIComponent(room.name)}`}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[#10B981] hover:text-emerald-800"
                  >
                    Voir la page publique

                    <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}