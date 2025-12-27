'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { AlertCircle, Lock, Mail, AlertTriangle } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [isSignUp, setIsSignUp] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Champs
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [pseudo, setPseudo] = useState('')
  const [nom, setNom] = useState('')
  const [prenom, setPrenom] = useState('')
  const [dob, setDob] = useState('')
  const [termsAccepted, setTermsAccepted] = useState(false)

  const handleAuth = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (isSignUp) {
        // --- INSCRIPTION ---
        if (!termsAccepted) throw new Error("Tu dois accepter les conditions.")
        if (!pseudo || !nom || !prenom || !dob) throw new Error("Tout remplir SVP.")

        const { data: authData, error: authError } = await supabase.auth.signUp({ 
          email, 
          password,
          options: {
            data: {
              pseudo: pseudo,
              nom: nom,
              prenom: prenom,
              date_naissance: dob,
              terms_accepted_at: new Date().toISOString()
            }
          }
        })

        if (authError) throw authError
        
        alert("Compte créé ! Vérifie tes emails pour confirmer.")
        setIsSignUp(false)

      } else {
        // --- CONNEXION ---
        const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password })
        
        // 1. Gestion Erreur Auth (Mot de passe faux ou User inexistant)
        if (signInError) {
            // On ne donne pas de détails pour la sécurité
            throw new Error("Identifiant ou mot de passe incorrect.")
        }

        // 2. Vérification Soft Delete (Suppression logique)
        if (data?.user) {
            const { data: profile } = await supabase
                .from('profiles')
                .select('deleted_at')
                .eq('id', data.user.id)
                .single()

            if (profile?.deleted_at) {
                const deletedDate = new Date(profile.deleted_at)
                const now = new Date()
                // Différence en jours
                const diffTime = Math.abs(now - deletedDate)
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

                if (diffDays > 30) {
                    // CAS 1 : Supprimé depuis > 30 jours -> On fait croire que le compte n'existe pas
                    await supabase.auth.signOut()
                    throw new Error("Identifiant ou mot de passe incorrect.")
                } else {
                    // CAS 2 : Supprimé depuis < 30 jours -> On propose la réactivation
                    const reactivate = confirm("Ce compte est en cours de suppression. Voulez-vous le réactiver ?")
                    if (reactivate) {
                        await supabase.from('profiles').update({ deleted_at: null }).eq('id', data.user.id)
                        // On continue vers le dashboard
                    } else {
                        await supabase.auth.signOut()
                        return // On arrête là sans erreur, juste retour login
                    }
                }
            }
        }

        router.push('/dashboard')
      }
    } catch (err) {
      // Si c'est une erreur "Invalid login credentials", on la traduit proprement
      if (err.message.includes("Invalid login credentials")) {
          setError("Identifiant ou mot de passe incorrect.")
      } else {
          setError(err.message)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-8 border border-slate-100 dark:border-slate-800">
        
        <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Oukonsort
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2">
            {isSignUp ? "Rejoins la communauté étudiante" : "Connecte-toi pour organiser"}
            </p>
        </div>

        {/* --- CADRE D'ERREUR STYLISÉ --- */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-xl p-4 mb-6 flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
            <AlertTriangle className="text-red-600 dark:text-red-400 shrink-0 mt-0.5" size={20} />
            <div>
                <h3 className="text-sm font-bold text-red-700 dark:text-red-300">Erreur de connexion</h3>
                <p className="text-xs text-red-600 dark:text-red-400 mt-1 leading-snug">
                    {error}
                </p>
            </div>
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          
          {/* EMAIL */}
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Email</label>
            <div className="relative">
                <input 
                type="email" required
                className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition pl-10"
                value={email} onChange={(e) => setEmail(e.target.value)}
                />
                <Mail size={18} className="absolute left-3 top-3.5 text-slate-400"/>
            </div>
            {isSignUp && (
                <p className="text-[10px] text-slate-500 mt-1 ml-1">
                    Servira d'identifiant de connexion unique. <strong className="text-slate-600 dark:text-slate-300">Non modifiable.</strong>
                </p>
            )}
          </div>

          {/* PASSWORD */}
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Mot de passe</label>
            <div className="relative">
                <input 
                type="password" required minLength={6}
                className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition pl-10"
                value={password} onChange={(e) => setPassword(e.target.value)}
                />
                <Lock size={18} className="absolute left-3 top-3.5 text-slate-400"/>
            </div>
            {isSignUp && (
                <p className="text-[10px] text-slate-500 mt-1 ml-1">
                    Tu pourras le modifier plus tard via ton profil.
                </p>
            )}
          </div>

          {isSignUp && (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-4 pt-2">
               
               {/* ALERTE INFO IMMUABLE */}
               <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-100 dark:border-blue-800 flex gap-2 items-start">
                    <AlertCircle size={16} className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5"/>
                    <p className="text-xs text-blue-800 dark:text-blue-200 leading-tight">
                        Attention : Pour garantir la confiance entre étudiants, ton <strong>Identité</strong> (Nom, Prénom, Âge) et ton <strong>Pseudo</strong> ne seront <u>plus modifiables</u> une fois inscrit.
                    </p>
               </div>

               <div className="grid grid-cols-2 gap-3">
                 <input type="text" placeholder="Pseudo" required className="col-span-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-3 text-slate-900 dark:text-white outline-none" value={pseudo} onChange={(e) => setPseudo(e.target.value)} />
                 <input type="text" placeholder="Prénom" required className="rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-3 text-slate-900 dark:text-white outline-none" value={prenom} onChange={(e) => setPrenom(e.target.value)} />
                 <input type="text" placeholder="Nom" required className="rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-3 text-slate-900 dark:text-white outline-none" value={nom} onChange={(e) => setNom(e.target.value)} />
               </div>
               
               <div>
                   <input type="date" required className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-3 text-slate-900 dark:text-white outline-none" value={dob} onChange={(e) => setDob(e.target.value)} />
                   <p className="text-[10px] text-slate-400 mt-1 ml-1">Date de naissance (Non modifiable).</p>
               </div>
               
               <div className="flex items-start gap-3 pt-2">
                <input id="terms" type="checkbox" required checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)} className="mt-1" />
                <div className="text-xs text-slate-600 dark:text-slate-400">
                  <label htmlFor="terms">Je certifie avoir +16 ans et j'accepte les <Link href="/legal" className="text-blue-500 underline">CGU</Link>.</label>
                  <p className="mt-1 opacity-70">Mineurs sous responsabilité légale.</p>
                </div>
               </div>
            </div>
          )}

          <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition active:scale-95 disabled:opacity-50 mt-4">
            {loading ? 'Chargement...' : (isSignUp ? "S'inscrire" : 'Se connecter')}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button onClick={() => setIsSignUp(!isSignUp)} className="text-sm text-slate-500 dark:text-slate-400 hover:text-blue-500 transition">
            {isSignUp ? "J'ai déjà un compte" : "Créer un compte"}
          </button>
        </div>
      </div>
    </main>
  )
}