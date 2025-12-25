'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  Building2, Plus, Search, MapPin, 
  BadgeCheck, ArrowLeft, MoreHorizontal, 
  Megaphone, Calendar 
} from 'lucide-react'

export default function AdminPartnersList() {
  const router = useRouter()
  const [partners, setPartners] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    checkAdminAndFetch()
  }, [])

  async function checkAdminAndFetch() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }
    
    // Vérif Admin basique
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    if (profile?.role !== 'admin') { router.push('/dashboard'); return }

    fetchPartners()
  }

  async function fetchPartners() {
    // On récupère les institutions et le nombre d'événements associés
    const { data, error } = await supabase
      .from('institutions')
      .select('*, institutional_events(count)')
      .order('created_at', { ascending: false })
      
    if (data) setPartners(data)
    setLoading(false)
  }

  const filteredPartners = partners.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Chargement...</div>

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors pb-20">
      
      {/* HEADER */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-6 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-4">
                <Link href="/admin" className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300">
                    <ArrowLeft size={20}/>
                </Link>
                <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <Building2 className="text-blue-600"/> Gestion Partenaires
                </h1>
            </div>
            
            {/* BOUTON MODIFIÉ : LIEN VERS CREATE */}
            <Link href="/admin/partners/create" className="bg-blue-600 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition">
                <Plus size={20}/> Nouveau
            </Link>
        </div>
      </div>

      {/* LISTE */}
      <div className="max-w-5xl mx-auto p-6">
        
        {/* Barre recherche */}
        <div className="relative mb-6">
            <Search className="absolute left-4 top-3.5 text-slate-400" size={20}/>
            <input 
                type="text" 
                placeholder="Rechercher une entreprise..." 
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-3 pl-12 pr-4 outline-none focus:ring-2 ring-blue-500 text-slate-900 dark:text-white"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
            />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPartners.map(partner => (
                <Link key={partner.id} href={`/admin/partners/${partner.id}`}>
                    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 transition cursor-pointer group shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 font-bold text-lg">
                                    {partner.logo_url ? <img src={partner.logo_url} className="w-full h-full object-cover rounded-lg"/> : partner.name[0]}
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-blue-500 transition">{partner.name}</h3>
                                    <p className="text-xs text-slate-500 capitalize">{partner.type}</p>
                                </div>
                            </div>
                            <div className={`w-3 h-3 rounded-full ${partner.status === 'active' ? 'bg-green-500' : 'bg-orange-500'}`}></div>
                        </div>
                        
                        <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pt-4 border-t border-slate-100 dark:border-slate-800">
                            <span className="flex items-center gap-1"><Megaphone size={14}/> {partner.institutional_events[0]?.count || 0} Pubs</span>
                            {partner.is_partner && <span className="flex items-center gap-1 text-blue-600 font-bold"><BadgeCheck size={14}/> Officiel</span>}
                        </div>
                    </div>
                </Link>
            ))}
        </div>
      </div>
    </main>
  )
}