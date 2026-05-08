'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useParticipant } from '@/context/AuthContext'
import { UserCircleIcon, LockClosedIcon } from '@heroicons/react/24/outline'

export default function QuestionSection({ sessionId, isLive: isLiveInitial, startTime, endTime }) {
  const { participant, loaded } = useParticipant()

  const [questions, setQuestions] = useState([])
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [userVotes, setUserVotes] = useState(new Set())

  // Recalcul isLive côté client toutes les 10s
  const [isLive, setIsLive] = useState(isLiveInitial)

  useEffect(() => {
    if (!startTime || !endTime) return
    const check = () => {
      const now = new Date()
      setIsLive(now >= new Date(startTime) && now <= new Date(endTime))
    }
    check()
    const interval = setInterval(check, 10000)
    return () => clearInterval(interval)
  }, [startTime, endTime])

  // Charger les votes localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('userUpvotes')
      if (stored) setUserVotes(new Set(JSON.parse(stored)))
    } catch {}
  }, [])

  // Charger les questions — toujours visible (public)
  const fetchQuestions = useCallback(async () => {
    try {
      const res = await fetch(`/api/sessions/${sessionId}/questions`)
      if (res.ok) setQuestions(await res.json())
    } catch (err) {
      console.error('Erreur chargement questions:', err)
    }
  }, [sessionId])

  useEffect(() => {
    fetchQuestions()
    if (!isLive) return
    const interval = setInterval(fetchQuestions, 5000)
    return () => clearInterval(interval)
  }, [sessionId, isLive, fetchQuestions])

  // Upvote — accessible aux visiteurs non connectés
  const handleUpvote = async (questionId) => {
    if (userVotes.has(questionId)) return
    try {
      const res = await fetch(`/api/questions/${questionId}/upvote`, { method: 'POST' })
      if (res.ok) {
        const newVotes = new Set(userVotes)
        newVotes.add(questionId)
        setUserVotes(newVotes)
        try { localStorage.setItem('userUpvotes', JSON.stringify([...newVotes])) } catch {}
        fetchQuestions()
      }
    } catch (err) {
      console.error('Erreur upvote:', err)
    }
  }

  // Soumission question — participant connecté uniquement
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!content.trim() || !participant) return

    setLoading(true)
    setSubmitError('')
    setSubmitSuccess(false)

    try {
      const res = await fetch(`/api/sessions/${sessionId}/questions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          participantId: participant.userId,
          pseudo: participant.pseudo,
        }),
      })

      const data = await res.json().catch(() => ({}))

      if (res.ok) {
        setContent('')
        setSubmitSuccess(true)
        setTimeout(() => setSubmitSuccess(false), 3000)
        fetchQuestions()
      } else if (res.status === 401) {
        setSubmitError('🔒 Vous devez être connecté pour poser une question.')
      } else if (res.status === 403) {
        setIsLive(false)
        setSubmitError("❌ La session n'est plus en direct. Les questions sont fermées.")
      } else if (res.status === 400) {
        setSubmitError('⚠️ ' + (data.error || 'Le contenu est requis.'))
      } else if (res.status === 404) {
        setSubmitError('⚠️ Session introuvable. Rechargez la page.')
      } else {
        setSubmitError('❌ ' + (data.error || 'Erreur lors de l\'envoi, réessayez.'))
      }
    } catch {
      setSubmitError('❌ Erreur réseau. Vérifiez votre connexion.')
    } finally {
      setLoading(false)
    }
  }

  // Attendons que le contexte soit chargé (évite le flash)
  if (!loaded) return null

  return (
    <div>
      <h3 className="text-xl font-bold mb-4 text-[#F9FAFB]">❓ Questions</h3>

      {/* ═══ ZONE FORMULAIRE ═══ */}
      {isLive ? (
        <>
          {participant ? (
            /* ✅ Participant connecté — formulaire actif */
            <form onSubmit={handleSubmit} className="mb-6 space-y-3 bg-[#10B981]/10 border border-emerald-500/30 rounded-xl p-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-red-500 text-white animate-pulse">
                  🔴 LIVE
                </span>
                <div className="flex items-center gap-1.5 text-sm text-gray-300">
                  <UserCircleIcon className="w-4 h-4 text-emerald-400" />
                  <span>Connecté en tant que <span className="font-semibold text-emerald-400">{participant.pseudo}</span></span>
                </div>
              </div>

              <textarea
                className="w-full bg-[#1F2937] border border-white/15 text-[#F9FAFB] placeholder-gray-500 p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
                placeholder="Posez votre question à l'intervenant..."
                rows={3}
                value={content}
                onChange={e => { setContent(e.target.value); setSubmitError('') }}
                required
              />

              {submitError && (
                <div className="bg-red-500/10 border border-red-400/30 rounded-lg px-3 py-2 text-red-300 text-sm">
                  {submitError}
                </div>
              )}
              {submitSuccess && (
                <div className="bg-emerald-500/10 border border-emerald-400/30 rounded-lg px-3 py-2 text-emerald-300 text-sm">
                  ✅ Question envoyée avec succès !
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !content.trim()}
                className="bg-[#10B981] hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-5 py-2 rounded-lg text-sm font-semibold transition"
              >
                {loading ? 'Envoi en cours...' : 'Poser la question'}
              </button>
            </form>
          ) : (
            /* 🔒 Visiteur non connecté — invitation à se connecter */
            <div className="mb-6 border border-emerald-500/20 bg-[#111827] rounded-xl p-5">
              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-full bg-emerald-500/10 shrink-0">
                  <LockClosedIcon className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-[#F9FAFB] mb-1">
                    Connectez-vous pour participer
                  </p>
                  <p className="text-xs text-gray-400 mb-4">
                    La session est en direct ! Créez un compte participant gratuit pour poser vos questions aux intervenants.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Link
                      href="/login"
                      className="inline-flex items-center gap-2 bg-[#10B981] hover:bg-emerald-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition"
                    >
                      <UserCircleIcon className="w-4 h-4" />
                      Se connecter / S'inscrire
                    </Link>
                    <span className="text-xs text-gray-500 self-center">
                      Rapide — juste un pseudo
                    </span>
                  </div>
                </div>
              </div>
              {/* Note : l'upvote reste accessible aux visiteurs */}
              <p className="text-xs text-gray-500 mt-4 pt-3 border-t border-white/5">
                💡 Vous pouvez quand même voter pour les questions existantes sans vous connecter.
              </p>
            </div>
          )}
        </>
      ) : (
        /* Session non live */
        <div className="mb-6 bg-[#111827] border border-white/10 rounded-xl p-4">
          <p className="text-gray-400 text-sm">
            ⏳ Les questions sont ouvertes uniquement pendant les sessions en direct.
          </p>
        </div>
      )}

      {/* ═══ LISTE DES QUESTIONS — toujours visible ═══ */}
      {questions.length === 0 ? (
        <p className="text-gray-500 text-sm text-center py-6 border border-dashed border-white/10 rounded-xl">
          Aucune question pour le moment.
        </p>
      ) : (
        <div className="space-y-3">
          {questions.map(q => (
            <div
              key={q.id}
              className="bg-[#1F2937] border border-white/10 rounded-xl p-4 shadow-sm"
            >
              <p className="text-[#F9FAFB] font-medium leading-relaxed">{q.content}</p>
              <div className="flex justify-between items-center mt-3">
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  <UserCircleIcon className="w-3.5 h-3.5" />
                  <span>{q.authorName || 'Anonyme'}</span>
                </div>
                {/* Upvote accessible à tous — connecté ou non */}
                <button
                  onClick={() => handleUpvote(q.id)}
                  disabled={userVotes.has(q.id)}
                  title={userVotes.has(q.id) ? 'Déjà voté' : 'Voter pour cette question'}
                  className={`flex items-center gap-1.5 rounded-full text-xs font-medium transition px-3 py-1.5 ${
                    userVotes.has(q.id)
                      ? 'bg-[#10B981]/15 text-[#10B981] cursor-default'
                      : 'bg-white/5 hover:bg-[#10B981]/15 hover:text-[#10B981] text-gray-400 cursor-pointer'
                  }`}
                >
                  👍 {q.upvotes}
                  {userVotes.has(q.id) && <span className="opacity-60">(voté)</span>}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
