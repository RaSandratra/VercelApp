'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import { useEffect, useMemo, useState } from 'react'
import {
  ArrowLeftEndOnRectangleIcon,
  ArrowTopRightOnSquareIcon,
  BuildingOfficeIcon,
  CalendarDaysIcon,
  ChartBarIcon,
  MoonIcon,
  PlayCircleIcon,
  SparklesIcon,
  SunIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline'
import { useTheme } from '@/context/ThemeContext'
import ProfilePhotoButton from '@/components/ProfilePhotoButton'

const navItems = [
  { href: '/admin/dashboard', label: 'Tableau de bord', icon: ChartBarIcon },
  { href: '/admin/events', label: 'Événements', icon: CalendarDaysIcon },
  { href: '/admin/sessions', label: 'Sessions', icon: PlayCircleIcon },
  { href: '/admin/speakers', label: 'Intervenants', icon: UserGroupIcon },
  { href: '/admin/rooms', label: 'Salles', icon: BuildingOfficeIcon },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const { isDark, toggleTheme } = useTheme()
  const { data: session } = useSession()
  const [adminPhotoUrl, setAdminPhotoUrl] = useState('')
  const adminEmail = session?.user?.email || ''
  const adminName = useMemo(
    () => adminEmail.split('@')[0] || 'Admin',
    [adminEmail]
  )

  useEffect(() => {
    if (!adminEmail) return

    try {
      setAdminPhotoUrl(localStorage.getItem(`adminPhoto:${adminEmail}`) || '')
    } catch {}
  }, [adminEmail])

  const handleAdminPhotoChange = (photoUrl) => {
    setAdminPhotoUrl(photoUrl)

    try {
      localStorage.setItem(`adminPhoto:${adminEmail}`, photoUrl)
    } catch {}
  }

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-white/10 bg-[#1F2937] shadow-sm lg:flex">
      <div className="border-b border-white/10 px-5 py-5">
        <Link href="/admin/dashboard" className="flex items-center gap-3 text-[#F9FAFB]">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#10B981] text-white shadow-glow">
            <SparklesIcon className="h-5 w-5" />
          </div>
          <div>
            <p className="text-lg font-black tracking-tight">EventSync</p>
            <p className="text-xs font-medium text-gray-400">Administration</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(`${href}/`)
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-all ${
                isActive
                  ? 'bg-[#10B981] text-white shadow-glow'
                  : 'text-gray-400 hover:-translate-y-0.5 hover:bg-[#10B981]/10 hover:text-[#10B981]'
              }`}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="space-y-2 border-t border-white/10 px-3 py-4">
        {adminEmail && (
          <div className="pb-2">
            <ProfilePhotoButton
              name={adminName}
              photoUrl={adminPhotoUrl}
              onPhotoChange={handleAdminPhotoChange}
              caption="Administrateur"
            />
          </div>
        )}

        <button
          type="button"
          onClick={toggleTheme}
          className="theme-toggle flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold"
        >
          {isDark ? (
            <SunIcon className="h-5 w-5" />
          ) : (
            <MoonIcon className="h-5 w-5" />
          )}
          {isDark ? 'Mode clair' : 'Mode sombre'}
        </button>

        <Link
          href="/"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-gray-400 hover:-translate-y-0.5 hover:bg-[#10B981]/10 hover:text-[#10B981]"
        >
          <ArrowTopRightOnSquareIcon className="h-5 w-5" />
          Site public
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-gray-400 hover:-translate-y-0.5 hover:bg-red-500/10 hover:text-red-300"
        >
          <ArrowLeftEndOnRectangleIcon className="h-5 w-5 shrink-0" />
          Déconnexion
        </button>
      </div>
    </aside>
  )
}
