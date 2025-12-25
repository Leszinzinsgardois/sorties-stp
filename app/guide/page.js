'use client'

import Link from 'next/link'
import { 
  Rocket, MapPin, ShieldCheck, Share2, 
  Zap, Users, ArrowRight, CheckCircle, 
  Smartphone, Lock, TramFront, CloudRain 
} from 'lucide-react'

export default function Guide() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors selection:bg-blue-500 selection:text-white">
      
      {/* 1. HERO HEADER */}
      <section className="relative pt-20 pb-20 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] -z-10"></div>
        
        <div className="container mx-auto px-6 text-center max-w-4xl">
            <div className="inline-flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full px-4 py-1.5 mb-6 shadow-sm animate-in fade-in slide-in-from-bottom-4">
                <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wide">Tutoriel Rapide</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-6 leading-[1.1] animate-in fade-in slide-in-from-bottom-6 duration-700">
                Organise ta soirée en <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">moins de 2 minutes.</span>
            </h1>
            
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700">
                Fini les groupes WhatsApp où l'info se perd. Oukonsort centralise tout : lieu, tram, météo et invités. Voici comment ça marche.
            </p>

            <div className="flex justify-center gap-4 animate-in fade-in zoom-in duration-700 delay-100">
                <Link href="/dashboard/create" className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold shadow-xl shadow-blue-500/30 hover:scale-105 transition-transform flex items-center gap-2">
                    <Rocket size={20}/> Créer ma soirée
                </Link>
            </div>
        </div>
      </section>

      {/* 2. STEPS (LE COMMENT FAIRE) */}
      <section className="py-20 bg-white dark:bg-slate-900 border-y border-slate-100 dark:border-slate-800">
          <div className="container mx-auto px-6 max-w-5xl">
              
              {/* STEP 1 */}
              <div className="flex flex-col md:flex-row items-center gap-10 mb-20 group">
                  <div className="flex-1 order-2 md:order-1">
                      <div className="bg-blue-50 dark:bg-blue-900/20 w-12 h-12 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 font-black text-xl mb-4 border border-blue-100 dark:border-blue-800">1</div>
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Définis les bases</h3>
                      <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                          Donne un titre, une date et une heure. Tu peux aussi fixer une <strong>jauge maximale</strong> de participants pour éviter que ça déborde.
                      </p>
                      <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
                          <li className="flex items-center gap-2"><CheckCircle size={16} className="text-green-500"/> Titre & Description</li>
                          <li className="flex items-center gap-2"><CheckCircle size={16} className="text-green-500"/> Limite de participants (Compteur auto)</li>
                      </ul>
                  </div>
                  <div className="flex-1 order-1 md:order-2 bg-slate-50 dark:bg-slate-950 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 rotate-2 group-hover:rotate-0 transition duration-500">
                      <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm mb-3">
                          <Users className="text-blue-500"/>
                          <div>
                              <p className="text-xs font-bold text-slate-400 uppercase">Participants</p>
                              <p className="font-bold dark:text-white">Max 30 personnes</p>
                          </div>
                      </div>
                      <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm opacity-50">
                          <Lock className="text-slate-400"/>
                          <div>
                              <p className="text-xs font-bold text-slate-400 uppercase">Visibilité</p>
                              <p className="font-bold dark:text-white">Sur invitation</p>
                          </div>
                      </div>
                  </div>
              </div>

              {/* STEP 2 */}
              <div className="flex flex-col md:flex-row items-center gap-10 mb-20 group">
                  <div className="flex-1 bg-slate-50 dark:bg-slate-950 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 -rotate-2 group-hover:rotate-0 transition duration-500">
                       <div className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm mb-3 border-l-4 border-purple-500">
                          <div className="flex justify-between items-center mb-1">
                              <p className="text-xs font-bold text-purple-500 uppercase">Lieu Privé</p>
                              <ShieldCheck size={16} className="text-purple-500"/>
                          </div>
                          <p className="font-bold dark:text-white text-lg">Chez Thomas</p>
                          <p className="text-xs text-slate-400 mt-1">Adresse masquée pour les non-inscrits.</p>
                      </div>
                      <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-2 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 w-fit">
                          <TramFront size={14}/> Ligne 1 - Louis Blanc
                      </div>
                  </div>
                  <div className="flex-1">
                      <div className="bg-purple-50 dark:bg-purple-900/20 w-12 h-12 rounded-2xl flex items-center justify-center text-purple-600 dark:text-purple-400 font-black text-xl mb-4 border border-purple-100 dark:border-purple-800">2</div>
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Choisis le lieu (Intelligent)</h3>
                      <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                          Bar public ou appart privé ? Si c'est privé, l'adresse exacte est protégée.
                          <br/>
                          Nouveau : Sélectionne l'arrêt de <strong>Tramway</strong> le plus proche pour guider tes potes.
                      </p>
                  </div>
              </div>

              {/* STEP 3 */}
              <div className="flex flex-col md:flex-row items-center gap-10 group">
                  <div className="flex-1 order-2 md:order-1">
                      <div className="bg-green-50 dark:bg-green-900/20 w-12 h-12 rounded-2xl flex items-center justify-center text-green-600 dark:text-green-400 font-black text-xl mb-4 border border-green-100 dark:border-green-800">3</div>
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Partage le lien unique</h3>
                      <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                          Une fois créé, tu obtiens un lien unique. Envoie-le sur Insta, Snap ou WhatsApp.
                          <br/>
                          Tes amis n'ont <strong>pas besoin de créer de compte</strong> pour voir les infos de base, mais ils doivent s'inscrire pour voir l'adresse exacte.
                      </p>
                  </div>
                  <div className="flex-1 order-1 md:order-2 bg-slate-50 dark:bg-slate-950 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 rotate-1 group-hover:rotate-0 transition duration-500 flex justify-center items-center">
                      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-xl text-center max-w-xs w-full">
                          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                              <Share2 size={32}/>
                          </div>
                          <p className="font-bold text-slate-900 dark:text-white mb-2">Lien copié !</p>
                          <p className="text-xs text-slate-500">oukonsort.fr/event/123...</p>
                          <button className="w-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-sm py-2 rounded-lg mt-4">Envoyer à un ami</button>
                      </div>
                  </div>
              </div>

          </div>
      </section>

      {/* 3. FEATURES HIGHLIGHT (Pourquoi c'est mieux ?) */}
      <section className="py-20 bg-slate-50 dark:bg-slate-950">
          <div className="container mx-auto px-6 max-w-6xl">
              <div className="text-center mb-16">
                  <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4">Pourquoi passer par Oukonsort ?</h2>
                  <p className="text-slate-600 dark:text-slate-400">On a pensé à tout ce qui manquait dans tes conversations de groupe.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Feature 1 */}
                  <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition">
                      <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-xl flex items-center justify-center text-orange-600 dark:text-orange-400 mb-4">
                          <CloudRain size={24}/>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Alerte Météo Auto</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                          S'il pleut ou qu'il y a un orage le jour J, une bannière d'alerte s'affiche automatiquement sur ton événement. Pas de mauvaise surprise.
                      </p>
                  </div>

                  {/* Feature 2 */}
                  <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition">
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4">
                          <Users size={24}/>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Gestion Guest-List</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                          Vois en temps réel qui vient. La jauge se remplit visuellement. Si c'est complet, les inscriptions se bloquent toutes seules.
                      </p>
                  </div>

                  {/* Feature 3 */}
                  <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition">
                      <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-xl flex items-center justify-center text-red-600 dark:text-red-400 mb-4">
                          <Zap size={24}/>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Modifs en direct</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                          Tu décales l'heure ? Tu changes de bar ? Modifie l'event et une alerte "Horaire Modifié" apparaîtra pour prévenir tout le monde.
                      </p>
                  </div>
              </div>
          </div>
      </section>

      {/* 4. CTA */}
      <section className="py-20 border-t border-slate-200 dark:border-slate-800 text-center">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-6">Prêt à tester ?</h2>
          <div className="flex justify-center gap-4">
              <Link href="/dashboard/create" className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold shadow-xl shadow-blue-500/30 hover:scale-105 transition-transform flex items-center gap-2">
                  <Rocket size={20}/> Créer une sortie
              </Link>
              <Link href="/" className="px-8 py-4 rounded-xl font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                  Retour à l'accueil
              </Link>
          </div>
      </section>

    </main>
  )
}