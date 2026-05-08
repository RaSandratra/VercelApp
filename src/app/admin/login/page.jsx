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

    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    if (res?.error) {
      setError('Identifiants invalides')
    } else {
      router.push('/admin/dashboard')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#111827] px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl border border-white/10 bg-[#1F2937] p-8 shadow-xl"
      >
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-black text-[#F9FAFB]">
            Admin EventSync
          </h1>

          <p className="mt-2 text-sm text-gray-400">
            Connectez-vous pour accéder au tableau de bord.
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-400">
              Email
            </label>

            <input
              type="email"
              placeholder="admin@eventsync.com"
              className="w-full rounded-lg border border-white/15 bg-[#111827] px-4 py-2.5 text-[#F9FAFB] outline-none transition focus:border-[#10B981] focus:ring-2 focus:ring-[#10B981]/40"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-400">
              Mot de passe
            </label>

            <input
              type="password"
              placeholder="••••••••"
              className="w-full rounded-lg border border-white/15 bg-[#111827] px-4 py-2.5 text-[#F9FAFB] outline-none transition focus:border-[#10B981] focus:ring-2 focus:ring-[#10B981]/40"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="mt-6 w-full rounded-lg bg-[#10B981] px-4 py-2.5 font-semibold text-white transition hover:bg-emerald-700"
        >
          Se connecter
        </button>
      </form>
    </div>
  )
}