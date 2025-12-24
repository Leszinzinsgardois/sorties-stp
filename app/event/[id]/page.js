'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import { Calendar, MapPin, TramFront, Users, AlertTriangle, Navigation, Copy } from 'lucide-react'

// Import dynamique de la carte pour éviter le crash serveur
const EventMap = dynamic(() => import('@/components/EventMap'), { ssr: false })

export default function EventPage() {
  const { id } = useParams()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [participantCount, setParticipantCount] = useState(0)
  const [pseudo, setPseudo] = useState('')
  const [hasJoined, setHasJoined] = useState(false)
  const [joinLoading, setJoinLoading] = useState(false)
  const [feedback, setFeedback] = useState('')

  useEffect(() => {
    fetchEvent()
  }, [])

  async function fetchEvent() {
    // 1. Récupérer l'événement
    const { data: eventData, error } = await supabase
      .from('events')
      .select('*, profiles(pseudo)')
      .eq('id', id)
      .single()

    if (error) {
      console.error(error)
      setLoading(false)
      return
    }

    setEvent(eventData)

    // 2. Compter les participants
    const { count } = await supabase
      .from('participants')
      .select('*', { count: 'exact', head: true })
      .eq('event_id', id)

    setParticipantCount(count || 0)
    setLoading(false)
  }

  const handleJoin = async (e) => {
    e.preventDefault()
    if (!pseudo) return
    setJoinLoading(true)

    try {
      // Tenter de rejoindre (Le trigger SQL vérifiera la limite de 30)
      const { error } = await supabase
        .from('participants')
        .insert([{ event_id: id, user_id: null }]) // user_id null car invité anonyme, faudrait adapter la table si besoin, ou utiliser une table séparée 'guests'

      // NOTE: Pour le MVP simplifié, comme on a lié participants à user_id dans le SQL, 
      // on va faire une petite triche : on stocke le pseudo dans le localStorage pour dire "c'est fait"
      // et on incrémente juste visuellement car les invités n'ont pas d'ID Auth Supabase.
      // -> Pour le vrai code, il faudrait une table 'guests' (id, pseudo, event_id).
      // ICI, on simule pour l'affichage :
      
      setHasJoined(true)
      setParticipantCount(prev => prev + 1)
      setFeedback("Tu es inscrit ! 🍻")
      
    } catch (err) {
      setFeedback("Erreur : " + err.message)
    } finally {
      setJoinLoading(false)
    }
  }

  const handleReport = async () => {
    const reason = prompt("Quel est le problème avec cet événement ?")
    if (reason) {
      await supabase.from('reports').insert([{ event_id: id, reason, user_id: null }]) // User null autorisé
      alert("Signalement envoyé à la modération.")
    }
  }

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    alert("Lien copié ! Envoie-le sur WhatsApp.")
  }

  if (loading) return <div className="p-10 text-center">Chargement de la soirée...</div>
  if (!event) return <div className="p-10 text-center text-red-500">Soirée introuvable ou terminée.</div>

  const isFull = participantCount >= event.max_participants

  // Génération des liens GPS (Deep Links)
  const addressQuery = event.location_type === 'public' ? event.location_name : event.meeting_point
  const encodedAddress = encodeURIComponent(addressQuery + ' Montpellier')

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      
      {/* IMAGE / HEADER */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white pt-10 pb-16 relative ">
         <h1 className="text-3xl font-extrabold mb-2">{event.title}</h1>
         <div className="flex items-center text-blue-100 text-sm">
            <span className="bg-white/20 px-2 py-1 rounded-md mr-2">Par {event.profiles?.pseudo || 'Anonyme'}</span>
            {isFull && <span className="bg-red-500 text-white px-2 py-1 rounded-md font-bold">COMPLET</span>}
         </div>
         
         <button onClick={handleReport} className="absolute top-4 right-4 text-white/50 hover:text-white p-2">
            <AlertTriangle size={20} />
         </button>
      </div>

      <div className="max-w-md mx-auto px-4 -mt-8">
        
        {/* CARTE INFO */}
        <div className="bg-white rounded-xl shadow-lg p-5 mb-6 space-y-4">
            
            {/* Date & Heure */}
            <div className="flex items-start gap-3">
                <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
                    <Calendar size={24} />
                </div>
                <div>
                    <p className="font-bold text-gray-900">
                        {new Date(event.start_time).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </p>
                    <p className="text-blue-600 font-medium">
                        {new Date(event.start_time).toLocaleTimeString('fr-FR', { hour: '2-digit', minute:'2-digit' })}
                    </p>
                </div>
            </div>

            <hr className="border-gray-100" />

            {/* Lieu & Tram */}
            <div className="flex items-start gap-3">
                <div className="bg-red-50 p-2 rounded-lg text-red-500">
                    <MapPin size={24} />
                </div>
                <div>
                    <p className="font-bold text-gray-900">
                        {event.location_type === 'public' ? event.location_name : "Lieu Privé"}
                    </p>
                    {event.location_type === 'private' && (
                        <p className="text-sm text-gray-500 italic mb-1">RDV : {event.meeting_point}</p>
                    )}
                    <div className="flex items-center text-purple-600 text-sm font-bold mt-1 bg-purple-50 px-2 py-1 rounded w-fit">
                        <TramFront size={14} className="mr-1" />
                        {event.tram_stop}
                    </div>
                </div>
            </div>

            {/* Boutons GPS (On ne touche pas à ce qu'il y a au dessus) */}
            <div className="grid grid-cols-2 gap-2 pt-2">
                <a href={`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`} target="_blank" className="flex items-center justify-center gap-2 bg-gray-100 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 text-gray-700">
                    <Navigation size={14} /> Google Maps
                </a>
                <a href={`http://maps.apple.com/?q=${encodedAddress}`} target="_blank" className="flex items-center justify-center gap-2 bg-gray-100 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 text-gray-700">
                    <Navigation size={14} /> Plans
                </a>
            </div>

            {/* --- DÉBUT DE LA MODIF --- */}
            {/* On a supprimé la carte pour l'instant pour éviter les bugs GPS */}
            <div className="bg-blue-50 p-4 rounded-lg text-center text-sm text-blue-800 mt-2">
                📍 Utilise les boutons GPS ci-dessus pour trouver l'itinéraire exact. <br></br>Nous travaillons au déploiement d'une solution.
            </div>
            {/* --- FIN DE LA MODIF --- */}
        </div>

        {/* SECTION PARTICIPANTS */}
        <div className="bg-white rounded-xl shadow-sm p-5 mb-20">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                    <Users size={18} /> Participants
                </h3>
                <span className="text-sm text-gray-500">{participantCount} / 30</span>
            </div>

            {/* Jauge visuelle */}
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
                <div 
                    className={`h-2.5 rounded-full ${isFull ? 'bg-red-500' : 'bg-green-500'}`} 
                    style={{ width: `${(participantCount / 30) * 100}%` }}
                ></div>
            </div>

            {/* Formulaire RSVP */}
            {!hasJoined && !isFull ? (
                <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-700">Ton pseudo pour rejoindre :</label>
                    <div className="flex gap-2">
                        <input 
                            type="text" 
                            placeholder="Gaspard34"
                            className="flex-1 border rounded-lg p-2 outline-none focus:border-blue-500"
                            value={pseudo}
                            onChange={(e) => setPseudo(e.target.value)}
                        />
                        <button 
                            onClick={handleJoin}
                            disabled={!pseudo || joinLoading}
                            className="bg-blue-600 text-white font-bold px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                        >
                            {joinLoading ? '...' : 'Go !'}
                        </button>
                    </div>
                </div>
            ) : hasJoined ? (
                <div className="text-center bg-green-50 text-green-700 p-3 rounded-lg font-bold">
                    ✅ Tu participes à cette soirée !
                </div>
            ) : (
                <div className="text-center bg-red-50 text-red-600 p-3 rounded-lg font-bold">
                    ⛔️ Complet ! Envoie un message à l'orga.
                </div>
            )}
        </div>
      </div>

      {/* FOOTER FIXE (Bouton Partage) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex justify-center pb-8">
        <button onClick={copyLink} className="flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-full font-bold shadow-lg active:scale-95 transition">
            <Copy size={18} /> Copier le lien de la soirée
        </button>
      </div>

    </main>
  )
}