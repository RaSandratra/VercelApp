'use client'
import { useState, useEffect, useCallback } from 'react'

export default function QuestionSection({ sessionId, isLive }) {
  const [questions, setQuestions] = useState([])
  const [content, setContent] = useState('')
  const [authorName, setAuthorName] = useState('')
  const [loading, setLoading] = useState(false)

  // BUG FIX: fetchQuestions doit être useCallback pour éviter des re-renders infinis
  // dans le tableau de dépendances de useEffect
  const fetchQuestions = useCallback(async () => {
    try {
      // BUG FIX: La route était /api/sessions/{id}/questions, pas /api/sessions/live-status/[id]/questions
      const res = await fetch(`/api/sessions/${sessionId}/questions`)
      if (res.ok) setQuestions(await res.json())
    } catch (error) {
      console.error('Erreur chargement questions:', error)
    }
  }, [sessionId])

  useEffect(() => {
    if (!isLive) return
    fetchQuestions()
    const interval = setInterval(fetchQuestions, 5000)
    return () => clearInterval(interval)
  }, [sessionId, isLive, fetchQuestions])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!content.trim()) return
    setLoading(true)
    try {
      const res = await fetch(`/api/sessions/${sessionId}/questions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, authorName: authorName || null }),
      })
      if (res.ok) {
        setContent('')
        fetchQuestions()
      }
    } catch (error) {
      console.error('Erreur envoi question:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpvote = async (questionId) => {
    try {
      await fetch(`/api/questions/${questionId}/upvote`, { method: 'POST' })
      fetchQuestions()
    } catch (error) {
      console.error('Erreur upvote:', error)
    }
  }

  if (!isLive) {
    return (
      <p className="text-gray-500 mt-8">
        Les questions seront disponibles quand la session sera en direct.
      </p>
    )
  }

  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold mb-4">Questions</h3>
      <form onSubmit={handleSubmit} className="my-4 space-y-2">
        <textarea
          className="w-full border p-2 rounded"
          placeholder="Votre question..."
          value={content}
          onChange={e => setContent(e.target.value)}
          required
        />
        <input
          className="w-full border p-2 rounded"
          placeholder="Votre nom (optionnel)"
          value={authorName}
          onChange={e => setAuthorName(e.target.value)}
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? 'Envoi...' : 'Poser'}
        </button>
      </form>
      <div className="space-y-3">
        {questions.map(q => (
          <div key={q.id} className="border p-3 rounded">
            <p>{q.content}</p>
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm text-gray-500">{q.authorName || 'Anonyme'}</span>
              <button
                onClick={() => handleUpvote(q.id)}
                className="bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded transition"
              >
                👍 {q.upvotes}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
