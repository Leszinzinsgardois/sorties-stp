'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Plus, MapPin, Calendar, Users, Filter, Clock, Archive, Edit3 } from 'lucide-react'

export default function Dashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [events, setEvents] = useState([])
  const [showArchived, setShowArchived] = useState(false)

  useEffect(() => {
    checkUser()
  }, [])

  async function checkUser() {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error || !user) { router.push('/login'); return }
    fetchMyEvents(user.id)
  }

  async function fetchMyEvents(userId) {
    const { data } = await supabase
      .from('events')
      .select('*, participants(count)') 
      .eq('organizer_id', userId)
      .order('start_time', { ascending: false })
      
    setEvents(data || [])
    setLoading(false)
  }

  const filteredEvents = events.filter(event => {
    if (showArchived) return true 
    return event.is_visible // Montre les actifs (même annulés, tant qu'ils ne sont pas archivés par le temps)
  })

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-500">Chargement...</div>

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24 transition-colors">
      
      {/* BARRE DE TITRE */}
      <div className="max-w-md mx-auto px-6 pt-8 pb-4 flex items-end justify-between">
        <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Mes Sorties</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Gère tes événements.</p>
        </div>
        <button 
            onClick={() => setShowArchived(!showArchived)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition ${showArchived ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' : 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400'}`}
        >
            {showArchived ? <Clock size={14}/> : <Filter size={14}/>}
            {showArchived ? 'Masquer Terminés' : 'Afficher tout'}
        </button>
      </div>

      {/* LISTE */}
      <div className="p-4 space-y-4 max-w-md mx-auto">
        {filteredEvents.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 mx-2 animate-in fade-in zoom-in duration-300">
            <div className="bg-blue-50 dark:bg-slate-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              {showArchived ? <Archive className="text-slate-400" size={32}/> : <Calendar className="text-blue-500 dark:text-blue-400" size={32} />}
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white">{showArchived ? "Aucun historique." : "Rien de prévu ?"}</h3>
            <p className="text-slate-500 dark:text-slate-400 mt-2 mb-8 max-w-[200px] mx-auto">{showArchived ? "Tu n'as pas encore organisé de soirées passées." : "Lance une soirée pour tes potes dès maintenant."}</p>
            {!showArchived && (
                <Link href="/dashboard/create">
                <button className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition">Créer une sortie</button>
                </Link>
            )}
          </div>
        ) : (
          filteredEvents.map(event => (
            <div key={event.id} className={`bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border relative hover:scale-[1.02] transition-transform ${!event.is_visible ? 'opacity-70 border-slate-100 dark:border-slate-800 grayscale-[0.5]' : 'border-slate-100 dark:border-slate-800'} ${event.is_cancelled ? 'border-red-200 dark:border-red-900/30' : ''}`}>
              
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 truncate pr-4">{event.title}</h3>
                <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide shrink-0 ${event.is_cancelled ? 'bg-red-600 text-white' : event.is_visible ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-slate-100 text-slate-500'}`}>
                  {event.is_cancelled ? 'Annulé' : (event.is_visible ? 'En ligne' : 'Terminé')}
                </span>
              </div>
              
              <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400 mb-5">
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-blue-500"/>
                  {new Date(event.start_time).toLocaleDateString()} • {new Date(event.start_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-purple-500"/>
                  {event.location_type === 'public' ? event.location_name : 'Lieu Privé'} 
                  <span className="text-slate-300 dark:text-slate-600">•</span> 
                  <span className="font-medium text-blue-600 dark:text-blue-400">{event.tram_stop}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users size={16} className="text-slate-400"/>
                  <span className={event.participants?.[0]?.count >= event.max_participants ? "text-red-500 font-bold" : "font-medium text-slate-900 dark:text-white"}>
                    {event.participants?.[0]?.count || 0}
                  </span> 
                  / {event.max_participants}
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                {event.is_visible && !event.is_cancelled && (
                    <Link href={`/dashboard/edit/${event.id}`} className="p-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition" title="Modifier">
                        <Edit3 size={20} />
                    </Link>
                )}
                <Link href={`/event/${event.id}`} className={`flex-1 flex items-center justify-center font-bold py-3 rounded-xl transition ${event.is_cancelled ? 'bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400' : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'}`}>
                    {event.is_cancelled ? 'Voir Annulation' : (event.is_visible ? 'Gérer & Partager' : 'Voir les stats (Archivé)')}
                </Link>
              </div>

            </div>
          ))
        )}
      </div>

      <Link href="/dashboard/create">
        <button className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-full shadow-xl shadow-blue-600/40 hover:scale-110 transition-transform z-30">
          <Plus size={32} />
        </button>
      </Link>
    </main>
  )
}