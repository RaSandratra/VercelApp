'use client'
import { useState, useEffect, useCallback } from 'react'

export default function QuestionSection({ sessionId, isLive: isLiveInitial, startTime, endTime }) {
  const [questions, setQuestions] = useState([])
  const [content, setContent] = useState('')
  const [authorName, setAuthorName] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [userVotes, setUserVotes] = useState(new Set())

  useEffect(() => {
    const stored = localStorage.getItem('userUpvotes')
    if (stored) {
      const ids = JSON.parse(stored)
      setUserVotes(new Set(ids))
    }
  }, [])

  const addVoteToStorage = (questionId) => {
    const newVotes = new Set(userVotes)
    newVotes.add(questionId)
    setUserVotes(newVotes)
    localStorage.setItem('userUpvotes', JSON.stringify([...newVotes]))
  }

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

  const fetchQuestions = useCallback(async () => {
    try {
      const res = await fetch(`/api/sessions/${sessionId}/questions`)
      if (res.ok) setQuestions(await res.json())
    } catch (error) {
      console.error('Erreur chargement questions:', error)
    }
  }, [sessionId])

  useEffect(() => {
    fetchQuestions()
    if (!isLive) return
    const interval = setInterval(fetchQuestions, 5000)
    return () => clearInterval(interval)
  }, [sessionId, isLive, fetchQuestions])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!content.trim()) return
    setLoading(true)
    setSubmitError('')
    setSubmitSuccess(false)

    try {
      const res = await fetch(`/api/sessions/${sessionId}/questions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, authorName: authorName || null }),
      })
      const data = await res.json().catch(() => ({}))

      if (res.ok) {
        setContent('')
        setAuthorName('')
        setSubmitSuccess(true)
        setTimeout(() => setSubmitSuccess(false), 3000)
        fetchQuestions()
      } else if (res.status === 403) {
        setIsLive(false)
        setSubmitError('❌ La session n\'est plus en direct. Les questions sont fermées.')
      } else if (res.status === 400) {
        setSubmitError('⚠️ ' + (data.error || 'Le contenu de la question est requis.'))
      } else if (res.status === 404) {
        setSubmitError('⚠️ Session introuvable. Rechargez la page et réessayez.')
      } else {
        setSubmitError('❌ ' + (data.error || 'Erreur lors de l\'envoi, réessayez.'))
      }
    } catch {
      setSubmitError('❌ Erreur réseau. Vérifiez votre connexion et réessayez.')
    } finally {
      setLoading(false)
    }
  }

  const handleUpvote = async (questionId) => {
    if (userVotes.has(questionId)) {
      setSubmitError('Vous avez déjà voté pour cette question.')
      setTimeout(() => setSubmitError(''), 2000)
      return
    }
    try {
      const res = await fetch(`/api/questions/${questionId}/upvote`, { method: 'POST' })
      if (res.ok) {
        addVoteToStorage(questionId)
        fetchQuestions()
      } else {
        setSubmitError('Erreur lors du vote.')
        setTimeout(() => setSubmitError(''), 2000)
      }
    } catch (error) {
      console.error('Erreur upvote:', error)
      setSubmitError('Erreur réseau.')
      setTimeout(() => setSubmitError(''), 2000)
    }
  }

  return (
    <div>
      <h3 className="text-xl font-bold mb-4 text-gray-800">❓ Questions</h3>

      {isLive ? (
        <form onSubmit={handleSubmit} className="mb-6 space-y-3 bg-blue-50 border border-blue-100 rounded-xl p-4">
          <p className="text-sm font-medium text-blue-700">🔴 Session en direct — posez votre question</p>
          <textarea
            className="w-full border border-gray-300 p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-blue-400 outline-none resize-none"
            placeholder="Votre question..."
            rows={3}
            value={content}
            onChange={e => { setContent(e.target.value); setSubmitError('') }}
            required
          />
          <input
            className="w-full border border-gray-300 p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-blue-400 outline-none"
            placeholder="Votre nom (optionnel)"
            value={authorName}
            onChange={e => setAuthorName(e.target.value)}
          />
          {submitError && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-red-600 text-sm">
              {submitError}
            </div>
          )}
          {submitSuccess && (
            <div className="bg-green-50 border border-green-200 rounded-lg px-3 py-2 text-green-700 text-sm">
              ✅ Question envoyée avec succès !
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-5 py-2 rounded-lg text-sm font-medium transition"
          >
            {loading ? 'Envoi en cours...' : 'Poser la question'}
          </button>
        </form>
      ) : (
        <div className="mb-6 bg-gray-50 border border-gray-200 rounded-xl p-4">
          {submitError ? (
            <p className="text-red-500 text-sm">{submitError}</p>
          ) : (
            <p className="text-gray-500 text-sm">
              ⏳ Les nouvelles questions ne peuvent être posées que lorsque la session est en direct.
            </p>
          )}
        </div>
      )}

      {questions.length === 0 ? (
        <p className="text-gray-400 text-sm text-center py-6">Aucune question pour le moment.</p>
      ) : (
        <div className="space-y-3">
          {questions.map(q => (
            <div key={q.id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
              <p className="text-gray-800 font-medium">{q.content}</p>
              <div className="flex justify-between items-center mt-3">
                <span className="text-xs text-gray-400">
                  {q.authorName || 'Anonyme'}
                </span>
                <button
                  onClick={() => handleUpvote(q.id)}
                  disabled={userVotes.has(q.id)}
                  className={`flex items-center gap-1.5 rounded-full text-xs font-medium transition px-3 py-1 ${
                    userVotes.has(q.id)
                      ? 'bg-green-100 text-green-600 cursor-default'
                      : 'bg-gray-100 hover:bg-blue-100 hover:text-blue-700 text-gray-600'
                  }`}
                >
                  👍 {q.upvotes}
                  {userVotes.has(q.id) && <span className="ml-1">(déjà voté)</span>}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}