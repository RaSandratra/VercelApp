'use client'
import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useParticipant } from '@/context/AuthContext'
import toast from 'react-hot-toast'
import { ShieldCheckIcon, UserIcon } from '@heroicons/react/24/outline'

/**
 * Page de connexion unifiÃ©e.
 * Onglet Admin : via NextAuth (credentials)
 * Onglet Participant : pseudo + session localStorage
 */
export default function LoginPage() {
  const [tab, setTab] = useState('participant')
  const router = useRouter()
  const { loginParticipant } = useParticipant()

  // --- Formulaire admin ---
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [adminError, setAdminError] = useState('')
  const [adminLoading, setAdminLoading] = useState(false)

  const handleAdminLogin = async (e) => {
    e.preventDefault()
    setAdminError('')
    setAdminLoading(true)
    const res = await signIn('credentials', { email, password, redirect: false })
    setAdminLoading(false)
    if (res?.error) {
      setAdminError('Email ou mot de passe incorrect')
      toast.error('Identifiants invalides')
    } else {
      toast.success('Connexion admin rÃ©ussie')
      router.push('/admin/dashboard')
    }
  }

  // --- Formulaire participant ---
  const [pseudo, setPseudo] = useState('')
  const [pseudoError, setPseudoError] = useState('')

  const handleParticipantLogin = (e) => {
    e.preventDefault()
    const trimmed = pseudo.trim()
    if (!trimmed || trimmed.length < 2) {
      setPseudoError('Le pseudo doit contenir au moins 2 caractÃ¨res')
      return
    }
    loginParticipant(trimmed)
    toast.success(`Bienvenue, ${trimmed} !`)
    router.push('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-600 to-emerald-800 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-white tracking-tight">EventSync</h1>
          <p className="text-emerald-200 mt-2">Rejoignez la conversation</p>
        </div>

        {/* Card */}
        <div className="bg-[#1F2937] rounded-2xl shadow-2xl overflow-hidden">
          {/* Onglets */}
          <div className="flex border-b border-white/10">
            <button
              onClick={() => setTab('participant')}
              className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-semibold transition-colors ${
                tab === 'participant'
                  ? 'text-[#10B981] border-b-2 border-emerald-600 bg-[#10B981]/15'
                  : 'text-gray-400 hover:text-gray-400 hover:bg-[#111827]'
              }`}
            >
              <UserIcon className="w-4 h-4" />
              Participant
            </button>
            <button
              onClick={() => setTab('admin')}
              className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-semibold transition-colors ${
                tab === 'admin'
                  ? 'text-[#10B981] border-b-2 border-emerald-600 bg-[#10B981]/15'
                  : 'text-gray-400 hover:text-gray-400 hover:bg-[#111827]'
              }`}
            >
              <ShieldCheckIcon className="w-4 h-4" />
              Administrateur
            </button>
          </div>

          <div className="p-8">
            {/* === Onglet Participant === */}
            {tab === 'participant' && (
              <form onSubmit={handleParticipantLogin} className="space-y-5">
                <div>
                  <h2 className="text-xl font-bold text-[#F9FAFB] mb-1">Espace participant</h2>
                  <p className="text-sm text-gray-400">
                    Choisissez un pseudo pour suivre vos sessions et poser des questions.
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Votre pseudo
                  </label>
                  <input
                    type="text"
                    value={pseudo}
                    onChange={(e) => { setPseudo(e.target.value); setPseudoError('') }}
                    placeholder="ex : Marie, JohnDoe42..."
                    className="w-full px-4 py-2.5 border border-white/15 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                    autoFocus
                  />
                  {pseudoError && <p className="text-red-500 text-xs mt-1">{pseudoError}</p>}
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#10B981] hover:bg-emerald-700 text-white font-semibold py-2.5 rounded-xl transition duration-200"
                >
                  Rejoindre en tant que participant
                </button>
                <p className="text-xs text-center text-gray-400">
                  Vos favoris et questions seront sauvegardÃ©s localement.
                </p>
              </form>
            )}

            {/* === Onglet Admin === */}
            {tab === 'admin' && (
              <form onSubmit={handleAdminLogin} className="space-y-5">
                <div>
                  <h2 className="text-xl font-bold text-[#F9FAFB] mb-1">Espace administrateur</h2>
                  <p className="text-sm text-gray-400">
                    AccÃ©dez au tableau de bord de gestion.
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 border border-white/15 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                    required
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Mot de passe
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2.5 border border-white/15 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                    required
                  />
                </div>
                {adminError && (
                  <p className="text-red-500 text-sm text-center">{adminError}</p>
                )}
                <button
                  type="submit"
                  disabled={adminLoading}
                  className="w-full bg-[#10B981] hover:bg-emerald-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-xl transition duration-200"
                >
                  {adminLoading ? 'Connexion...' : 'Se connecter'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}





