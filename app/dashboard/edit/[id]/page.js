'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, MapPin, TramFront, Calendar, Info, AlignLeft, Type, X, Plus, Users, Save, Trash2, Clock, Globe, Lock } from 'lucide-react'
import Link from 'next/link'

// TRAMWAY DATA
const TRAM_LINES = {
  "Ligne 1": ["Mosson","Stade de la Mosson","Halles de la Paillade","Saint-Paul","Hauts de Massane","Euromédecine","Malbosc – Domaine d’O","Château d’O","Occitanie – Hôpitaux Facultés","Hôpital Lapeyronie","Université Montpellier – Triolet","Saint-Éloi","Boutonnet – Cité des Arts","Stade Philippidès","Albert 1er – Saint-Charles","Louis Blanc – Agora de la Danse","Corum","Comédie","Gare Saint-Roch","Du Guesclin","Antigone","Léon Blum","Place de l’Europe","Rives du Lez","Moularès – Hôtel de Ville","Port Marianne","Millénaire","Place de France","Odysseum","Gare Sud de France"],
  "Ligne 2": ["Saint-Jean-de-Védas Centre","Saint-Jean-le-Sec","La Condamine","Victoire 2","Sabines","Villeneuve d’Angoulême","Croix d’Argent","Mas Drevon","Lemasson","Saint-Cléophas","Nouveau Saint-Roch","Rondelet","Gare Saint-Roch","Comédie","Corum","Beaux-Arts","Jeu de Mail des Abbés","Aiguelongue","Saint-Lazare","Charles de Gaulle","Clairval","La Galine","Centurions","Notre-Dame de Sablassou","Aube Rouge","Via Domitia","Georges Pompidou","Jacou"],
  "Ligne 3": ["Juvignac","Mosson","Celleneuve","Pilory","Hôtel du Département","Pergola","Tonnelles","Jules Guesde","Astruc","Les Arceaux","Plan Cabanes","Gambetta","Observatoire","Gare Saint-Roch – République","Place Carnot","Voltaire","Rives du Lez – Consuls de Mer","Moularès – Hôtel de Ville","Port Marianne","Pablo Picasso","Boirargues","Cougourlude","Lattes Centre","Pérols Étang de l’Or"],
  "Ligne 4": ["Garcia Lorca","Restanque","Saint-Martin","Nouveau Saint-Roch","Rondelet","Gare Saint-Roch – République","Observatoire","Saint-Guilhem – Courreau","Peyrou – Arc de Triomphe","Albert 1er – Cathédrale","Louis Blanc – Agora de la Danse","Corum","Les Aubes","Pompignane","Place de l’Europe","Rives du Lez","Georges Frêche – Hôtel de Ville","La Rauze","Garcia Lorca"],
  "Ligne 5": ["Clapiers","Montferrier-sur-Lez","Agropolis","Plan des 4 Seigneurs","CNRS – Zoo du Lunaret","Pôle Chimie Balard","Université Paul Valéry","Saint-Éloi – Docteur Pezet","Boutonnet – Cité des Arts","Stade Philippidès","Albert 1er – Saint-Charles","Albert 1er – Jardin des Plantes","Peyrou – Arc de Triomphe","Saint-Guilhem – Courreau","Gambetta","Parc Clemenceau","Place du 8 Mai 1945","Cité Créative – Parc Montcalm","Chamberte – Les Roses","Estanove","Yves du Manoir","Ovalie","Parc Bagatelle","Parc Font-Colombe","Parc des Bouisses","Grès de Montpellier"]
};

