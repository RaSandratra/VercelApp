'use client'
import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useParticipant } from '@/context/AuthContext'
import toast from 'react-hot-toast'
import { ShieldCheckIcon, UserIcon } from '@heroicons/react/24/outline'

/**
 * Page de connexion unifiée.
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
      toast.success('Connexion admin réussie')
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
      setPseudoError('Le pseudo doit contenir au moins 2 caractères')
      return
    }
    loginParticipant(trimmed)
    toast.success(`Bienvenue, ${trimmed} !`)
    router.push('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-800 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-white tracking-tight">EventSync</h1>
          <p className="text-blue-200 mt-2">Rejoignez la conversation</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Onglets */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setTab('participant')}
              className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-semibold transition-colors ${
                tab === 'participant'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <UserIcon className="w-4 h-4" />
              Participant
            </button>
            <button
              onClick={() => setTab('admin')}
              className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-semibold transition-colors ${
                tab === 'admin'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
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
                  <h2 className="text-xl font-bold text-gray-800 mb-1">Espace participant</h2>
                  <p className="text-sm text-gray-500">
                    Choisissez un pseudo pour suivre vos sessions et poser des questions.
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Votre pseudo
                  </label>
                  <input
                    type="text"
                    value={pseudo}
                    onChange={(e) => { setPseudo(e.target.value); setPseudoError('') }}
                    placeholder="ex : Marie, JohnDoe42..."
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    autoFocus
                  />
                  {pseudoError && <p className="text-red-500 text-xs mt-1">{pseudoError}</p>}
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl transition duration-200"
                >
                  Rejoindre en tant que participant
                </button>
                <p className="text-xs text-center text-gray-400">
                  Vos favoris et questions seront sauvegardés localement.
                </p>
              </form>
            )}

            {/* === Onglet Admin === */}
            {tab === 'admin' && (
              <form onSubmit={handleAdminLogin} className="space-y-5">
                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-1">Espace administrateur</h2>
                  <p className="text-sm text-gray-500">
                    Accédez au tableau de bord de gestion.
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    required
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mot de passe
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    required
                  />
                </div>
                {adminError && (
                  <p className="text-red-500 text-sm text-center">{adminError}</p>
                )}
                <button
                  type="submit"
                  disabled={adminLoading}
                  className="w-full bg-gray-800 hover:bg-gray-900 disabled:opacity-60 text-white font-semibold py-2.5 rounded-xl transition duration-200"
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
