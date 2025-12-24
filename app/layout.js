import './globals.css'
import { Inter } from 'next/font/google'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

// --- CONFIGURATION METADATA GLOBALE ---
export const metadata = {
  metadataBase: new URL('https://sorties-mtp.netlify.app'), // ⚠️ METS TON VRAI LIEN NETLIFY ICI (très important)
  title: {
    default: 'Sorties MTP - Organise tes soirées sans galère',
    template: '%s | Sorties MTP', // Ex: "Anniv Thomas | Sorties MTP"
  },
  description: "L'outil gratuit pour les étudiants montpelliérains. Crée ta soirée, partage le lien, gère les invités. Simple et sans compte.",
  openGraph: {
    title: 'Sorties MTP',
    description: 'Tes soirées étudiantes, sans la galère.',
    url: 'https://sorties-mtp.netlify.app',
    siteName: 'Sorties MTP',
    locale: 'fr_FR',
    type: 'website',
  },
  manifest: '/manifest.json',
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        {children}
        
        {/* FOOTER PERSISTANT (Optionnel, pour le style) */}
        <footer className="fixed bottom-2 right-2 z-50 opacity-50 hover:opacity-100 transition-opacity pointer-events-none">
            <span className="text-[10px] text-slate-400 bg-white/80 dark:bg-slate-900/80 px-2 py-1 rounded-full backdrop-blur border border-slate-200 dark:border-slate-800">
                Bêta v1.0
            </span>
        </footer>
      </body>
    </html>
  )
}