'use client'
import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()
  const handleSubmit = async (e) => {
    e.preventDefault()
    const res = await signIn('credentials', { email, password, redirect: false })
    if (res?.error) setError('Identifiants invalides')
    else router.push('/admin/dashboard')
  }
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-96">
        <h1 className="text-2xl font-bold mb-4 text-center">Admin EventSync</h1>
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <input type="email" placeholder="Email" className="w-full border p-2 mb-2 rounded" value={email} onChange={e => setEmail(e.target.value)} required />
        <input type="password" placeholder="Mot de passe" className="w-full border p-2 mb-4 rounded" value={password} onChange={e => setPassword(e.target.value)} required />
        <button type="submit" className="bg-blue-600 text-white p-2 w-full rounded">Se connecter</button>
      </form>
    </div>
  )
}