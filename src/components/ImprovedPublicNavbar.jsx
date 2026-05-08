'use client'
import Link from 'next/link'
import { useParticipant } from '@/context/AuthContext'
import { usePathname } from 'next/navigation'
import {
  StarIcon,
  UserCircleIcon,
  ArrowRightEndOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  CalendarDaysIcon
} from '@heroicons/react/24/outline'
import { useState } from 'react'

function NavLink({ href, label, current, icon }) {
  const isActive = current === href
  return (
    <Link
      href={href}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
        isActive
          ? 'bg-blue-600 text-white'
          : 'text-gray-300 hover:text-white hover:bg-gray-800'
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  )
}

export default function ImprovedPublicNavbar() {
  const pathname = usePathname()
  const { participant, logoutParticipant, loaded } = useParticipant()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Ne pas afficher la navbar publique sur les pages admin
  if (pathname?.startsWith('/admin')) return null

  return (
    <nav className="bg-gradient-to-r from-gray-900 to-gray-800 text-white shadow-lg sticky top-0 z-30 border-b border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-xl tracking-tight text-white hover:text-blue-400 transition-colors"
          >
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <CalendarDaysIcon className="w-5 h-5" />
            </div>
            EventSync
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            <NavLink
              href="/"
              label="Accueil"
              current={pathname}
              icon={<HomeIcon className="w-4 h-4" />}
            />
            <NavLink
              href="/favourites"
              label="Mes favoris"
              current={pathname}
              icon={<StarIcon className="w-4 h-4" />}
            />
          </div>

          {/* Auth Section */}
          <div className="flex items-center gap-3">
            {loaded && participant ? (
              <div className="hidden sm:flex items-center gap-3">
                <div className="flex items-center gap-2 text-sm">
                  <UserCircleIcon className="w-5 h-5 text-blue-400" />
                  <span className="text-gray-300">{participant.pseudo}</span>
                </div>
                <button
                  onClick={logoutParticipant}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-red-400 hover:bg-red-900/20 transition-colors rounded-lg border border-gray-700 hover:border-red-400"
                >
                  <ArrowRightEndOnRectangleIcon className="w-4 h-4" />
                  <span>Déconnexion</span>
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden sm:inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
              >
                Se connecter
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              {isMenuOpen ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <Bars3Icon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-700 py-4">
            <div className="flex flex-col gap-2">
              <NavLink
                href="/"
                label="Accueil"
                current={pathname}
                icon={<HomeIcon className="w-4 h-4" />}
              />
              <NavLink
                href="/favourites"
                label="Mes favoris"
                current={pathname}
                icon={<StarIcon className="w-4 h-4" />}
              />

              <div className="border-t border-gray-700 pt-4 mt-2">
                {loaded && participant ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300">
                      <UserCircleIcon className="w-5 h-5 text-blue-400" />
                      <span>{participant.pseudo}</span>
                    </div>
                    <button
                      onClick={() => {
                        logoutParticipant()
                        setIsMenuOpen(false)
                      }}
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-400 hover:text-red-400 hover:bg-red-900/20 transition-colors rounded-lg border border-gray-700 hover:border-red-400"
                    >
                      <ArrowRightEndOnRectangleIcon className="w-4 h-4" />
                      <span>Déconnexion</span>
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
                  >
                    Se connecter
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}