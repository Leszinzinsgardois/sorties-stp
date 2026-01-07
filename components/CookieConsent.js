'use client'

import { useState, useEffect } from 'react'
import { GoogleAnalytics } from '@next/third-parties/google'
import { Cookie, X, Check } from 'lucide-react'

export default function CookieConsent() {
  const [consent, setConsent] = useState(null) // null = pas encore répondu

  useEffect(() => {
    // Vérifie si l'utilisateur a déjà répondu dans le passé
    const savedConsent = localStorage.getItem('cookie_consent')
    if (savedConsent !== null) {
      setConsent(savedConsent === 'true')
    }
  }, [])

  const handleAccept = () => {
    setConsent(true)
    localStorage.setItem('cookie_consent', 'true')
  }

  const handleDecline = () => {
    setConsent(false)
    localStorage.setItem('cookie_consent', 'false')
  }

  // Si l'utilisateur a déjà répondu, on n'affiche plus la bannière.
  // MAIS si c'est "true", on rend le composant GoogleAnalytics.
  if (consent === true) {
    return <GoogleAnalytics gaId="G-RLL11RVSQK" />
  }

  if (consent === false) {
    return null // Rien ne se charge, pas de traceur.
  }

  // Si consent === null (pas de réponse), on affiche la bannière
  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 animate-in slide-in-from-bottom-4 fade-in duration-500">
      <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-2xl">
        
        <div className="flex items-start gap-4 mb-4">
          <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-xl text-blue-600 dark:text-blue-400 shrink-0">
            <Cookie size={24} />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">Cookies & Confidentialité</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Nous utilisons un cookie unique (Google Analytics) pour compter les visites (et évènements de site (bugs etc...)) de façon anonyme. C'est tout.
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <button 
            onClick={handleDecline}
            className="flex-1 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold rounded-xl transition flex items-center justify-center gap-2"
          >
            <X size={14} /> Refuser
          </button>
          <button 
            onClick={handleAccept}
            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
          >
            <Check size={14} /> Accepter
          </button>
        </div>

      </div>
    </div>
  )
}