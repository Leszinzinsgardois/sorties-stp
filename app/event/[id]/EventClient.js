'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Calendar, MapPin, TramFront, Users, AlertTriangle, Copy, ArrowLeft, Info, AlertOctagon, Clock, CloudRain, Sun, Zap, Umbrella, ArrowRight, Printer, FileText } from 'lucide-react'

// Mapping Codes WMO Météo -> Alertes
const getWeatherAlert = (code) => {
    // 95, 96, 99 : Orages
    if ([95, 96, 99].includes(code)) return { type: 'red', label: 'Vigilance Orages', icon: Zap, message: 'Orages violents prévus. Soyez prudents.' }
    // 61, 63, 65 : Pluie forte
    if ([61, 63, 65, 80, 81, 82].includes(code)) return { type: 'orange', label: 'Pluie Forte', icon: CloudRain, message: 'Risque d\'averses intenses.' }
    return null
}

export default function EventClient() {
  const { id } = useParams()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [participantCount, setParticipantCount] = useState(0)
  
  // NOUVEAU : Liste complète pour l'organisateur
  const [participantsList, setParticipantsList] = useState([]) 
  const [isOrganizer, setIsOrganizer] = useState(false)

  const [pseudo, setPseudo] = useState('')
  const [hasJoined, setHasJoined] = useState(false)
  const [joinLoading, setJoinLoading] = useState(false)
  const [weatherAlert, setWeatherAlert] = useState(null)

  useEffect(() => {
    const alreadyJoined = localStorage.getItem(`joined_${id}`)
    if (alreadyJoined) setHasJoined(true)
    fetchEvent()
  }, [])

  async function fetchEvent() {
    // 1. Récupérer l'utilisateur courant pour vérifier si c'est l'organisateur
    const { data: { user } } = await supabase.auth.getUser()
    
    // 2. Récupérer l'event
    const { data: eventData, error } = await supabase.from('events').select('*, profiles(pseudo)').eq('id', id).single()
    if (error) { setLoading(false); return }
    setEvent(eventData)

    // Vérif si organisateur
    const isOrg = user && user.id === eventData.organizer_id
    setIsOrganizer(isOrg)

    // 3. Récupérer les participants
    if (isOrg) {
        // Si Organisateur : On récupère TOUTE la liste (Noms)
        const { data } = await supabase.from('participants').select('guest_name, user_id, joined_at').eq('event_id', id).order('joined_at', { ascending: true })
        setParticipantsList(data || [])
        setParticipantCount(data?.length || 0)
    } else {
        // Si Invité : On récupère juste le COMPTEUR (Confidentialité)
        const { count } = await supabase.from('participants').select('*', { count: 'exact', head: true }).eq('event_id', id)
        setParticipantCount(count || 0)
    }
    
    if (eventData?.start_time) checkWeather(eventData.start_time)
    setLoading(false)
  }

  // --- (Fonctions météo et join inchangées) ---
  async function checkWeather(dateStr) {
      const eventDate = new Date(dateStr)
      const today = new Date()
      const diffTime = eventDate - today
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      if (diffDays >= 0 && diffDays < 7) {
        try {
            const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=43.6108&longitude=3.8767&daily=weather_code&timezone=Europe%2FBerlin`)
            const data = await res.json()
            const dateISO = eventDate.toISOString().split('T')[0]
            const index = data.daily.time.indexOf(dateISO)
            
            if (index !== -1) {
                const code = data.daily.weather_code[index]
                const alert = getWeatherAlert(code)
                if (alert) setWeatherAlert(alert)
            }
        } catch (e) { console.error("Météo non disponible", e) }
      }
  }

  const handleJoin = async () => {
    if (!pseudo) return
    const isFinishedCheck = new Date() > new Date(event.end_time)
    if (event.is_cancelled || isFinishedCheck) { alert("Les inscriptions sont fermées."); return }

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

  // Fonction d'impression
  const printList = () => {
    window.print()
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-500">Chargement...</div>
  if (!event) return <div className="p-10 text-center text-red-500">Soirée introuvable.</div>

  const isFull = participantCount >= event.max_participants
  const isFinished = new Date() > new Date(event.end_time)
  const addressQuery = event.location_type === 'public' ? event.location_name : event.meeting_point
  const encodedAddress = encodeURIComponent(addressQuery + ' Montpellier')

  return (
    <>
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24 transition-colors print:hidden">
      
      {/* HEADER FIXE */}
      <div className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 pt-safe-top">
         <div className="flex items-center justify-between p-4 max-w-5xl mx-auto w-full">
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

      <div className="max-w-5xl mx-auto px-4 pt-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">

        {/* --- COLONNE GAUCHE (Infos) --- */}
        <div className="space-y-6">
            
            {/* 1. ALERTE ANNULATION */}
            {event.is_cancelled && (
                <div className="bg-red-600 text-white p-6 rounded-3xl shadow-xl shadow-red-600/20 border-4 border-white dark:border-slate-900 animate-in fade-in slide-in-from-top-4">
                    <div className="flex items-start gap-4">
                        <div className="bg-white/20 p-3 rounded-2xl shrink-0"><AlertOctagon size={32} className="text-white"/></div>
                        <div>
                            <h2 className="text-2xl font-black uppercase tracking-wide mb-1">Annulé</h2>
                            <p className="text-red-100 font-medium text-sm mb-4">Le {new Date(event.cancelled_at).toLocaleDateString()}</p>
                            <div className="bg-black/20 p-4 rounded-xl backdrop-blur-sm">
                                <p className="text-xs text-white/60 uppercase font-bold mb-1">Motif :</p>
                                <p className="text-lg font-bold">"{event.cancellation_reason}"</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 2. ALERTE METEO */}
            {weatherAlert && !event.is_cancelled && (
                <div className={`p-4 rounded-2xl flex items-start gap-4 animate-in slide-in-from-top-4 ${weatherAlert.type === 'red' ? 'bg-red-600 text-white shadow-red-500/30' : 'bg-orange-500 text-white shadow-orange-500/30'} shadow-lg`}>
                    <div className="bg-white/20 p-2 rounded-xl shrink-0"><weatherAlert.icon size={24} className="text-white" /></div>
                    <div>
                        <h3 className="font-black uppercase tracking-wide text-sm">{weatherAlert.label}</h3>
                        <p className="text-xs font-medium opacity-90 mt-1">{weatherAlert.message}</p>
                    </div>
                </div>
            )}

            {/* 3. ALERTE HORAIRE MODIFIÉ (Restaurée) */}
            {!event.is_cancelled && event.initial_start_time && (
                <div className="bg-orange-50 dark:bg-orange-900/20 border-l-4 border-orange-500 p-4 rounded-r-xl shadow-sm animate-pulse">
                    <div className="flex items-start gap-3">
                        <AlertTriangle className="text-orange-600 dark:text-orange-400 shrink-0 mt-1" size={20} />
                        <div>
                            <h3 className="font-bold text-orange-700 dark:text-orange-400 uppercase text-xs tracking-wide">⚠️ Horaire Modifié</h3>
                            <div className="flex items-center gap-2 mt-1 text-sm text-orange-900 dark:text-orange-200">
                                <span className="line-through opacity-60">{new Date(event.initial_start_time).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
                                <ArrowRight size={14} />
                                <span className="font-bold">{new Date(event.start_time).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
                            </div>
                            <p className="text-xs text-orange-800 dark:text-orange-300 mt-1">L'organisateur a décalé la soirée.</p>
                        </div>
                    </div>
                </div>
            )}

            {/* CARTE INFO */}
            <div className={`bg-white dark:bg-slate-900 rounded-3xl shadow-sm p-6 space-y-6 border border-slate-100 dark:border-slate-800 ${event.is_cancelled || isFinished ? 'opacity-70 grayscale-[0.5]' : ''}`}>
                <div className="flex justify-between items-center">
                    <span className="text-xs font-bold bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full">@{event.profiles?.pseudo || 'Anonyme'}</span>
                    {event.is_cancelled ? <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-md font-bold">ANNULÉ</span> : 
                     isFinished ? <span className="bg-slate-200 text-slate-600 text-xs px-2 py-1 rounded-md font-bold">TERMINÉ</span> : 
                     isFull && <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-md font-bold">COMPLET</span>}
                </div>

                <div className="flex items-center gap-4">
                    <div className="bg-blue-50 dark:bg-slate-800 w-12 h-12 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0"><Calendar size={24} /></div>
                    <div>
                        <p className="font-bold text-slate-900 dark:text-white text-lg">{new Date(event.start_time).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' })}</p>
                        <p className="text-slate-500 dark:text-slate-400">{new Date(event.start_time).toLocaleTimeString('fr-FR', { hour: '2-digit', minute:'2-digit' })}</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="bg-purple-50 dark:bg-slate-800 w-12 h-12 rounded-2xl flex items-center justify-center text-purple-600 dark:text-purple-400 shrink-0"><MapPin size={24} /></div>
                    <div className="min-w-0 flex-1">
                        <p className="font-bold text-slate-900 dark:text-white truncate">{event.location_type === 'public' ? event.location_name : "Lieu Privé"}</p>
                        {event.location_type === 'private' && <p className="text-sm text-slate-500 dark:text-slate-400 mb-1 break-words">RDV : {event.meeting_point}</p>}
                        <div className="inline-flex items-center text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-1 rounded mt-1">
                            <TramFront size={12} className="mr-1" />
                            {event.tram_stop}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* --- COLONNE DROITE --- */}
        <div className="space-y-6">
            
            {/* DESCRIPTION */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm p-6 border border-slate-100 dark:border-slate-800">
                <h3 className="font-bold text-slate-800 dark:text-white mb-3">À propos</h3>
                <div className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl">
                    {event.description || <span className="italic text-slate-400">Aucune description.</span>}
                </div>
            </div>

            {/* PARTICIPANTS */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm p-6 border border-slate-100 dark:border-slate-800">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2"><Users size={20} className="text-blue-600 dark:text-blue-400"/> Participants</h3>
                    <span className="font-mono font-bold text-slate-600 dark:text-slate-400">{participantCount} / {event.max_participants}</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3 mb-6 overflow-hidden">
                    <div className={`h-full transition-all duration-500 ${isFull ? 'bg-red-500' : 'bg-gradient-to-r from-blue-500 to-indigo-500'}`} style={{ width: `${Math.min((participantCount / event.max_participants) * 100, 100)}%` }}></div>
                </div>
                
                {/* Actions d'inscription (Invité) */}
                {!isOrganizer && (
                    event.is_cancelled ? (
                        <div className="text-center bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 p-4 rounded-xl font-bold">🚫 Annulé</div>
                    ) : isFinished ? (
                        <div className="text-center bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 p-4 rounded-xl font-bold flex items-center justify-center gap-2"><Clock size={18} /> C'est fini !</div>
                    ) : !hasJoined && !isFull ? (
                        <div className="flex gap-2">
                            <input type="text" placeholder="Ton Prénom..." className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 outline-none min-w-0" value={pseudo} onChange={(e) => setPseudo(e.target.value)} />
                            <button onClick={handleJoin} disabled={!pseudo || joinLoading} className="bg-blue-600 text-white font-bold px-4 py-3 rounded-xl hover:bg-blue-700 disabled:opacity-50">Je viens !</button>
                        </div>
                    ) : hasJoined ? (
                        <div className="text-center bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 p-4 rounded-xl font-bold">✅ Inscrit !</div>
                    ) : (
                        <div className="text-center bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl font-bold">⛔️ Complet !</div>
                    )
                )}

                {/* ZONE ORGANISATEUR (Liste + Impression) */}
                {isOrganizer && participantsList.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                        <h4 className="text-xs font-bold text-slate-500 uppercase mb-3">Liste des invités (Organisateur)</h4>
                        <div className="max-h-60 overflow-y-auto space-y-2 mb-4 bg-slate-50 dark:bg-slate-950 p-2 rounded-xl">
                            {participantsList.map((p, i) => (
                                <div key={i} className="flex justify-between items-center text-sm p-2 bg-white dark:bg-slate-900 rounded-lg shadow-sm">
                                    <span className="font-bold text-slate-800 dark:text-white">{p.guest_name}</span>
                                    <span className="text-xs text-slate-400">{new Date(p.joined_at).toLocaleDateString()}</span>
                                </div>
                            ))}
                        </div>
                        <button onClick={printList} className="w-full flex items-center justify-center gap-2 bg-slate-800 dark:bg-white text-white dark:text-slate-900 font-bold py-3 rounded-xl hover:opacity-90 transition">
                            <Printer size={18} /> Télécharger la liste (PDF)
                        </button>
                    </div>
                )}
            </div>

        </div>
      </div>
      
      {/* Footer Share */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 p-4 pb-8 flex justify-center z-40">
        <button onClick={copyLink} className="flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-3 rounded-full font-bold shadow-lg active:scale-95 transition hover:scale-105"><Copy size={18} /> Partager</button>
      </div>
    </main>

    {/* --- MODE IMPRESSION (Invisible à l'écran, visible sur PDF) --- */}
    <div className="hidden print:block p-8 bg-white text-black">
        <div className="text-center mb-8 border-b-2 border-black pb-4">
            <h1 className="text-4xl font-black mb-2">{event.title}</h1>
            <p className="text-lg">Organisé par {event.profiles?.pseudo}</p>
            <p className="text-sm mt-2">{new Date(event.start_time).toLocaleString()}</p>
            <p className="text-sm">{event.location_name} - {event.location_type === 'public' ? 'Public' : 'Privé'}</p>
        </div>

        <h2 className="text-2xl font-bold mb-4 uppercase border-b border-gray-300 pb-2">Liste des Participants ({participantCount})</h2>
        
        <table className="w-full text-left border-collapse">
            <thead>
                <tr className="border-b-2 border-black">
                    <th className="py-2">#</th>
                    <th className="py-2">Nom / Pseudo</th>
                    <th className="py-2">Date inscription</th>
                    <th className="py-2 text-right">Émargement</th>
                </tr>
            </thead>
            <tbody>
                {participantsList.map((p, i) => (
                    <tr key={i} className="border-b border-gray-200">
                        <td className="py-3 font-mono text-gray-500">{i + 1}</td>
                        <td className="py-3 font-bold">{p.guest_name}</td>
                        <td className="py-3 text-sm">{new Date(p.joined_at).toLocaleString()}</td>
                        <td className="py-3 text-right"><div className="w-6 h-6 border-2 border-black inline-block rounded"></div></td>
                    </tr>
                ))}
            </tbody>
        </table>

        <div className="mt-12 text-center text-sm text-gray-500 italic">
            Généré automatiquement par Oukonsort - oukonsort.netlify.app
        </div>
    </div>
    </>
  )
}