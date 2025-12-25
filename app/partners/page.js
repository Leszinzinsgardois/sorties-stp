'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation' // Pour la redirection
import Link from 'next/link'
import { 
  Building2, Calendar, Megaphone, MapPin, 
  ExternalLink, Info, AlertTriangle, BadgeCheck, 
  ArrowLeft, Clock 
} from 'lucide-react'

export default function PartnersPage() {
  const router = useRouter()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    checkUserAndFetch()
  }, [])

  // VÉRIFICATION AUTH + FETCH
  async function checkUserAndFetch() {
    // 1. Vérifier si connecté
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      // Si pas connecté, on dégage vers le login
      router.push('/login')
      return
    }

    // 2. Si connecté, on charge les données
    const { data } = await supabase
      .from('institutional_events')
      .select('*, institutions(*)')
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      
    if (data) setPosts(data)
    setLoading(false)
  }

  const filteredPosts = posts.filter(post => filter === 'all' || post.type === filter)

  // Pendant le chargement ou la vérification auth, on affiche un loader
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  )

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20 transition-colors">
      
      {/* HEADER FIXE */}
      <div className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 pt-safe-top">
        <div className="max-w-2xl mx-auto px-4 py-4">
            <div className="flex items-center gap-4 mb-4">
                <Link href="/dashboard" className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition">
                    <ArrowLeft size={20}/>
                </Link>
                <div>
                    <h1 className="text-xl font-black text-slate-900 dark:text-white">Espace Partenaires</h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Bons plans & Sorties officielles</p>
                </div>
            </div>

            {/* BARRE DE FILTRES */}
            <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                <button 
                    onClick={() => setFilter('all')} 
                    className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all border ${
                        filter === 'all' 
                        ? 'bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-900/20 dark:bg-white dark:text-slate-900' 
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                >
                    Tout voir
                </button>

                <button 
                    onClick={() => setFilter('event')} 
                    className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all border flex items-center gap-2 ${
                        filter === 'event' 
                        ? 'bg-purple-600 text-white border-purple-600 shadow-lg shadow-purple-600/30' 
                        : 'bg-white dark:bg-slate-800 text-purple-600 dark:text-purple-400 border-purple-100 dark:border-purple-900/30 hover:bg-purple-50 dark:hover:bg-purple-900/20'
                    }`}
                >
                    <Calendar size={16}/> Événements
                </button>

                <button 
                    onClick={() => setFilter('promotion')} 
                    className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all border flex items-center gap-2 ${
                        filter === 'promotion' 
                        ? 'bg-orange-500 text-white border-orange-500 shadow-lg shadow-orange-500/30' 
                        : 'bg-white dark:bg-slate-800 text-orange-600 dark:text-orange-400 border-orange-100 dark:border-orange-900/30 hover:bg-orange-50 dark:hover:bg-orange-900/20'
                    }`}
                >
                    <Megaphone size={16}/> Bons Plans
                </button>
            </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 mt-6 space-y-6">
        
        {/* BANNIÈRE BÊTA */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-100 dark:border-blue-800/50 p-4 rounded-2xl flex items-start gap-3">
            <div className="bg-blue-100 dark:bg-blue-900/40 p-2 rounded-lg text-blue-600 dark:text-blue-400 shrink-0">
                <Info size={18}/>
            </div>
            <div>
                <h3 className="font-bold text-blue-900 dark:text-blue-300 text-xs uppercase tracking-wide mb-1">Version Bêta - Simulation</h3>
                <p className="text-xs text-blue-700 dark:text-blue-200/80 leading-relaxed">
                    Espace en développement. Les offres affichées peuvent être fictives. Aucune transaction réelle.
                </p>
            </div>
        </div>

        {/* LISTE DES POSTS */}
        {filteredPosts.length === 0 ? (
            <div className="text-center py-20 flex flex-col items-center bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800">
                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400 mb-4">
                    <Building2 size={24}/>
                </div>
                <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">C'est calme par ici</h3>
                <p className="text-sm text-slate-500 max-w-xs mx-auto mt-1">Aucune offre correspondant à tes filtres pour le moment.</p>
            </div>
        ) : (
            <div className="space-y-6">
                {filteredPosts.map(post => (
                    <CardInstitution key={post.id} post={post} />
                ))}
            </div>
        )}
      </div>
    </main>
  )
}

