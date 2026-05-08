'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import toast from 'react-hot-toast'
import { LoadingSpinner } from '@/components/ui'

export default function EditEventPage() {
  const router = useRouter()
  const { id } = useParams()

  const [form, setForm] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    location: '',
  })

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!id) return

    fetch(`/api/events/${id}`)
      .then((res) => res.json())
      .then((data) => {
        const toLocal = (iso) =>
          new Date(iso).toISOString().slice(0, 16)

        setForm({
          title: data.title || '',
          description: data.description || '',
          startDate: toLocal(data.startDate),
          endDate: toLocal(data.endDate),
          location: data.location || '',
        })

        setLoading(false)
      })
      .catch(() => {
        toast.error("Impossible de charger l'événement")
        setLoading(false)
      })
  }, [id])

  const handleSubmit = async (e) => {
    e.preventDefault()

    setSaving(true)

    const toastId = toast.loading('Enregistrement...')

    const res = await fetch(`/api/admin/events/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form),
      credentials: 'include',
    })

    setSaving(false)

    if (res.ok) {
      toast.success('Événement mis à jour', {
        id: toastId,
      })

      router.push('/admin/events')
    } else {
      const data = await res.json().catch(() => ({}))

      toast.error(
        data.error || 'Erreur lors de la mise à jour',
        {
          id: toastId,
        }
      )
    }
  }

  if (loading) {
    return (
      <LoadingSpinner message="Chargement de l'événement..." />
    )
  }

  return (
    <div className="max-w-xl mx-auto p-8">
      <h1 className="mb-6 text-2xl font-bold text-[#F9FAFB]">
        Modifier l'événement
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-400">
            Titre
          </label>

          <input
            type="text"
            className="w-full rounded-lg border border-white/15 p-2.5 outline-none focus:ring-2 focus:ring-emerald-500"
            value={form.title}
            onChange={(e) =>
              setForm({
                ...form,
                title: e.target.value,
              })
            }
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-400">
            Description
          </label>

          <textarea
            className="w-full rounded-lg border border-white/15 p-2.5 outline-none focus:ring-2 focus:ring-emerald-500"
            rows="3"
            value={form.description}
            onChange={(e) =>
              setForm({
                ...form,
                description: e.target.value,
              })
            }
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-400">
            Date de début
          </label>

          <input
            type="datetime-local"
            className="w-full rounded-lg border border-white/15 p-2.5 outline-none focus:ring-2 focus:ring-emerald-500"
            value={form.startDate}
            onChange={(e) =>
              setForm({
                ...form,
                startDate: e.target.value,
              })
            }
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-400">
            Date de fin
          </label>

          <input
            type="datetime-local"
            className="w-full rounded-lg border border-white/15 p-2.5 outline-none focus:ring-2 focus:ring-emerald-500"
            value={form.endDate}
            onChange={(e) =>
              setForm({
                ...form,
                endDate: e.target.value,
              })
            }
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-400">
            Lieu
          </label>

          <input
            type="text"
            className="w-full rounded-lg border border-white/15 p-2.5 outline-none focus:ring-2 focus:ring-emerald-500"
            value={form.location}
            onChange={(e) =>
              setForm({
                ...form,
                location: e.target.value,
              })
            }
            required
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-[#10B981] px-5 py-2.5 font-medium text-white transition hover:bg-emerald-700 disabled:opacity-60"
          >
            {saving ? 'Enregistrement...' : 'Enregistrer'}
          </button>

          <button
            type="button"
            onClick={() => router.push('/admin/events')}
            className="rounded-lg border border-white/15 px-5 py-2.5 font-medium text-gray-400 transition hover:bg-[#111827]"
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  )
}