'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Bars3Icon,
  XMarkIcon,
  CalendarDaysIcon,
} from '@heroicons/react/24/outline'
import { useState } from 'react'

export default function PublicNavbar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] =
    useState(false)

  const navigation = [
    {
      name: 'Accueil',
      href: '/',
    },
    {
      name: 'Sessions',
      href: '/sessions',
    },
    {
      name: 'Favoris',
      href: '/favourites',
    },
    {
      name: 'Connexion',
      href: '/login',
    },
  ]

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#111827]/95 backdrop-blur">
      <nav className="container mx-auto flex items-center justify-between px-4 py-4">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 text-white transition hover:opacity-90"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#10B981] shadow-lg shadow-emerald-500/20">
            <CalendarDaysIcon className="h-5 w-5 text-white" />
          </div>

          <div className="leading-tight">
            <span className="block text-lg font-black tracking-tight">
              EventSync
            </span>

            <span className="hidden text-xs font-medium text-gray-400 sm:block">
              Live conference hub
            </span>
          </div>
        </Link>

        {/* Desktop navigation */}
        <div className="hidden items-center gap-2 md:flex">
          {navigation.map((item) => {
            const active =
              pathname === item.href

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                  active
                    ? 'bg-[#10B981]/15 text-[#10B981]'
                    : 'text-gray-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                {item.name}
              </Link>
            )
          })}
        </div>

        {/* Mobile button */}
        <button
          onClick={() =>
            setMobileOpen(!mobileOpen)
          }
          className="rounded-lg p-2 text-gray-300 transition hover:bg-white/5 hover:text-white md:hidden"
        >
          {mobileOpen ? (
            <XMarkIcon className="h-6 w-6" />
          ) : (
            <Bars3Icon className="h-6 w-6" />
          )}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-white/10 bg-[#111827] md:hidden">
          <div className="container mx-auto flex flex-col gap-1 px-4 py-4">
            {navigation.map((item) => {
              const active =
                pathname === item.href

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() =>
                    setMobileOpen(false)
                  }
                  className={`rounded-lg px-4 py-3 text-sm font-medium transition ${
                    active
                      ? 'bg-[#10B981]/15 text-[#10B981]'
                      : 'text-gray-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {item.name}
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </header>
  )
}