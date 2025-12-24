'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Check, X, ShieldAlert, Eye, User, Calendar } from 'lucide-react'

export default function VerificationPage() {
  const router = useRouter()

  // FAUSSES DONNÉES (MOCK)
  // Une fois la fonctionnalité codée, on remplacera ça par un fetch Supabase
  const [requests, setRequests] = useState([
    { id: 1, pseudo: 'Thibault34', name: 'Thibault Dupuis', dob: '12/05/2002', status: 'pending', date: 'Il y a 2h' },
    { id: 2, pseudo: 'Lisa_MTP', name: 'Lisa Martin', dob: '03/11/2004', status: 'pending', date: 'Il y a 5h' },
    { id: 3, pseudo: 'Lucas_B', name: 'Lucas Bernard', dob: '28/01/2001', status: 'pending', date: 'Hier' },
  ])

  // Simulation d'action (Sans effet réel)
  const handleAction = (id, action) => {
    if(!confirm(`Êtes-vous sûr de vouloir ${action === 'accept' ? 'VALIDER' : 'REFUSER'} ce dossier ?`)) return
    
    // On retire juste l'élément de la liste pour faire "genre"
    setRequests(requests.filter(r => r.id !== id))
    alert(`Dossier ${action === 'accept' ? 'validé' : 'refusé'} (Simulation - Aucune action base de données).`)
  }

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20 transition-colors">
      
      {/* HEADER */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10 px-6 py-4 flex items-center gap-4">
        <Link href="/admin" className="bg-slate-100 dark:bg-slate-800 p-2 rounded-full text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <ShieldAlert className="text-orange-500" />
            Vérifications CNI
        </h1>
      </div>

      <div className="max-w-4xl mx-auto p-6 space-y-6">

        {/* ALERTE TECH */}
        <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 p-4 rounded-2xl flex items-start gap-3">
            <ShieldAlert size={24} className="text-orange-600 dark:text-orange-400 shrink-0 mt-0.5"/>
            <div>
                <h3 className="font-bold text-orange-800 dark:text-orange-300">Module Non Connecté</h3>
                <p className="text-sm text-orange-700 dark:text-orange-400 mt-1">
                    Cette interface est une maquette. Les boutons simulent les actions mais aucune modification n'est effectuée sur la base de données (Supabase).
                </p>
            </div>
        </div>

        {/* COMPTEUR */}
        <div className="flex justify-between items-end px-2">
            <h2 className="font-bold text-slate-700 dark:text-slate-300">
                En attente ({requests.length})
            </h2>
        </div>

        {/* LISTE DES DEMANDES */}
        <div className="space-y-4">
            {requests.length === 0 ? (
                <div className="text-center py-20 text-slate-400 italic">
                    Aucune demande en attente.
                </div>
            ) : (
                requests.map((req) => (
                    <div key={req.id} className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
                        
                        {/* INFOS USER */}
                        <div className="flex items-center gap-4 w-full md:w-auto">
                            <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-500">
                                <User size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800 dark:text-white text-lg">
                                    {req.name} <span className="text-slate-400 text-sm font-normal">(@{req.pseudo})</span>
                                </h3>
                                <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400 mt-1">
                                    <span className="flex items-center gap-1"><Calendar size={14}/> Né(e) le {req.dob}</span>
                                    <span className="text-slate-300">•</span>
                                    <span>Demande : {req.date}</span>
                                </div>
                            </div>
                        </div>

                        {/* ACTIONS */}
                        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                            <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition text-sm">
                                <Eye size={18} />
                                Voir CNI
                            </button>
                            
                            <div className="w-px h-8 bg-slate-200 dark:bg-slate-700 mx-2 hidden md:block"></div>

                            <button 
                                onClick={() => handleAction(req.id, 'reject')}
                                className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/40 transition"
                                title="Refuser"
                            >
                                <X size={20} />
                            </button>
                            <button 
                                onClick={() => handleAction(req.id, 'accept')}
                                className="p-3 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-xl hover:bg-green-100 dark:hover:bg-green-900/40 transition"
                                title="Valider"
                            >
                                <Check size={20} />
                            </button>
                        </div>

                    </div>
                ))
            )}
        </div>

      </div>
    </main>
  )
}