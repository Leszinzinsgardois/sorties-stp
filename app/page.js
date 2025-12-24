import Link from 'next/link'
import { Rocket, ShieldCheck, Zap, Heart, Code, ArrowRight, MapPin, Users } from 'lucide-react'

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors selection:bg-blue-500 selection:text-white">
      
      {/* 1. HERO SECTION (L'accroche) */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        {/* Déco d'arrière-plan */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-500/20 dark:bg-blue-500/10 rounded-full blur-[100px] -z-10 pointer-events-none"></div>

        <div className="container mx-auto px-6 text-center z-10 relative">
            <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 text-blue-600 dark:text-blue-300 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <Rocket size={14} />
                Version Bêta (MVP)
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight text-slate-900 dark:text-white animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
                Tes soirées, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">sans la galère.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                L'outil simple et gratuit pour organiser tes before, anniversaires et sorties à Montpellier. 
                Finies les conversations de groupe interminables.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4 animate-in fade-in zoom-in duration-700 delay-300">
                <Link 
                href="/login" 
                className="bg-blue-600 text-white px-8 py-4 rounded-full font-bold shadow-xl shadow-blue-500/30 hover:scale-105 transition-transform flex items-center justify-center gap-2"
                >
                🚀 Organiser une sortie
                </Link>
                {/* On retire le bouton code invité car l'invit se fait par lien direct maintenant */}
                <a href="#about" className="px-8 py-4 rounded-full font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center justify-center gap-2">
                    En savoir plus <ArrowRight size={18}/>
                </a>
            </div>
        </div>
      </section>

      {/* 2. FEATURES (Pourquoi utiliser l'app ?) */}
      <section id="about" className="py-20 bg-white dark:bg-slate-900 border-y border-slate-100 dark:border-slate-800">
        <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Card 1 */}
                <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 hover:shadow-lg transition">
                    <div className="bg-blue-100 dark:bg-blue-900/30 w-12 h-12 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6">
                        <Zap size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-3">Ultra Rapide</h3>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                        Crée une soirée en 30 secondes. Partage un lien unique. Tes potes s'inscrivent sans créer de compte.
                    </p>
                </div>
                {/* Card 2 */}
                <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 hover:shadow-lg transition">
                    <div className="bg-purple-100 dark:bg-purple-900/30 w-12 h-12 rounded-2xl flex items-center justify-center text-purple-600 dark:text-purple-400 mb-6">
                        <ShieldCheck size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-3">Confidentialité (RGPD)</h3>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                        Pas de tracking publicitaire. Tes lieux privés sont cachés. Les données s'autodétruisent après l'événement.
                    </p>
                </div>
                {/* Card 3 */}
                <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 hover:shadow-lg transition">
                    <div className="bg-green-100 dark:bg-green-900/30 w-12 h-12 rounded-2xl flex items-center justify-center text-green-600 dark:text-green-400 mb-6">
                        <MapPin size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-3">Made in MTP</h3>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                        Pensé pour les étudiants montpelliérains. Intégration des trams et des lieux locaux.
                    </p>
                </div>
            </div>
        </div>
      </section>

      {/* 3. LE PROJET & LE DEV (Transparence) */}
      <section className="py-20">
        <div className="container mx-auto px-6 max-w-4xl">
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-900 rounded-3xl p-8 md:p-12 text-white shadow-2xl relative overflow-hidden">
                {/* Deco */}
                <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
                    <Code size={200} />
                </div>

                <div className="relative z-10">
                    <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                        <Heart className="text-red-500 fill-red-500" />
                        L'histoire du projet
                    </h2>
                    <p className="text-slate-300 text-lg mb-6 leading-relaxed">
                        Sorties MTP n'est pas une startup de la Silicon Valley. C'est un projet étudiant né d'un constat simple : organiser une soirée devrait être aussi fun que d'y participer.
                    </p>
                    
                    <div className="space-y-4 mb-8">
                        <div className="flex items-start gap-3">
                            <div className="bg-white/10 p-2 rounded-lg mt-1"><Code size={16}/></div>
                            <div>
                                <h4 className="font-bold">Développement Solo</h4>
                                <p className="text-sm text-slate-400">Codé avec passion (et beaucoup de café) par [Ton Prénom].</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="bg-white/10 p-2 rounded-lg mt-1"><Users size={16}/></div>
                            <div>
                                <h4 className="font-bold">Projet Communautaire</h4>
                                <p className="text-sm text-slate-400">Vos retours construisent l'app. C'est une V1, tout reste à faire !</p>
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-white/10">
                        <p className="text-sm text-slate-400 italic">
                            "L'objectif ? Prouver qu'on peut faire des outils utiles, gratuits et respectueux de la vie privée."
                        </p>
                    </div>
                </div>
            </div>
        </div>
      </section>

    </main>
  )
}