'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { ArrowLeft, MapPin, TramFront, Calendar, Info, AlignLeft, Type, ChevronDown, Plus, X, Users, Tag } from 'lucide-react'
import Link from 'next/link'

// --- DONNÉES TRAMWAY (Statique pour l'instant) ---
const TRAM_LINES = {
  "Ligne 1": ["Mosson","Stade de la Mosson","Halles de la Paillade","Saint-Paul","Hauts de Massane","Euromédecine","Malbosc – Domaine d’O","Château d’O","Occitanie – Hôpitaux Facultés","Hôpital Lapeyronie","Université Montpellier – Triolet","Saint-Éloi","Boutonnet – Cité des Arts","Stade Philippidès","Albert 1er – Saint-Charles","Louis Blanc – Agora de la Danse","Corum","Comédie","Gare Saint-Roch","Du Guesclin","Antigone","Léon Blum","Place de l’Europe","Rives du Lez","Moularès – Hôtel de Ville","Port Marianne","Millénaire","Place de France","Odysseum","Gare Sud de France"],
  "Ligne 2": ["Saint-Jean-de-Védas Centre","Saint-Jean-le-Sec","La Condamine","Victoire 2","Sabines","Villeneuve d’Angoulême","Croix d’Argent","Mas Drevon","Lemasson","Saint-Cléophas","Nouveau Saint-Roch","Rondelet","Gare Saint-Roch","Comédie","Corum","Beaux-Arts","Jeu de Mail des Abbés","Aiguelongue","Saint-Lazare","Charles de Gaulle","Clairval","La Galine","Centurions","Notre-Dame de Sablassou","Aube Rouge","Via Domitia","Georges Pompidou","Jacou"],
  "Ligne 3": ["Juvignac","Mosson","Celleneuve","Pilory","Hôtel du Département","Pergola","Tonnelles","Jules Guesde","Astruc","Les Arceaux","Plan Cabanes","Gambetta","Observatoire","Gare Saint-Roch – République","Place Carnot","Voltaire","Rives du Lez – Consuls de Mer","Moularès – Hôtel de Ville","Port Marianne","Pablo Picasso","Boirargues","Cougourlude","Lattes Centre","Pérols Étang de l’Or"],
  "Ligne 4": ["Garcia Lorca","Restanque","Saint-Martin","Nouveau Saint-Roch","Rondelet","Gare Saint-Roch – République","Observatoire","Saint-Guilhem – Courreau","Peyrou – Arc de Triomphe","Albert 1er – Cathédrale","Louis Blanc – Agora de la Danse","Corum","Les Aubes","Pompignane","Place de l’Europe","Rives du Lez","Georges Frêche – Hôtel de Ville","La Rauze","Garcia Lorca"],
  "Ligne 5": ["Clapiers","Montferrier-sur-Lez","Agropolis","Plan des 4 Seigneurs","CNRS – Zoo du Lunaret","Pôle Chimie Balard","Université Paul Valéry","Saint-Éloi – Docteur Pezet","Boutonnet – Cité des Arts","Stade Philippidès","Albert 1er – Saint-Charles","Albert 1er – Jardin des Plantes","Peyrou – Arc de Triomphe","Saint-Guilhem – Courreau","Gambetta","Parc Clemenceau","Place du 8 Mai 1945","Cité Créative – Parc Montcalm","Chamberte – Les Roses","Estanove","Yves du Manoir","Ovalie","Parc Bagatelle","Parc Font-Colombe","Parc des Bouisses","Grès de Montpellier"]
};


