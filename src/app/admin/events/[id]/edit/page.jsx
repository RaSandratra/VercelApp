'use client'
import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import toast from 'react-hot-toast'
import { LoadingSpinner } from '@/components/ui'

export default function EditEventPage() {
  const router = useRouter()
  const { id } = useParams()
  const [form, setForm] = useState({ title: '', description: '', startDate: '', endDate: '', location: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!id) return
    fetch(`/api/events/${id}`)
      .then(res => res.json())
      .then(data => {
        // Convertit les dates ISO en format datetime-local (YYYY-MM-DDTHH:mm)
        const toLocal = (iso) => new Date(iso).toISOString().slice(0, 16)
        setForm({
          title: data.title || '',
          description: data.description || '',
          startDate: toLocal(data.startDate),
          endDate: toLocal(data.endDate),
          location: data.location || '',
        })
        setLoading(false)
      })
      .catch(() => { toast.error('Impossible de charger l\'Ã©vÃ©nement'); setLoading(false) })
  }, [id])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    const toastId = toast.loading('Enregistrement...')
    const res = await fetch(`/api/admin/events/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
      credentials: 'include',
    })
    setSaving(false)
    if (res.ok) {
      toast.success('Ã‰vÃ©nement mis Ã  jour', { id: toastId })
      router.push('/admin/events')
    } else {
      const data = await res.json().catch(() => ({}))
      toast.error(data.error || 'Erreur lors de la mise Ã  jour', { id: toastId })
    }
  }

  if (loading) return <LoadingSpinner message="Chargement de l'Ã©vÃ©nement..." />

  return (
    <div className="max-w-xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6 text-[#F9FAFB]">Modifier l'Ã©vÃ©nement</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Titre</label>
          <input
            type="text"
            className="w-full border border-white/15 p-2.5 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
          <textarea
            className="w-full border border-white/15 p-2.5 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
            rows="3"
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Date de dÃ©but</label>
          <input
            type="datetime-local"
            className="w-full border border-white/15 p-2.5 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
            value={form.startDate}
            onChange={e => setForm({ ...form, startDate: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Date de fin</label>
          <input
            type="datetime-local"
            className="w-full border border-white/15 p-2.5 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
            value={form.endDate}
            onChange={e => setForm({ ...form, endDate: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Lieu</label>
          <input
            type="text"
            className="w-full border border-white/15 p-2.5 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
            value={form.location}
            onChange={e => setForm({ ...form, location: e.target.value })}
            required
          />
        </div>
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="bg-[#10B981] hover:bg-emerald-700 disabled:opacity-60 text-white px-5 py-2.5 rounded-lg font-medium transition"
          >
            {saving ? 'Enregistrement...' : 'Enregistrer'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/admin/events')}
            className="border border-white/15 hover:bg-[#111827] text-gray-400 px-5 py-2.5 rounded-lg font-medium transition"
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  )
}





