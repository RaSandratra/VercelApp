'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import {
  MagnifyingGlassIcon,
  PlayCircleIcon,
  PlusIcon,
} from '@heroicons/react/24/outline'
import { LoadingSpinner } from '@/components/ui'

export default function AdminSessionsPage() {
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetch('/api/sessions')
      .then((res) => res.json())
      .then((data) => {
        setSessions(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(() => {
        toast.error('Erreur de chargement')
        setLoading(false)
      })
  }, [])

  const handleDelete = async (id, title) => {
    if (!confirm(`Supprimer la session "${title}" ?`)) {
      return
    }

    const toastId = toast.loading('Suppression...')

    const res = await fetch(`/api/admin/sessions/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    })

    if (res.ok) {
      setSessions((prev) =>
        prev.filter((session) => session.id !== id)
      )

      toast.success('Session supprimée', {
        id: toastId,
      })
    } else {
      toast.error('Erreur lors de la suppression', {
        id: toastId,
      })
    }
  }

  const filtered = useMemo(() => {
    const value = search.toLowerCase()

    return sessions.filter(
      (session) =>
        session.title?.toLowerCase().includes(value) ||
        session.event?.title?.toLowerCase().includes(value) ||
        session.room?.toLowerCase().includes(value)
    )
  }, [sessions, search])

  return (
    <div className="pt-20 space-y-6">
      <section className="rounded-lg border border-white/10 bg-[#1F2937] p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-[#10B981]">
              Programme
            </p>

            <h1 className="mt-1 flex items-center gap-2 text-3xl font-black text-[#F9FAFB]">
              <PlayCircleIcon className="h-8 w-8 text-[#10B981]" />
              Sessions
            </h1>

            <p className="mt-2 text-sm text-gray-400">
              {sessions.length} session
              {sessions.length > 1 ? 's' : ''} configurée
              {sessions.length > 1 ? 's' : ''}
            </p>
          </div>

          <Link
            href="/admin/sessions/new"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#10B981] px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            <PlusIcon className="h-4 w-4" />
            Nouvelle session
          </Link>
        </div>

        <div className="relative mt-5 max-w-md">
          <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Rechercher par session, événement ou salle..."
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
          {search
            ? 'Aucune session ne correspond à cette recherche.'
            : 'Aucune session pour le moment.'}
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-white/10 bg-[#1F2937] shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-[#111827] text-xs uppercase tracking-wide text-gray-400">
                <tr>
                  <th className="px-5 py-3 text-left font-bold">
                    Titre
                  </th>

                  <th className="hidden px-5 py-3 text-left font-bold md:table-cell">
                    Événement
                  </th>

                  <th className="hidden px-5 py-3 text-left font-bold lg:table-cell">
                    Horaire
                  </th>

                  <th className="hidden px-5 py-3 text-left font-bold xl:table-cell">
                    Salle
                  </th>

                  <th className="px-5 py-3 text-right font-bold">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/10">
                {filtered.map((session) => (
                  <tr
                    key={session.id}
                    className="hover:bg-[#243244]"
                  >
                    <td className="px-5 py-4">
                      <p className="font-semibold text-[#F9FAFB]">
                        {session.title}
                      </p>

                      <p className="mt-1 line-clamp-1 text-xs text-gray-400">
                        {session.description}
                      </p>
                    </td>

                    <td className="hidden px-5 py-4 text-gray-400 md:table-cell">
                      {session.event?.title || '-'}
                    </td>

                    <td className="hidden px-5 py-4 text-gray-400 lg:table-cell">
                      {new Date(
                        session.startTime
                      ).toLocaleString('fr-FR', {
                        dateStyle: 'short',
                        timeStyle: 'short',
                      })}
                    </td>

                    <td className="hidden px-5 py-4 text-gray-400 xl:table-cell">
                      {session.room}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/admin/sessions/${session.id}/edit`}
                          className="rounded-md px-3 py-1.5 text-sm font-semibold text-[#10B981] hover:bg-[#10B981]/15"
                        >
                          Modifier
                        </Link>

                        <button
                          onClick={() =>
                            handleDelete(
                              session.id,
                              session.title
                            )
                          }
                          className="rounded-md px-3 py-1.5 text-sm font-semibold text-red-300 hover:bg-red-500/10"
                        >
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