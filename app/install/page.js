'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Apple, Smartphone, Share, PlusSquare, MoreVertical, ArrowDownToLine, ArrowLeft, CheckCircle } from 'lucide-react'

export default function InstallPage() {
  const [os, setOs] = useState('ios') // 'ios' ou 'android'

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors pb-20 selection:bg-blue-500 selection:text-white">
      
      {/* HEADER */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10 px-6 py-4 flex items-center gap-4">
        <Link 
          href="/" 
          className="bg-slate-100 dark:bg-slate-800 p-2 rounded-full text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
        >
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-xl font-bold text-slate-800 dark:text-white">
          Installer l'App
        </h1>
      </div>

      <div className="max-w-md mx-auto px-6 py-8">
        
        {/* ACCROCHE */}
        <div className="text-center mb-8">
            <div className="w-20 h-20 bg-blue-600 rounded-3xl mx-auto mb-6 shadow-2xl shadow-blue-500/30 flex items-center justify-center text-white font-black text-3xl">
                S
            </div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Installe Sorties MTP</h2>
            <p className="text-slate-500 dark:text-slate-400">
                Ajoute l'app sur ton écran d'accueil pour y accéder en un clic, comme Insta ou Snap.
            </p>
        </div>

        {/* SELECTEUR OS */}
        <div className="bg-slate-200 dark:bg-slate-800 p-1 rounded-xl flex mb-10">
            <button 
                onClick={() => setOs('ios')}
                className={`flex-1 py-3 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all ${os === 'ios' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
            >
                <Apple size={18} className="mb-0.5"/> iPhone (Safari)
            </button>
            <button 
                onClick={() => setOs('android')}
                className={`flex-1 py-3 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all ${os === 'android' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
            >
                <Smartphone size={18} /> Android (Chrome)
            </button>
        </div>

        {/* TUTO IOS */}
        {os === 'ios' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                <div className="flex gap-4 items-start">
                    <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center shrink-0 font-bold text-slate-500">1</div>
                    <div>
                        <p className="font-medium text-slate-900 dark:text-white mb-2">
                            Appuie sur le bouton <span className="font-bold text-blue-500">Partager</span>
                        </p>
                        <p className="text-sm text-slate-500">Il est tout en bas au milieu de ton écran.</p>
                        <div className="mt-3 bg-slate-100 dark:bg-slate-800 p-3 rounded-xl inline-block">
                             <Share className="text-blue-500" />
                        </div>
                    </div>
                </div>

                <div className="w-px h-8 bg-slate-200 dark:bg-slate-800 ml-5"></div>

                <div className="flex gap-4 items-start">
                    <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center shrink-0 font-bold text-slate-500">2</div>
                    <div>
                        <p className="font-medium text-slate-900 dark:text-white mb-2">
                            Choisis <span className="font-bold">"Sur l'écran d'accueil"</span>
                        </p>
                        <p className="text-sm text-slate-500">Tu devras peut-être scroller un peu vers le bas.</p>
                        <div className="mt-3 bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-xl inline-flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                             <PlusSquare size={18}/> Sur l'écran d'accueil
                        </div>
                    </div>
                </div>

                <div className="w-px h-8 bg-slate-200 dark:bg-slate-800 ml-5"></div>

                <div className="flex gap-4 items-start">
                    <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center shrink-0 font-bold">
                        <CheckCircle size={20}/>
                    </div>
                    <div>
                        <p className="font-medium text-slate-900 dark:text-white mb-1">
                            C'est terminé !
                        </p>
                        <p className="text-sm text-slate-500">L'app est maintenant sur ton téléphone.</p>
                    </div>
                </div>
            </div>
        )}

        {/* TUTO ANDROID */}
        {os === 'android' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                <div className="flex gap-4 items-start">
                    <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center shrink-0 font-bold text-slate-500">1</div>
                    <div>
                        <p className="font-medium text-slate-900 dark:text-white mb-2">
                            Appuie sur les <span className="font-bold text-blue-500">3 petits points</span>
                        </p>
                        <p className="text-sm text-slate-500">En haut à droite de ton navigateur.</p>
                        <div className="mt-3 bg-slate-100 dark:bg-slate-800 p-3 rounded-xl inline-block">
                             <MoreVertical className="text-slate-700 dark:text-slate-300" />
                        </div>
                    </div>
                </div>

                <div className="w-px h-8 bg-slate-200 dark:bg-slate-800 ml-5"></div>

                <div className="flex gap-4 items-start">
                    <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center shrink-0 font-bold text-slate-500">2</div>
                    <div>
                        <p className="font-medium text-slate-900 dark:text-white mb-2">
                            Sélectionne <span className="font-bold">"Installer l'application"</span>
                        </p>
                        <p className="text-sm text-slate-500">Ou "Ajouter à l'écran d'accueil" selon ta version.</p>
                        <div className="mt-3 bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-xl inline-flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                             <ArrowDownToLine size={18}/> Installer l'application
                        </div>
                    </div>
                </div>

                <div className="w-px h-8 bg-slate-200 dark:bg-slate-800 ml-5"></div>

                <div className="flex gap-4 items-start">
                    <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center shrink-0 font-bold">
                        <CheckCircle size={20}/>
                    </div>
                    <div>
                        <p className="font-medium text-slate-900 dark:text-white mb-1">
                            C'est terminé !
                        </p>
                        <p className="text-sm text-slate-500">L'app est installée.</p>
                    </div>
                </div>
            </div>
        )}

      </div>
    </main>
  )
}