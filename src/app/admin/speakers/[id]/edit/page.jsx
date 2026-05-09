'use client'
import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'

export default function EditSpeakerPage() {
  const router = useRouter()
  const { id } = useParams()
  const [form, setForm] = useState({ name: '', bio: '', photoUrl: '', links: '{}' })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    fetch(`/api/speakers/${id}`)
      .then(res => res.json())
      .then(data => {
        setForm({
          name: data.name,
          bio: data.bio || '',
          photoUrl: data.photoUrl || '',
          links: data.links ? JSON.stringify(data.links) : '{}'
        })
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [id])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const res = await fetch(`/api/admin/speakers/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        links: JSON.parse(form.links)
      }),
      credentials: 'include'
    })
    if (res.ok) {
      router.push('/admin/speakers')
    } else {
      const data = await res.json()
      alert(`Erreur : ${data.error || 'Mise à jour échouée'}`)
    }
  }

  if (loading) return <div className="p-8">Chargement...</div>

  return (
    <div className="max-w-xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Modifier l’intervenant</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" placeholder="Nom complet" className="w-full border p-2 rounded"
               value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
        <textarea placeholder="Biographie" className="w-full border p-2 rounded" rows="4"
                  value={form.bio} onChange={e => setForm({...form, bio: e.target.value})} />
        <input type="url" placeholder="URL de la photo" className="w-full border p-2 rounded"
               value={form.photoUrl} onChange={e => setForm({...form, photoUrl: e.target.value})} />
        <input type="text" placeholder='Liens JSON (ex: {"twitter":"https://..."})' className="w-full border p-2 rounded"
               value={form.links} onChange={e => setForm({...form, links: e.target.value})} />
        <button type="submit" className="bg-[#10B981] text-white px-4 py-2 rounded">Mettre à jour</button>
      </form>
    </div>
  )
}