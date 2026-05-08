'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { MagnifyingGlassIcon, PlusIcon, UserGroupIcon } from '@heroicons/react/24/outline'
import { LoadingSpinner, SpeakerAvatar } from '@/components/ui'

export default function AdminSpeakersPage() {
  const [speakers, setSpeakers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetch('/api/speakers')
      .then((res) => res.json())
      .then((data) => {
        setSpeakers(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(() => {
        toast.error('Erreur de chargement')
        setLoading(false)
      })
  }, [])

  const handleDelete = async (id, name) => {
    if (!confirm(`Supprimer dÃ©finitivement "${name}" ?`)) return
    const toastId = toast.loading('Suppression...')
    const res = await fetch(`/api/admin/speakers/${id}`, { method: 'DELETE', credentials: 'include' })

    if (res.ok) {
      setSpeakers((prev) => prev.filter((speaker) => speaker.id !== id))
      toast.success('Intervenant supprimÃ©', { id: toastId })
    } else {
      toast.error('Erreur lors de la suppression', { id: toastId })
    }
  }

  const filtered = useMemo(() => {
    const value = search.toLowerCase()
    return speakers.filter((speaker) =>
      speaker.name?.toLowerCase().includes(value) ||
      speaker.bio?.toLowerCase().includes(value)
    )
  }, [speakers, search])

  return (
    <div className="pt-20 space-y-6">
      <section className="rounded-lg border border-white/10 bg-[#1F2937] p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-[#10B981]">Annuaire</p>
            <h1 className="mt-1 flex items-center gap-2 text-3xl font-black text-[#F9FAFB]">
              <UserGroupIcon className="h-8 w-8 text-[#10B981]" />
              Intervenants
            </h1>
            <p className="mt-2 text-sm text-gray-400">{speakers.length} profil{speakers.length > 1 ? 's' : ''} disponible{speakers.length > 1 ? 's' : ''}</p>
          </div>
          <Link
            href="/admin/speakers/new"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#10B981] px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            <PlusIcon className="h-4 w-4" />
            Nouvel intervenant
          </Link>
        </div>

        <div className="relative mt-5 max-w-md">
          <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Rechercher par nom ou bio..."
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
          {search ? 'Aucun intervenant ne correspond Ã  cette recherche.' : 'Aucun intervenant.'}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((speaker) => (
            <div key={speaker.id} className="rounded-lg border border-white/10 bg-[#1F2937] p-5 shadow-sm hover:shadow-md">
              <div className="flex items-start gap-4">
                <SpeakerAvatar name={speaker.name} photoUrl={speaker.photoUrl} size="md" />
                <div className="min-w-0 flex-1">
                  <h2 className="truncate font-bold text-[#F9FAFB]">{speaker.name}</h2>
                  <p className="mt-1 line-clamp-3 text-sm leading-6 text-gray-400">{speaker.bio || 'Aucune biographie renseignÃ©e.'}</p>
                </div>
              </div>
              <div className="mt-5 flex justify-end gap-2 border-t border-white/10 pt-4">
                <Link href={`/admin/speakers/${speaker.id}/edit`} className="rounded-md px-3 py-1.5 text-sm font-semibold text-[#10B981] hover:bg-[#10B981]/15">
                  Modifier
                </Link>
                <button onClick={() => handleDelete(speaker.id, speaker.name)} className="rounded-md px-3 py-1.5 text-sm font-semibold text-red-300 hover:bg-red-500/10">
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}





