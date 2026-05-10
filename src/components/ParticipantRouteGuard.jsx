'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useParticipant } from '@/context/AuthContext'

const PUBLIC_PATHS = ['/login']

function isPublicPath(pathname) {
  return (
    PUBLIC_PATHS.includes(pathname) ||
    pathname.startsWith('/admin')
  )
}

export default function ParticipantRouteGuard({ children }) {
  const pathname = usePathname()
  const router = useRouter()
  const { participant, loaded } = useParticipant()
  const publicPath = isPublicPath(pathname || '/')

  useEffect(() => {
    if (!loaded || publicPath || participant) return

    router.replace('/login')
  }, [loaded, participant, publicPath, router])

  if (!loaded) return null

  if (!publicPath && !participant) return null

  return children
}
