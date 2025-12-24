'use client'

import { useState, useEffect } from 'react'
import { Rocket, X } from 'lucide-react'

export default function WelcomeModal() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // On vérifie si l'utilisateur a déjà vu le message
    const hasSeenPopup = localStorage.getItem('seen_mvp_intro_v1')
    if (!hasSeenPopup) {
      // Petit délai pour que l'animation soit fluide à l'arrivée
      setTimeout(() => setIsOpen(true), 500)
    }
  }, [])

  const handleClose = () => {
    // On enregistre qu'il l'a vu pour ne plus l'embêter
    localStorage.setItem('seen_mvp_intro_v1', 'true')
    setIsOpen(false)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity duration-300">
      
      {/* LA CARTE */}
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 relative animate-in fade-in zoom-in duration-300">
        
        {/* Décoration de fond */}
        <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
            <Rocket size={120} />
        </div>

        {/* Header */}
        <div className="flex items-start justify-between mb-4 relative z-10">
            <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-2xl text-blue-600 dark:text-blue-400">
                <Rocket size={32} />
            </div>
            <button onClick={handleClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition">
                <X size={24} />
            </button>
        </div>

        {/* Titre */}
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mb-4 leading-tight relative z-10">
            Sorties MTP est en ligne <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">(V1 – MVP)</span>
        </h2>

        {/* Texte */}
        <div className="space-y-3 text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-8 relative z-10">
            <p><strong>Bienvenue sur la première version de Sorties MTP 👋</strong></p>
            <p>
                Cette version est un <strong>MVP</strong> : certaines fonctionnalités et l’interface peuvent évoluer rapidement.
            </p>
            <p>
                Des changements visuels ou techniques peuvent donc apparaître au fil des mises à jour, dans le but de rendre l’application plus simple, plus stable et plus agréable à utiliser.
            </p>
            <p className="pt-2 text-blue-600 dark:text-blue-400 font-medium">
                Merci de faire partie des premiers utilisateurs 💙
            </p>
            <p className="text-xs text-slate-400 italic">
                Vos retours sont précieux pour améliorer le service.
            </p>
        </div>

        {/* Bouton */}
        <button 
            onClick={handleClose}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/30 hover:scale-[1.02] active:scale-95 transition-transform relative z-10"
        >
            👉 Continuer (ne plus voir)
        </button>

      </div>
    </div>
  )
}