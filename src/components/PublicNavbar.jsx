'use client'
import Link from 'next/link'
import { useParticipant } from '@/context/AuthContext'
import { usePathname } from 'next/navigation'
import {
  StarIcon,
  UserCircleIcon,
  ArrowRightEndOnRectangleIcon,
} from '@heroicons/react/24/outline'


export default function PublicNavbar() {
  const pathname = usePathname()
  const { participant, logoutParticipant, loaded } = useParticipant()

  // Ne pas afficher la navbar publique sur les pages admin
  if (pathname?.startsWith('/admin')) return null

  return (
    <nav className="bg-gray-900 text-white shadow-md sticky top-0 z-30">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="font-bold text-lg tracking-tight text-white hover:text-blue-400 transition flex-shrink-0">
          EventSync
        </Link>

        {/* Liens principaux */}
        <div className="hidden sm:flex items-center gap-1">
          <NavLink href="/" label="Événements" current={pathname} />
          <NavLink href="/favourites" label="Mes favoris" current={pathname} icon={<StarIcon className="w-4 h-4" />} />
        </div>

        {/* Auth participant */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {loaded && participant ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-300 hidden sm:inline">
                <UserCircleIcon className="w-4 h-4 inline mr-1 text-blue-400" />
                {participant.pseudo}
              </span>
              <button
                onClick={logoutParticipant}
                className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-400 transition px-2 py-1 rounded border border-gray-700 hover:border-red-400"
              >
                <ArrowRightEndOnRectangleIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Déconnexion</span>
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1.5 text-sm bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-lg transition font-medium"
            >
              <UserCircleIcon className="w-4 h-4" />
              Connexion
            </Link>
          )}
        </div>
      </div>

      {/* Mobile nav */}
      <div className="sm:hidden border-t border-gray-700 px-4 pb-2 flex gap-4">
        <NavLink href="/" label="Événements" current={pathname} mobile />
        <NavLink href="/favourites" label="Favoris" current={pathname} mobile />
      </div>
    </nav>
  )
}

function NavLink({ href, label, icon, current, mobile }) {
  const isActive = current === href
  const base = mobile
    ? `text-xs py-1.5 font-medium transition`
    : `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition`
  const active = mobile ? 'text-blue-400' : 'bg-gray-700 text-white'
  const inactive = mobile ? 'text-gray-400' : 'text-gray-300 hover:bg-gray-800 hover:text-white'

  return (
    <Link href={href} className={`${base} ${isActive ? active : inactive}`}>
      {icon}
      {label}
    </Link>
  )
}
