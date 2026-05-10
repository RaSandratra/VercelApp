'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const ThemeContext = createContext(null)

const STORAGE_KEY = 'eventsync-theme'

function getInitialTheme() {
  if (typeof window === 'undefined') return 'dark'

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'light' || stored === 'dark') return stored
  } catch {}

  return window.matchMedia?.('(prefers-color-scheme: light)').matches
    ? 'light'
    : 'dark'
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.documentElement.style.colorScheme = theme

    try {
      localStorage.setItem(STORAGE_KEY, theme)
    } catch {}
  }, [theme])

  const value = useMemo(
    () => ({
      theme,
      isDark: theme === 'dark',
      toggleTheme: () => setTheme((current) => current === 'dark' ? 'light' : 'dark'),
    }),
    [theme]
  )

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
