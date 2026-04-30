'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NewSpeakerPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', bio: '', photoUrl: '', links: '{}' })
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    // BUG FIX: JSON.parse peut planter si l'utilisateur saisit du JSON invalide
    let parsedLinks = {}
    try {
      parsedLinks = JSON.parse(form.links || '{}')
    } catch {
      setError('Le champ Liens doit être un JSON valide. Ex: {"twitter":"https://..."}')
      return
    }
    const res = await fetch('/api/admin/speakers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, links: parsedLinks }),
      credentials: 'include',
    })
    if (res.ok) router.push('/admin/speakers')
    else alert('Erreur lors de la création')
  }

  return (
    <div className="max-w-xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Nouvel intervenant</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Nom complet"
          className="w-full border p-2 rounded"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          required
        />
        <textarea
          placeholder="Biographie"
          className="w-full border p-2 rounded"
          rows="3"
          value={form.bio}
          onChange={e => setForm({ ...form, bio: e.target.value })}
        />
        <input
          type="url"
          placeholder="URL de la photo"
          className="w-full border p-2 rounded"
          value={form.photoUrl}
          onChange={e => setForm({ ...form, photoUrl: e.target.value })}
        />
        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Liens (JSON) — ex: {`{"twitter":"https://...","github":"https://..."}`}
          </label>
          <input
            type="text"
            className="w-full border p-2 rounded font-mono text-sm"
            value={form.links}
            onChange={e => setForm({ ...form, links: e.target.value })}
          />
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Créer
        </button>
      </form>
    </div>
  )
}
