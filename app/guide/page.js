'use client'

import Link from 'next/link'
import { 
  Rocket, MapPin, ShieldCheck, Share2, 
  Zap, Users, ArrowRight, CheckCircle, 
  Smartphone, HelpCircle, CloudRain, 
  TramFront, Lock, Eye, AlertTriangle, 
  Calendar, Info, QrCode, Download,
  ShieldAlert, Siren, Bot, Sparkles, Wand2
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

      {/* 2. LE TUTO RAPIDE */}
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

      {/* 3. L'ENCYCLOPÉDIE (Features en détail) */}
      <section className="py-24 bg-slate-50 dark:bg-slate-950">
          <div className="container mx-auto px-6 max-w-6xl">
              
              <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4">L'Encyclopédie des Fonctionnalités</h2>
                    <p className="text-slate-600 dark:text-slate-400 max-w-xl">
                        Oukonsort est bourré de petits outils intelligents. Voici comment tout fonctionne.
                    </p>
                </div>
              </div>

              {/* GRID TYPE "BENTO" */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {/* --- LIGNE 1 : ZÉRO FRICTION + PARTAGE --- */}

                  {/* CARD: ZÉRO FRICTION (2 cols) */}
                  <div className="md:col-span-2 bg-gradient-to-br from-blue-600 to-blue-700 p-8 rounded-3xl shadow-lg text-white relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                          <Rocket size={150}/>
                      </div>
                      <div className="relative z-10">
                          <div className="bg-white/20 p-3 rounded-xl w-fit mb-6 backdrop-blur-md">
                              <Zap size={28} className="text-white"/>
                          </div>
                          <h3 className="text-2xl font-bold mb-2">Zéro friction pour tes potes</h3>
                          <p className="text-blue-100 mb-6 max-w-lg">
                              C'est la force d'Oukonsort. Quand tu partages le lien sur WhatsApp ou Insta :
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="flex items-center gap-3 bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                                  <CheckCircle size={20} className="text-green-300"/>
                                  <span className="font-bold text-sm">Pas d'application à télécharger</span>
                              </div>
                              <div className="flex items-center gap-3 bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                                  <CheckCircle size={20} className="text-green-300"/>
                                  <span className="font-bold text-sm">Pas de compte obligatoire</span>
                              </div>
                              <div className="flex items-center gap-3 bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                                  <CheckCircle size={20} className="text-green-300"/>
                                  <span className="font-bold text-sm">Infos visibles en 1 clic</span>
                              </div>
                                <div className="flex items-center gap-3 bg-white/5 p-3 rounded-lg backdrop-blur-sm border border-white/10 border-dashed">
                                    <Calendar size={20} className="text-blue-200"/>
                                    <span className="font-bold text-sm text-blue-100">Ajout Calendrier <span className="text-xs opacity-70 font-normal ml-1">(À venir)</span></span>
                                </div>
                          </div>
                      </div>
                  </div>

                  {/* CARD: PARTAGE & QR (1 col) */}
                  <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-pink-500/30 transition shadow-sm group">
                      <div className="bg-pink-100 dark:bg-pink-900/20 p-3 rounded-xl text-pink-600 dark:text-pink-400 w-fit mb-6">
                          <Share2 size={32}/>
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Partage Viral</h3>
                      <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
                          Le lien généré est magique.
                      </p>
                      <ul className="text-sm text-slate-500 space-y-2 mb-4">
                          <li>• Copie le lien en 1 clic.</li>
                          <li>• Partage-le en Story Insta.</li>
                          <li>• Colle-le dans tes groupes de promo.</li>
                      </ul>
                      <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 text-xs font-bold text-slate-400 uppercase">
                          <QrCode size={14}/> QR Code intégré (bientôt)
                      </div>
                  </div>

                  {/* --- LIGNE 2 : FONCTIONNALITÉS --- */}

                  {/* CARD: METEO (1 col) */}
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-blue-500/30 transition shadow-sm group">
                        
                        {/* En-tête avec Icône + Badge AUTO */}
                        <div className="flex items-start justify-between mb-6">
                            <div className="bg-orange-100 dark:bg-orange-900/20 p-3 rounded-xl text-orange-600 dark:text-orange-400">
                                <CloudRain size={32}/>
                            </div>
                            <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold px-3 py-1 rounded-full uppercase">Auto</span>
                        </div>

                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Météo Auto</h3>
                        <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
                            Fini de checker la météo toutes les 5 minutes, Oukonsort scanne Météo-France pour toi.
                        </p>
                        
                        {/* Blocs d'infos (J'ai ajouté un petit space-y-2 pour qu'ils ne se collent pas) */}
                        <div className="space-y-2">
                            <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-100 dark:border-slate-800 text-xs text-slate-500">
                                <p>⚡️ <strong>Orage/Pluie ?</strong> Une bannière d'alerte s'affiche automatiquement.</p>
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-100 dark:border-slate-800 text-xs text-slate-500">
                                <p>☀️ <strong>Grand Soleil ?</strong> Aucune information n'apparaît à l'écran.</p>
                            </div>
                        </div>
                    </div>

                  {/* CARD: TRAMWAY (1 col) */}
                  <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-purple-500/30 transition shadow-sm">
                      <div className="bg-purple-100 dark:bg-purple-900/20 p-3 rounded-xl text-purple-600 dark:text-purple-400 w-fit mb-6">
                          <TramFront size={32}/>
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Sélecteur Tram 2.0</h3>
                      <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
                          Fini les "C'est quel arrêt ?".
                      </p>
                      <p className="text-sm text-slate-500">
                          Choisis la ligne et l'arrêt précis. Il apparaît clairement sur la fiche de l'événement. Tu as toujours la possibilité de changer l'arrêt si tu t'es trompé.
                      </p>
                  </div>

                  {/* CARD: JAUGE (1 col) */}
                  <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-green-500/30 transition shadow-sm">
                      <div className="bg-green-100 dark:bg-green-900/20 p-3 rounded-xl text-green-600 dark:text-green-400 w-fit mb-6">
                          <Users size={32}/>
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Jauge Max</h3>
                      <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
                          Contrôle qui vient.
                      </p>
                      <ul className="text-sm text-slate-500 space-y-2">
                          <li>• Tu fixes un max (ex: 20).</li>
                          <li>• Barre de progression.</li>
                          <li>• Blocage auto quand complet.</li>
                      </ul>
                  </div>

                  {/* --- LIGNE 3 : GESTION & INFOS --- */}

                  {/* CARD: MODIFICATION (2 cols) */}
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
                              <p className="text-xs text-slate-500">Une alerte "Horaire Modifié" apparaît avec l'ancien et le nouvel horaire.</p>
                          </div>
                          <div className="bg-red-50 dark:bg-red-900/10 p-3 rounded-lg border border-red-100 dark:border-red-900/20">
                              <p className="font-bold text-red-700 dark:text-red-400 text-sm mb-1">Annulation</p>
                              <p className="text-xs text-slate-500">L'événement se fige, passe en rouge et affiche ton motif d'annulation.</p>
                          </div>
                      </div>
                  </div>

                  {/* CARD: FORUM (1 col) */}
                  <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500/30 transition shadow-sm">
                      <div className="bg-indigo-100 dark:bg-indigo-900/20 p-3 rounded-xl text-indigo-600 dark:text-indigo-400 w-fit mb-6">
                          <Info size={32}/>
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Infos Pratiques</h3>
                      <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
                          Ajoute des tags spécifiques.
                      </p>
                      <p className="text-sm text-slate-500">
                          Dress-code, PAF, ou "Ramenez vos boissons". Ces infos s'affichent dans un cadre dédié.
                      </p>
                  </div>

                  {/* --- LIGNE 4 : PWA (LARGE) --- */}

                  {/* CARD: INSTALLATION (PWA) (3 cols) */}
                  <div className="md:col-span-3 bg-slate-900 dark:bg-white p-8 rounded-3xl border border-slate-800 dark:border-slate-200 shadow-sm text-white dark:text-slate-900 relative overflow-hidden flex flex-col md:flex-row items-center gap-8">
                      <div className="flex-1">
                          <div className="bg-white/20 dark:bg-slate-900/10 p-3 rounded-xl w-fit mb-6 backdrop-blur-sm">
                              <Smartphone size={28}/>
                          </div>
                          <h3 className="text-2xl font-bold mb-2">Installe l'App (sans Store)</h3>
                          <p className="opacity-90 mb-6 max-w-xl">
                              Oukonsort est une <strong>Progressive Web App (PWA)</strong>. Tu peux l'installer sur ton écran d'accueil comme une vraie appli, sans passer par l'App Store ou le Play Store.
                          </p>
                          <Link href="/install" className="inline-flex items-center gap-2 bg-white text-slate-900 dark:bg-slate-900 dark:text-white px-6 py-3 rounded-xl font-bold text-sm hover:scale-105 transition-transform">
                              <Download size={18}/> Voir le tuto d'installation
                          </Link>
                      </div>
                      {/* Visual Mockup Abstract */}
                      <div className="flex-1 w-full flex justify-center opacity-50 md:opacity-100">
                           <div className="flex gap-4">
                                <div className="w-16 h-16 rounded-2xl bg-white/10 dark:bg-slate-900/10 border border-white/20 flex items-center justify-center font-bold text-2xl">📱</div>
                                <div className="w-16 h-16 rounded-2xl bg-white/10 dark:bg-slate-900/10 border border-white/20 flex items-center justify-center font-bold text-2xl">⚡️</div>
                                <div className="w-16 h-16 rounded-2xl bg-white/10 dark:bg-slate-900/10 border border-white/20 flex items-center justify-center font-bold text-2xl">🔔</div>
                           </div>
                      </div>
                  </div>

                  {/* --- LIGNE 5 : PRIVÉ (LARGE) --- */}

                   {/* CARD: PRIVE (3 cols) */}
                  <div className="md:col-span-3 bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-green-500/30 transition shadow-sm">
                      <div className="flex flex-col md:flex-row gap-8 items-center">
                        <div className="flex-1">
                            <div className="bg-green-100 dark:bg-green-900/20 p-3 rounded-xl text-green-600 dark:text-green-400 w-fit mb-6">
                                <Lock size={32}/>
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Lieux Privés & Sécurité</h3>
                            <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-2xl">
                                C'est notre priorité. Si tu organises une soirée en "Lieu Privé" (chez toi), ton adresse reste cachée.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800 p-4 rounded-xl">
                                    <Eye size={20} className="text-slate-400 shrink-0"/>
                                    <p className="text-sm text-slate-600 dark:text-slate-300"><strong>Les inconnus</strong> ne voient QUE le point de RDV public (ex: Arrêt de Tram) ou un lieu à proximité de chez toi que tu détermines.</p>
                                </div>
                                <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800 p-4 rounded-xl">
                                    <CheckCircle size={20} className="text-green-500 shrink-0"/>
                                    <p className="text-sm text-slate-600 dark:text-slate-300">Grâce aux listes de participants, tu peux envoyer <strong>aux inscrits</strong> les informations sur l'adresse exacte ou bien le lieu de rdv à proximité.</p>
                                </div>
                            </div>
                        </div>
                      </div>
                  </div>
                  {/* CARD: OUKONSORT AI (Teaser) - 2 cols */}
                   <div className="md:col-span-2 relative p-1 rounded-3xl overflow-hidden group">
                      {/* Bordure animée FLUIDE */}
                      <div className="absolute inset-[-50%] bg-[conic-gradient(from_0deg,transparent_0_340deg,#a855f7_360deg)] animate-[spin_4s_linear_infinite] opacity-50 group-hover:opacity-100 transition-opacity"></div>
                      <div className="absolute inset-[2px] bg-slate-900 rounded-[22px] z-0"></div>

                      <div className="relative z-10 p-8 h-full flex flex-col justify-center">
                           <div className="flex flex-wrap items-center gap-3 mb-4">
                               <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-3 rounded-xl text-white shadow-lg shadow-purple-500/20">
                                   <Bot size={28}/>
                               </div>
                               <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300">
                                   Oukonsort AI
                               </h3>
                               <span className="bg-purple-500/20 border border-purple-500/30 text-purple-200 text-[10px] font-bold px-2 py-1 rounded-full uppercase">
                                   Bêta +++
                               </span>
                           </div>

                           <p className="text-slate-400 text-sm mb-6 leading-relaxed max-w-md">
                               On entraîne une IA capable de générer ta soirée parfaite en une phrase.
                               <br/>"Soirée posée, 10 personnes, budget serré." 👉 <strong className="text-purple-300">Boom, tout est suggéré par l'IA, à toi de compléter ou laisser tel quel !</strong>
                           </p>

                           <div className="flex items-center gap-2 text-xs font-mono text-purple-400/80 bg-purple-900/20 w-fit px-3 py-1.5 rounded-lg border border-purple-500/20">
                               <Sparkles size={14} className="animate-pulse"/>
                               <span>Phase de R&D (Non déployé)</span>
                           </div>
                      </div>
                      
                      {/* Abstract shapes */}
                      <div className="absolute right-0 bottom-0 w-64 h-64 bg-purple-600/20 blur-[80px] rounded-full pointer-events-none"></div>
                  </div>

                   {/* CARD: SOS (1 col) */}
                  <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-red-500/50 transition shadow-sm group relative overflow-hidden">
                      {/* Fond Alerte */}
                      <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
                           <Siren size={100} className="text-red-500"/>
                      </div>
                      <div className="flex items-start justify-between mb-6 relative z-10">
                          <div className="bg-red-100 dark:bg-red-900/20 p-3 rounded-xl text-red-600 dark:text-red-400">
                              <ShieldAlert size={32}/>
                          </div>
                          <span className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-300 text-[10px] font-bold px-2 py-1 rounded-full border border-red-200 dark:border-red-800 uppercase tracking-wide">
                              En étude
                          </span>
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 relative z-10">Bouton SOS</h3>
                      <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 relative z-10">
                          Pour des soirées 100% sûres.
                      </p>
                      <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-100 dark:border-slate-800 text-xs text-slate-500 relative z-10">
                          <p>🔴 <strong>Objectif :</strong> Un bouton pour signaler toute activité suspecte immédiatement.</p>
                          <p className="mt-2 text-[10px] italic opacity-70 border-t border-slate-200 dark:border-slate-800 pt-2">Feature en attente des soutiens adéquats.</p>
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