'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NewSessionPage() {
  const router = useRouter()
  const [events, setEvents] = useState([])
  const [speakers, setSpeakers] = useState([])
  const [form, setForm] = useState({
    title: '', description: '', startTime: '', endTime: '', room: '', capacity: '', eventId: '', speakerIds: []
  })
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/events').then(r => r.json()).then(setEvents).catch(console.error)
    // BUG FIX: /api/speakers n'existait pas — route créée
    fetch('/api/speakers').then(r => r.json()).then(setSpeakers).catch(console.error)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const res = await fetch('/api/admin/sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
      credentials: 'include', // BUG FIX: credentials manquant sur les requêtes admin
    })
    if (res.ok) router.push('/admin/sessions')
    else {
      const data = await res.json().catch(() => ({}))
      setError(data.error || 'Erreur lors de la création')
    }
  }

  return (
    <div className="max-w-xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Nouvelle session</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" placeholder="Titre" className="w-full border p-2 rounded" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
        <textarea placeholder="Description" className="w-full border p-2 rounded" rows="2" value={form.description} onChange={e => setForm({...form, description: e.target.value})} required />
        <div>
          <label className="block text-sm text-gray-600 mb-1">Début</label>
          <input type="datetime-local" className="w-full border p-2 rounded" value={form.startTime} onChange={e => setForm({...form, startTime: e.target.value})} required />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Fin</label>
          <input type="datetime-local" className="w-full border p-2 rounded" value={form.endTime} onChange={e => setForm({...form, endTime: e.target.value})} required />
        </div>
        <input type="text" placeholder="Salle" className="w-full border p-2 rounded" value={form.room} onChange={e => setForm({...form, room: e.target.value})} required />
        <input type="number" placeholder="Capacité (optionnel)" className="w-full border p-2 rounded" value={form.capacity} onChange={e => setForm({...form, capacity: e.target.value})} min="1" />
        <select className="w-full border p-2 rounded" value={form.eventId} onChange={e => setForm({...form, eventId: e.target.value})} required>
          <option value="">Choisir un événement</option>
          {events.map(ev => <option key={ev.id} value={ev.id}>{ev.title}</option>)}
        </select>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Intervenants (Ctrl+clic pour sélection multiple)</label>
          <select multiple className="w-full border p-2 rounded h-32" value={form.speakerIds} onChange={e => setForm({...form, speakerIds: Array.from(e.target.selectedOptions, opt => opt.value)})}>
            {speakers.map(sp => <option key={sp.id} value={sp.id}>{sp.name}</option>)}
          </select>
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Créer</button>
      </form>
    </div>
  )
}
