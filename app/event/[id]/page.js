'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useParams } from 'next/navigation'
import Link from 'next/link'
// MODIF: On importe ArrowLeft pour le bouton retour
import { Calendar, MapPin, TramFront, Users, AlertTriangle, Copy, ArrowLeft, Info } from 'lucide-react'

export default function EventPage() {
  const { id } = useParams()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [participantCount, setParticipantCount] = useState(0)
  const [pseudo, setPseudo] = useState('')
  const [hasJoined, setHasJoined] = useState(false)
  const [joinLoading, setJoinLoading] = useState(false)
  
  useEffect(() => {
    const alreadyJoined = localStorage.getItem(`joined_${id}`)
    if (alreadyJoined) setHasJoined(true)
    fetchEvent()
  }, [])

  async function fetchEvent() {
    const { data: eventData, error } = await supabase.from('events').select('*, profiles(pseudo)').eq('id', id).single()
    if (error) { setLoading(false); return }
    setEvent(eventData)

    const { count } = await supabase.from('participants').select('*', { count: 'exact', head: true }).eq('event_id', id)
    setParticipantCount(count || 0)
    setLoading(false)
  }

  const handleJoin = async () => {
    if (!pseudo) return
    setJoinLoading(true)
    try {
      const { error } = await supabase.from('participants').insert([{ event_id: id, user_id: null, guest_name: pseudo }])
      if (error) throw error
      setHasJoined(true)
      setParticipantCount(prev => prev + 1)
      localStorage.setItem(`joined_${id}`, 'true')
    } catch (err) { alert("Erreur : " + err.message) } 
    finally { setJoinLoading(false) }
  }

  const handleReport = async () => {
    const reason = prompt("Motif du signalement ?")
    if (reason) { await supabase.from('reports').insert([{ event_id: id, reason, user_id: null }]); alert("Signalement envoyé.") }
  }

  const copyLink = () => { navigator.clipboard.writeText(window.location.href); alert("Lien copié ! 🔗") }

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-500">Chargement...</div>
  if (!event) return <div className="p-10 text-center text-red-500">Soirée introuvable.</div>

  const isFull = participantCount >= event.max_participants
  const addressQuery = event.location_type === 'public' ? event.location_name : event.meeting_point
  const encodedAddress = encodeURIComponent(addressQuery + ' Montpellier')

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24 transition-colors">
      
      {/* HEADER FIXE */}
      <div className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 pt-safe-top">
         <div className="flex items-center justify-between p-4">
            {/* MODIF ICI : Lien vers /dashboard avec icône flèche */}
            <Link href="/dashboard" className="bg-slate-100 dark:bg-slate-800 p-2 rounded-full text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition">
                <ArrowLeft size={20} />
            </Link>
            
            <h1 className="font-bold text-slate-800 dark:text-white truncate max-w-[200px] text-center">
                {event.title}
            </h1>
            <button onClick={handleReport} className="text-slate-400 hover:text-red-500 p-2">
                <AlertTriangle size={20} />
            </button>
         </div>
      </div>

      <div className="max-w-md mx-auto px-4 pt-6">
        
        {/* INFO CARD */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm p-6 mb-6 space-y-6 border border-slate-100 dark:border-slate-800">
            
            <div className="flex justify-between items-center">
                <span className="text-xs font-bold bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full">
                    @{event.profiles?.pseudo || 'Anonyme'}
                </span>
                {isFull && <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-md font-bold">COMPLET</span>}
            </div>

            {/* Date */}
            <div className="flex items-center gap-4">
                <div className="bg-blue-50 dark:bg-slate-800 w-12 h-12 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                    <Calendar size={24} />
                </div>
                <div>
                    <p className="font-bold text-slate-900 dark:text-white text-lg">
                        {new Date(event.start_time).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' })}
                    </p>
                    <p className="text-slate-500 dark:text-slate-400">
                        {new Date(event.start_time).toLocaleTimeString('fr-FR', { hour: '2-digit', minute:'2-digit' })}
                    </p>
                </div>
            </div>

            {/* Lieu */}
            <div className="flex items-center gap-4">
                <div className="bg-purple-50 dark:bg-slate-800 w-12 h-12 rounded-2xl flex items-center justify-center text-purple-600 dark:text-purple-400 shrink-0">
                    <MapPin size={24} />
                </div>
                <div className="min-w-0 flex-1">
                    <p className="font-bold text-slate-900 dark:text-white truncate">
                        {event.location_type === 'public' ? event.location_name : "Lieu Privé"}
                    </p>
                    {event.location_type === 'private' && (
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-1 break-words">RDV : {event.meeting_point}</p>
                    )}
                    <div className="inline-flex items-center text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-1 rounded mt-1">
                        <TramFront size={12} className="mr-1" />
                        {event.tram_stop}
                    </div>
                </div>
            </div>

            {/* Boutons GPS */}
            <div className="grid grid-cols-2 gap-3 pt-2">
                <a href={`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`} target="_blank" className="flex items-center justify-center gap-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 py-3 rounded-xl text-sm font-bold hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition">
                    Google Maps
                </a>
                <a href={`http://maps.apple.com/?q=${encodedAddress}`} target="_blank" className="flex items-center justify-center gap-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 py-3 rounded-xl text-sm font-bold hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition">
                    Plans
                </a>
            </div>
        </div>

        {/* DESCRIPTION */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm p-6 mb-6 border border-slate-100 dark:border-slate-800">
             <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-3">
                <Info size={20} className="text-indigo-500 dark:text-indigo-400"/> À propos
             </h3>
             <div className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800/50">
                {event.description ? event.description : <span className="italic text-slate-400">Aucune information supplémentaire fournie par l'organisateur.</span>}
             </div>
        </div>

        {/* PARTICIPANTS */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm p-6 mb-8 border border-slate-100 dark:border-slate-800">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                    <Users size={20} className="text-blue-600 dark:text-blue-400"/> Participants
                </h3>
                <span className="font-mono font-bold text-slate-600 dark:text-slate-400">{participantCount} / 30</span>
            </div>

            {/* Jauge */}
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3 mb-6 overflow-hidden">
                <div className={`h-full transition-all duration-500 ${isFull ? 'bg-red-500' : 'bg-gradient-to-r from-blue-500 to-indigo-500'}`} style={{ width: `${Math.min((participantCount / 30) * 100, 100)}%` }}></div>
            </div>

            {/* Formulaire RSVP */}
            {!hasJoined && !isFull ? (
                <div className="flex gap-2">
                    <input 
                        type="text" placeholder="Ton Prénom..."
                        className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-slate-900 dark:text-white outline-none focus:border-blue-500 min-w-0 transition"
                        value={pseudo} onChange={(e) => setPseudo(e.target.value)}
                    />
                    <button 
                        onClick={handleJoin} disabled={!pseudo || joinLoading}
                        className="bg-blue-600 text-white font-bold px-4 py-3 rounded-xl whitespace-nowrap hover:bg-blue-700 disabled:opacity-50 shadow-md shadow-blue-500/20 transition active:scale-95"
                    >
                        {joinLoading ? '...' : 'Je viens !'}
                    </button>
                </div>
            ) : hasJoined ? (
                <div className="text-center bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 p-4 rounded-xl font-bold border border-green-100 dark:border-green-900/50">
                    ✅ Tu es inscrit sur la liste !
                </div>
            ) : (
                <div className="text-center bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl font-bold border border-red-100 dark:border-red-900/50">
                    ⛔️ Complet !
                </div>
            )}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 p-4 pb-8 flex justify-center z-40">
        <button onClick={copyLink} className="flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-3 rounded-full font-bold shadow-lg active:scale-95 transition hover:scale-105">
            <Copy size={18} /> Partager le lien
        </button>
      </div>
    </main>
  )
}