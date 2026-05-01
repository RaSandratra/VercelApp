'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import {
  HomeIcon,
  CalendarDaysIcon,
  PlayCircleIcon,
  UserGroupIcon,
  ArrowLeftEndOnRectangleIcon,
} from '@heroicons/react/24/outline'

const navItems = [
  { href: '/admin/dashboard', label: 'Tableau de bord', icon: HomeIcon },
  { href: '/admin/events', label: 'Événements', icon: CalendarDaysIcon },
  { href: '/admin/sessions', label: 'Sessions', icon: PlayCircleIcon },
  { href: '/admin/speakers', label: 'Intervenants', icon: UserGroupIcon },
]


export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed top-0 left-0 h-full w-56 bg-gray-900 text-white flex flex-col z-40 shadow-xl">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-gray-700">
        <Link href="/admin/dashboard" className="text-xl font-bold text-white hover:text-blue-400 transition">
          EventSync
        </Link>
        <p className="text-xs text-gray-400 mt-0.5">Administration</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Bouton déconnexion */}
      <div className="px-3 py-4 border-t border-gray-700">
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-300 hover:bg-red-600 hover:text-white w-full transition-colors"
        >
          <ArrowLeftEndOnRectangleIcon className="w-5 h-5 flex-shrink-0" />
          Déconnexion
        </button>
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2 mt-1 rounded-lg text-xs text-gray-500 hover:text-gray-300 transition-colors"
        >
          ← Retour au site public
        </Link>
      </div>
    </aside>
  )
}
