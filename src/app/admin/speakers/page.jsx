'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { LoadingSpinner, SpeakerAvatar } from '@/components/ui'
import { UserGroupIcon, PlusIcon } from '@heroicons/react/24/outline'

export default function AdminSpeakersPage() {
  const [speakers, setSpeakers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/speakers')
      .then(res => res.json())
      .then(data => { setSpeakers(data); setLoading(false) })
      .catch(() => { toast.error('Erreur de chargement'); setLoading(false) })
  }, [])

  const handleDelete = async (id, name) => {
    if (!confirm(`Supprimer définitivement "${name}" ?`)) return
    const toastId = toast.loading('Suppression...')
    const res = await fetch(`/api/admin/speakers/${id}`, { method: 'DELETE', credentials: 'include' })
    if (res.ok) {
      setSpeakers(prev => prev.filter(s => s.id !== id))
      toast.success('Intervenant supprimé', { id: toastId })
    } else {
      toast.error('Erreur lors de la suppression', { id: toastId })
    }
  }

  return (
    <div className="p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <UserGroupIcon className="w-7 h-7 text-violet-600" />
          Intervenants
        </h1>
        <Link href="/admin/speakers/new" className="flex items-center gap-1.5 bg-violet-600 hover:bg-violet-700 text-white text-sm px-4 py-2 rounded-lg transition font-medium">
          <PlusIcon className="w-4 h-4" />
          Nouvel intervenant
        </Link>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : speakers.length === 0 ? (
        <div className="bg-white rounded-xl border p-12 text-center text-gray-400">Aucun intervenant.</div>
      ) : (
        <div className="grid gap-3">
          {speakers.map(speaker => (
            <div key={speaker.id} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between gap-4 hover:shadow-sm transition">
              <div className="flex items-center gap-3 min-w-0">
                <SpeakerAvatar name={speaker.name} photoUrl={speaker.photoUrl} size="sm" />
                <div className="min-w-0">
                  <p className="font-semibold text-gray-800">{speaker.name}</p>
                  {speaker.bio && (
                    <p className="text-sm text-gray-500 truncate max-w-xs">{speaker.bio}</p>
                  )}
                </div>
              </div>
              <div className="flex gap-3 flex-shrink-0">
                <Link href={`/admin/speakers/${speaker.id}/edit`} className="text-blue-600 hover:underline text-sm font-medium">
                  Modifier
                </Link>
                <button onClick={() => handleDelete(speaker.id, speaker.name)} className="text-red-500 hover:underline text-sm font-medium">
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
