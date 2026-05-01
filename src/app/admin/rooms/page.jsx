'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { LoadingSpinner } from '@/components/ui'
import { BuildingOfficeIcon } from '@heroicons/react/24/outline'

export default function AdminRoomsPage() {
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [sessionsByRoom, setSessionsByRoom] = useState({})

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/rooms', { credentials: 'include' }).then(r => r.json()),
      fetch('/api/sessions').then(r => r.json()),
    ])
      .then(([roomsData, sessionsData]) => {
        setRooms(roomsData)
        // Grouper les sessions par salle
        const grouped = {}
        sessionsData.forEach(s => {
          if (!s.room) return
          if (!grouped[s.room]) grouped[s.room] = []
          grouped[s.room].push(s)
        })
        setSessionsByRoom(grouped)
        setLoading(false)
      })
      .catch(() => {
        toast.error('Erreur de chargement')
        setLoading(false)
      })
  }, [])

  return (
    <div className="p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <BuildingOfficeIcon className="w-7 h-7 text-emerald-600" />
          Salles
        </h1>
        <p className="text-sm text-gray-500">
          Les salles sont gérées automatiquement via les sessions.
          Pour créer ou renommer une salle, modifiez le champ &quot;Salle&quot; d&apos;une session.
        </p>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : rooms.length === 0 ? (
        <div className="bg-white rounded-xl border p-12 text-center text-gray-400">
          Aucune salle définie. Créez des sessions avec un champ salle pour les voir apparaître ici.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rooms.map(room => {
            const sessions = sessionsByRoom[room.name] || []
            return (
              <div
                key={room.name}
                className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-emerald-100 rounded-lg">
                      <BuildingOfficeIcon className="w-5 h-5 text-emerald-600" />
                    </div>
                    <h2 className="font-semibold text-gray-800">{room.name}</h2>
                  </div>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                    {sessions.length} session{sessions.length !== 1 ? 's' : ''}
                  </span>
                </div>

                {sessions.length > 0 && (
                  <div className="space-y-1 mt-3">
                    {sessions.slice(0, 3).map(s => (
                      <Link
                        key={s.id}
                        href={`/admin/sessions/${s.id}/edit`}
                        className="block text-xs text-gray-600 hover:text-blue-600 truncate hover:underline"
                      >
                        • {s.title}
                      </Link>
                    ))}
                    {sessions.length > 3 && (
                      <p className="text-xs text-gray-400">
                        +{sessions.length - 3} autre{sessions.length - 3 > 1 ? 's' : ''}...
                      </p>
                    )}
                  </div>
                )}

                <div className="mt-4 pt-3 border-t border-gray-100">
                  <Link
                    href={`/rooms/${encodeURIComponent(room.name)}`}
                    className="text-xs text-emerald-600 hover:underline font-medium"
                  >
                    Voir la page publique →
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
