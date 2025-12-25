'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Trash2, Lock, User, ShieldCheck, ScanFace, IdCard, AlertCircle } from 'lucide-react'

export default function ProfilePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)

  // États formulaires (Email retiré car non modifiable)
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' })

  useEffect(() => {
    getProfile()
  }, [])

  async function getProfile() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }
    setUser(user)
    // On n'a plus besoin de stocker l'email dans un state modifiable

    const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
    setProfile(data)
    setLoading(false)
  }

  // --- GESTION MOT DE PASSE ---
  async function updatePassword() {
    if (!passwords.current || !passwords.new || !passwords.confirm) return alert("Remplis tous les champs mot de passe.")
    if (passwords.new !== passwords.confirm) return alert("Les nouveaux mots de passe ne correspondent pas.")

    // 1. Vérifier l'ancien mot de passe
    const { error: signInError } = await supabase.auth.signInWithPassword({ 
        email: user.email, 
        password: passwords.current 
    })
    
    if (signInError) return alert("Le mot de passe actuel est incorrect.")

    // 2. Mettre à jour
    const { error } = await supabase.auth.updateUser({ password: passwords.new })
    if (error) alert("Erreur: " + error.message)
    else {
        alert("Mot de passe modifié avec succès !")
        setPasswords({ current: '', new: '', confirm: '' })
    }
  }

  // --- SUPPRESSION COMPTE (Soft Delete) ---
  async function handleDeleteAccount() {
    const confirmation = prompt("Écris 'SUPPRIMER' pour confirmer la suppression de ton compte. Il sera réactivable pendant 30 jours.")
    if (confirmation !== 'SUPPRIMER') return

    await supabase.from('profiles').update({ deleted_at: new Date().toISOString() }).eq('id', user.id)
    
    await supabase.auth.signOut()
    router.push('/')
    alert("Compte supprimé. Tu as 30 jours pour le réactiver en te connectant.")
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-500">Chargement...</div>

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20 transition-colors">
      
      {/* HEADER */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10 px-4 py-4 flex items-center gap-4">
        <Link href="/dashboard" className="bg-slate-100 dark:bg-slate-800 p-2 rounded-full text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-xl font-bold text-slate-800 dark:text-white">Mon Compte</h1>
      </div>

      <div className="max-w-2xl mx-auto p-4 space-y-6">

        {/* 1. INFOS CIVILES (Lecture Seule) */}
        <section className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 space-y-4">
            <h2 className="font-bold text-slate-800 dark:text-white flex items-center gap-2"><User size={20} className="text-blue-500"/> Informations Personnelles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase">Pseudo (Public)</label>
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-blue-800 dark:text-blue-300 font-bold border border-blue-100 dark:border-blue-900/50">
                        @{profile?.pseudo}
                    </div>
                </div>
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase">Identité (Privé)</label>
                    <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-300 font-medium cursor-not-allowed">
                        {profile?.prenom} {profile?.nom}
                    </div>
                </div>
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase">Né(e) le</label>
                    <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-300 font-medium cursor-not-allowed">
                        {profile?.date_naissance ? new Date(profile.date_naissance).toLocaleDateString() : 'Non renseigné'}
                    </div>
                </div>
            </div>
            <p className="text-xs text-slate-400 italic pt-2 flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-green-500"/> Identité vérifiée (si vérification par CNI effectuée) et non modifiable.
            </p>
        </section>

        {/* 2. VÉRIFICATION CNI */}
        <section className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                <IdCard size={100} />
            </div>

            <div className="flex items-start gap-4 relative z-10">
                <div className="bg-white dark:bg-slate-800 p-3 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 text-slate-400">
                    <ScanFace size={28} />
                </div>
                <div>
                    <h3 className="font-bold text-slate-800 dark:text-white text-lg">Vérification</h3>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Par Carte d'Identité</p>
                    
                    <div className="inline-flex items-center gap-2 bg-slate-200 dark:bg-slate-700 px-3 py-1 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 mb-3">
                        <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                        Non effectué
                    </div>

                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed flex items-start gap-2">
                        <AlertCircle size={16} className="shrink-0 mt-0.5" />
                        Cette fonctionnalité n'est pas encore implémentée. Inutile de s'inquiéter, votre compte est parfaitement fonctionnel.
                    </p>
                </div>
            </div>
        </section>

        {/* 3. SÉCURITÉ (Email & Mdp) */}
        <section className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 space-y-6">
            <h2 className="font-bold text-slate-800 dark:text-white flex items-center gap-2"><Lock size={20} className="text-purple-500"/> Sécurité & Connexion</h2>
            
            {/* Email (Lecture Seule) */}
            <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Adresse E-mail</label>
                <div className="flex gap-2">
                    <input 
                        type="email" 
                        value={user?.email || ''} 
                        readOnly
                        className="flex-1 p-3 bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-500 dark:text-slate-400 cursor-not-allowed"
                        title="L'adresse e-mail sert d'identifiant et ne peut pas être modifiée ici."
                    />
                </div>
                <p className="text-[10px] text-slate-400 italic">Identifiant de connexion (non modifiable).</p>
            </div>

            <hr className="border-slate-100 dark:border-slate-800" />

            {/* Mot de passe */}
            <div className="space-y-3">
                <label className="text-xs font-bold text-slate-500 uppercase">Changer de mot de passe</label>
                
                <input 
                    type="password" placeholder="Mot de passe actuel"
                    value={passwords.current} onChange={e => setPasswords({...passwords, current: e.target.value})}
                    className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-purple-500 transition text-slate-900 dark:text-white"
                />
                
                <div className="flex flex-col md:flex-row gap-2">
                    <input 
                        type="password" placeholder="Nouveau mot de passe"
                        value={passwords.new} onChange={e => setPasswords({...passwords, new: e.target.value})}
                        className="flex-1 p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-purple-500 transition text-slate-900 dark:text-white"
                    />
                    <input 
                        type="password" placeholder="Veuillez le réécrire"
                        value={passwords.confirm} onChange={e => setPasswords({...passwords, confirm: e.target.value})}
                        className="flex-1 p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-purple-500 transition text-slate-900 dark:text-white"
                    />
                </div>
                <button onClick={updatePassword} className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold py-3 rounded-xl hover:opacity-90 transition shadow-lg">
                    Mettre à jour le mot de passe
                </button>
            </div>
        </section>

        {/* 4. DANGER ZONE */}
        <section className="bg-red-50 dark:bg-red-900/10 p-6 rounded-3xl border border-red-100 dark:border-red-900/30 space-y-4">
            <h2 className="font-bold text-red-600 dark:text-red-400 flex items-center gap-2"><Trash2 size={20}/> Zone de Danger</h2>
            <p className="text-sm text-red-800 dark:text-red-300">
                La suppression est effective immédiatement. Votre compte sera inaccessible mais restaurable pendant 30 jours, puis archivé 1 an avant suppression définitive (RGPD).
            </p>
            <button onClick={handleDeleteAccount} className="w-full bg-red-600 text-white font-bold py-3 rounded-xl hover:bg-red-700 transition shadow-lg shadow-red-500/20">
                Supprimer mon compte
            </button>
        </section>

      </div>
    </main>
  )
}