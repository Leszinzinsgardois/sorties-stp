'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { PartyPopper, CheckCircle, ArrowRight, BookOpen, Smartphone } from 'lucide-react'
import Link from 'next/link'

export default function WelcomePopup() {
  const [isOpen, setIsOpen] = useState(false)
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    // On vérifie si l'URL contient un marqueur de succès
    // Supabase ajoute parfois 'error_description' si ça rate, ou rien si ça marche.
    // Mais on peut aussi détecter le hash qui contient 'access_token' pour une connexion auto.
    
    // Pour faire simple selon ta demande "account-activated=True"
    // Tu devras configurer ton lien de redirection email vers "https://ton-site.com/?welcome=true"
    
    // OU BIEN : On détecte simplement si l'utilisateur est connecté pour la première fois ?
    // Le plus simple pour ton cas précis est de vérifier le paramètre URL que TU définis.
    
    if (searchParams.get('welcome') === 'true' || window.location.hash.includes('type=signup')) {
      setIsOpen(true)
      // Nettoyer l'URL pour que le popup ne réapparaisse pas au refresh (optionnel)
      // router.replace('/', { scroll: false })
    }
  }, [searchParams])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-300 relative border border-slate-200 dark:border-slate-800">
        
        {/* Confettis décoratifs (CSS ou SVG simple) */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-blue-500/10 to-transparent pointer-events-none"></div>

        <div className="p-8 text-center relative z-10">
          <div className="mx-auto w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600 dark:text-green-400 mb-6 shadow-lg shadow-green-500/20">
            <PartyPopper size={40} />
          </div>

          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Compte Activé ! 🚀</h2>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-8">
            Bienvenue dans la communauté <strong>Oukonsort</strong>. Ton profil est validé, tu es prêt à organiser ta première sortie.
          </p>

          <div className="space-y-3">
            <Link href="/dashboard" className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-blue-700 hover:scale-[1.02] transition flex items-center justify-center gap-2">
              Accéder à mon Espace <ArrowRight size={18}/>
            </Link>
            
            <Link href="/guide" className="w-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold py-3 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition flex items-center justify-center gap-2">
              <BookOpen size={18}/> Comment ça marche ?
            </Link>
          </div>
          
          <button 
            onClick={() => setIsOpen(false)} 
            className="mt-6 text-xs text-slate-400 hover:text-slate-600 underline"
          >
            Fermer et explorer l'accueil
          </button>
        </div>
      </div>
    </div>
  )
}