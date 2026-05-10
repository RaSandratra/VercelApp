import './globals.css'
import Providers from '../components/Providers'
import PublicNavbar from '../components/PublicNavbar'

export const metadata = {
  title: 'EventSync',
  description: "Gestion d'événements en temps réel",
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr" data-theme="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const stored = localStorage.getItem('eventsync-theme');
                const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
                const theme = stored || (prefersLight ? 'light' : 'dark');
                document.documentElement.dataset.theme = theme;
                document.documentElement.style.colorScheme = theme;
              } catch {}
            `,
          }}
        />
      </head>
      <body>
        <Providers>
          <PublicNavbar />
          {children}
        </Providers>
      </body>
    </html>
  )
}
