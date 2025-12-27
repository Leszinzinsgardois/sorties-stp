'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { AlertCircle, Lock, Mail, AlertTriangle, ArrowLeft } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [isSignUp, setIsSignUp] = useState(false)
  const [isResetMode, setIsResetMode] = useState(false) // Mode "Mot de passe oublié"
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [successMsg, setSuccessMsg] = useState(null)

  // Champs
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [pseudo, setPseudo] = useState('')
  const [nom, setNom] = useState('')
  const [prenom, setPrenom] = useState('')
  const [dob, setDob] = useState('')
  const [termsAccepted, setTermsAccepted] = useState(false)

  // --- GESTION AUTH ---
  const handleAuth = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccessMsg(null)

    try {
      if (isResetMode) {
        // --- 1. MOT DE PASSE OUBLIÉ ---
        const redirectUrl = `${window.location.origin}/update-password`
        
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: redirectUrl,
        })

        if (error) throw error
        setSuccessMsg("Si un compte existe avec cet email, un lien de réinitialisation a été envoyé.")

      } else if (isSignUp) {
        // --- 2. INSCRIPTION ---
        if (!termsAccepted) throw new Error("Tu dois accepter les conditions.")
        if (!pseudo || !nom || !prenom || !dob) throw new Error("Tout remplir SVP.")

        // C'est ICI que la fusion a eu lieu 👇
        const { data: authData, error: authError } = await supabase.auth.signUp({ 
          email, 
          password,
          options: {
            // Redirection après validation de l'email vers la page d'accueil avec ?welcome=true
            emailRedirectTo: `${window.location.origin}/?welcome=true`, 
            data: {
              pseudo: pseudo, nom: nom, prenom: prenom,
              date_naissance: dob, terms_accepted_at: new Date().toISOString()
            }
          }
        })

        if (authError) throw authError
        
        // Message si confirmation requise
        if (authData?.user && !authData.session) {
             setSuccessMsg("Compte créé ! Vérifie tes emails pour confirmer ton inscription avant de te connecter.")
             setIsSignUp(false) // Retour au login
             return // On arrête là
        }
        
        alert("Compte créé !")
        setIsSignUp(false)

      } else {
        // --- 3. CONNEXION ---
        const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password })
        
        if (signInError) throw new Error("Identifiant ou mot de passe incorrect.")

        // Vérification Soft Delete
        if (data?.user) {
            const { data: profile } = await supabase.from('profiles').select('deleted_at').eq('id', data.user.id).single()

            if (profile?.deleted_at) {
                const deletedDate = new Date(profile.deleted_at)
                const diffDays = Math.ceil(Math.abs(new Date() - deletedDate) / (1000 * 60 * 60 * 24))

                if (diffDays > 30) {
                    await supabase.auth.signOut()
                    throw new Error("Identifiant ou mot de passe incorrect.")
                } else {
                    const reactivate = confirm("Ce compte est en cours de suppression. Voulez-vous le réactiver ?")
                    if (reactivate) {
                        await supabase.from('profiles').update({ deleted_at: null }).eq('id', data.user.id)
                    } else {
                        await supabase.auth.signOut()
                        return
                    }
                }
            }
        }
        router.push('/dashboard')
      }
    } catch (err) {
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
            {isResetMode ? "Récupération de compte" : isSignUp ? "Rejoins la communauté étudiante" : "Connecte-toi pour organiser"}
            </p>
        </div>

        {/* MESSAGES (Erreur / Succès) */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-xl p-4 mb-6 flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
            <AlertTriangle className="text-red-600 dark:text-red-400 shrink-0 mt-0.5" size={20} />
            <div>
                <h3 className="text-sm font-bold text-red-700 dark:text-red-300">Erreur</h3>
                <p className="text-xs text-red-600 dark:text-red-400 mt-1 leading-snug">{error}</p>
            </div>
          </div>
        )}
        {successMsg && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/50 rounded-xl p-4 mb-6 flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="text-green-600 dark:text-green-400 shrink-0 mt-0.5" size={20} />
            <div>
                <h3 className="text-sm font-bold text-green-700 dark:text-green-300">Email envoyé</h3>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1 leading-snug">{successMsg}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          
          {/* EMAIL (Toujours visible) */}
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

          {/* PASSWORD (Caché si Reset Mode) */}
          {!isResetMode && (
            <div>
                <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Mot de passe</label>
                    {/* Lien Mot de passe oublié */}
                    {!isSignUp && (
                        <button type="button" onClick={() => { setIsResetMode(true); setError(null); setSuccessMsg(null); }} className="text-[10px] font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400">
                            Mot de passe oublié ?
                        </button>
                    )}
                </div>
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
          )}

          {/* CHAMPS SUPPLÉMENTAIRES (Seulement pour Inscription) */}
          {isSignUp && !isResetMode && (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-4 pt-2">
               
               <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-100 dark:border-blue-800 flex gap-2 items-start">
                    <AlertCircle size={16} className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5"/>
                    <p className="text-xs text-blue-800 dark:text-blue-200 leading-tight">
                        Attention : Pour garantir la confiance, ton <strong>Identité</strong> et ton <strong>Pseudo</strong> ne seront <u>plus modifiables</u>.
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
            {loading ? 'Chargement...' : isResetMode ? 'Envoyer le lien' : isSignUp ? "S'inscrire" : 'Se connecter'}
          </button>

          {/* Bouton Retour (si Reset Mode) */}
          {isResetMode && (
            <button type="button" onClick={() => { setIsResetMode(false); setError(null); setSuccessMsg(null); }} className="w-full text-center text-sm text-slate-500 hover:text-slate-700 mt-2 flex items-center justify-center gap-2">
                <ArrowLeft size={16}/> Retour à la connexion
            </button>
          )}
        </form>

        {!isResetMode && (
            <div className="mt-8 text-center">
            <button onClick={() => setIsSignUp(!isSignUp)} className="text-sm text-slate-500 dark:text-slate-400 hover:text-blue-500 transition">
                {isSignUp ? "J'ai déjà un compte" : "Créer un compte"}
            </button>
            </div>
        )}
      </div>
    </main>
  )
}