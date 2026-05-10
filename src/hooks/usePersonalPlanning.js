import { useEffect, useMemo, useState } from 'react'

const STORAGE_KEY = 'personalPlanning'

function normalizeSession(session) {
  return {
    id: session.id,
    title: session.title,
    startTime: new Date(session.startTime).toISOString(),
    endTime: new Date(session.endTime).toISOString(),
    room: session.room || '',
    eventTitle: session.eventTitle || session.event?.title || '',
  }
}

function hasTimeConflict(a, b) {
  if (a.id === b.id) return false

  const aStart = new Date(a.startTime).getTime()
  const aEnd = new Date(a.endTime).getTime()
  const bStart = new Date(b.startTime).getTime()
  const bEnd = new Date(b.endTime).getTime()

  return aStart < bEnd && aEnd > bStart
}

export function usePersonalPlanning() {
  const [plannedSessions, setPlannedSessions] = useState([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) setPlannedSessions(JSON.parse(stored))
    } catch {}

    setLoaded(true)
  }, [])

  const persist = (nextPlanning) => {
    setPlannedSessions(nextPlanning)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextPlanning))
    } catch {}
  }

  const addToPlanning = (session) => {
    const nextSession = normalizeSession(session)

    if (plannedSessions.some((item) => item.id === nextSession.id)) {
      return { ok: true, status: 'already-added' }
    }

    const conflict = plannedSessions.find((item) =>
      hasTimeConflict(nextSession, item)
    )

    if (conflict) {
      return { ok: false, status: 'conflict', conflict }
    }

    persist([...plannedSessions, nextSession])
    return { ok: true, status: 'added' }
  }

  const removeFromPlanning = (id) => {
    persist(plannedSessions.filter((item) => item.id !== id))
  }

  const togglePlanning = (session) => {
    const nextSession = normalizeSession(session)

    if (plannedSessions.some((item) => item.id === nextSession.id)) {
      removeFromPlanning(nextSession.id)
      return { ok: true, status: 'removed' }
    }

    return addToPlanning(nextSession)
  }

  const isPlanned = (id) => plannedSessions.some((item) => item.id === id)

  const plannedIds = useMemo(
    () => plannedSessions.map((item) => item.id),
    [plannedSessions]
  )

  return {
    addToPlanning,
    isPlanned,
    loaded,
    plannedIds,
    plannedSessions,
    removeFromPlanning,
    togglePlanning,
  }
}
