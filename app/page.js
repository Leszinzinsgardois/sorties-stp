import Link from 'next/link'
import { Rocket, ShieldCheck, Zap, Heart, Code, ArrowRight, MapPin, Users, HelpCircle, CheckCircle, Smartphone, Share2, PartyPopper, MessageCircle } from 'lucide-react'

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors selection:bg-blue-500 selection:text-white overflow-x-hidden">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-20 lg:pt-32 lg:pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-purple-500/20 rounded-full blur-[100px] -z-10 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[80px] -z-10"></div>

        <div className="container mx-auto px-6 relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                
                <div className="flex-1 text-center lg:text-left">
                    <div className="inline-flex flex-col sm:flex-row items-center gap-2 mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <span className="inline-flex items-center gap-1.5 bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 text-blue-600 dark:text-blue-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                            <Rocket size={12} /> Bêta (MVP)
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 italic">
                            L’objectif : avancer vite, proprement, et ensemble.
                        </span>
                    </div>
                    
                    <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight text-slate-900 dark:text-white leading-[1.1] animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
                        Tes soirées, <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">sans la galère.</span>
                    </h1>
                    
                    <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                        Pensé pour les lycéens et étudiants, <strong>Oukonsort</strong> te permet d’organiser tes soirées sans prise de tête.
                        <span className="block mt-2 font-medium text-slate-800 dark:text-slate-200">
                            Parce qu’organiser une soirée, ça devrait être simple. Vraiment.
                        </span>
                    </p>
                    
                    <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 animate-in fade-in zoom-in duration-700 delay-300">
                        <Link href="/dashboard" className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold shadow-xl shadow-blue-500/30 hover:scale-105 transition-transform flex items-center justify-center gap-2">
                        🚀 Créer une sortie
                        </Link>
                        <a href="#why" className="px-8 py-4 rounded-xl font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center justify-center gap-2">
                            Le concept <ArrowRight size={18}/>
                        </a>
                    </div>
                </div>

                {/* MOCKUP VISUEL */}
                <div className="flex-1 w-full max-w-[400px] lg:max-w-none perspective-1000 hidden md:block animate-in fade-in slide-in-from-right-8 duration-1000 delay-300">
                    <div className="relative transform rotate-y-[-12deg] rotate-x-[5deg] hover:rotate-y-0 hover:rotate-x-0 transition-transform duration-500 ease-out">
                        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 relative z-20">
                            <div className="flex justify-between items-center mb-6">
                                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">@Lucas34</span>
                                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded font-bold">CE SOIR</span>
                            </div>
                            <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-2">Anniv' Julie 🎂</h3>
                            <div className="space-y-3 mb-6">
                                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 p-3 rounded-xl">
                                    <MapPin className="text-purple-500" />
                                    <div>
                                        <p className="font-bold text-sm">Lieu Privé (Protégé)</p>
                                        <p className="text-xs opacity-70">RDV : Arrêt Louis Blanc</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-between items-center">
                                <div className="flex -space-x-2">
                                    <div className="w-8 h-8 rounded-full bg-blue-500 border-2 border-white"></div>
                                    <div className="w-8 h-8 rounded-full bg-purple-500 border-2 border-white"></div>
                                    <div className="w-8 h-8 rounded-full bg-green-500 border-2 border-white"></div>
                                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold border-2 border-white text-slate-600">+18</div>
                                </div>
                                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold">Je viens !</button>
                            </div>
                        </div>
                        <div className="absolute top-4 -right-4 w-full h-full bg-slate-200 dark:bg-slate-800 rounded-3xl -z-10 opacity-50"></div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* 2. LE CONSTAT */}
      <section id="why" className="py-20 bg-white dark:bg-slate-900 border-y border-slate-100 dark:border-slate-800">
        <div className="container mx-auto px-6 text-center max-w-3xl">
            <div className="mb-8 inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 text-red-500 mb-6">
                <MessageCircle size={32} />
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-6">
                Trop de messages, pas assez d’infos claires.
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                Des gens qui ne savent plus où ni quand, des adresses qui circulent mal... 
                <strong>Oukonsort</strong> est né d’un constat simple : les communications autour des soirées étudiantes sont souvent floues.
                <br/><br/>
                <strong className="text-slate-900 dark:text-white">Ici, tout est centralisé, clair et accessible en un lien.</strong>
            </p>
        </div>
      </section>

      {/* 3. FEATURES */}
      <section className="py-20 bg-slate-50 dark:bg-slate-950">
        <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-lg transition group">
                    <div className="bg-blue-100 dark:bg-blue-900/30 w-12 h-12 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6 group-hover:scale-110 transition-transform">
                        <Share2 size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-3">Simple & Fun</h3>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                        Un lien unique à partager. Aucune création de compte pour les invités. C'est fluide, rapide, et fait pour être utilisé sans réfléchir.
                    </p>
                </div>
                <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-lg transition group">
                    <div className="bg-purple-100 dark:bg-purple-900/30 w-12 h-12 rounded-2xl flex items-center justify-center text-purple-600 dark:text-purple-400 mb-6 group-hover:scale-110 transition-transform">
                        <ShieldCheck size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-3">Sécurité avant tout</h3>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                        Ton adresse personnelle reste protégée (système de point de RDV). Oukonsort met la responsabilité au centre de la fête.
                    </p>
                </div>
                <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-lg transition group">
                    <div className="bg-green-100 dark:bg-green-900/30 w-12 h-12 rounded-2xl flex items-center justify-center text-green-600 dark:text-green-400 mb-6 group-hover:scale-110 transition-transform">
                        <MapPin size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-3">Made in MTP</h3>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                        Développé et testé à Montpellier. Parce qu’ici, organiser une soirée étudiante peut vite devenir compliqué. On commence local !
                    </p>
                </div>
            </div>
        </div>
      </section>

      {/* 4. COMMUNAUTÉ */}
      <section className="py-20 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-6 max-w-5xl">
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-900 rounded-3xl p-8 md:p-12 text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row gap-10 items-center">
                <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
                    <Users size={200} />
                </div>
                <div className="flex-1 relative z-10">
                    <div className="inline-flex items-center gap-2 text-blue-400 font-bold uppercase tracking-wider text-xs mb-4">
                        <Heart size={14} className="fill-blue-400"/> Projet Étudiant
                    </div>
                    <h2 className="text-3xl font-black mb-4">Ce projet, c’est aussi le vôtre.</h2>
                    <p className="text-slate-300 leading-relaxed mb-6">
                        Oukonsort est un projet vivant. Créé par un étudiant, pour des étudiants, il est pensé pour évoluer avec vos idées.
                    </p>
                    <div className="space-y-2 text-sm text-slate-400 mb-6">
                        <p className="flex items-center gap-2"><CheckCircle size={16} className="text-green-500"/> Vos retours construisent les prochaines versions.</p>
                        <p className="flex items-center gap-2"><CheckCircle size={16} className="text-green-500"/> Ambition : devenir la référence locale.</p>
                    </div>
                    
                    {/* BOUTONS D'ACTION COMMUNAUTÉ */}
                    <div className="flex flex-wrap gap-3">
                        <Link href="/about" className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm font-bold transition">
                            À propos du développeur <ArrowRight size={16}/>
                        </Link>
                        <a href="https://forms.gle/wdadEqpkfzXU8KoRA" className="inline-flex items-center gap-2 bg-white text-slate-900 hover:bg-slate-100 px-4 py-2 rounded-lg text-sm font-bold transition shadow-lg">
                            <MessageCircle size={16}/> Suggérer une idée
                        </a>
                    </div>

                </div>
                <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/10 max-w-sm">
                    <h3 className="font-bold text-lg mb-2 flex items-center gap-2"><Zap size={18} className="text-yellow-400"/> Vision</h3>
                    <p className="text-sm text-slate-300 italic">
                        "À terme, l’app pourrait aussi permettre de découvrir des événements partenaires, profiter d’avantages locaux, et connecter encore plus la vie étudiante montpelliéraine."
                    </p>
                </div>
            </div>
        </div>
      </section>

      {/* 5. CTA FINAL */}
      <section className="py-24 bg-blue-600 dark:bg-blue-700 text-white text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="container mx-auto px-6 relative z-10">
              <h2 className="text-2xl md:text-4xl font-black mb-6 leading-tight">"Des outils simples, gratuits et respectueux de la vie privée."</h2>
              <p className="text-blue-100 text-lg mb-10 max-w-xl mx-auto font-medium">Pensés pour les étudiants. Construits avec eux.</p>
              <Link href="/login" className="bg-white text-blue-600 px-10 py-4 rounded-full font-bold text-lg shadow-2xl hover:bg-slate-100 transition hover:scale-105 inline-flex items-center gap-2">
                  🚀 C'est parti
              </Link>
          </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white dark:bg-slate-900 py-8 border-t border-slate-200 dark:border-slate-800 text-center">
        <div className="flex justify-center gap-6 text-sm font-medium text-slate-500 mb-4">
            <Link href="/about" className="hover:text-blue-600 transition">À propos</Link>
            <Link href="/legal" className="hover:text-blue-600 transition">Mentions Légales & CGU</Link>
        </div>
        <Link href="/install" className="hover:text-blue-600 transition font-bold flex items-center justify-center gap-1 mb-4">
            <Smartphone size={14}/> Installer l'app
        </Link>
        <p className="text-xs text-slate-400">
            © 2024 Oukonsort. Fait avec ❤️ à Montpellier.
        </p>
      </footer>
    </main>
  )
}