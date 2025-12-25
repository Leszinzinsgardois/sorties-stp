'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, MapPin, TramFront, Calendar, Info, AlignLeft, Type, X, Plus, Users, Save, Trash2 } from 'lucide-react'
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
  
  // Données originales pour comparaison
  const [originalEvent, setOriginalEvent] = useState(null)
  const [currentParticipantsCount, setCurrentParticipantsCount] = useState(0)

  // Formulaire
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
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

    // Récup event + Compte participants
    const { data: event, error } = await supabase.from('events').select('*').eq('id', id).single()
    if (error || event.organizer_id !== user.id) {
        alert("Accès interdit.")
        router.push('/dashboard')
        return
    }

    setOriginalEvent(event) // Sauvegarde de l'état initial pour le diff

    const { count } = await supabase.from('participants').select('*', { count: 'exact', head: true }).eq('event_id', id)
    setCurrentParticipantsCount(count || 0)

    // Remplissage form
    setTitle(event.title)
    setDescription(event.description || '')
    
    const d = new Date(event.start_time)
    setDate(d.toISOString().split('T')[0])
    setTime(d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }))

    setLocationType(event.location_type)
    if (event.location_type === 'public') setLocationName(event.location_name)
    else setMeetingPoint(event.meeting_point)

    // Parsing Tram
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

  // Tags Logic
  const addTag = () => { if (newTagLabel && newTagValue) { setTags([...tags, { label: newTagLabel, value: newTagValue }]); setNewTagLabel(''); setNewTagValue('') } }
  const removeTag = (index) => { setTags(tags.filter((_, i) => i !== index)) }

  const handleUpdate = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (!title || !date || !time) throw new Error("Titre, date et heure requis.")
      
      if (maxParticipants < currentParticipantsCount) {
        throw new Error(`Impossible de réduire la jauge à ${maxParticipants} car il y a déjà ${currentParticipantsCount} inscrits.`)
      }

      const startDateTime = new Date(`${date}T${time}`).toISOString()
      const endDateTime = new Date(new Date(`${date}T${time}`).getTime() + 5 * 60 * 60 * 1000).toISOString()
      const tramString = `${selectedLine} - ${selectedStop}`

      // --- GÉNÉRATION DU LOG DÉTAILLÉ (DIFF) ---
      let changes = []
      
      // Comparaison Horaire
      const oldTime = new Date(originalEvent.start_time).toISOString()
      if (startDateTime !== oldTime) {
         changes.push(`🕗 Horaire : ${new Date(originalEvent.start_time).toLocaleString()} -> ${new Date(startDateTime).toLocaleString()}`)
      }

      // Comparaison Lieu
      if (locationType !== originalEvent.location_type) changes.push(`📍 Type Lieu : ${originalEvent.location_type} -> ${locationType}`)
      if (locationType === 'public' && locationName !== originalEvent.location_name) changes.push(`📍 Lieu : "${originalEvent.location_name}" -> "${locationName}"`)
      if (locationType === 'private' && meetingPoint !== originalEvent.meeting_point) changes.push(`📍 RDV : "${originalEvent.meeting_point}" -> "${meetingPoint}"`)
      
      // Comparaison Tram
      if (tramString !== originalEvent.tram_stop) changes.push(`🚃 Tram : "${originalEvent.tram_stop}" -> "${tramString}"`)
      
      // Comparaison Jauge
      if (maxParticipants !== originalEvent.max_participants) changes.push(`👥 Jauge : ${originalEvent.max_participants} -> ${maxParticipants}`)
      
      // --- MODIF ICI : Comparaison Titre/Desc détaillée ---
      if (title !== originalEvent.title) {
          changes.push(`📝 Titre : "${originalEvent.title}" -> "${title}"`)
      }
      if (description !== originalEvent.description) {
          // On structure la description sur plusieurs lignes pour la lisibilité
          changes.push(`📝 Description :\n   AVANT : "${originalEvent.description || ''}"\n   APRÈS : "${description}"`)
      }

      // --- GESTION ALERTE HORAIRE ---
      // Si l'horaire change, on sauvegarde l'horaire ORIGINAL dans 'initial_start_time' 
      // (seulement si c'est la première modif d'horaire, sinon on garde le tout premier)
      let initialStartTimeToSave = originalEvent.initial_start_time
      if (startDateTime !== oldTime && !originalEvent.initial_start_time) {
          initialStartTimeToSave = originalEvent.start_time // On fige l'heure originale
      }

      // 1. UPDATE EVENT
      const { error } = await supabase.from('events').update({
        title, description,
        start_time: startDateTime, end_time: endDateTime,
        location_type: locationType,
        location_name: locationType === 'public' ? locationName : null,
        meeting_point: locationType === 'private' ? meetingPoint : null,
        tram_stop: tramString,
        max_participants: parseInt(maxParticipants),
        additional_info: tags,
        initial_start_time: initialStartTimeToSave
      }).eq('id', id)

      if (error) throw error

      // 2. LOG DANS event_logs (Si changements détectés)
      if (changes.length > 0) {
          await supabase.from('event_logs').insert([{
            event_id: id,
            modified_by: user.id,
            change_type: 'UPDATE',
            details: changes.join('\n') // Stocke tout le détail ligne par ligne
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
    
    // Log l'annulation
    await supabase.from('event_logs').insert([{
        event_id: id,
        modified_by: user.id,
        change_type: 'CANCEL',
        details: `Annulation pour motif : ${reason}`
    }])

    router.push('/dashboard')
  }

  // Helper pour recherche tram
  const filteredStops = TRAM_LINES[selectedLine]?.filter(stop => stop.toLowerCase().includes(stopSearch.toLowerCase())) || []

  if (loading) return <div className="min-h-screen flex items-center justify-center dark:bg-slate-950 dark:text-white">Chargement...</div>

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20 pt-4">
      {/* HEADER SIMPLIFIÉ */}
      <div className="flex items-center justify-between px-4 mb-6">
        <div className="flex items-center gap-4">
            <Link href="/dashboard" className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2 rounded-full text-slate-700 dark:text-slate-200"><ArrowLeft size={20} /></Link>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">Modifier</h1>
        </div>
        {!isCancelled && (
            <button type="button" onClick={handleCancel} className="text-red-500 font-bold text-xs bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg border border-red-100 dark:border-red-900">
                Annuler l'événement
            </button>
        )}
      </div>

      <form onSubmit={handleUpdate} className="max-w-md mx-auto px-4 space-y-6">
        
        {/* TITRE & DESC */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">
            <input type="text" className="w-full bg-transparent font-bold text-lg dark:text-white outline-none" value={title} onChange={e => setTitle(e.target.value)} />
            <textarea className="w-full bg-transparent outline-none dark:text-white text-sm" value={description} onChange={e => setDescription(e.target.value)} />
        </div>

        {/* DATE/HEURE */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 flex gap-4">
            <input type="date" className="bg-transparent font-bold dark:text-white outline-none" value={date} onChange={e => setDate(e.target.value)} />
            <input type="time" className="bg-transparent font-bold dark:text-white outline-none" value={time} onChange={e => setTime(e.target.value)} />
        </div>

        {/* TRAMWAY & LIEU */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">
             {/* Sélecteur Tram */}
             <div className="flex gap-2">
                <select value={selectedLine} onChange={(e) => { setSelectedLine(e.target.value); setSelectedStop(''); setStopSearch('') }} className="w-1/3 bg-slate-50 dark:bg-slate-800 rounded-xl font-bold text-xs text-center dark:text-white">
                    {Object.keys(TRAM_LINES).map(line => <option key={line} value={line}>{line}</option>)}
                </select>
                <div className="flex-1 relative">
                    <input type="text" placeholder="Arrêt..." className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-sm dark:text-white" value={selectedStop || stopSearch} onChange={(e) => { setStopSearch(e.target.value); setSelectedStop(''); setShowStopSuggestions(true) }} onFocus={() => setShowStopSuggestions(true)} />
                    {showStopSuggestions && !selectedStop && (
                        <div className="absolute top-full w-full bg-white dark:bg-slate-900 border z-20 max-h-32 overflow-y-auto">
                            {filteredStops.map(stop => <div key={stop} onClick={() => { setSelectedStop(stop); setShowStopSuggestions(false) }} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer text-sm dark:text-white">{stop}</div>)}
                        </div>
                    )}
                </div>
             </div>
             {/* Nom du lieu */}
             <input type="text" placeholder="Lieu..." className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-sm dark:text-white" value={locationType === 'public' ? locationName : meetingPoint} onChange={e => locationType === 'public' ? setLocationName(e.target.value) : setMeetingPoint(e.target.value)} />
        </div>

        {/* FORUM (TAGS) */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-3">
             <label className="text-xs font-bold text-slate-500 uppercase">Infos Pratiques</label>
             <div className="flex flex-wrap gap-2">
                {tags.map((tag, i) => (
                    <span key={i} className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs px-2 py-1 rounded border border-blue-100 dark:border-blue-800 flex items-center gap-1">
                        {tag.label}: {tag.value}
                        <button type="button" onClick={() => removeTag(i)}><X size={10}/></button>
                    </span>
                ))}
            </div>
            <div className="flex gap-2">
                <input type="text" placeholder="Label" className="w-1/3 p-2 bg-slate-50 dark:bg-slate-800 rounded text-xs dark:text-white" value={newTagLabel} onChange={e => setNewTagLabel(e.target.value)} />
                <input type="text" placeholder="Valeur" className="flex-1 p-2 bg-slate-50 dark:bg-slate-800 rounded text-xs dark:text-white" value={newTagValue} onChange={e => setNewTagValue(e.target.value)} />
                <button type="button" onClick={addTag} className="bg-slate-200 dark:bg-slate-700 p-2 rounded text-slate-600 dark:text-white"><Plus size={16}/></button>
            </div>
        </div>

        {/* JAUGE (Avec affichage du min) */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 flex justify-between items-center">
             <div className="text-sm dark:text-white">
                <p className="font-bold">Jauge Max</p>
                <p className="text-xs text-slate-500">Min: {currentParticipantsCount} (inscrits)</p>
             </div>
             <input type="number" className="w-16 text-center bg-slate-50 dark:bg-slate-800 rounded-lg p-2 font-bold dark:text-white" value={maxParticipants} onChange={e => setMaxParticipants(parseInt(e.target.value))} />
        </div>

        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2">
            <Save size={20} /> Enregistrer
        </button>

      </form>
    </main>
  )
}