export default function CreateEvent() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState(null)

  // Formulaire
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [locationType, setLocationType] = useState('public')
  const [locationName, setLocationName] = useState('')
  const [meetingPoint, setMeetingPoint] = useState('')
  
  // TRAMWAY 2.0
  const [selectedLine, setSelectedLine] = useState('Ligne 1')
  const [selectedStop, setSelectedStop] = useState('')
  const [stopSearch, setStopSearch] = useState('')
  const [showStopSuggestions, setShowStopSuggestions] = useState(false)

  // MEMBERS LIMIT & TAGS
  const [maxParticipants, setMaxParticipants] = useState(30)
  const [tags, setTags] = useState([]) // [{ label: 'Dress Code', value: 'Chic' }]
  const [newTagLabel, setNewTagLabel] = useState('')
  const [newTagValue, setNewTagValue] = useState('')

  useEffect(() => {
    checkUser()
  }, [])

  async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) router.push('/login')
    setUser(user)
  }

  // Gestion des Tags
  const addTag = () => {
    if (newTagLabel && newTagValue) {
      setTags([...tags, { label: newTagLabel, value: newTagValue }])
      setNewTagLabel('')
      setNewTagValue('')
    }
  }
  const removeTag = (index) => {
    setTags(tags.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (!title || !date || !time) throw new Error("Titre, date et heure obligatoires.")
      if (locationType === 'private' && !meetingPoint) throw new Error("Point de RDV obligatoire pour lieu privé.")
      if (!selectedStop) throw new Error("Merci de sélectionner un arrêt de tram.")

      const startDateTime = new Date(`${date}T${time}`).toISOString()
      const endDateTime = new Date(new Date(`${date}T${time}`).getTime() + 5 * 60 * 60 * 1000).toISOString()

      const { error } = await supabase.from('events').insert([{
        title,
        description,
        start_time: startDateTime,
        end_time: endDateTime,
        organizer_id: user.id,
        location_type: locationType,
        location_name: locationType === 'public' ? locationName : null,
        meeting_point: locationType === 'private' ? meetingPoint : null,
        tram_stop: `${selectedLine} - ${selectedStop}`, // On combine pour la base
        max_participants: parseInt(maxParticipants), 
        additional_info: tags, // On sauvegarde le "Forum"
        is_visible: true
      }])

      if (error) throw error
      router.push('/dashboard')

    } catch (error) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  // Filtrage des arrêts pour l'autocomplétion
  const filteredStops = TRAM_LINES[selectedLine]?.filter(stop => 
    stop.toLowerCase().includes(stopSearch.toLowerCase())
  ) || []

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20 transition-colors pt-4">
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
                <input type="text" required placeholder="Titre (ex: Anniv Thomas)" className="w-full py-4 bg-transparent outline-none text-slate-900 dark:text-white font-bold" value={title} onChange={e => setTitle(e.target.value)} />
            </div>
          </div>
          <div>
            <div className="flex items-start bg-slate-50 dark:bg-slate-800 rounded-xl px-4 py-3 border border-transparent focus-within:border-blue-500 transition">
                <AlignLeft size={18} className="text-slate-400 mr-3 mt-1 shrink-0" />
                <textarea placeholder="Description..." className="w-full bg-transparent outline-none text-slate-900 dark:text-white min-h-[80px] resize-none" value={description} onChange={e => setDescription(e.target.value)} />
            </div>
          </div>
        </div>

        {/* DATE & HEURE */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-5">
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-[-10px] ml-1">Quand ?</label>
            <div className="flex gap-4">
                <div className="flex-1 bg-slate-50 dark:bg-slate-800 rounded-xl px-4 py-3 border border-transparent focus-within:border-blue-500 flex items-center">
                    <Calendar size={18} className="text-slate-400 mr-3 shrink-0" />
                    <input type="date" required className="w-full bg-transparent outline-none text-slate-900 dark:text-white font-medium" value={date} onChange={e => setDate(e.target.value)} />
                </div>
                <div className="w-1/3 bg-slate-50 dark:bg-slate-800 rounded-xl px-4 py-3 border border-transparent focus-within:border-blue-500 flex items-center">
                    <input type="time" required className="w-full bg-transparent outline-none text-slate-900 dark:text-white font-medium text-center" value={time} onChange={e => setTime(e.target.value)} />
                </div>
            </div>
        </div>

        {/* LIEU & TRANSPORT (TRAMWAY 2.0) */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-6">
          
          {/* Public / Privé (inchangé) */}
          <div className="grid grid-cols-2 gap-3">
             {/* ... Boutons Public/Privé comme avant ... */}
             <button type="button" onClick={() => setLocationType('public')} className={`p-4 rounded-2xl text-sm font-bold transition flex flex-col items-center gap-2 ${locationType === 'public' ? 'bg-blue-50 dark:bg-blue-900/30 border-2 border-blue-500 text-blue-700 dark:text-blue-300' : 'bg-slate-50 dark:bg-slate-800 border-2 border-transparent text-slate-500'}`}><MapPin size={24} />Lieu Public</button>
             <button type="button" onClick={() => setLocationType('private')} className={`p-4 rounded-2xl text-sm font-bold transition flex flex-col items-center gap-2 ${locationType === 'private' ? 'bg-purple-50 dark:bg-purple-900/30 border-2 border-purple-500 text-purple-700 dark:text-purple-300' : 'bg-slate-50 dark:bg-slate-800 border-2 border-transparent text-slate-500'}`}><Info size={24} />Lieu Privé</button>
          </div>

          {locationType === 'public' ? (
             <div className="flex items-center bg-slate-50 dark:bg-slate-800 rounded-xl px-4 border border-transparent focus-within:border-blue-500 transition">
                <MapPin size={18} className="text-slate-400 mr-3" />
                <input type="text" placeholder="Nom du lieu..." className="w-full py-4 bg-transparent outline-none text-slate-900 dark:text-white" value={locationName} onChange={e => setLocationName(e.target.value)} />
             </div>
          ) : (
             <div className="flex items-center bg-slate-50 dark:bg-slate-800 rounded-xl px-4 border border-transparent focus-within:border-purple-500 transition">
                 <MapPin size={18} className="text-slate-400 mr-3" />
                 <input type="text" required placeholder="Point de RDV public..." className="w-full py-4 bg-transparent outline-none text-slate-900 dark:text-white" value={meetingPoint} onChange={e => setMeetingPoint(e.target.value)} />
             </div>
          )}

          {/* SÉLECTEUR TRAMWAY 2.0 */}
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2 ml-1">Accès Tram</label>
            <div className="flex gap-2">
                {/* Sélecteur Ligne */}
                <div className="w-1/3 relative bg-slate-50 dark:bg-slate-800 rounded-xl border border-transparent focus-within:border-blue-500 transition">
                    <select value={selectedLine} onChange={(e) => { setSelectedLine(e.target.value); setSelectedStop(''); setStopSearch('') }} className="w-full h-full bg-transparent appearance-none outline-none text-slate-900 dark:text-white font-bold text-center pl-2 rounded-xl cursor-pointer">
                        {Object.keys(TRAM_LINES).map(line => <option key={line} value={line} className="dark:bg-slate-900">{line}</option>)}
                    </select>
                </div>
                
                {/* Recherche Arrêt */}
                <div className="flex-1 relative">
                    <div className="flex items-center bg-slate-50 dark:bg-slate-800 rounded-xl px-4 border border-transparent focus-within:border-blue-500 transition h-full">
                        <TramFront size={18} className="text-slate-400 mr-2 shrink-0" />
                        <input 
                            type="text" 
                            placeholder="Rechercher arrêt..." 
                            className="w-full py-4 bg-transparent outline-none text-slate-900 dark:text-white font-medium text-sm"
                            value={selectedStop || stopSearch}
                            onChange={(e) => { setStopSearch(e.target.value); setSelectedStop(''); setShowStopSuggestions(true) }}
                            onFocus={() => setShowStopSuggestions(true)}
                        />
                         {selectedStop && <button type="button" onClick={() => {setSelectedStop(''); setStopSearch('')}}><X size={14} className="text-slate-400"/></button>}
                    </div>

                    {/* Dropdown Suggestions */}
                    {showStopSuggestions && !selectedStop && (
                        <div className="absolute top-full left-0 w-full mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-20 max-h-48 overflow-y-auto">
                            {filteredStops.length > 0 ? filteredStops.map(stop => (
                                <button key={stop} type="button" onClick={() => { setSelectedStop(stop); setShowStopSuggestions(false) }} className="w-full text-left px-4 py-3 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition border-b border-slate-50 dark:border-slate-800 last:border-0">
                                    {stop}
                                </button>
                            )) : (
                                <div className="p-4 text-xs text-slate-400 text-center">Aucun arrêt trouvé sur {selectedLine}</div>
                            )}
                        </div>
                    )}
                </div>
            </div>
          </div>
        </div>

        {/* FORUM (INFOS CLÉS) */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase ml-1">Infos Pratiques (Forum)</label>
            
            {/* Liste des tags */}
            <div className="flex flex-wrap gap-2 mb-2">
                {tags.map((tag, i) => (
                    <span key={i} className="inline-flex items-center gap-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-bold px-2 py-1 rounded-lg border border-blue-100 dark:border-blue-800">
                        {tag.label}: {tag.value}
                        <button type="button" onClick={() => removeTag(i)} className="ml-1 hover:text-red-500"><X size={12}/></button>
                    </span>
                ))}
            </div>

            {/* Ajout Tag */}
            <div className="flex gap-2">
                <input type="text" placeholder="Label (ex: PAF)" className="w-1/3 bg-slate-50 dark:bg-slate-800 rounded-xl px-3 py-2 text-sm outline-none dark:text-white" value={newTagLabel} onChange={e => setNewTagLabel(e.target.value)} />
                <input type="text" placeholder="Valeur (ex: 5€)" className="flex-1 bg-slate-50 dark:bg-slate-800 rounded-xl px-3 py-2 text-sm outline-none dark:text-white" value={newTagValue} onChange={e => setNewTagValue(e.target.value)} />
                <button type="button" onClick={addTag} className="bg-slate-200 dark:bg-slate-700 p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-blue-500 hover:text-white transition"><Plus size={20}/></button>
            </div>
        </div>

        {/* JAUGE MODIFIABLE */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <Users size={20} className="text-slate-400" />
                <span className="font-bold text-slate-700 dark:text-slate-300 text-sm">Limite participants</span>
            </div>
            <div className="flex items-center bg-slate-50 dark:bg-slate-800 rounded-xl px-2">
                <button type="button" onClick={() => setMaxParticipants(Math.max(1, maxParticipants - 1))} className="p-2 text-slate-400 hover:text-blue-500">-</button>
                <input 
                    type="number" min="1" max="30"
                    className="w-12 bg-transparent text-center font-bold text-slate-900 dark:text-white outline-none"
                    value={maxParticipants} onChange={(e) => setMaxParticipants(parseInt(e.target.value) || 0)}
                />
                <button type="button" onClick={() => setMaxParticipants(maxParticipants + 1)} className="p-2 text-slate-400 hover:text-blue-500">+</button>
            </div>
        </div>

        <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/30 hover:scale-[1.02] active:scale-95 transition-transform disabled:opacity-50">
          {loading ? 'Création...' : '🚀 Lancer la soirée'}
        </button>
      </form>
    </main>
  )
}