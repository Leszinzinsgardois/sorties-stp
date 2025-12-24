'use client'

import Link from 'next/link'
import { ArrowLeft, User, Heart, ShieldCheck, XCircle, Users, Rocket, Code, GraduationCap, MapPin } from 'lucide-react'

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors pb-20 selection:bg-blue-500 selection:text-white">
      
      {/* HEADER SIMPLE */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10 px-6 py-4 flex items-center gap-4">
        <Link 
          href="/" 
          className="bg-slate-100 dark:bg-slate-800 p-2 rounded-full text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
        >
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-xl font-bold text-slate-800 dark:text-white">
          À propos du développeur
        </h1>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-10 space-y-16">

        {/* 1. QUI SUIS-JE ? */}
        <section className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row gap-8 items-start">
                {/* Avatar / Photo placeholder */}
                <div className="shrink-0">
                    <div className="w-24 h-24 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 border-4 border-white dark:border-slate-900 shadow-lg">
                        <User size={40} />
                    </div>
                </div>
                
                <div className="space-y-4">
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white">Qui suis-je ?</h2>
                    <div className="prose dark:prose-invert text-slate-600 dark:text-slate-300 leading-relaxed">
                        <p>
                            Je m’appelle <strong>Antoine</strong>, je suis étudiant en <span className="text-blue-600 dark:text-blue-400 font-medium">Licence Information-Communication</span> à l’Université Paul-Valéry.
                        </p>
                        <p>
                            Je m’intéresse au numérique et au développement depuis le lycée, où j’ai découvert le code en spécialité NSI. À la base, c’était surtout de la curiosité. Puis j’ai compris que le développement pouvait devenir un vrai outil au service de la communication.
                        </p>
                        <p className="bg-slate-100 dark:bg-slate-800/50 p-4 rounded-xl border-l-4 border-blue-500 italic">
                            "Je ne me définis pas comme un expert, mais comme un étudiant qui aime créer des solutions concrètes, surtout quand elles peuvent faciliter la vie étudiante. Et des galères, j’en connais."
                        </p>
                    </div>
                </div>
            </div>
        </section>

        {/* 2. POURQUOI SORTIES MTP ? */}
        <section className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 space-y-6">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center text-purple-600 dark:text-purple-400 mb-2">
                <Rocket size={24} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Pourquoi Sorties MTP existe ?</h2>
            <div className="space-y-4 text-slate-600 dark:text-slate-300 leading-relaxed">
                <p>
                    Sorties MTP est né d’une expérience très simple : <br/>
                    <strong className="text-slate-900 dark:text-white">Organiser une soirée entre potes, c’est souvent le bazar.</strong>
                </p>
                <p>
                    Les messages qui se perdent, les horaires pas clairs, les adresses qu’on n’ose pas partager, les questions du type <em>“on se retrouve où ? à quel arrêt ? on fait quoi avant ?”</em>…
                    Ça paraît banal, mais mis bout à bout, ça devient vite long et pénible.
                </p>
                <p>
                    Je me suis dit qu’il devait y avoir un moyen <strong>plus simple, plus clair et plus sain</strong> d’organiser ce genre de sorties. C’est de là qu’est née l’idée.
                </p>
            </div>
        </section>

        {/* 3. PROJET HUMAIN */}
        <section className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                <Heart className="text-red-500 fill-red-500"/> Un projet humain avant tout
            </h2>
            <div className="prose dark:prose-invert text-slate-600 dark:text-slate-300 leading-relaxed space-y-4">
                <p>
                    Sorties MTP n’est pas qu’un projet technique. C’est avant tout un projet humain, et même un peu engagé.
                </p>
                <p>
                    Je développe seul, avec mes connaissances actuelles, en m’aidant parfois d’outils d’IA (en essayant de le faire intelligemment et de progresser par moi-même).
                    Je suis conscient de mes limites, surtout techniques, mais je préfère avancer pas à pas plutôt que de ne rien faire.
                </p>
                <div className="flex items-start gap-3 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl text-blue-800 dark:text-blue-300">
                    <Users className="shrink-0 mt-1" size={20}/>
                    <p className="text-sm font-medium">
                        Si le projet fonctionne, l’objectif est clair : s’entourer d’étudiants locaux, de professionnels de l’informatique, du juridique, et même de professeurs, pour construire quelque chose de solide, propre et utile.
                    </p>
                </div>
            </div>
        </section>

        {/* 4. MES VALEURS */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* OUI */}
            <div className="bg-green-50 dark:bg-green-900/10 p-6 rounded-3xl border border-green-100 dark:border-green-900/30">
                <h3 className="font-bold text-green-700 dark:text-green-400 mb-4 flex items-center gap-2">
                    <ShieldCheck size={20}/> Non négociable
                </h3>
                <ul className="space-y-3 text-sm text-green-800 dark:text-green-300">
                    <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 shrink-0"></div> Le respect de la vie privée</li>
                    <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 shrink-0"></div> La transparence totale</li>
                    <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 shrink-0"></div> La gratuité sans piège</li>
                </ul>
            </div>

            {/* NON */}
            <div className="bg-red-50 dark:bg-red-900/10 p-6 rounded-3xl border border-red-100 dark:border-red-900/30">
                <h3 className="font-bold text-red-700 dark:text-red-400 mb-4 flex items-center gap-2">
                    <XCircle size={20}/> Je refuse
                </h3>
                <ul className="space-y-3 text-sm text-red-800 dark:text-red-300">
                    <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 shrink-0"></div> Les publicités intrusives</li>
                    <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 shrink-0"></div> La revente de données</li>
                    <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 shrink-0"></div> Les mécaniques trompeuses</li>
                </ul>
            </div>
        </section>

        {/* 5. COMMUNAUTÉ & SUITE */}
        <section className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Une app construite avec vous</h2>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    Je ne vois pas les utilisateurs comme de simples “users”, mais comme une communauté.
                    Les retours, les idées, les critiques… tout ça compte énormément. 
                    <strong className="text-slate-900 dark:text-white block mt-2">C’est presque comme si vous en étiez co-éditeurs.</strong>
                </p>
            </div>

            <div className="bg-slate-900 dark:bg-slate-800 text-white p-8 rounded-3xl relative overflow-hidden">
                <div className="relative z-10 space-y-4">
                    <h3 className="text-xl font-bold flex items-center gap-2"><GraduationCap className="text-yellow-400"/> Et la suite ?</h3>
                    <p className="text-slate-300 text-sm leading-relaxed">
                        Aujourd’hui, Sorties MTP est un projet personnel sérieux et une expérimentation. 
                        De mon côté, je me projette dans les métiers de la communication (milieu artistique ou F1 🏎️).
                        Sorties MTP est une façon de lier communication, numérique et utilité réelle.
                    </p>
                </div>
                <div className="absolute -bottom-10 -right-10 opacity-10">
                    <Code size={150} />
                </div>
            </div>
        </section>

        {/* 6. CONCLUSION */}
        <section className="text-center pt-8 border-t border-slate-200 dark:border-slate-800">
            <p className="text-lg font-medium text-slate-900 dark:text-white mb-6">
                En résumé, Sorties MTP c’est :
            </p>
            <div className="flex flex-wrap justify-center gap-3">
                <span className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-full text-sm text-slate-600 dark:text-slate-300">🎓 Un projet étudiant</span>
                <span className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-full text-sm text-slate-600 dark:text-slate-300">🤝 Construit avec vous</span>
                <span className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-full text-sm text-slate-600 dark:text-slate-300">🛡️ Respectueux</span>
            </div>
            <p className="mt-8 font-black text-2xl text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                On peut faire mieux, sans trahir la confiance des gens.
            </p>
        </section>

      </div>
    </main>
  )
}