// COMPOSANT CARTE
function CardInstitution({ post }) {
    const isPromo = post.type === 'promotion'
    const inst = post.institutions

    return (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group">
            
            {/* HEADER CARTE */}
            <div className="p-5 flex items-center justify-between border-b border-slate-50 dark:border-slate-800/50">
                <div className="flex items-center gap-3">
                    {/* Logo Institution */}
                    {inst.logo_url ? (
                        <img src={inst.logo_url} alt={inst.name} className="w-10 h-10 rounded-xl object-cover border border-slate-100 dark:border-slate-700 shadow-sm"/>
                    ) : (
                        <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 border border-slate-100 dark:border-slate-700">
                            <Building2 size={20}/>
                        </div>
                    )}
                    
                    {/* Nom + Badge Certifié (COLLÉ AU NOM) */}
                    <div>
                        <h3 className="font-bold text-slate-900 dark:text-white leading-tight flex items-center gap-1.5">
                            {inst.name}
                            {inst.is_partner && (
                                <BadgeCheck size={16} className="text-blue-500 fill-blue-500/10" />
                            )}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{inst.type === 'private' ? 'Établissement' : inst.type === 'public' ? 'Institution' : 'Association'}</p>
                    </div>
                </div>
                
                {/* BADGE TYPE COLORÉ */}
                <span className={`text-[10px] font-bold px-3 py-1.5 rounded-lg uppercase tracking-wide border ${
                    isPromo 
                    ? 'bg-orange-50 dark:bg-orange-900/10 text-orange-600 dark:text-orange-400 border-orange-100 dark:border-orange-900/30' 
                    : 'bg-purple-50 dark:bg-purple-900/10 text-purple-600 dark:text-purple-400 border-purple-100 dark:border-purple-900/30'
                }`}>
                    {isPromo ? 'Promo' : 'Event'}
                </span>
            </div>

            {/* CONTENU */}
            <div className="p-5">
                <h2 className="text-lg md:text-xl font-black text-slate-800 dark:text-white mb-3 leading-snug">
                    {post.title}
                </h2>
                
                {/* INFO DATE / LIEU */}
                <div className="flex flex-wrap gap-3 mb-4">
                    {post.start_time && (
                        <div className={`flex items-center gap-1.5 text-xs font-bold px-2.5 py-1.5 rounded-lg ${isPromo ? 'bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300' : 'bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300'}`}>
                            {isPromo ? <Clock size={14}/> : <Calendar size={14}/>}
                            {new Date(post.start_time).toLocaleDateString(undefined, {day:'numeric', month:'short'})}
                            {!isPromo && ` • ${new Date(post.start_time).toLocaleTimeString(undefined, {hour:'2-digit', minute:'2-digit'})}`}
                        </div>
                    )}
                    {post.location && (
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-1.5 rounded-lg">
                            <MapPin size={14}/> {post.location}
                        </div>
                    )}
                </div>
                
                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800/50 mb-4">
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                        {post.description}
                    </p>
                    {post.conditions && (
                        <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700/50 flex items-start gap-2">
                            <Info size={14} className="text-slate-400 mt-0.5 shrink-0"/>
                            <p className="text-xs text-slate-500 dark:text-slate-400 italic">{post.conditions}</p>
                        </div>
                    )}
                </div>

                {/* BOUTON ACTION */}
                {inst.website && (
                    <a href={inst.website} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-bold text-sm bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90 transition shadow-lg shadow-slate-500/10">
                        En savoir plus <ExternalLink size={14}/>
                    </a>
                )}
            </div>

            {/* FOOTER MENTIONS */}
            {(post.legal_mentions || post.description?.toLowerCase().includes('alcool') || post.title?.toLowerCase().includes('bar')) && (
                <div className="px-5 py-3 bg-slate-50 dark:bg-slate-950/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center">
                    <p className="text-[10px] font-medium text-slate-400 flex items-center gap-1.5">
                        <AlertTriangle size={10}/> {post.legal_mentions || "L'abus d'alcool est dangereux pour la santé."}
                    </p>
                </div>
            )}
        </div>
    )
}