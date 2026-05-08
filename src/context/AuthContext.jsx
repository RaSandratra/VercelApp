'use client'
import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)


export function AuthProvider({ children }) {
  const [participant, setParticipant] = useState(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem('participant')
      if (stored) setParticipant(JSON.parse(stored))
    } catch {}
    setLoaded(true)
  }, [])

  const loginParticipant = (pseudo) => {
    const userId = `user_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
    const data = { userId, pseudo, createdAt: new Date().toISOString() }
    setParticipant(data)
    try { localStorage.setItem('participant', JSON.stringify(data)) } catch {}
    return data
  }

  const logoutParticipant = () => {
    setParticipant(null)
    try { localStorage.removeItem('participant') } catch {}
  }

  return (
    <AuthContext.Provider value={{ participant, loginParticipant, logoutParticipant, loaded }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useParticipant() {
  return useContext(AuthContext)
}
