import './globals.css'
import { Inter } from 'next/font/google'
import { GoogleAnalytics } from '@next/third-parties/google' // <--- 1. IMPORT ICI
import Header from '@/components/Header' 

const inter = Inter({ subsets: ['latin'] })

// --- CONFIGURATION METADATA GLOBALE ---
export const metadata = {
  metadataBase: new URL('https://oukonsort.netlify.app'), // (Mets ton URL finale ici quand tu l'auras)
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
      </body>
      {/* 2. LE TRACKER EST JUSTE ICI 👇 */}
      {/* Remplace 'G-XXXXXXXXXX' par ton vrai code copié à l'étape 1 */}
      <GoogleAnalytics gaId="G-RLL11RVSQK" />
    </html>
  )
}