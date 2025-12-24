'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Plus, MapPin, Calendar, Users, LogOut, Moon } from 'lucide-react'

export default function Dashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [events, setEvents] = useState([])

  useEffect(() => {
    checkUser()
  }, [])

  async function checkUser() {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error || !user) { router.push('/login'); return }
    fetchMyEvents(user.id)
  }

  async function fetchMyEvents(userId) {
    const { data } = await supabase.from('events').select('*').eq('organizer_id', userId).order('start_time', { ascending: true })
    setEvents(data || [])
    setLoading(false)
  }

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-500">Chargement...</div>

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24 transition-colors">
      
      {/* HEADER */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10 px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">
          Mes Sorties
        </h1>
        <button onClick={handleSignOut} className="text-slate-400 hover:text-red-500 p-2 transition">
          <LogOut size={20} />
        </button>
      </header>

      {/* LISTE */}
      <div className="p-4 space-y-4 max-w-md mx-auto mt-4">
        {events.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 mx-4">
            <div className="bg-blue-50 dark:bg-slate-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar className="text-blue-500 dark:text-blue-400" size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white">Rien de prévu ?</h3>
            <p className="text-slate-500 dark:text-slate-400 mt-2 mb-8">Lance une soirée pour tes potes.</p>
            <Link href="/dashboard/create">
              <button className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition">
                Créer une sortie
              </button>
            </Link>
          </div>
        ) : (
          events.map(event => (
            <div key={event.id} className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 relative hover:scale-[1.02] transition-transform">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">{event.title}</h3>
                <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide ${event.is_visible ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-slate-100 text-slate-500'}`}>
                  {event.is_visible ? 'En ligne' : 'Terminé'}
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
                  0 / {event.max_participants}
                </div>
              </div>

              <Link href={`/event/${event.id}`} className="block text-center w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition">
                Gérer & Partager
              </Link>
            </div>
          ))
        )}
      </div>

      <Link href="/dashboard/create">
        <button className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-full shadow-xl shadow-blue-600/40 hover:scale-110 transition-transform">
          <Plus size={32} />
        </button>
      </Link>
    </main>
  )
}