import { useEffect, useState, useRef } from 'react'

export function useLiveStatus(sessionIds, intervalMs = 10000) {
  const [liveMap, setLiveMap] = useState({})
  // BUG FIX: sessionIds.join(',') dans le tableau de deps cause des re-renders infinis
  // quand le tableau est recréé à chaque render. On utilise une ref pour stabiliser.
  const idsKey = sessionIds.join(',')
  const idsKeyRef = useRef(idsKey)
  idsKeyRef.current = idsKey

  useEffect(() => {
    if (!idsKey) return

    const fetchStatus = async () => {
      try {
        const res = await fetch(`/api/sessions/live-status?ids=${idsKeyRef.current}`)
        if (res.ok) {
          const data = await res.json()
          setLiveMap(data)
        }
      } catch (error) {
        console.error('useLiveStatus error:', error)
      }
    }

    fetchStatus()
    const interval = setInterval(fetchStatus, intervalMs)
    return () => clearInterval(interval)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idsKey, intervalMs])

  return liveMap
}
