import { Inter } from 'next/font/google'
import './globals.css'
import Providers from '../components/Providers'
import PublicNavbar from '../components/PublicNavbar'


const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'EventSync',
  description: "Gestion d'événements en temps réel",
  
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <Providers>
          {/* La navbar publique se masque automatiquement sur /admin/* */}
          <PublicNavbar />
          {children}
        </Providers>
      </body>
    </html>
  )
}
