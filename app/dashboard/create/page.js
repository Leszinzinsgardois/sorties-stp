'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { ArrowLeft, MapPin, TramFront, Calendar, Info } from 'lucide-react'
import Link from 'next/link'

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
      // On met arbitrairement la fin 5h plus tard (pour le MVP)
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
            location_name: locationType === 'public' ? locationName : null, // Nom du bar
            meeting_point: locationType === 'private' ? meetingPoint : null, // "Devant la boulangerie"
            tram_stop: tramStop,
            max_participants: 30, // Hard-codé comme prévu
            is_visible: true
          }
        ])

      if (error) throw error

      // 3. Succès -> Retour au dashboard
      router.push('/dashboard')

    } catch (error) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 pb-10">
      {/* Header */}
      <div className="bg-white p-4 border-b flex items-center gap-4 sticky top-0 z-10">
        <Link href="/dashboard" className="text-gray-600 hover:text-blue-600">
          <ArrowLeft />
        </Link>
        <h1 className="text-xl font-bold">Créer une sortie</h1>
      </div>

      <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 space-y-6">
        
        {/* TITRE & DESC */}
        <div className="bg-white p-4 rounded-xl shadow-sm space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom de la sortie</label>
            <input 
              type="text" required placeholder="Ex: Anniv de Thomas"
              className="w-full p-2 border rounded-lg focus:border-blue-500 outline-none"
              value={title} onChange={e => setTitle(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optionnel)</label>
            <textarea 
              placeholder="On va boire un coup..."
              className="w-full p-2 border rounded-lg focus:border-blue-500 outline-none h-20"
              value={description} onChange={e => setDescription(e.target.value)}
            />
          </div>
        </div>

        {/* DATE & HEURE */}
        <div className="bg-white p-4 rounded-xl shadow-sm space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input 
                type="date" required
                className="w-full p-2 border rounded-lg outline-none"
                value={date} onChange={e => setDate(e.target.value)}
              />
            </div>
            <div className="w-1/3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Heure</label>
              <input 
                type="time" required
                className="w-full p-2 border rounded-lg outline-none"
                value={time} onChange={e => setTime(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* LIEU & TRANSPORT */}
        <div className="bg-white p-4 rounded-xl shadow-sm space-y-6">
          
          {/* Choix Public / Privé */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type de lieu</label>
            <div className="grid grid-cols-2 gap-2">
              <button 
                type="button"
                onClick={() => setLocationType('public')}
                className={`p-2 rounded-lg border text-sm font-medium transition ${locationType === 'public' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'border-gray-200 text-gray-600'}`}
              >
                🏢 Lieu Public (Bar...)
              </button>
              <button 
                type="button"
                onClick={() => setLocationType('private')}
                className={`p-2 rounded-lg border text-sm font-medium transition ${locationType === 'private' ? 'bg-purple-50 border-purple-500 text-purple-700' : 'border-gray-200 text-gray-600'}`}
              >
                🏠 Lieu Privé (Appart)
              </button>
            </div>
          </div>

          {/* Champs dynamiques selon le type */}
          {locationType === 'public' ? (
            <div className="animate-in fade-in">
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom du lieu</label>
              <div className="flex items-center border rounded-lg px-3 bg-gray-50">
                <MapPin size={18} className="text-gray-400 mr-2" />
                <input 
                  type="text" placeholder="Ex: Jungle Pub"
                  className="w-full p-2 bg-transparent outline-none"
                  value={locationName} onChange={e => setLocationName(e.target.value)}
                />
              </div>
            </div>
          ) : (
            <div className="animate-in fade-in space-y-2">
               <label className="block text-sm font-medium text-purple-700 mb-1">📍 Point de rendez-vous (Public)</label>
               <div className="bg-purple-50 p-3 rounded-lg border border-purple-100 text-xs text-purple-800 mb-2 flex gap-2">
                  <Info size={16} className="shrink-0" />
                  Ne donne pas ton adresse exacte ici. Donne un point de repère proche.
               </div>
               <input 
                  type="text" required placeholder="Ex: Devant la pharmacie de l'arrêt"
                  className="w-full p-2 border rounded-lg focus:border-purple-500 outline-none"
                  value={meetingPoint} onChange={e => setMeetingPoint(e.target.value)}
                />
            </div>
          )}

          {/* TRAMWAY (Obligatoire) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Arrêt de Tram le plus proche</label>
            <div className="relative">
              <TramFront size={18} className="absolute left-3 top-3 text-gray-400" />
              <select 
                value={tramStop}
                onChange={(e) => setTramStop(e.target.value)}
                className="w-full p-2 pl-10 border rounded-lg appearance-none bg-white outline-none focus:border-blue-500"
              >
                <option value="Ligne 1">🟦 Tram Ligne 1</option>
                <option value="Ligne 2">🟧 Tram Ligne 2</option>
                <option value="Ligne 3">🟩 Tram Ligne 3</option>
                <option value="Ligne 4">🟫 Tram Ligne 4</option>
                <option value="Ligne 5">🟪 Tram Ligne 5 </option>
              </select>
            </div>
          </div>
        </div>

        {/* INFO JAUGE (Non modifiable) */}
        <div className="text-center text-xs text-gray-400">
          ⚠️ Limité automatiquement à 30 personnes max.
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-blue-700 transition active:scale-95 disabled:opacity-50"
        >
          {loading ? 'Création...' : '🚀 Lancer la soirée'}
        </button>

      </form>
    </main>
  )
}