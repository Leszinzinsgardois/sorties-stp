'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

// C'est cette ligne qui causait ton erreur si le "export default" manquait
export default function LoginPage() {
  const router = useRouter()
  const [isSignUp, setIsSignUp] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Champs du formulaire
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [pseudo, setPseudo] = useState('')
  const [nom, setNom] = useState('')
  const [prenom, setPrenom] = useState('')
  const [dob, setDob] = useState('')
  
  // Checkbox légale
  const [termsAccepted, setTermsAccepted] = useState(false)

  const handleAuth = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (isSignUp) {
        // --- INSCRIPTION ---
        
        // 1. Vérifications
        if (!termsAccepted) {
          throw new Error("Tu dois accepter les conditions pour t'inscrire.")
        }
        if (!pseudo || !nom || !prenom || !dob) {
            throw new Error("Tous les champs sont obligatoires.")
        }

        // 2. Création du compte Auth (Email/Mdp)
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email,
          password,
        })
        if (authError) throw authError

        if (authData?.user) {
          // 3. Création du Profil dans la table 'profiles'
          const { error: profileError } = await supabase
            .from('profiles')
            .insert([
              {
                id: authData.user.id,
                pseudo,
                nom,
                prenom,
                date_naissance: dob,
                terms_accepted_at: new Date().toISOString()
              }
            ])

          if (profileError) {
            throw new Error("Erreur profil (Pseudo déjà pris ?) : " + profileError.message)
          }

          alert("Compte créé ! Tu peux maintenant te connecter.")
          setIsSignUp(false) // On repasse en mode connexion
        }

      } else {
        // --- CONNEXION ---
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
        
        // Redirection vers le tableau de bord (qu'on fera après)
        alert("Connexion réussie !")
        router.push('/dashboard') // Je l'ai commenté pour l'instant pour éviter une erreur 404
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8 border border-gray-100">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
          {isSignUp ? 'Créer un compte Orga' : 'Connexion Organisateur'}
        </h1>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input 
              type="email" 
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Mot de passe</label>
            <input 
              type="password" 
              required
              minLength={6}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Champs Inscription */}
          {isSignUp && (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
              <div>
                <label className="block text-sm font-medium text-gray-700">Pseudo Public</label>
                <input 
                  type="text" 
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
                  value={pseudo}
                  onChange={(e) => setPseudo(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Prénom (Privé)</label>
                  <input 
                    type="text" 
                    required
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
                    value={prenom}
                    onChange={(e) => setPrenom(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black-700">Nom (Privé)</label>
                  <input 
                    type="text" 
                    required
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Date de naissance</label>
                <input 
                  type="date" 
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                />
              </div>

              {/* CHECKBOX LÉGALE */}
              <div className="flex items-start gap-3 pt-2">
                <input
                  id="terms"
                  type="checkbox"
                  required
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-1"
                />
                <div className="text-sm text-gray-700">
                  <label htmlFor="terms">
                    Je certifie avoir au moins 16 ans, être inscrit(e) dans un établissement d’enseignement secondaire ou supérieur, et accepter les <Link href="/legal" className="text-blue-600 hover:underline">[Conditions Générales d’Utilisation]</Link> ainsi que la <Link href="/legal" className="text-blue-600 hover:underline">[Politique de Confidentialité]</Link>.
                  </label>
                  <p className="text-xs text-gray-500 mt-1">
                    Pour les utilisateurs mineurs, l’utilisation du service s’effectue sous la responsabilité des représentants légaux conformément aux CGU de l'application.
                  </p>
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? 'Chargement...' : (isSignUp ? "S'inscrire" : 'Se connecter')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-sm text-blue-600 hover:underline"
          >
            {isSignUp ? "J'ai déjà un compte" : "Pas encore de compte ? Créer un compte"}
          </button>
        </div>
      </div>
    </main>
  )
}