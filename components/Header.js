'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { 
  Rocket, LogIn, Menu, X, Smartphone, 
  LayoutDashboard, User, LogOut, ShieldAlert 
} from 'lucide-react'

export default function Header() {
  const router = useRouter()
  const pathname = usePathname() // Pour savoir sur quelle page on est
  const [isOpen, setIsOpen] = useState(false) // Menu Mobile
  const [user, setUser] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)

  // Vérification de la session au chargement
  useEffect(() => {
    checkUser()

    // Écoute les changements (connexion/déconnexion)
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user)
        checkAdminRole(session.user.id)
      } else {
        setUser(null)
        setIsAdmin(false)
      }
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      setUser(user)
      checkAdminRole(user.id)
    }
  }

  async function checkAdminRole(userId) {
    const { data } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single()
    if (data?.role === 'admin') {
      setIsAdmin(true)
    }
  }

  async function handleSignOut() {
    await supabase.auth.signOut()
    setUser(null)
    setIsAdmin(false)
    setIsOpen(false)
    router.push('/')
    router.refresh()
  }

  // Fermer le menu mobile quand on change de page
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-all">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* LOGO (Oukonsort) */}
        <Link href={user ? "/dashboard" : "/"} className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <Rocket size={18} className="fill-white/20" />
            </div>
            <span className="font-black text-xl tracking-tight text-slate-900 dark:text-white">
                Oukon<span className="text-blue-600">sort</span>
            </span>
        </Link>

        {/* --- DESKTOP MENU (Caché sur mobile) --- */}
        <div className="hidden md:flex items-center gap-6">
            
            {/* Lien App Mobile */}
            <Link 
                href="/install" 
                className="flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition"
            >
                <Smartphone size={18} /> L'App
            </Link>

            <div className="w-px h-6 bg-slate-200 dark:bg-slate-800"></div>

            {user ? (
                // MODE CONNECTÉ
                <>
                    {isAdmin && (
                        <Link href="/admin" className="text-orange-600 hover:text-orange-700 font-bold text-sm flex items-center gap-1 bg-orange-50 dark:bg-orange-900/20 px-3 py-1.5 rounded-full transition">
                            <ShieldAlert size={16}/> Admin
                        </Link>
                    )}
                    
                    <Link href="/dashboard" className={`text-sm font-bold transition ${pathname === '/dashboard' ? 'text-blue-600' : 'text-slate-600 dark:text-slate-300 hover:text-blue-600'}`}>
                        Dashboard
                    </Link>
                    
                    <Link href="/profile" className={`text-sm font-bold transition ${pathname === '/profile' ? 'text-blue-600' : 'text-slate-600 dark:text-slate-300 hover:text-blue-600'}`}>
                        Mon Profil
                    </Link>

                    <button 
                        onClick={handleSignOut}
                        className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 p-2 rounded-full hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition"
                        title="Se déconnecter"
                    >
                        <LogOut size={18} />
                    </button>
                </>
            ) : (
                // MODE INVITÉ
                <Link 
                    href="/login" 
                    className="flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-5 py-2 rounded-full font-bold text-sm hover:opacity-90 hover:scale-105 transition-all shadow-xl shadow-slate-900/10"
                >
                    <LogIn size={16} /> Connexion
                </Link>
            )}
        </div>

        {/* --- MOBILE HAMBURGER (Visible sur mobile) --- */}
        <button 
            className="md:hidden p-2 text-slate-700 dark:text-slate-200"
            onClick={() => setIsOpen(!isOpen)}
        >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* --- MOBILE MENU OVERLAY --- */}
      {isOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 shadow-xl p-4 flex flex-col gap-4 animate-in slide-in-from-top-2">
             <Link href="/install" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300 font-bold">
                <Smartphone size={20} className="text-blue-500" /> Installer l'App
            </Link>

            {user ? (
                <>
                    <Link href="/dashboard" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300 font-bold">
                        <LayoutDashboard size={20} className="text-blue-500" /> Dashboard
                    </Link>
                    <Link href="/profile" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300 font-bold">
                        <User size={20} className="text-purple-500" /> Mon Profil
                    </Link>
                    {isAdmin && (
                        <Link href="/admin" className="flex items-center gap-3 p-3 rounded-xl bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 font-bold">
                            <ShieldAlert size={20} /> Interface Admin
                        </Link>
                    )}
                    <div className="h-px bg-slate-100 dark:bg-slate-800 my-1"></div>
                    <button onClick={handleSignOut} className="flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 font-bold w-full text-left">
                        <LogOut size={20} /> Se déconnecter
                    </button>
                </>
            ) : (
                <Link href="/login" className="flex items-center justify-center gap-2 bg-blue-600 text-white p-3 rounded-xl font-bold mt-2">
                    <LogIn size={20} /> Se connecter
                </Link>
            )}
        </div>
      )}
    </nav>
  )
}