'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NewEventPage() {
  const router = useRouter()
  const [form, setForm] = useState({ title: '', description: '', startDate: '', endDate: '', location: '' })
  const handleSubmit = async (e) => {
    e.preventDefault()
    const res = await fetch('/api/admin/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
      credentials: 'include'
    })
    if (res.ok) router.push('/admin/events')
    else alert('Erreur')
  }
  return (
    <div className="max-w-xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Nouvel événement</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" placeholder="Titre" className="w-full border p-2 rounded" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
        <textarea placeholder="Description" className="w-full border p-2 rounded" rows="3" value={form.description} onChange={e => setForm({...form, description: e.target.value})} required />
        <input type="datetime-local" className="w-full border p-2 rounded" value={form.startDate} onChange={e => setForm({...form, startDate: e.target.value})} required />
        <input type="datetime-local" className="w-full border p-2 rounded" value={form.endDate} onChange={e => setForm({...form, endDate: e.target.value})} required />
        <input type="text" placeholder="Lieu" className="w-full border p-2 rounded" value={form.location} onChange={e => setForm({...form, location: e.target.value})} required />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Créer</button>
      </form>
    </div>
  )
}