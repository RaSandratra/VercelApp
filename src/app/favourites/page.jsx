'use client'
import { useFavorites } from '@/hooks/useFavorites'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function FavoritesPage() {
  const { favorites } = useFavorites()
  const [sessions, setSessions] = useState([])
  useEffect(() => {
    if (favorites.length === 0) return
    fetch(`/api/sessions?ids=${favorites.join(',')}`).then(res => res.json()).then(setSessions)
  }, [favorites])
  if (favorites.length === 0) return <div className="container mx-auto p-4">Aucune session favorite.</div>
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Mes sessions favorites</h1>
      <div className="grid gap-4">
        {sessions.map(s => (
          <Link key={s.id} href={`/sessions/${s.id}`} className="border p-4 rounded shadow">
            <h2 className="text-xl font-semibold">{s.title}</h2>
            <p className="text-gray-600">{s.description}</p>
            <p className="text-sm text-gray-500">{new Date(s.startTime).toLocaleString()} - {s.room}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}