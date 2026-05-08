'use client'
import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import toast from 'react-hot-toast'
import { LoadingSpinner } from '@/components/ui'

export default function EditSessionPage() {
  const router = useRouter()
  const { id } = useParams()
  const [form, setForm] = useState({
    title: '', description: '', startTime: '', endTime: '',
    room: '', capacity: '', eventId: '', speakerIds: []
  })
  const [events, setEvents] = useState([])
  const [speakers, setSpeakers] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!id) return
    const toLocal = (iso) => new Date(iso).toISOString().slice(0, 16)

    Promise.all([
      fetch(`/api/sessions/${id}`).then(r => r.json()),
      fetch('/api/events').then(r => r.json()),
      fetch('/api/speakers').then(r => r.json()),
    ])
      .then(([session, eventsData, speakersData]) => {
        setForm({
          title: session.title || '',
          description: session.description || '',
          startTime: toLocal(session.startTime),
          endTime: toLocal(session.endTime),
          room: session.room || '',
          capacity: session.capacity || '',
          eventId: session.eventId || '',
          speakerIds: session.speakers?.map(s => s.id) || [],
        })
        setEvents(eventsData)
        setSpeakers(speakersData)
        setLoading(false)
      })
      .catch(() => { toast.error('Impossible de charger la session'); setLoading(false) })
  }, [id])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    const toastId = toast.loading('Enregistrement...')
    const res = await fetch(`/api/admin/sessions/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
      credentials: 'include',
    })
    setSaving(false)
    if (res.ok) {
      toast.success('Session mise Ã  jour', { id: toastId })
      router.push('/admin/sessions')
    } else {
      const data = await res.json().catch(() => ({}))
      toast.error(data.error || 'Erreur lors de la mise Ã  jour', { id: toastId })
    }
  }

  if (loading) return <LoadingSpinner message="Chargement de la session..." />

  return (
    <div className="max-w-xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6 text-[#F9FAFB]">Modifier la session</h1>
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
            rows="2"
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">DÃ©but</label>
          <input
            type="datetime-local"
            className="w-full border border-white/15 p-2.5 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
            value={form.startTime}
            onChange={e => setForm({ ...form, startTime: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Fin</label>
          <input
            type="datetime-local"
            className="w-full border border-white/15 p-2.5 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
            value={form.endTime}
            onChange={e => setForm({ ...form, endTime: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Salle</label>
          <input
            type="text"
            className="w-full border border-white/15 p-2.5 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
            value={form.room}
            onChange={e => setForm({ ...form, room: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">CapacitÃ© (optionnel)</label>
          <input
            type="number"
            min="1"
            className="w-full border border-white/15 p-2.5 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
            value={form.capacity}
            onChange={e => setForm({ ...form, capacity: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Ã‰vÃ©nement</label>
          <select
            className="w-full border border-white/15 p-2.5 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
            value={form.eventId}
            onChange={e => setForm({ ...form, eventId: e.target.value })}
            required
          >
            <option value="">Choisir un Ã©vÃ©nement</option>
            {events.map(ev => <option key={ev.id} value={ev.id}>{ev.title}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Intervenants (Ctrl+clic pour sÃ©lection multiple)
          </label>
          <select
            multiple
            className="w-full border border-white/15 p-2.5 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none h-32"
            value={form.speakerIds}
            onChange={e => setForm({ ...form, speakerIds: Array.from(e.target.selectedOptions, opt => opt.value) })}
          >
            {speakers.map(sp => <option key={sp.id} value={sp.id}>{sp.name}</option>)}
          </select>
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
            onClick={() => router.push('/admin/sessions')}
            className="border border-white/15 hover:bg-[#111827] text-gray-400 px-5 py-2.5 rounded-lg font-medium transition"
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  )
}





