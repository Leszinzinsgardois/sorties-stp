
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  Building2, MapPin, Globe, BadgeCheck, 
  ArrowLeft, Calendar, Megaphone, CheckCircle, 
  ExternalLink, Clock
} from 'lucide-react'

export default function PartnerProfilePage() {
  const { id } = useParams()
  const router = useRouter()
  const [partner, setPartner] = useState(null)
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPublicData()
  }, [])

  async function fetchPublicData() {
    try {
      // 1. Récupérer les infos publiques du partenaire
      const { data: inst, error: instError } = await supabase
        .from('institutions')
        .select('*')
        .eq('id', id)
        .single()

      if (instError || !inst) {
        router.push('/partners') 
        return
      }
      setPartner(inst)

      // 2. Récupérer ses événements publics (tout sauf archivés)
      const { data: evts } = await supabase
        .from('institutional_events')
        .select('*')
        .eq('institution_id', id)
        .neq('status', 'archived')
        .order('created_at', { ascending: false })

      if (evts) setEvents(evts)

    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
    </div>
  )

  if (!partner) return null

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors pb-24">
      
      {/* 1. HEADER / COUVERTURE (Style Identique Dashboard) */}
      <div className="relative h-48 md:h-64 w-full bg-slate-900 overflow-hidden">
          {/* Motif de fond abstrait */}
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4"></div>
          
          <div className="container mx-auto px-6 h-full flex items-start pt-8 relative z-10">
            <Link href="/partners" className="bg-white/10 hover:bg-white/20 text-white p-2.5 rounded-full backdrop-blur-md transition-all border border-white/10">
                <ArrowLeft size={20} />
            </Link>
          </div>
      </div>

      <div className="container mx-auto px-6 -mt-20 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
            
            {/* 2. CARTE D'IDENTITÉ (Gauche - Sticky sur Desktop) */}
            <div className="w-full lg:w-1/3 space-y-6 lg:sticky lg:top-8">
                
                {/* BLOC PRINCIPAL */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-slate-800 text-center relative overflow-hidden">
                    {/* Logo */}
                    <div className="w-32 h-32 mx-auto bg-slate-50 dark:bg-slate-800 rounded-2xl border-4 border-white dark:border-slate-800 shadow-lg mb-4 overflow-hidden flex items-center justify-center relative z-10">
                        {partner.logo_url ? (
                            <img src={partner.logo_url} alt={partner.name} className="w-full h-full object-cover" />
                        ) : (
                            <Building2 size={48} className="text-slate-300 dark:text-slate-600" />
                        )}
                    </div>

                    <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-1">{partner.name}</h1>
                    
                    {/* Type d'établissement */}
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-6">
                        {partner.type === 'association' ? 'Association Étudiante' : partner.type === 'public' ? 'Institution Publique' : 'Établissement Privé'}
                    </p>

                    {/* Badges de Confiance (Design unifié) */}
                    <div className="flex flex-col gap-2 mb-6">
                        {partner.is_verified && (
                            <div className="w-full flex items-center justify-center gap-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 py-2 rounded-xl text-xs font-bold border border-green-100 dark:border-green-900/30">
                                <CheckCircle size={14} /> Profil Authentifié
                            </div>
                        )}
                        {partner.is_partner && (
                            <div className="w-full flex items-center justify-center gap-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 py-2 rounded-xl text-xs font-bold border border-blue-100 dark:border-blue-900/30">
                                <BadgeCheck size={14} /> Partenaire Certifié
                            </div>
                        )}
                    </div>

                    {/* Boutons d'action */}
                    {partner.website && (
                        <a href={partner.website} target="_blank" rel="noopener noreferrer" className="w-full py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors">
                            <Globe size={16}/> Site Internet <ExternalLink size={12} className="opacity-50"/>
                        </a>
                    )}
                </div>

                {/* BLOC DESCRIPTION & INFOS */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
                    <h3 className="font-bold text-slate-900 dark:text-white mb-3 text-sm uppercase tracking-wide">À propos</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6">
                        {partner.description || "Aucune description fournie."}
                    </p>

                    <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                        <div className="flex items-start gap-3">
                            <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded-lg text-slate-500 dark:text-slate-400">
                                <MapPin size={18} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase mb-0.5">Localisation</p>
                                <p className="text-sm font-medium text-slate-900 dark:text-white">{partner.address}</p>
                                <p className="text-sm text-slate-500">{partner.city}</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* 3. FEED D'ACTUALITÉ (Droite) */}
            <div className="w-full lg:w-2/3">
                <div className="mb-6 flex items-end justify-between px-2">
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white">Actualités</h2>
                    <span className="text-xs font-bold text-slate-500 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700">
                        {events.length} publication{events.length > 1 ? 's' : ''}
                    </span>
                </div>

                <div className="space-y-6">
                    {events.map(event => (
                        <div key={event.id} className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-indigo-500/30 dark:hover:border-indigo-500/30 transition-all duration-300 group relative overflow-hidden">
                            
                            {/* Bandeau latéral de couleur selon le type */}
                            <div className={`absolute top-0 left-0 w-1.5 h-full 
                                ${event.type === 'promotion' ? 'bg-orange-500' : event.type === 'communication' ? 'bg-blue-500' : 'bg-purple-600'}`} 
                            />

                            <div className="pl-4">
                                {/* Header Event */}
                                <div className="flex flex-wrap justify-between items-start mb-3 gap-2">
                                    <div className="flex items-center gap-2">
                                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider
                                            ${event.type === 'promotion' ? 'bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border border-orange-100 dark:border-orange-900/50' : 
                                              event.type === 'communication' ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50' : 
                                              'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border border-purple-100 dark:border-purple-900/50'}`}>
                                            {event.type === 'promotion' ? 'Bon Plan 🔥' : event.type === 'communication' ? 'Info' : 'Événement'}
                                        </span>
                                        {event.status === 'finished' && (
                                            <span className="text-[10px] font-bold px-2 py-1 rounded-lg uppercase bg-slate-100 text-slate-500 border border-slate-200">Terminé</span>
                                        )}
                                    </div>
                                    <span className="text-xs font-medium text-slate-400 flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-md">
                                        <Clock size={12}/> {new Date(event.created_at).toLocaleDateString()}
                                    </span>
                                </div>

                                {/* Contenu */}
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{event.title}</h3>
                                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-6 whitespace-pre-line">
                                    {event.description}
                                </p>

                                {/* Footer Event (Infos pratiques) */}
                                {(event.start_time || event.location) && (
                                    <div className="flex flex-wrap gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                                        {event.start_time && (
                                            <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-700">
                                                <Calendar size={14} className="text-purple-500"/>
                                                <span className="font-bold">{new Date(event.start_time).toLocaleDateString()}</span>
                                                <span className="opacity-70">à {new Date(event.start_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                            </div>
                                        )}
                                        {event.location && (
                                            <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-700">
                                                <MapPin size={14} className="text-red-500"/>
                                                <span className="font-medium">{event.location}</span>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Mentions Légales */}
                                {event.legal_mentions && (
                                    <p className="mt-4 text-[10px] text-slate-400 italic border-t border-dashed border-slate-100 dark:border-slate-800 pt-2">
                                        * {event.legal_mentions}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}

                    {events.length === 0 && (
                        <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 border-dashed">
                            <div className="bg-slate-50 dark:bg-slate-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Megaphone size={24} className="text-slate-400"/>
                            </div>
                            <h3 className="text-slate-900 dark:text-white font-bold mb-1">C'est calme par ici...</h3>
                            <p className="text-slate-500 font-medium text-sm">Aucune actualité publiée pour le moment.</p>
                        </div>
                    )}
                </div>
            </div>

        </div>
      </div>
    </main>
  )
}