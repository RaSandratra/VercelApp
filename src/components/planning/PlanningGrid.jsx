'use client'

import { useLiveStatus } from '@/hooks/useLiveStatus'
import { useFavorites } from '@/hooks/useFavorites'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { LiveBadge } from '@/components/ui'

export default function PlanningGrid({ sessions }) {
  const router = useRouter()
  const liveMap = useLiveStatus(sessions.map(s => s.id))
  const { isFavorite, addFavorite, removeFavorite } = useFavorites()

  if (!sessions || sessions.length === 0) {
    return <div className="text-gray-500 text-center py-8">Aucune session programmée.</div>
  }

  const rooms = [...new Set(sessions.map(s => s.room).filter(Boolean))].sort()

  const timeSlots = {}
  sessions.forEach(session => {
    const start = new Date(session.startTime)
    const timeKey = start.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    if (!timeSlots[timeKey]) timeSlots[timeKey] = []
    timeSlots[timeKey].push(session)
  })

  const sortedTimes = Object.keys(timeSlots).sort((a, b) => {
    const [ah, am] = a.split(':')
    const [bh, bm] = b.split(':')
    return new Date(2000, 0, 1, ah, am) - new Date(2000, 0, 1, bh, bm)
  })

  const getSessionAt = (timeKey, room) => timeSlots[timeKey]?.find(s => s.room === room)

  const formatTime = (date) =>
    new Date(date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })

  const handleFavoriteToggle = (session) => {
    const favori = isFavorite(session.id)
    if (favori) {
      removeFavorite(session.id)
      toast('Retiré des favoris', { icon: '★' })
    } else {
      addFavorite(session.id)
      toast.success('Ajouté aux favoris !')
    }
  }

  return (
    <>
      {/* Vue tableau (desktop) */}
      <div className="hidden md:block overflow-x-auto shadow-sm rounded-xl border border-gray-200">
        <table className="min-w-full bg-white text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-4 py-3 text-left font-semibold border-b text-xs uppercase tracking-wide">
                Horaire
              </th>
              {rooms.map(room => (
                <th key={room} className="px-4 py-3 text-left font-semibold border-b text-xs uppercase tracking-wide">
                  {room}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedTimes.map(time => (
              <tr key={time} className="border-b hover:bg-gray-50 transition">
                <td className="px-4 py-3 font-semibold text-gray-700 align-top whitespace-nowrap text-sm">
                  {time}
                </td>
                {rooms.map(room => {
                  const session = getSessionAt(time, room)
                  if (!session) {
                    return (
                      <td key={`${time}-${room}`} className="px-4 py-3 text-gray-300 align-top">—</td>
                    )
                  }
                  const isLive = liveMap[session.id] || false
                  const favori = isFavorite(session.id)
                  const speakers = session.speakers?.map(s => s.name).join(', ') || ''

                  return (
                    <td key={session.id} className="px-4 py-3 align-top">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-start justify-between gap-2">
                          <button
                            onClick={() => router.push(`/sessions/${session.id}`)}
                            className="text-blue-700 hover:text-blue-900 font-medium text-left hover:underline"
                          >
                            {session.title}
                          </button>
                          {isLive && <LiveBadge />}
                        </div>
                        {speakers && <div className="text-xs text-gray-500">{speakers}</div>}
                        <div className="text-xs text-gray-400">jusqu'à {formatTime(session.endTime)}</div>
                        <button
                          onClick={() => handleFavoriteToggle(session)}
                          className={`text-sm mt-1 self-start flex items-center gap-1 transition ${
                            favori ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'
                          }`}
                        >
                          {favori ? '★ Favori' : '☆ Ajouter'}
                        </button>
                      </div>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Vue cartes (mobile) */}
      <div className="md:hidden space-y-3">
        {sessions.map(session => {
          const isLive = liveMap[session.id] || false
          const favori = isFavorite(session.id)
          const speakers = session.speakers?.map(s => s.name).join(', ') || ''
          return (
            <div key={session.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
              <div className="flex items-start justify-between gap-2 mb-1">
                <button
                  onClick={() => router.push(`/sessions/${session.id}`)}
                  className="text-blue-700 font-semibold text-left hover:underline leading-snug"
                >
                  {session.title}
                </button>
                {isLive && <LiveBadge />}
              </div>
              {session.room && (
                <p className="text-xs text-gray-500 mb-1">📍 {session.room}</p>
              )}
              <p className="text-xs text-gray-400 mb-1">
                {formatTime(session.startTime)} – {formatTime(session.endTime)}
              </p>
              {speakers && <p className="text-xs text-gray-500 mb-2">{speakers}</p>}
              <button
                onClick={() => handleFavoriteToggle(session)}
                className={`text-sm flex items-center gap-1 transition ${
                  favori ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'
                }`}
              >
                {favori ? '★ Favori' : '☆ Ajouter aux favoris'}
              </button>
            </div>
          )
        })}
      </div>
    </>
  )
}
