'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useParticipant } from '@/context/AuthContext'
import {
  UserCircleIcon,
  LockClosedIcon,
} from '@heroicons/react/24/outline'

export default function QuestionSection({
  sessionId,
  isLive: isLiveInitial,
  startTime,
  endTime,
}) {
  const { participant, loaded } = useParticipant()
  const { data: adminSession } = useSession()

  const [questions, setQuestions] = useState([])
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [submitSuccess, setSubmitSuccess] =
    useState(false)

  const [userVotes, setUserVotes] = useState(
    new Set()
  )

  const adminEmail = adminSession?.user?.email
  const voterKey = participant?.userId
    ? `participant:${participant.userId}`
    : adminEmail
      ? `admin:${adminEmail}`
      : 'visitor:anonymous'

  const voteStorageKey = `userUpvotes:${voterKey}`

  // Recalcul isLive côté client toutes les 10 s
  const [isLive, setIsLive] = useState(isLiveInitial)

  useEffect(() => {
    if (!startTime || !endTime) return

    const check = () => {
      const now = new Date()

      setIsLive(
        now >= new Date(startTime) &&
          now <= new Date(endTime)
      )
    }

    check()

    const interval = setInterval(check, 10000)

    return () => clearInterval(interval)
  }, [startTime, endTime])

  // Charger les votes localStorage pour l'identité courante.
  useEffect(() => {
    try {
      const stored = localStorage.getItem(voteStorageKey)

      if (stored) {
        setUserVotes(new Set(JSON.parse(stored)))
      } else {
        setUserVotes(new Set())
      }
    } catch {}
  }, [voteStorageKey])

  // Charger les questions — toujours visible (public)
  const fetchQuestions = useCallback(async () => {
    try {
      const res = await fetch(
        `/api/sessions/${sessionId}/questions`
      )

      if (res.ok) {
        setQuestions(await res.json())
      }
    } catch (err) {
      console.error(
        'Erreur lors du chargement des questions :',
        err
      )
    }
  }, [sessionId])

  useEffect(() => {
    fetchQuestions()

    if (!isLive) return

    const interval = setInterval(fetchQuestions, 5000)

    return () => clearInterval(interval)
  }, [sessionId, isLive, fetchQuestions])

  // Upvote — un vote par question et par identité locale
  const handleUpvote = async (questionId) => {
    if (userVotes.has(questionId)) return

    try {
      const res = await fetch(
        `/api/questions/${questionId}/upvote`,
        {
          method: 'POST',
        }
      )

      if (res.ok) {
        const newVotes = new Set(userVotes)

        newVotes.add(questionId)

        setUserVotes(newVotes)

        try {
          localStorage.setItem(
            voteStorageKey,
            JSON.stringify([...newVotes])
          )
        } catch {}

        fetchQuestions()
      }
    } catch (err) {
      console.error(
        "Erreur lors de l'upvote :",
        err
      )
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
      const res = await fetch(
        `/api/sessions/${sessionId}/questions`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            content,
            participantId: participant.userId,
            pseudo: participant.pseudo,
          }),
        }
      )

      const data = await res
        .json()
        .catch(() => ({}))

      if (res.ok) {
        setContent('')
        setSubmitSuccess(true)

        setTimeout(
          () => setSubmitSuccess(false),
          3000
        )

        fetchQuestions()
      } else if (res.status === 401) {
        setSubmitError(
          '🔒 Vous devez être connecté pour poser une question.'
        )
      } else if (res.status === 403) {
        setIsLive(false)

        setSubmitError(
          "❌ La session n'est plus en direct. Les questions sont fermées."
        )
      } else if (res.status === 400) {
        setSubmitError(
          '⚠️ ' +
            (data.error ||
              'Le contenu est requis.')
        )
      } else if (res.status === 404) {
        setSubmitError(
          '⚠️ Session introuvable. Rechargez la page.'
        )
      } else {
        setSubmitError(
          '❌ ' +
            (data.error ||
              "Erreur lors de l'envoi, réessayez.")
        )
      }
    } catch {
      setSubmitError(
        '❌ Erreur réseau. Vérifiez votre connexion.'
      )
    } finally {
      setLoading(false)
    }
  }

  // Attendons que le contexte soit chargé
  if (!loaded) return null

  return (
    <div>
      <h3 className="mb-4 text-xl font-bold text-[#F9FAFB]">
        ❓ Questions
      </h3>

      {/* ═══ ZONE FORMULAIRE ═══ */}
      {isLive ? (
        <>
          {participant ? (
            /* ✅ Participant connecté — formulaire actif */
            <form
              onSubmit={handleSubmit}
              className="mb-6 space-y-3 rounded-xl border border-emerald-500/30 bg-[#10B981]/10 p-4"
            >
              <div className="flex items-center gap-2">
                <span className="animate-pulse rounded-full bg-red-500 px-2 py-0.5 text-xs font-semibold text-white">
                  🔴 LIVE
                </span>

                <div className="flex items-center gap-1.5 text-sm text-gray-300">
                  <UserCircleIcon className="h-4 w-4 text-emerald-400" />

                  <span>
                    Connecté en tant que{' '}
                    <span className="font-semibold text-emerald-400">
                      {participant.pseudo}
                    </span>
                  </span>
                </div>
              </div>

              <textarea
                className="w-full resize-none rounded-lg border border-white/15 bg-[#1F2937] p-2.5 text-sm text-[#F9FAFB] placeholder-gray-500 outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Posez votre question à l'intervenant..."
                rows={3}
                value={content}
                onChange={(e) => {
                  setContent(e.target.value)
                  setSubmitError('')
                }}
                required
              />

              {submitError && (
                <div className="rounded-lg border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
                  {submitError}
                </div>
              )}

              {submitSuccess && (
                <div className="rounded-lg border border-emerald-400/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">
                  ✅ Question envoyée avec succès !
                </div>
              )}

              <button
                type="submit"
                disabled={
                  loading || !content.trim()
                }
                className="rounded-lg bg-[#10B981] px-5 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading
                  ? 'Envoi en cours...'
                  : 'Poser la question'}
              </button>
            </form>
          ) : (
            /* 🔒 Visiteur non connecté */
            <div className="mb-6 rounded-xl border border-emerald-500/20 bg-[#111827] p-5">
              <div className="flex items-start gap-4">
                <div className="shrink-0 rounded-full bg-emerald-500/10 p-2.5">
                  <LockClosedIcon className="h-5 w-5 text-emerald-400" />
                </div>

                <div className="flex-1">
                  <p className="mb-1 text-sm font-semibold text-[#F9FAFB]">
                    Connectez-vous pour participer
                  </p>

                  <p className="mb-4 text-xs text-gray-400">
                    La session est en direct !
                    Créez un compte participant
                    gratuit pour poser vos questions
                    aux intervenants.
                  </p>

                  <div className="flex flex-wrap gap-3">
                    <Link
                      href="/login"
                      className="inline-flex items-center gap-2 rounded-lg bg-[#10B981] px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600"
                    >
                      <UserCircleIcon className="h-4 w-4" />
                      Se connecter / S'inscrire
                    </Link>

                    <span className="self-center text-xs text-gray-500">
                      Rapide — juste un pseudo
                    </span>
                  </div>
                </div>
              </div>

              {/* Note : l'upvote reste accessible aux visiteurs */}
              <p className="mt-4 border-t border-white/5 pt-3 text-xs text-gray-500">
                💡 Vous pouvez quand même voter
                pour les questions existantes sans
                vous connecter.
              </p>
            </div>
          )}
        </>
      ) : (
        /* Session non live */
        <div className="mb-6 rounded-xl border border-white/10 bg-[#111827] p-4">
          <p className="text-sm text-gray-400">
            ⏳ Les questions sont ouvertes
            uniquement pendant les sessions en
            direct.
          </p>
        </div>
      )}

      {/* ═══ LISTE DES QUESTIONS ═══ */}
      {questions.length === 0 ? (
        <p className="rounded-xl border border-dashed border-white/10 py-6 text-center text-sm text-gray-500">
          Aucune question pour le moment.
        </p>
      ) : (
        <div className="space-y-3">
          {questions.map((q) => (
            <div
              key={q.id}
              className="rounded-xl border border-white/10 bg-[#1F2937] p-4 shadow-sm"
            >
              <p className="font-medium leading-relaxed text-[#F9FAFB]">
                {q.content}
              </p>

              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  <UserCircleIcon className="h-3.5 w-3.5" />

                  <span>
                    {q.authorName || 'Anonyme'}
                  </span>
                </div>

                {/* Upvote accessible à tous */}
                <button
                  onClick={() =>
                    handleUpvote(q.id)
                  }
                  disabled={userVotes.has(q.id)}
                  title={
                    userVotes.has(q.id)
                      ? 'Déjà voté'
                      : 'Voter pour cette question'
                  }
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition ${
                    userVotes.has(q.id)
                      ? 'cursor-default bg-[#10B981]/15 text-[#10B981]'
                      : 'cursor-pointer bg-white/5 text-gray-400 hover:bg-[#10B981]/15 hover:text-[#10B981]'
                  }`}
                >
                  👍 {q.upvotes}

                  {userVotes.has(q.id) && (
                    <span className="opacity-60">
                      (voté)
                    </span>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
