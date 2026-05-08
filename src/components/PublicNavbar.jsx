'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import {
  ArrowRightEndOnRectangleIcon,
  Bars3Icon,
  CalendarDaysIcon,
  HomeIcon,
  SparklesIcon,
  StarIcon,
  UserCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { useParticipant } from '@/context/AuthContext'

function NavLink({ href, label, current, icon, onClick }) {
  const isActive = href === '/' ? current === href : current?.startsWith(href)

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-all ${
        isActive
          ? 'bg-[#10B981] text-white shadow-glow'
          : 'text-gray-300 hover:bg-white/10 hover:text-white'
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  )
}

export default function PublicNavbar() {
  const pathname = usePathname()
  const { participant, logoutParticipant, loaded } = useParticipant()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  if (pathname?.startsWith('/admin')) return null

  const closeMenu = () => setIsMenuOpen(false)

  return (
    <nav className="sticky top-0 z-30 border-b border-white/10 bg-[#111827]/95 text-white shadow-dark-md backdrop-blur-xl">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-3 text-white hover:text-white">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#10B981] shadow-glow">
              <SparklesIcon className="h-5 w-5" />
            </div>
            <div className="leading-tight">
              <span className="block text-lg font-bold tracking-tight">EventSync</span>
              <span className="hidden text-xs font-medium text-gray-300 sm:block">Live conference hub</span>
            </div>
          </Link>

          <div className="hidden items-center gap-2 md:flex">
            <NavLink href="/" label="Accueil" current={pathname} icon={<HomeIcon className="h-4 w-4" />} />
            <NavLink href="/sessions" label="Sessions" current={pathname} icon={<CalendarDaysIcon className="h-4 w-4" />} />
            <NavLink href="/favourites" label="Mes favoris" current={pathname} icon={<StarIcon className="h-4 w-4" />} />
          </div>

          <div className="flex items-center gap-3">
            {loaded && participant ? (
              <div className="hidden items-center gap-3 sm:flex">
                <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm">
                  <UserCircleIcon className="h-5 w-5 text-[#10B981]" />
                  <span className="max-w-32 truncate text-gray-100">{participant.pseudo}</span>
                </div>
                <button
                  onClick={logoutParticipant}
                  className="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm text-gray-300 hover:border-red-400/50 hover:bg-red-500/10 hover:text-red-200"
                >
                  <ArrowRightEndOnRectangleIcon className="h-4 w-4" />
                  <span>Déconnexion</span>
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden items-center gap-2 rounded-lg bg-[#10B981] px-4 py-2 text-sm font-semibold text-white shadow-glow hover:bg-emerald-700 sm:inline-flex"
              >
                Se connecter
              </Link>
            )}

            <button
              onClick={() => setIsMenuOpen((open) => !open)}
              className="rounded-lg p-2 transition-colors hover:bg-white/10 md:hidden"
              aria-label={isMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            >
              {isMenuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="border-t border-white/10 py-4 md:hidden">
            <div className="flex flex-col gap-2">
              <NavLink href="/" label="Accueil" current={pathname} icon={<HomeIcon className="h-4 w-4" />} onClick={closeMenu} />
              <NavLink href="/sessions" label="Sessions" current={pathname} icon={<CalendarDaysIcon className="h-4 w-4" />} onClick={closeMenu} />
              <NavLink href="/favourites" label="Mes favoris" current={pathname} icon={<StarIcon className="h-4 w-4" />} onClick={closeMenu} />

              <div className="mt-2 border-t border-white/10 pt-4">
                {loaded && participant ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2 text-sm text-gray-100">
                      <UserCircleIcon className="h-5 w-5 text-[#10B981]" />
                      <span>{participant.pseudo}</span>
                    </div>
                    <button
                      onClick={() => {
                        logoutParticipant()
                        closeMenu()
                      }}
                      className="flex w-full items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm text-gray-300 hover:border-red-400/50 hover:bg-red-500/10 hover:text-red-200"
                    >
                      <ArrowRightEndOnRectangleIcon className="h-4 w-4" />
                      <span>Déconnexion</span>
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    onClick={closeMenu}
                    className="flex w-full items-center justify-center rounded-lg bg-[#10B981] px-4 py-3 font-semibold text-white hover:bg-emerald-700"
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





