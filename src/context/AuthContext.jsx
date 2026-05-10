'use client'
import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)
const PARTICIPANT_SESSION_KEY = 'participantSession'


export function AuthProvider({ children }) {
  const [participant, setParticipant] = useState(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    try {
      // Nettoie l'ancienne session persistante qui laissait explorer sans vraie reconnexion.
      localStorage.removeItem('participant')

      const stored = sessionStorage.getItem(PARTICIPANT_SESSION_KEY)
      if (stored) setParticipant(JSON.parse(stored))
    } catch {}
    setLoaded(true)
  }, [])

  const loginParticipant = (pseudo) => {
    const userId = `user_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
    const data = { userId, pseudo, createdAt: new Date().toISOString() }
    setParticipant(data)
    try { sessionStorage.setItem(PARTICIPANT_SESSION_KEY, JSON.stringify(data)) } catch {}
    return data
  }

  const logoutParticipant = () => {
    setParticipant(null)
    try {
      sessionStorage.removeItem(PARTICIPANT_SESSION_KEY)
      localStorage.removeItem('participant')
    } catch {}
  }

  const updateParticipantPhoto = (photoUrl) => {
    setParticipant((current) => {
      if (!current) return current

      const updated = { ...current, photoUrl }
      try {
        sessionStorage.setItem(PARTICIPANT_SESSION_KEY, JSON.stringify(updated))
      } catch {}
      return updated
    })
  }

  return (
    <AuthContext.Provider value={{ participant, loginParticipant, logoutParticipant, updateParticipantPhoto, loaded }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useParticipant() {
  return useContext(AuthContext)
}
