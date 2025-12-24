'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Plus, MapPin, Calendar, Users, LogOut } from 'lucide-react'

export default function Dashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [events, setEvents] = useState([])

  useEffect(() => {
    checkUser()
  }, [])

  async function checkUser() {
    // 1. On récupère l'utilisateur actuel
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user) {
      router.push('/login') // Pas connecté ? Dehors !
      return
    }

    setUser(user)
    fetchMyEvents(user.id)
  }

  async function fetchMyEvents(userId) {
    // 2. On récupère ses événements
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('organizer_id', userId)
      .order('start_time', { ascending: true })

    if (error) console.error(error)
    else setEvents(data || [])
    
    setLoading(false)
  }

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) return <div className="p-10 text-center">Chargement de tes soirées...</div>

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      {/* HEADER */}
      <header className="bg-white/90 backdrop-blur-md border-b sticky top-0 z-50 px-4 py-4 flex justify-between items-center shadow-sm">
        <h1 className="text-xl font-bold text-blue-600">Mes Sorties</h1>
        <button 
          onClick={handleSignOut}
          className="text-gray-500 hover:text-red-500 p-2"
        >
          <LogOut size={20} />
        </button>
      </header>

      {/* LISTE DES ÉVÉNEMENTS */}
      <div className="p-4 space-y-4 max-w-md mx-auto">
        
        {events.length === 0 ? (
          // État vide (Pas encore de soirée)
          <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
            <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="text-blue-500" size={32} />
            </div>
            <h3 className="text-lg font-medium text-gray-900">C'est vide ici !</h3>
            <p className="text-gray-500 mt-1 mb-6">Tu n'as rien prévu pour l'instant.</p>
            <Link href="/dashboard/create">
              <button className="bg-blue-600 text-white px-6 py-2 rounded-full font-bold shadow-lg hover:bg-blue-700 transition">
                Créer ma première sortie
              </button>
            </Link>
          </div>
        ) : (
          // Liste des soirées
          events.map(event => (
            <div key={event.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 relative">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg text-gray-800">{event.title}</h3>
                <span className={`text-xs px-2 py-1 rounded-full ${event.is_visible ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                  {event.is_visible ? 'En ligne' : 'Terminé'}
                </span>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-blue-500"/>
                  {new Date(event.start_time).toLocaleDateString()} à {new Date(event.start_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-red-500"/>
                  {event.location_type === 'public' ? event.location_name : 'Lieu Privé'} 
                  <span className="text-gray-400">•</span> 
                  <span className="font-medium text-blue-600">{event.tram_stop}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users size={16} className="text-gray-400"/>
                  0 / {event.max_participants} participants
                </div>
              </div>

              <Link href={`/event/${event.id}`} className="block text-center w-full border border-blue-600 text-blue-600 font-medium py-2 rounded-lg hover:bg-blue-50">
                Voir & Partager
              </Link>
            </div>
          ))
        )}
      </div>

      {/* FLOATING ACTION BUTTON (Le bouton + en bas) */}
      <Link href="/dashboard/create">
        <button className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-xl hover:bg-blue-700 hover:scale-105 transition-all">
          <Plus size={28} />
        </button>
      </Link>
    </main>
  )
}