'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { LoadingSpinner } from '@/components/ui'
import { CalendarDaysIcon, PlusIcon } from '@heroicons/react/24/outline'

export default function AdminEventsPage() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetch('/api/events')
      .then(res => res.json())
      .then(data => { setEvents(data); setLoading(false) })
      .catch(() => { toast.error('Erreur de chargement'); setLoading(false) })
  }, [])

  const handleDelete = async (id, title) => {
    if (!confirm(`Supprimer définitivement "${title}" ?`)) return
    const toastId = toast.loading('Suppression...')
    const res = await fetch(`/api/admin/events/${id}`, { method: 'DELETE', credentials: 'include' })
    if (res.ok) {
      setEvents(prev => prev.filter(e => e.id !== id))
      toast.success('Événement supprimé', { id: toastId })
    } else {
      toast.error('Erreur lors de la suppression', { id: toastId })
    }
  }

  const filtered = events.filter(e =>
    e.title?.toLowerCase().includes(search.toLowerCase()) ||
    e.location?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <CalendarDaysIcon className="w-7 h-7 text-blue-600" />
          Événements
        </h1>
        <Link href="/admin/events/new" className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg transition font-medium">
          <PlusIcon className="w-4 h-4" />
          Nouvel événement
        </Link>
      </div>

      {/* Recherche */}
      <input
        type="text"
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Rechercher par titre ou lieu..."
        className="mb-4 w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
      />

      {loading ? (
        <LoadingSpinner />
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-xl border p-12 text-center text-gray-400">
          {search ? 'Aucun résultat pour cette recherche.' : 'Aucun événement. Créez-en un !'}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs tracking-wide">
              <tr>
                <th className="px-4 py-3 text-left font-semibold border-b">Titre</th>
                <th className="px-4 py-3 text-left font-semibold border-b hidden md:table-cell">Dates</th>
                <th className="px-4 py-3 text-left font-semibold border-b hidden lg:table-cell">Lieu</th>
                <th className="px-4 py-3 text-left font-semibold border-b">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(event => (
                <tr key={event.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3 font-medium text-gray-800">{event.title}</td>
                  <td className="px-4 py-3 text-gray-500 hidden md:table-cell">
                    {new Date(event.startDate).toLocaleDateString('fr-FR')} –{' '}
                    {new Date(event.endDate).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-4 py-3 text-gray-500 hidden lg:table-cell">{event.location}</td>
                  <td className="px-4 py-3 flex gap-3">
                    <Link href={`/admin/events/${event.id}/edit`} className="text-blue-600 hover:text-blue-800 hover:underline font-medium">
                      Modifier
                    </Link>
                    <button onClick={() => handleDelete(event.id, event.title)} className="text-red-500 hover:text-red-700 hover:underline font-medium">
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
