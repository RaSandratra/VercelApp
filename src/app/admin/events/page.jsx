'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { CalendarDaysIcon, MagnifyingGlassIcon, PlusIcon } from '@heroicons/react/24/outline'
import { LoadingSpinner } from '@/components/ui'

export default function AdminEventsPage() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetch('/api/events')
      .then((res) => res.json())
      .then((data) => {
        setEvents(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(() => {
        toast.error('Erreur de chargement')
        setLoading(false)
      })
  }, [])

  const handleDelete = async (id, title) => {
    if (!confirm(`Supprimer dÃ©finitivement "${title}" ?`)) return
    const toastId = toast.loading('Suppression...')
    const res = await fetch(`/api/admin/events/${id}`, { method: 'DELETE', credentials: 'include' })

    if (res.ok) {
      setEvents((prev) => prev.filter((event) => event.id !== id))
      toast.success('Ã‰vÃ©nement supprimÃ©', { id: toastId })
    } else {
      toast.error('Erreur lors de la suppression', { id: toastId })
    }
  }

  const filtered = useMemo(() => {
    const value = search.toLowerCase()
    return events.filter((event) =>
      event.title?.toLowerCase().includes(value) ||
      event.location?.toLowerCase().includes(value)
    )
  }, [events, search])

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-white/10 bg-[#1F2937] p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-[#10B981]">Gestion</p>
            <h1 className="mt-1 flex items-center gap-2 text-3xl font-black text-[#F9FAFB]">
              <CalendarDaysIcon className="h-8 w-8 text-[#10B981]" />
              Ã‰vÃ©nements
            </h1>
            <p className="mt-2 text-sm text-gray-400">{events.length} Ã©vÃ©nement{events.length > 1 ? 's' : ''} enregistrÃ©{events.length > 1 ? 's' : ''}</p>
          </div>
          <Link
            href="/admin/events/new"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#10B981] px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            <PlusIcon className="h-4 w-4" />
            Nouvel Ã©vÃ©nement
          </Link>
        </div>

        <div className="relative mt-5 max-w-md">
          <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Rechercher par titre ou lieu..."
            className="w-full rounded-lg border-white/15 bg-[#1F2937] py-2.5 pl-10 pr-4 text-sm text-[#F9FAFB] placeholder:text-gray-400"
          />
        </div>
      </section>

      {loading ? (
        <div className="rounded-lg border border-white/10 bg-[#1F2937] shadow-sm">
          <LoadingSpinner />
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-lg border border-white/10 bg-[#1F2937] p-12 text-center text-gray-400 shadow-sm">
          {search ? 'Aucun rÃ©sultat pour cette recherche.' : 'Aucun Ã©vÃ©nement. CrÃ©ez-en un pour commencer.'}
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-white/10 bg-[#1F2937] shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-[#111827] text-xs uppercase tracking-wide text-gray-400">
                <tr>
                  <th className="px-5 py-3 text-left font-bold">Titre</th>
                  <th className="hidden px-5 py-3 text-left font-bold md:table-cell">Dates</th>
                  <th className="hidden px-5 py-3 text-left font-bold lg:table-cell">Lieu</th>
                  <th className="px-5 py-3 text-right font-bold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {filtered.map((event) => (
                  <tr key={event.id} className="hover:bg-[#243244]">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-[#F9FAFB]">{event.title}</p>
                      <p className="mt-1 line-clamp-1 text-xs text-gray-400">{event.description}</p>
                    </td>
                    <td className="hidden px-5 py-4 text-gray-400 md:table-cell">
                      {new Date(event.startDate).toLocaleDateString('fr-FR')} - {new Date(event.endDate).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="hidden px-5 py-4 text-gray-400 lg:table-cell">{event.location}</td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <Link href={`/admin/events/${event.id}/edit`} className="rounded-md px-3 py-1.5 text-sm font-semibold text-[#10B981] hover:bg-[#10B981]/15">
                          Modifier
                        </Link>
                        <button onClick={() => handleDelete(event.id, event.title)} className="rounded-md px-3 py-1.5 text-sm font-semibold text-red-300 hover:bg-red-500/10">
                          Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}





