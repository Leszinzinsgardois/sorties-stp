'use client'

import Link from 'next/link'
import { 
  Rocket, MapPin, ShieldCheck, Share2, 
  Zap, Users, ArrowRight, CheckCircle, 
  Smartphone, HelpCircle, CloudRain, 
  TramFront, Lock, Eye, AlertTriangle, 
  Calendar, Info 
} from 'lucide-react'

export default function Guide() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors selection:bg-blue-500 selection:text-white">
      
      {/* 1. HERO : LE MANUEL */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] -z-10"></div>
        
        <div className="container mx-auto px-6 text-center max-w-4xl">
            <div className="inline-flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full px-4 py-1.5 mb-8 shadow-sm animate-in fade-in slide-in-from-bottom-4">
                <Info size={14} className="text-blue-500"/>
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wide">Documentation Officielle</span>
            </div>
            
            <h1 className="text-4xl md:text-7xl font-black text-slate-900 dark:text-white mb-6 leading-[1.1] animate-in fade-in slide-in-from-bottom-6 duration-700">
                Tout savoir sur <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">Oukonsort.</span>
            </h1>
            
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700">
                Du lancement rapide aux fonctionnalités avancées. Voici comment maîtriser l'app de A à Z.
            </p>
        </div>
      </section>

      {/* 2. LE TUTO RAPIDE (Style V1 Restauré & Amélioré) */}
      <section className="py-20 bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800">
          <div className="container mx-auto px-6 max-w-6xl">
              <div className="text-center mb-16">
                  <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4">🚀 Démarrage Rapide</h2>
                  <p className="text-slate-500 font-medium">Créer une sortie prend moins d'une minute. Voici les 3 étapes.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                  {/* Ligne connecteur (visible sur PC) */}
                  <div className="hidden md:block absolute top-10 left-[16%] w-[68%] h-1 bg-gradient-to-r from-blue-100 via-purple-100 to-green-100 dark:from-slate-800 dark:via-slate-800 dark:to-slate-800 rounded-full -z-0"></div>

                  {/* Étape 1 */}
                  <div className="relative z-10 flex flex-col items-center text-center group">
                      <div className="w-20 h-20 bg-white dark:bg-slate-950 rounded-2xl border-2 border-slate-100 dark:border-slate-800 flex items-center justify-center text-2xl font-black text-blue-600 shadow-xl mb-6 group-hover:scale-110 group-hover:border-blue-500 transition-all duration-300">
                          1
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">La Base</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-xs">
                          Choisis un <strong>Titre</strong> cool et une <strong>Date</strong>. 
                          Définis une jauge max (ex: 30 pers) pour que les inscriptions se bloquent automatiquement si c'est complet.
                      </p>
                  </div>

                  {/* Étape 2 */}
                  <div className="relative z-10 flex flex-col items-center text-center group">
                      <div className="w-20 h-20 bg-white dark:bg-slate-950 rounded-2xl border-2 border-slate-100 dark:border-slate-800 flex items-center justify-center text-2xl font-black text-purple-600 shadow-xl mb-6 group-hover:scale-110 group-hover:border-purple-500 transition-all duration-300">
                          2
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Le Spot</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-xs">
                          <strong>Lieu Public</strong> (Bar, Parc) ou <strong>Privé</strong> (Chez toi).
                          Si c'est privé, l'adresse est masquée aux inconnus. Ajoute l'arrêt de <strong>Tram</strong> le plus proche pour guider les potes.
                      </p>
                  </div>

                  {/* Étape 3 */}
                  <div className="relative z-10 flex flex-col items-center text-center group">
                      <div className="w-20 h-20 bg-white dark:bg-slate-950 rounded-2xl border-2 border-slate-100 dark:border-slate-800 flex items-center justify-center text-2xl font-black text-green-600 shadow-xl mb-6 group-hover:scale-110 group-hover:border-green-500 transition-all duration-300">
                          3
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Le Partage</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-xs">
                          Valide et obtiens ton <strong>Lien Unique</strong>. 
                          Envoie-le sur Insta ou WhatsApp. Tes amis voient les infos sans compte, mais doivent s'inscrire pour avoir l'adresse exacte.
                      </p>
                  </div>
              </div>
          </div>
      </section>

      {/* 3. LE GIGA DICTIONNAIRE (Features en détail) */}
      <section className="py-24 bg-slate-50 dark:bg-slate-950">
          <div className="container mx-auto px-6 max-w-6xl">
              
              <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4">L'Encyclopédie des Fonctionnalités</h2>
                    <p className="text-slate-600 dark:text-slate-400 max-w-xl">
                        Oukonsort est bourré de petits outils intelligents pour te simplifier la vie. Voici comment ils fonctionnent en détail.
                    </p>
                </div>
              </div>

              {/* GRID TYPE "BENTO" */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {/* CARD: METEO */}
                  <div className="md:col-span-2 bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-blue-500/30 transition shadow-sm group">
                      <div className="flex items-start justify-between mb-6">
                          <div className="bg-orange-100 dark:bg-orange-900/20 p-3 rounded-xl text-orange-600 dark:text-orange-400">
                              <CloudRain size={32}/>
                          </div>
                          <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold px-3 py-1 rounded-full uppercase">Automatique</span>
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Vigilance Météo Intelligente</h3>
                      <p className="text-slate-600 dark:text-slate-400 mb-4">
                          Ne te laisse pas surprendre par la pluie. Oukonsort scanne les prévisions Météo-France pour ton événement (jusqu'à 5 jours avant).
                      </p>
                      <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-100 dark:border-slate-800 text-sm text-slate-500">
                          <p>⚡️ <strong>Orage/Pluie ?</strong> Une bannière d'alerte s'affiche automatiquement en haut de ta soirée.</p>
                          <p>☀️ <strong>Grand soleil ?</strong> Rien ne s'affiche, profite.</p>
                      </div>
                  </div>

                  {/* CARD: TRAMWAY */}
                  <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-purple-500/30 transition shadow-sm">
                      <div className="bg-purple-100 dark:bg-purple-900/20 p-3 rounded-xl text-purple-600 dark:text-purple-400 w-fit mb-6">
                          <TramFront size={32}/>
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Sélecteur Tram 2.0</h3>
                      <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
                          Plus besoin d'expliquer "C'est l'arrêt après la gare".
                      </p>
                      <p className="text-sm text-slate-500 border-t border-slate-100 dark:border-slate-800 pt-4">
                          Sélectionne ta ligne (1 à 4) et choisis l'arrêt précis dans la liste officielle. Il apparaîtra clairement sur la fiche de l'événement.
                      </p>
                  </div>

                  {/* CARD: JAUGE */}
                  <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-green-500/30 transition shadow-sm">
                      <div className="bg-green-100 dark:bg-green-900/20 p-3 rounded-xl text-green-600 dark:text-green-400 w-fit mb-6">
                          <Users size={32}/>
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Jauge & Liste d'Attente</h3>
                      <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
                          Contrôle qui vient.
                      </p>
                      <ul className="text-sm text-slate-500 space-y-2">
                          <li>• Tu fixes un max (ex: 20).</li>
                          <li>• La barre de progression se remplit.</li>
                          <li>• À 20/20, le bouton "Je viens" disparaît et affiche <strong>COMPLET</strong>.</li>
                      </ul>
                  </div>

                  {/* CARD: MODIFICATION */}
                  <div className="md:col-span-2 bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-blue-500/30 transition shadow-sm">
                       <div className="flex items-start justify-between mb-6">
                          <div className="bg-blue-100 dark:bg-blue-900/20 p-3 rounded-xl text-blue-600 dark:text-blue-400">
                              <AlertTriangle size={32}/>
                          </div>
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Modifications & Annulations</h3>
                      <p className="text-slate-600 dark:text-slate-400 mb-4">
                          Un imprévu ? Change l'heure, le lieu ou annule tout. Le système gère la communication pour toi.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-orange-50 dark:bg-orange-900/10 p-3 rounded-lg border border-orange-100 dark:border-orange-900/20">
                              <p className="font-bold text-orange-700 dark:text-orange-400 text-sm mb-1">Changement d'heure</p>
                              <p className="text-xs text-slate-500">Une alerte "Horaire Modifié" apparaît avec l'ancien et le nouvel horaire (ex: 20h → 21h).</p>
                          </div>
                          <div className="bg-red-50 dark:bg-red-900/10 p-3 rounded-lg border border-red-100 dark:border-red-900/20">
                              <p className="font-bold text-red-700 dark:text-red-400 text-sm mb-1">Annulation</p>
                              <p className="text-xs text-slate-500">L'événement se fige, passe en rouge et affiche ton motif d'annulation bien en vue.</p>
                          </div>
                      </div>
                  </div>

                  {/* CARD: FORUM */}
                  <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500/30 transition shadow-sm">
                      <div className="bg-indigo-100 dark:bg-indigo-900/20 p-3 rounded-xl text-indigo-600 dark:text-indigo-400 w-fit mb-6">
                          <Info size={32}/>
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Infos Pratiques</h3>
                      <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
                          Ajoute des tags spécifiques.
                      </p>
                      <p className="text-sm text-slate-500">
                          Dress-code, PAF (Participation aux frais), ou "Ramenez vos boissons". Ces infos s'affichent dans un cadre dédié "Infos Pratiques".
                      </p>
                  </div>
                   {/* CARD: PRIVE */}
                  <div className="md:col-span-2 bg-slate-900 dark:bg-white p-8 rounded-3xl border border-slate-800 dark:border-slate-200 shadow-sm text-white dark:text-slate-900 relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
                          <Lock size={120}/>
                      </div>
                      <div className="relative z-10">
                        <div className="bg-white/20 dark:bg-slate-900/10 p-3 rounded-xl w-fit mb-6 backdrop-blur-sm">
                            <Lock size={32}/>
                        </div>
                        <h3 className="text-2xl font-bold mb-2">Confidentialité & Lieux Privés</h3>
                        <p className="opacity-90 mb-6 max-w-lg">
                            C'est notre priorité. Si tu organises une soirée en "Lieu Privé" :
                        </p>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <CheckCircle size={20} className="text-green-400 dark:text-green-600"/>
                                <span className="font-bold">Les inconnus</span>
                                <span className="opacity-70 text-sm">ne voient QUE le point de RDV public (ex: Arrêt de Tram).</span>
                            </div>
                             <div className="flex items-center gap-3">
                                <CheckCircle size={20} className="text-green-400 dark:text-green-600"/>
                                <span className="font-bold">Les inscrits</span>
                                <span className="opacity-70 text-sm">doivent rejoindre l'événement (et donner leur pseudo) pour voir l'adresse exacte si tu l'as mise.</span>
                            </div>
                        </div>
                      </div>
                  </div>

              </div>
          </div>
      </section>

      {/* 4. CTA FINAL (Harmonisé Mobile) */}
      <section className="py-24 border-t border-slate-200 dark:border-slate-800 text-center bg-white dark:bg-slate-900">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-8">Maintenant, tu sais tout.</h2>
            
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 w-full max-w-md mx-auto sm:max-w-none">
                <Link href="/dashboard/create" className="w-full sm:w-auto bg-blue-600 text-white px-8 py-4 rounded-xl font-bold shadow-xl shadow-blue-500/30 hover:scale-105 transition-transform flex items-center justify-center gap-2">
                    <Rocket size={20}/> Créer une sortie
                </Link>
                <Link href="/" className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition flex items-center justify-center gap-2">
                    Retour à l'accueil
                </Link>
            </div>
          </div>
      </section>

    </main>
  )
}