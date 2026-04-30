'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { LoadingSpinner } from '@/components/ui'
import { PlayCircleIcon, PlusIcon } from '@heroicons/react/24/outline'

export default function AdminSessionsPage() {
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/sessions')
      .then(res => res.json())
      .then(data => { setSessions(data); setLoading(false) })
      .catch(() => { toast.error('Erreur de chargement'); setLoading(false) })
  }, [])

  const handleDelete = async (id, title) => {
    if (!confirm(`Supprimer la session "${title}" ?`)) return
    const toastId = toast.loading('Suppression...')
    const res = await fetch(`/api/admin/sessions/${id}`, { method: 'DELETE', credentials: 'include' })
    if (res.ok) {
      setSessions(prev => prev.filter(s => s.id !== id))
      toast.success('Session supprimée', { id: toastId })
    } else {
      toast.error('Erreur lors de la suppression', { id: toastId })
    }
  }

  return (
    <div className="p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <PlayCircleIcon className="w-7 h-7 text-indigo-600" />
          Sessions
        </h1>
        <Link href="/admin/sessions/new" className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-4 py-2 rounded-lg transition font-medium">
          <PlusIcon className="w-4 h-4" />
          Nouvelle session
        </Link>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : sessions.length === 0 ? (
        <div className="bg-white rounded-xl border p-12 text-center text-gray-400">Aucune session.</div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs tracking-wide">
              <tr>
                <th className="px-4 py-3 text-left font-semibold border-b">Titre</th>
                <th className="px-4 py-3 text-left font-semibold border-b hidden md:table-cell">Événement</th>
                <th className="px-4 py-3 text-left font-semibold border-b hidden lg:table-cell">Horaire</th>
                <th className="px-4 py-3 text-left font-semibold border-b">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sessions.map(session => (
                <tr key={session.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3 font-medium text-gray-800">{session.title}</td>
                  <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{session.event?.title || '—'}</td>
                  <td className="px-4 py-3 text-gray-500 hidden lg:table-cell">
                    {new Date(session.startTime).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })}
                  </td>
                  <td className="px-4 py-3 flex gap-3">
                    <Link href={`/admin/sessions/${session.id}/edit`} className="text-blue-600 hover:underline font-medium">
                      Modifier
                    </Link>
                    <button onClick={() => handleDelete(session.id, session.title)} className="text-red-500 hover:underline font-medium">
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
