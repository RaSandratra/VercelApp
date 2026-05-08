'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { CalendarIcon, MapPinIcon, ArrowRightIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
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
        toast.success(`Bienvenue, ${participant.pseudo} !`, { duration: 4000, icon: 'ðŸ‘‹' })
        sessionStorage.setItem(key, '1')
      }
      setWelcomed(true)
    }
  }, [loaded, participant])

  const formatDate = (date) =>
    new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })

  const filtered = events.filter(e =>
    !search ||
    e.title?.toLowerCase().includes(search.toLowerCase()) ||
    e.location?.toLowerCase().includes(search.toLowerCase()) ||
    e.description?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero */}
      <section className="bg-gradient-to-r from-emerald-700 to-emerald-800 text-white py-16 px-4 text-center">
        <h1 className="text-5xl font-extrabold mb-3">EventSync</h1>
        <p className="text-xl max-w-2xl mx-auto opacity-90 mb-6">
          DÃ©couvrez et participez Ã  des Ã©vÃ©nements interactifs en direct
        </p>
        {/* Barre de recherche dans le hero */}
        <div className="max-w-lg mx-auto relative">
          <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher un Ã©vÃ©nement, un lieu..."
            className="w-full pl-11 pr-4 py-3 rounded-xl text-[#F9FAFB] text-sm shadow-lg focus:ring-2 focus:ring-emerald-300 outline-none"
          />
        </div>
      </section>

      {/* Liste des Ã©vÃ©nements */}
      <main className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-[#F9FAFB] flex items-center gap-2">
            <CalendarIcon className="w-7 h-7 text-[#10B981]" />
            Ã‰vÃ©nements Ã  venir
          </h2>
          {search && (
            <span className="text-sm text-gray-400">
              {filtered.length} rÃ©sultat{filtered.length !== 1 ? 's' : ''} pour Â« {search} Â»
            </span>
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="bg-[#1F2937] rounded-xl shadow-sm border p-12 text-center text-gray-400">
            {search ? `Aucun Ã©vÃ©nement correspondant Ã  "${search}".` : 'Aucun Ã©vÃ©nement programmÃ© pour le moment.'}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((event) => (
              <Link key={event.id} href={`/events/${event.id}`}>
                <div className="bg-[#1F2937] rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden h-full flex flex-col border border-white/10 group">
                  <div className="p-6 flex-1">
                    <h3 className="text-xl font-bold text-[#F9FAFB] mb-2 line-clamp-1">{event.title}</h3>
                    <p className="text-gray-400 mb-4 text-sm line-clamp-2">{event.description}</p>
                    <div className="space-y-2 text-sm text-gray-400">
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="w-4 h-4 flex-shrink-0" />
                        <span>{formatDate(event.startDate)} â€“ {formatDate(event.endDate)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPinIcon className="w-4 h-4 flex-shrink-0" />
                        <span className="line-clamp-1">{event.location}</span>
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-white/10 px-6 py-3 bg-[#111827] text-right group-hover:bg-[#10B981]/15 transition">
                    <span className="text-[#10B981] text-sm font-medium inline-flex items-center gap-1">
                      Voir les sessions <ArrowRightIcon className="w-4 h-4" />
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