export default function EditEvent() {
  const router = useRouter()
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  
  const [originalEvent, setOriginalEvent] = useState(null)
  const [currentParticipantsCount, setCurrentParticipantsCount] = useState(0)

  // Formulaire
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [locationType, setLocationType] = useState('public')
  const [locationName, setLocationName] = useState('')
  const [meetingPoint, setMeetingPoint] = useState('')
  
  // Tram
  const [selectedLine, setSelectedLine] = useState('Ligne 1')
  const [selectedStop, setSelectedStop] = useState('')
  const [stopSearch, setStopSearch] = useState('')
  const [showStopSuggestions, setShowStopSuggestions] = useState(false)

  // Advanced
  const [maxParticipants, setMaxParticipants] = useState(30)
  const [tags, setTags] = useState([])
  const [newTagLabel, setNewTagLabel] = useState('')
  const [newTagValue, setNewTagValue] = useState('')
  const [isCancelled, setIsCancelled] = useState(false)

  useEffect(() => {
    checkUserAndEvent()
  }, [])

  async function checkUserAndEvent() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) router.push('/login')
    setUser(user)

    const { data: event, error } = await supabase.from('events').select('*').eq('id', id).single()
    if (error || event.organizer_id !== user.id) {
        alert("Accès interdit.")
        router.push('/dashboard')
        return
    }

    setOriginalEvent(event)
    const { count } = await supabase.from('participants').select('*', { count: 'exact', head: true }).eq('event_id', id)
    setCurrentParticipantsCount(count || 0)

    setTitle(event.title)
    setDescription(event.description || '')
    
    // START TIME
    const startDateObj = new Date(event.start_time)
    setDate(startDateObj.toISOString().split('T')[0])
    setTime(startDateObj.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }))

    // END TIME (Gestion robuste)
    const endDateRaw = event.end_date || event.end_time || new Date(startDateObj.getTime() + 4 * 3600000).toISOString()
    const endDateObj = new Date(endDateRaw)
    setEndTime(endDateObj.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }))

    setLocationType(event.location_type)
    if (event.location_type === 'public') setLocationName(event.location_name)
    else setMeetingPoint(event.meeting_point)

    if (event.tram_stop && event.tram_stop.includes(' - ')) {
        const [l, s] = event.tram_stop.split(' - ')
        setSelectedLine(l)
        setSelectedStop(s)
    } else {
        setSelectedStop(event.tram_stop)
    }

    setMaxParticipants(event.max_participants)
    setTags(event.additional_info || [])
    setIsCancelled(event.is_cancelled)
    setLoading(false)
  }

  const addTag = () => { if (newTagLabel && newTagValue) { setTags([...tags, { label: newTagLabel, value: newTagValue }]); setNewTagLabel(''); setNewTagValue('') } }
  const removeTag = (index) => { setTags(tags.filter((_, i) => i !== index)) }

  const handleUpdate = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (!title || !date || !time || !endTime) throw new Error("Titre, date et horaires (début/fin) requis.")
      if (maxParticipants < currentParticipantsCount) throw new Error(`Impossible de réduire la jauge à ${maxParticipants} car il y a déjà ${currentParticipantsCount} inscrits.`)

      // 1. Calcul Timestamps
      const startDateTime = new Date(`${date}T${time}`)
      let endDateTime = new Date(`${date}T${endTime}`)
      if (endDateTime < startDateTime) endDateTime.setDate(endDateTime.getDate() + 1)

      const startISO = startDateTime.toISOString()
      const endISO = endDateTime.toISOString()
      const tramString = `${selectedLine} - ${selectedStop}`

      // 2. Génération des Logs
      let changes = []
      
      const oldStart = new Date(originalEvent.start_time).toISOString()
      const oldEnd = originalEvent.end_date ? new Date(originalEvent.end_date).toISOString() : null

      if (startISO !== oldStart) changes.push(`🕗 Début : ${new Date(originalEvent.start_time).toLocaleTimeString()} -> ${time}`)
      if (oldEnd && endISO !== oldEnd) changes.push(`🏁 Fin : ${new Date(oldEnd).toLocaleTimeString()} -> ${endTime}`)

      if (locationType !== originalEvent.location_type) changes.push(`📍 Type Lieu changé`)
      if (locationType === 'public' && locationName !== originalEvent.location_name) changes.push(`📍 Lieu changé`)
      if (locationType === 'private' && meetingPoint !== originalEvent.meeting_point) changes.push(`📍 RDV changé`)
      
      if (tramString !== originalEvent.tram_stop) changes.push(`🚃 Tram : "${originalEvent.tram_stop}" -> "${tramString}"`)
      if (maxParticipants !== originalEvent.max_participants) changes.push(`👥 Jauge : ${originalEvent.max_participants} -> ${maxParticipants}`)
      if (title !== originalEvent.title) changes.push(`📝 Titre changé`)
      if (description !== originalEvent.description) changes.push(`📝 Description mise à jour`)

      // --- GESTION ALERTE HORAIRE INTELLIGENTE ---
      // Si l'heure de début OU l'heure de fin change, on déclenche le flag "Horaire Modifié"
      let initialStartTimeToSave = originalEvent.initial_start_time
      const hasTimeChanged = startISO !== oldStart || (oldEnd && endISO !== oldEnd)

      if (hasTimeChanged && !originalEvent.initial_start_time) {
          // On fige l'heure de début originale pour déclencher l'alerte sur le viewer
          initialStartTimeToSave = originalEvent.start_time 
      }

      const { error } = await supabase.from('events').update({
        title, description,
        start_time: startISO, 
        end_time: endISO,
        end_date: endISO, 
        location_type: locationType,
        location_name: locationType === 'public' ? locationName : null,
        meeting_point: locationType === 'private' ? meetingPoint : null,
        tram_stop: tramString,
        max_participants: parseInt(maxParticipants),
        additional_info: tags,
        initial_start_time: initialStartTimeToSave
      }).eq('id', id)

      if (error) throw error

      if (changes.length > 0) {
          await supabase.from('event_logs').insert([{
            event_id: id,
            modified_by: user.id,
            change_type: 'UPDATE',
            details: changes.join('\n')
          }])
      }

      router.push('/dashboard')

    } catch (error) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = async () => {
    if (!confirm("Voulez-vous vraiment ANNULER cet événement ?")) return
    const reason = prompt("Motif de l'annulation (obligatoire) :")
    if (!reason) return

    await supabase.from('events').update({
        is_cancelled: true,
        cancelled_at: new Date().toISOString(),
        cancellation_reason: reason
    }).eq('id', id)
    
    await supabase.from('event_logs').insert([{
        event_id: id, modified_by: user.id, change_type: 'CANCEL', details: `Annulation : ${reason}`
    }])

    router.push('/dashboard')
  }

  const filteredStops = TRAM_LINES[selectedLine]?.filter(stop => stop.toLowerCase().includes(stopSearch.toLowerCase())) || []

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-500">Chargement...</div>

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20 pt-4 transition-colors">
      <div className="flex items-center justify-between px-4 mb-6 max-w-md mx-auto">
        <div className="flex items-center gap-4">
            <Link href="/dashboard" className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2 rounded-full text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"><ArrowLeft size={20} /></Link>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">Modifier</h1>
        </div>
        {!isCancelled && (
            <button type="button" onClick={handleCancel} className="text-red-500 font-bold text-xs bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg border border-red-100 dark:border-red-900 hover:bg-red-100 transition flex items-center gap-2">
                <Trash2 size={14}/> Annuler
            </button>
        )}
      </div>

      <form onSubmit={handleUpdate} className="max-w-md mx-auto px-4 space-y-6">
        
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">
            <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase ml-1 mb-1 block">Titre</label>
                <div className="flex items-center bg-slate-50 dark:bg-slate-800 rounded-xl px-4 border border-transparent focus-within:border-blue-500 transition">
                    <Type size={18} className="text-slate-400 mr-3" />
                    <input type="text" className="w-full py-3 bg-transparent font-bold text-lg text-slate-900 dark:text-white outline-none" value={title} onChange={e => setTitle(e.target.value)} />
                </div>
            </div>
            <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase ml-1 mb-1 block">Description</label>
                <textarea className="w-full bg-slate-50 dark:bg-slate-800 rounded-xl p-4 outline-none text-slate-900 dark:text-white text-sm min-h-[100px] resize-none focus:border focus:border-blue-500 transition" value={description} onChange={e => setDescription(e.target.value)} />
            </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase ml-1">Horaires</label>
            <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center bg-slate-50 dark:bg-slate-800 rounded-xl px-4 py-3">
                    <Calendar size={18} className="text-slate-400 mr-3" />
                    <input type="date" className="bg-transparent font-medium text-slate-900 dark:text-white outline-none w-full" value={date} onChange={e => setDate(e.target.value)} />
                </div>
                <div className="flex gap-3">
                    <div className="flex-1 relative bg-slate-50 dark:bg-slate-800 rounded-xl px-3 py-3 flex items-center">
                        <Clock size={18} className="text-blue-500 mr-2" />
                        <input type="time" className="bg-transparent font-bold text-slate-900 dark:text-white outline-none w-full text-center" value={time} onChange={e => setTime(e.target.value)} />
                        <span className="absolute top-1 right-2 text-[10px] text-slate-400 font-bold">DÉBUT</span>
                    </div>
                    <div className="flex-1 relative bg-slate-50 dark:bg-slate-800 rounded-xl px-3 py-3 flex items-center">
                        <Clock size={18} className="text-slate-400 mr-2" />
                        <input type="time" className="bg-transparent font-bold text-slate-900 dark:text-white outline-none w-full text-center" value={endTime} onChange={e => setEndTime(e.target.value)} />
                        <span className="absolute top-1 right-2 text-[10px] text-slate-400 font-bold">FIN</span>
                    </div>
                </div>
            </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">
             <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                <button type="button" onClick={() => setLocationType('public')} className={`flex-1 py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 ${locationType === 'public' ? 'bg-white dark:bg-slate-700 shadow text-blue-600 dark:text-blue-300' : 'text-slate-500'}`}><Globe size={14}/> Public</button>
                <button type="button" onClick={() => setLocationType('private')} className={`flex-1 py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 ${locationType === 'private' ? 'bg-white dark:bg-slate-700 shadow text-purple-600 dark:text-purple-300' : 'text-slate-500'}`}><Lock size={14}/> Privé</button>
             </div>
             <div className="flex items-center bg-slate-50 dark:bg-slate-800 rounded-xl px-4 border border-transparent focus-within:border-blue-500 transition">
                <MapPin size={18} className="text-slate-400 mr-3" />
                <input type="text" placeholder={locationType === 'public' ? "Nom du lieu..." : "Point de RDV..."} className="w-full py-3 bg-transparent text-sm text-slate-900 dark:text-white outline-none" value={locationType === 'public' ? locationName : meetingPoint} onChange={e => locationType === 'public' ? setLocationName(e.target.value) : setMeetingPoint(e.target.value)} />
             </div>
             <div className="flex gap-2">
                <div className="w-1/3 relative bg-slate-50 dark:bg-slate-800 rounded-xl">
                    <select value={selectedLine} onChange={(e) => { setSelectedLine(e.target.value); setSelectedStop(''); setStopSearch('') }} className="w-full h-full bg-transparent font-bold text-xs text-center text-slate-900 dark:text-white outline-none appearance-none pl-2 rounded-xl">
                        {Object.keys(TRAM_LINES).map(line => <option key={line} value={line}>{line}</option>)}
                    </select>
                </div>
                <div className="flex-1 relative">
                    <div className="flex items-center bg-slate-50 dark:bg-slate-800 rounded-xl px-3">
                        <TramFront size={18} className="text-slate-400 mr-2" />
                        <input type="text" placeholder="Arrêt..." className="w-full py-3 bg-transparent text-sm text-slate-900 dark:text-white outline-none" value={selectedStop || stopSearch} onChange={(e) => { setStopSearch(e.target.value); setSelectedStop(''); setShowStopSuggestions(true) }} onFocus={() => setShowStopSuggestions(true)} />
                        {selectedStop && <button type="button" onClick={() => {setSelectedStop(''); setStopSearch('')}}><X size={14} className="text-slate-400"/></button>}
                    </div>
                    {showStopSuggestions && !selectedStop && (
                        <div className="absolute top-full left-0 w-full mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-20 max-h-48 overflow-y-auto">
                            {filteredStops.map(stop => (
                                <button key={stop} type="button" onClick={() => { setSelectedStop(stop); setShowStopSuggestions(false) }} className="w-full text-left px-4 py-3 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition border-b border-slate-50 dark:border-slate-800 last:border-0">
                                    {stop}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
             </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-3">
             <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase ml-1">Infos Pratiques</label>
             <div className="flex flex-wrap gap-2">
                {tags.map((tag, i) => (
                    <span key={i} className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs px-2 py-1 rounded border border-blue-100 dark:border-blue-800 flex items-center gap-1 font-medium">
                        {tag.label}: {tag.value}
                        <button type="button" onClick={() => removeTag(i)} className="hover:text-red-500 transition"><X size={12}/></button>
                    </span>
                ))}
            </div>
            <div className="flex gap-2">
                <input type="text" placeholder="Label" className="w-1/3 p-2 bg-slate-50 dark:bg-slate-800 rounded text-xs text-slate-900 dark:text-white outline-none" value={newTagLabel} onChange={e => setNewTagLabel(e.target.value)} />
                <input type="text" placeholder="Valeur" className="flex-1 p-2 bg-slate-50 dark:bg-slate-800 rounded text-xs text-slate-900 dark:text-white outline-none" value={newTagValue} onChange={e => setNewTagValue(e.target.value)} />
                <button type="button" onClick={addTag} className="bg-slate-200 dark:bg-slate-700 p-2 rounded text-slate-600 dark:text-slate-300 hover:bg-blue-500 hover:text-white transition"><Plus size={16}/></button>
            </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 flex justify-between items-center">
             <div className="text-sm dark:text-white">
                <p className="font-bold flex items-center gap-2"><Users size={18} className="text-slate-400"/> Jauge Max</p>
                <p className="text-xs text-slate-500 mt-1">Minimum autorisé : {currentParticipantsCount} (inscrits)</p>
             </div>
             <div className="flex items-center bg-slate-50 dark:bg-slate-800 rounded-xl px-2">
                <button type="button" onClick={() => setMaxParticipants(Math.max(currentParticipantsCount, maxParticipants - 1))} className="p-2 text-slate-400 hover:text-blue-500 transition">-</button>
                <input type="number" className="w-12 text-center bg-transparent font-bold text-slate-900 dark:text-white outline-none" value={maxParticipants} onChange={e => setMaxParticipants(parseInt(e.target.value))} />
                <button type="button" onClick={() => setMaxParticipants(Math.min(30, maxParticipants + 1))} className="p-2 text-slate-400 hover:text-blue-500 transition">+</button>
             </div>
        </div>

        <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30 transition">
            <Save size={20} /> Enregistrer les modifications
        </button>

      </form>
    </main>
  )
}