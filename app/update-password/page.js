'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Lock, Save } from 'lucide-react'

export default function UpdatePasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  // Vérifier si on a une session (le lien magique connecte l'utilisateur)
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) router.push('/login')
    })
  }, [])

  const handleUpdate = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
        alert("Erreur : " + error.message)
    } else {
        alert("Mot de passe mis à jour ! Tu peux te connecter.")
        router.push('/dashboard')
    }
    setLoading(false)
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
        <div className="w-full max-w-md bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Nouveau mot de passe</h1>
            <p className="text-slate-500 text-sm mb-6">Choisis un mot de passe sécurisé pour ton compte.</p>
            
            <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase">Nouveau mot de passe</label>
                    <div className="relative mt-1">
                        <input 
                            type="password" required minLength={6}
                            className="w-full p-3 pl-10 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition text-slate-900 dark:text-white"
                            value={password} onChange={e => setPassword(e.target.value)}
                        />
                        <Lock size={18} className="absolute left-3 top-3.5 text-slate-400"/>
                    </div>
                </div>
                <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition flex items-center justify-center gap-2">
                    <Save size={18}/> Enregistrer
                </button>
            </form>
        </div>
    </main>
  )
}