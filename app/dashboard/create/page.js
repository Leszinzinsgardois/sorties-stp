'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { ArrowLeft, MapPin, TramFront, Calendar, Info, AlignLeft, Type, ChevronDown } from 'lucide-react'
import Link from 'next/link'

// Liste officielle (pour cohérence avec la modif)
const TRAM_OPTIONS = [
  "Ligne 1",
  "Ligne 2",
  "Ligne 3",
  "Ligne 4",
  "Ligne 5",
  "Bus / Autre"
]

export default function CreateEvent() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState(null)

  // Formulaire
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [locationType, setLocationType] = useState('public') // 'public' ou 'private'
  const [locationName, setLocationName] = useState('') // Si public
  const [meetingPoint, setMeetingPoint] = useState('') // Si privé
  const [tramStop, setTramStop] = useState('Ligne 1') // Par défaut

  useEffect(() => {
    checkUser()
  }, [])

  async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) router.push('/login')
    setUser(user)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // 1. Validation de base
      if (!title || !date || !time) throw new Error("Titre, date et heure obligatoires.")
      if (locationType === 'private' && !meetingPoint) throw new Error("Point de RDV obligatoire pour lieu privé.")
      
      // Combiner date et heure pour le format timestamp
      const startDateTime = new Date(`${date}T${time}`).toISOString()
      
      // On fixe la fin à +5h par défaut (modifiable via SQL si besoin plus tard)
      const endDateTime = new Date(new Date(`${date}T${time}`).getTime() + 5 * 60 * 60 * 1000).toISOString()

      // 2. Insertion dans Supabase
      const { error } = await supabase
        .from('events')
        .insert([
          {
            title,
            description,
            start_time: startDateTime,
            end_time: endDateTime,
            organizer_id: user.id,
            location_type: locationType,
            location_name: locationType === 'public' ? locationName : null,
            meeting_point: locationType === 'private' ? meetingPoint : null,
            tram_stop: tramStop,
            max_participants: 30, 
            is_visible: true
          }
        ])

      if (error) throw error
      router.push('/dashboard')

    } catch (error) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20 transition-colors pt-4">
      
      {/* HEADER */}
      <div className="flex items-center gap-4 px-4 mb-6">
        <Link href="/dashboard" className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2 rounded-full text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">Créer une sortie</h1>
      </div>

      <form onSubmit={handleSubmit} className="max-w-md mx-auto px-4 space-y-6">
        
        {/* TITRE & DESC */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2 ml-1">Quoi ?</label>
            <div className="flex items-center bg-slate-50 dark:bg-slate-800 rounded-xl px-4 border border-transparent focus-within:border-blue-500 transition">
                <Type size={18} className="text-slate-400 mr-3 shrink-0" />
                <input 
                type="text" required placeholder="Titre (ex: Anniv Thomas)"
                className="w-full py-4 bg-transparent outline-none text-slate-900 dark:text-white font-bold placeholder:font-normal"
                value={title} onChange={e => setTitle(e.target.value)}
                />
            </div>
          </div>
          <div>
            <div className="flex items-start bg-slate-50 dark:bg-slate-800 rounded-xl px-4 py-3 border border-transparent focus-within:border-blue-500 transition">
                <AlignLeft size={18} className="text-slate-400 mr-3 mt-1 shrink-0" />
                <textarea 
                placeholder="Description (optionnel)..."
                className="w-full bg-transparent outline-none text-slate-900 dark:text-white min-h-[80px] resize-none"
                value={description} onChange={e => setDescription(e.target.value)}
                />
            </div>
          </div>
        </div>

        {/* DATE & HEURE */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-5">
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-[-10px] ml-1">Quand ?</label>
            <div className="flex gap-4">
                <div className="flex-1 bg-slate-50 dark:bg-slate-800 rounded-xl px-4 py-3 border border-transparent focus-within:border-blue-500 flex items-center">
                    <Calendar size={18} className="text-slate-400 mr-3 shrink-0" />
                    <input 
                        type="date" required
                        className="w-full bg-transparent outline-none text-slate-900 dark:text-white font-medium"
                        value={date} onChange={e => setDate(e.target.value)}
                    />
                </div>
                <div className="w-1/3 bg-slate-50 dark:bg-slate-800 rounded-xl px-4 py-3 border border-transparent focus-within:border-blue-500 flex items-center">
                    <input 
                        type="time" required
                        className="w-full bg-transparent outline-none text-slate-900 dark:text-white font-medium text-center"
                        value={time} onChange={e => setTime(e.target.value)}
                    />
                </div>
            </div>
        </div>

        {/* LIEU & TRANSPORT */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-6">
          
          {/* Choix Public / Privé */}
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-3 ml-1">Où ça ?</label>
            <div className="grid grid-cols-2 gap-3">
              <button 
                type="button"
                onClick={() => setLocationType('public')}
                className={`p-4 rounded-2xl text-sm font-bold transition flex flex-col items-center gap-2 ${locationType === 'public' ? 'bg-blue-50 dark:bg-blue-900/30 border-2 border-blue-500 text-blue-700 dark:text-blue-300' : 'bg-slate-50 dark:bg-slate-800 border-2 border-transparent text-slate-500'}`}
              >
                <MapPin size={24} />
                Lieu Public
              </button>
              <button 
                type="button"
                onClick={() => setLocationType('private')}
                className={`p-4 rounded-2xl text-sm font-bold transition flex flex-col items-center gap-2 ${locationType === 'private' ? 'bg-purple-50 dark:bg-purple-900/30 border-2 border-purple-500 text-purple-700 dark:text-purple-300' : 'bg-slate-50 dark:bg-slate-800 border-2 border-transparent text-slate-500'}`}
              >
                <Info size={24} />
                Lieu Privé
              </button>
            </div>
          </div>

          {/* Champs dynamiques */}
          {locationType === 'public' ? (
            <div className="animate-in fade-in zoom-in duration-300">
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2 ml-1">Nom du lieu</label>
              <div className="flex items-center bg-slate-50 dark:bg-slate-800 rounded-xl px-4 border border-transparent focus-within:border-blue-500 transition">
                <MapPin size={18} className="text-slate-400 mr-3" />
                <input 
                  type="text" placeholder="Ex: Jungle Pub, Parc du Peyrou..."
                  className="w-full py-4 bg-transparent outline-none text-slate-900 dark:text-white"
                  value={locationName} onChange={e => setLocationName(e.target.value)}
                />
              </div>
            </div>
          ) : (
            <div className="animate-in fade-in zoom-in duration-300 space-y-3">
               <label className="block text-xs font-bold text-purple-600 dark:text-purple-400 uppercase mb-1 ml-1">📍 Point de rendez-vous (Public)</label>
               <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl border border-purple-100 dark:border-purple-900/50 text-xs text-purple-800 dark:text-purple-200 flex gap-3 leading-relaxed">
                  <Info size={16} className="shrink-0 mt-0.5" />
                  <div>Ne mets <strong>jamais</strong> ton adresse perso ici. Donne un point de repère public (Arrêt de tram, Boulangerie...).</div>
               </div>
               <div className="flex items-center bg-slate-50 dark:bg-slate-800 rounded-xl px-4 border border-transparent focus-within:border-purple-500 transition">
                 <MapPin size={18} className="text-slate-400 mr-3" />
                 <input 
                    type="text" required placeholder="Ex: Devant la pharmacie..."
                    className="w-full py-4 bg-transparent outline-none text-slate-900 dark:text-white"
                    value={meetingPoint} onChange={e => setMeetingPoint(e.target.value)}
                  />
               </div>
            </div>
          )}

          {/* TRAMWAY (NOUVEAU SELECTEUR) */}
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2 ml-1">Accès Tram</label>
            <div className="relative bg-slate-50 dark:bg-slate-800 rounded-xl border border-transparent focus-within:border-blue-500 transition">
              <TramFront size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <select 
                required
                value={tramStop}
                onChange={(e) => setTramStop(e.target.value)}
                className="w-full py-4 pl-12 pr-10 bg-transparent appearance-none outline-none text-slate-900 dark:text-white font-medium cursor-pointer"
              >
                {TRAM_OPTIONS.map(opt => (
                    <option key={opt} value={opt} className="dark:bg-slate-900">{opt}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18}/>
            </div>
          </div>
        </div>

        {/* INFO JAUGE */}
        <div className="text-center text-xs text-slate-400 dark:text-slate-500 font-mono">
          ⚠️ Limité automatiquement à 30 personnes max.
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/30 hover:scale-[1.02] active:scale-95 transition-transform disabled:opacity-50 disabled:scale-100"
        >
          {loading ? 'Création en cours...' : '🚀 Lancer la soirée'}
        </button>

      </form>
    </main>
  )
}