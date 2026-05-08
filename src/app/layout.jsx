import './globals.css'
import Providers from '../components/Providers'
import PublicNavbar from '../components/PublicNavbar'

export const metadata = {
  title: 'EventSync',
  description: "Gestion d'Ã©vÃ©nements en temps rÃ©el",
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>
        <Providers>
          <PublicNavbar />
          {children}
        </Providers>
      </body>
    </html>
  )
}





