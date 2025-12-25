'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { 
  Home, MapPin, Search, Ghost, 
  Beer, Music, TramFront, Zap, 
  HelpCircle, ArrowLeft, AlertTriangle 
} from 'lucide-react'

export default function NotFound() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [mounted, setMounted] = useState(false)

  // Effet pour suivre la souris (Lampe torche)
  useEffect(() => {
    setMounted(true)
    const updateMousePosition = (ev) => {
      setMousePosition({ x: ev.clientX, y: ev.clientY })
    }
    window.addEventListener('mousemove', updateMousePosition)
    return () => window.removeEventListener('mousemove', updateMousePosition)
  }, [])

  // Objets flottants (Débris de soirée)
  const debris = [
    { Icon: TramFront, color: 'text-blue-500', size: 40, top: '10%', left: '10%', delay: '0s', duration: '15s' },
    { Icon: Beer, color: 'text-yellow-500', size: 30, top: '20%', left: '80%', delay: '2s', duration: '12s' },
    { Icon: Music, color: 'text-purple-500', size: 35, top: '70%', left: '15%', delay: '1s', duration: '18s' },
    { Icon: Zap, color: 'text-orange-500', size: 25, top: '80%', left: '70%', delay: '4s', duration: '10s' },
    { Icon: Ghost, color: 'text-slate-400', size: 50, top: '40%', left: '50%', delay: '0s', duration: '20s' }, // Le fantôme central
    { Icon: MapPin, color: 'text-red-500', size: 28, top: '15%', left: '40%', delay: '3s', duration: '14s' },
  ]

  if (!mounted) return null

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors cursor-none selection:bg-purple-500 selection:text-white">
      
      {/* 1. LAYER DE FOND : GRILLE & SPOTLIGHT */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Grille Cyberpunk */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        
        {/* Spotlight Interactif (Magie ici) */}
        <div 
            className="hidden md:block absolute inset-0 transition-opacity duration-500"
            style={{
                background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(29, 78, 216, 0.15), transparent 80%)`
            }}
        ></div>
        <div 
            className="hidden md:block absolute inset-0 mix-blend-overlay opacity-50 dark:opacity-100"
            style={{
                background: `radial-gradient(400px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(139, 92, 246, 0.1), transparent 80%)`
            }}
        ></div>
      </div>

      {/* 2. LAYER DÉBRIS FLOTTANTS (Animation CSS) */}
      <div className="absolute inset-0 z-0 overflow-hidden opacity-60">
          {debris.map((item, index) => (
              <div
                key={index}
                className={`absolute animate-float ${item.color} opacity-40 dark:opacity-30`}
                style={{
                    top: item.top,
                    left: item.left,
                    animationDuration: item.duration,
                    animationDelay: item.delay
                }}
              >
                  <item.Icon size={item.size} />
              </div>
          ))}
      </div>

      {/* 3. CONTENU PRINCIPAL */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center">
        
        {/* GLITCH 404 */}
        <div className="relative mb-8 group">
            <h1 className="text-[150px] md:text-[220px] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-slate-200 to-slate-400 dark:from-slate-800 dark:to-slate-950 select-none animate-pulse-slow">
                404
            </h1>
            <h1 className="absolute inset-0 text-[150px] md:text-[220px] font-black leading-none tracking-tighter text-blue-600/20 blur-2xl animate-pulse">
                404
            </h1>
            
            {/* Petit message par dessus le 404 */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-slate-900 px-6 py-2 rounded-full border border-slate-200 dark:border-slate-800 shadow-xl rotate-[-5deg] hover:rotate-0 transition-transform duration-300">
                <span className="text-sm md:text-lg font-bold text-slate-900 dark:text-white whitespace-nowrap flex items-center gap-2">
                    <AlertTriangle size={18} className="text-yellow-500"/> T'es perdu ?
                </span>
            </div>
        </div>

        {/* TEXTE */}
        <div className="max-w-2xl mx-auto space-y-6 animate-in slide-in-from-bottom-10 fade-in duration-1000 delay-200">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white">
                Oups ! Mauvais arrêt.
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                On dirait que tu as cherché une soirée qui n'existe pas (ou qui était tellement bien qu'elle a disparu de la réalité).
            </p>

            {/* BOUTONS D'ACTION */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Link href="/" className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 font-bold text-white transition-all duration-200 bg-blue-600 rounded-2xl hover:bg-blue-700 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/30 ring-offset-2 focus:ring-2">
                    <Home size={20} className="group-hover:-translate-y-1 transition-transform"/>
                    Retour à l'accueil
                </Link>
                
                <Link href="/dashboard" className="group inline-flex items-center justify-center gap-2 px-8 py-4 font-bold text-slate-700 dark:text-slate-300 transition-all duration-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-600">
                    <Search size={20} className="group-hover:rotate-12 transition-transform"/>
                    Chercher une autre sortie
                </Link>
            </div>
        </div>

        {/* FOOTER FUN */}
        <div className="absolute bottom-10 text-xs text-slate-400 font-mono animate-pulse">
            Error Code: PARTY_NOT_FOUND • Location: UNKNOWN
        </div>

      </div>

      {/* CURSEUR PERSONNALISÉ (Cercle qui suit la souris) */}
      <div 
        className="fixed top-0 left-0 w-8 h-8 border-2 border-blue-500 rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2 z-50 hidden md:block mix-blend-difference transition-transform duration-100 ease-out"
        style={{ 
            left: mousePosition.x, 
            top: mousePosition.y,
        }}
      >
          <div className="w-1 h-1 bg-blue-500 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      {/* CSS DÉDIÉ POUR L'ANIMATION FLOTTANTE */}
      <style jsx global>{`
        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-20px) rotate(10deg); }
          66% { transform: translateY(10px) rotate(-5deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        .animate-float {
          animation: float infinite ease-in-out;
        }
        .animate-pulse-slow {
            animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </main>
  )
}