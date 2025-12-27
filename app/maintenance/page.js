'use client'

import { Lock, Construction, ArrowRight, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function MaintenancePage() {
  const [dots, setDots] = useState('')

  // Animation des points
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.')
    }, 500)
    return () => clearInterval(interval)
  }, [])

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center bg-black overflow-hidden text-white selection:bg-purple-500 selection:text-white">
      
      {/* --- BACKGROUND FX --- */}
      {/* Spotlight Central (Lumière divine) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[500px] bg-white/[0.03] blur-[120px] rounded-full pointer-events-none"></div>
      
      {/* Aurora Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-800/20 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-800/10 rounded-full blur-[120px] animate-pulse delay-1000"></div>

      {/* Noise Texture (Grain) */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 z-[1] pointer-events-none"></div>
      
      {/* --- CONTENU CENTRAL --- */}
      <div className="relative z-10 max-w-3xl px-6 text-center flex flex-col items-center">
        
        {/* ICÔNE GLOWY */}
        <div className="relative mb-10 group cursor-default">
           {/* Halo derrière l'icône */}
           <div className="absolute inset-0 bg-purple-500/30 blur-2xl rounded-full opacity-50 group-hover:opacity-75 transition-opacity duration-700"></div>
           
           {/* Conteneur Verre */}
           <div className="relative w-24 h-24 flex items-center justify-center bg-white/5 border border-white/10 rounded-3xl backdrop-blur-2xl shadow-2xl ring-1 ring-white/20 animate-in fade-in zoom-in duration-1000">
              {/* Petite animation de flottement custom via CSS inline ou classe utilitaire si config */}
              <div className="animate-bounce" style={{ animationDuration: '3s' }}>
                 <Construction size={40} className="text-purple-300 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]" />
              </div>
           </div>
           
           {/* Petite étoile déco */}
           <Sparkles size={20} className="absolute -top-2 -right-2 text-yellow-200 animate-pulse delay-700" />
        </div>

        {/* TITRE (Fix des points de suspension) */}
        <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/50 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
          On refait la déco
          {/* Le span w-24 empêche le texte de bouger quand les points changent */}
          <span className="inline-block w-0 overflow-visible text-left">{dots}</span>
        </h1>

        <p className="text-lg md:text-xl text-slate-400 mb-12 leading-relaxed max-w-xl mx-auto font-light animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
          Une mise à jour majeure est en cours sur <strong className="text-white font-medium">Oukonsort</strong>. 
          Nous peaufinons les détails pour rendre l'expérience inoubliable.
        </p>

        {/* --- PROGRESS BAR PREMIUM --- */}
        <div className="w-full max-w-sm mx-auto animate-in fade-in zoom-in duration-1000 delay-500">
            <div className="flex justify-between text-xs font-mono text-slate-500 mb-2 uppercase tracking-widest">
                <span>Status</span>
                <span>37%</span>
            </div>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden relative">
                {/* La barre de progression */}
                <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 w-[37%] rounded-full shadow-[0_0_20px_rgba(168,85,247,0.4)]"></div>
                {/* L'effet de brillance qui passe dessus */}
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
            </div>
        </div>

      </div>

      {/* --- FOOTER / ACCÈS STAFF --- */}
      <div className="absolute bottom-10 text-center animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-700 z-20">
        <Link 
          href="/login" 
          className="group relative inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-500/30 transition-all duration-300 text-xs font-medium text-slate-400 hover:text-white backdrop-blur-md overflow-hidden"
        >
          {/* Background gradient on hover */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/10 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <Lock size={12} className="relative z-10 group-hover:text-purple-300 transition-colors"/>
          <span className="relative z-10 tracking-wide">ACCÈS STAFF</span>
          <ArrowRight size={12} className="relative z-10 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300 text-purple-300"/>
        </Link>
      </div>
      
      {/* Style CSS global pour l'animation shimmer (brillance) */}
      <style jsx global>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>

    </main>
  )
}