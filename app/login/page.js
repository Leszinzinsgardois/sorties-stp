'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

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
        if (!termsAccepted) throw new Error("Tu dois accepter les conditions.")
        if (!pseudo || !nom || !prenom || !dob) throw new Error("Tout remplir SVP.")

        const { data: authData, error: authError } = await supabase.auth.signUp({ email, password })
        if (authError) throw authError

        if (authData?.user) {
          const { error: profileError } = await supabase.from('profiles').insert([{
            id: authData.user.id, pseudo, nom, prenom, date_naissance: dob,
            terms_accepted_at: new Date().toISOString()
          }])
          if (profileError) throw new Error("Erreur profil : " + profileError.message)
          alert("Compte créé !")
          setIsSignUp(false)
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        router.push('/dashboard')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-8 border border-slate-100 dark:border-slate-800">
        
        <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Sorties MTP
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2">
            {isSignUp ? "Rejoins la communauté étudiante" : "Connecte-toi pour organiser"}
            </p>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-300 p-3 rounded-lg text-sm mb-6 border border-red-100 dark:border-red-800">
            {error}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Email</label>
            <input 
              type="email" required
              className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition"
              value={email} onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Mot de passe</label>
            <input 
              type="password" required minLength={6}
              className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition"
              value={password} onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {isSignUp && (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-4">
               {/* Je simplifie l'affichage pour la réponse, mais garde tes champs Nom/Prénom/Date comme avant */}
               <div className="grid grid-cols-2 gap-3">
                 <input type="text" placeholder="Pseudo" required className="col-span-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-3 text-slate-900 dark:text-white outline-none" value={pseudo} onChange={(e) => setPseudo(e.target.value)} />
                 <input type="text" placeholder="Prénom" required className="rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-3 text-slate-900 dark:text-white outline-none" value={prenom} onChange={(e) => setPrenom(e.target.value)} />
                 <input type="text" placeholder="Nom" required className="rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-3 text-slate-900 dark:text-white outline-none" value={nom} onChange={(e) => setNom(e.target.value)} />
               </div>
               <input type="date" required className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-3 text-slate-900 dark:text-white outline-none" value={dob} onChange={(e) => setDob(e.target.value)} />
               
               {/* Checkbox légale avec texte adapté dark mode */}
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