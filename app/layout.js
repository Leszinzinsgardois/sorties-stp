import './globals.css'
import { Inter } from 'next/font/google'
// On retire l'import direct de GoogleAnalytics ici
import Header from '@/components/Header' 
import CookieConsent from '@/components/CookieConsent' // <--- IMPORT DU NOUVEAU COMPOSANT

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  metadataBase: new URL('https://oukonsort.netlify.app'),
  title: {
    default: 'Oukonsort - Tes soirées sans galère',
    template: '%s | Oukonsort',
  },
  description: "L'app des soirées étudiantes à Montpellier. Simple, gratuit, sans compte invité.",
  openGraph: {
    title: 'Oukonsort',
    description: 'Organise tes soirées étudiantes sans galère.',
    siteName: 'Oukonsort',
    locale: 'fr_FR',
    type: 'website',
  },
  manifest: '/manifest.json',
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <Header />
        <div className="pt-16"> 
            {children}
        </div>
        
        {/* LE TRACKER EST GÉRÉ ICI 👇 */}
        {/* Il ne s'activera que si l'utilisateur clique sur "Accepter" */}
        <CookieConsent />
        
      </body>
    </html>
  )
}