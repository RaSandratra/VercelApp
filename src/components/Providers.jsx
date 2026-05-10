'use client'
import { SessionProvider } from 'next-auth/react'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from '@/context/AuthContext'
import { ThemeProvider } from '@/context/ThemeContext'


export default function Providers({ children }) {
  return (
    <SessionProvider>
      <ThemeProvider>
        <AuthProvider>
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              duration: 3000,
              style: {
                borderRadius: '10px',
                background: 'var(--color-surface)',
                color: 'var(--color-foreground)',
                fontSize: '14px',
              },
              success: {
                iconTheme: { primary: '#22c55e', secondary: '#f9fafb' },
              },
              error: {
                iconTheme: { primary: '#ef4444', secondary: '#f9fafb' },
              },
            }}
          />
        </AuthProvider>
      </ThemeProvider>
    </SessionProvider>
  )
}





