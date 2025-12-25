'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  Building2, Save, Trash2, ArrowLeft, 
  MapPin, Globe, Mail, BadgeCheck, 
  AlertTriangle, Calendar, Megaphone, Plus, X 
} from 'lucide-react'

export default function AdminPartnerDetail() {
  const { id } = useParams()
  const router = useRouter()
  const [partner, setPartner] = useState(null)
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  
  // États pour le formulaire Institution
  const [formData, setFormData] = useState({})
  
  // États pour le formulaire Événement (Modal)
  const [showEventModal, setShowEventModal] = useState(false)
  const [editingEvent, setEditingEvent] = useState(null) // null = create, obj = edit
  const [eventForm, setEventForm] = useState({ title: '', type: 'event', status: 'active' })

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    // 1. Récupérer l'Institution
    const { data: inst } = await supabase.from('institutions').select('*').eq('id', id).single()
    if (inst) {
        setPartner(inst)
        setFormData(inst)
    }

    // 2. Récupérer ses Événements (Enfants)
    const { data: evts } = await supabase.from('institutional_events').select('*').eq('institution_id', id).order('created_at', { ascending: false })
    if (evts) setEvents(evts)
    
    setLoading(false)
  }

  // --- LOGIQUE INSTITUTION ---
  async function updatePartner() {
    const { error } = await supabase.from('institutions').update(formData).eq('id', id)
    if (error) alert("Erreur update: " + error.message)
    else alert("Modifications enregistrées ✅")
  }

  async function deletePartner() {
    if (!confirm("ATTENTION: Cela supprimera l'entreprise ET tous ses événements. Continuer ?")) return
    await supabase.from('institutions').delete().eq('id', id)
    router.push('/admin/partners')
  }

  // --- LOGIQUE ÉVÉNEMENTS (Parent/Enfant) ---
  function openEventModal(event = null) {
      if (event) {
          setEditingEvent(event)
          setEventForm(event)
      } else {
          setEditingEvent(null)
          setEventForm({ title: '', type: 'event', status: 'active', institution_id: id })
      }
      setShowEventModal(true)
  }

  async function saveEvent() {
      const payload = { ...eventForm, institution_id: id } // Force le lien parent
      
      let error
      if (editingEvent) {
          // Update
          const res = await supabase.from('institutional_events').update(payload).eq('id', editingEvent.id)
          error = res.error
      } else {
          // Create
          const res = await supabase.from('institutional_events').insert([payload])
          error = res.error
      }

      if (error) alert("Erreur save event: " + error.message)
      else {
          setShowEventModal(false)
          fetchData() // Rafraîchir la liste
      }
  }

  async function deleteEvent(eventId) {
      if(!confirm("Supprimer cette publication ?")) return
      await supabase.from('institutional_events').delete().eq('id', eventId)
      fetchData()
  }

  if (loading) return <div className="p-10 text-white">Chargement...</div>

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20 transition-colors">
      
      {/* HEADER */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-6 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-4">
                <Link href="/admin/partners" className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"><ArrowLeft size={20}/></Link>
                <div>
                    <h1 className="text-xl font-black text-slate-900 dark:text-white">{formData.name}</h1>
                    <p className="text-xs text-slate-500 font-mono">{id}</p>
                </div>
            </div>
            <div className="flex gap-2">
                <button onClick={deletePartner} className="bg-red-50 text-red-600 p-2 rounded-lg hover:bg-red-100"><Trash2 size={20}/></button>
                <button onClick={updatePartner} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-blue-700"><Save size={20}/> Sauvegarder</button>
            </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* COLONNE GAUCHE : INFOS INSTITUTION */}
        <div className="lg:col-span-1 space-y-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
                <h2 className="font-bold text-slate-900 dark:text-white flex items-center gap-2"><Building2 size={18}/> Fiche Identité</h2>
                
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase">Nom</label>
                    <input type="text" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-sm dark:text-white" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase">Type</label>
                    <select className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-sm dark:text-white" value={formData.type || 'private'} onChange={e => setFormData({...formData, type: e.target.value})}>
                        <option value="private">Privé (Bar/Boîte)</option>
                        <option value="public">Public (Mairie)</option>
                        <option value="association">Association</option>
                    </select>
                </div>
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase">Description</label>
                    <textarea className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-sm dark:text-white min-h-[100px]" value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} />
                </div>
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase">Logo URL</label>
                    <input type="text" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-sm dark:text-white" value={formData.logo_url || ''} onChange={e => setFormData({...formData, logo_url: e.target.value})} />
                </div>
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase">Site Web</label>
                    <div className="flex items-center gap-2">
                        <Globe size={16} className="text-slate-400"/>
                        <input type="text" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-sm dark:text-white" value={formData.website || ''} onChange={e => setFormData({...formData, website: e.target.value})} />
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
                <h2 className="font-bold text-slate-900 dark:text-white flex items-center gap-2"><BadgeCheck size={18} className="text-blue-500"/> Statut & Admin</h2>
                
                <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-300">Partenaire Certifié</span>
                    <input type="checkbox" className="w-5 h-5 rounded" checked={formData.is_partner || false} onChange={e => setFormData({...formData, is_partner: e.target.checked})} />
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-300">Identité Vérifiée</span>
                    <input type="checkbox" className="w-5 h-5 rounded" checked={formData.is_verified || false} onChange={e => setFormData({...formData, is_verified: e.target.checked})} />
                </div>
                
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase">État du compte</label>
                    <select className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-sm dark:text-white" value={formData.status || 'beta'} onChange={e => setFormData({...formData, status: e.target.value})}>
                        <option value="beta">Bêta / Simulation</option>
                        <option value="active">Actif</option>
                        <option value="suspended">Suspendu</option>
                    </select>
                </div>
            </div>
        </div>

        {/* COLONNE DROITE : GESTION DES ÉVÉNEMENTS */}
        <div className="lg:col-span-2">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 min-h-[500px]">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="font-bold text-slate-900 dark:text-white flex items-center gap-2"><Megaphone size={18} className="text-purple-500"/> Publications ({events.length})</h2>
                    <button onClick={() => openEventModal()} className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-slate-200 dark:hover:bg-slate-700"><Plus size={16}/> Ajouter</button>
                </div>

                <div className="space-y-3">
                    {events.map(event => (
                        <div key={event.id} className="flex items-start justify-between bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-100 dark:border-slate-800 group">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${event.type === 'promotion' ? 'bg-orange-100 text-orange-600' : 'bg-purple-100 text-purple-600'}`}>{event.type}</span>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${event.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-slate-200 text-slate-500'}`}>{event.status}</span>
                                </div>
                                <h3 className="font-bold text-slate-900 dark:text-white">{event.title}</h3>
                                <p className="text-xs text-slate-500 mt-1 line-clamp-1">{event.description}</p>
                                <p className="text-xs text-slate-400 mt-1 flex items-center gap-1"><Calendar size={12}/> {new Date(event.created_at).toLocaleDateString()}</p>
                            </div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => openEventModal(event)} className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"><Save size={14}/></button>
                                <button onClick={() => deleteEvent(event.id)} className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"><Trash2 size={14}/></button>
                            </div>
                        </div>
                    ))}
                    {events.length === 0 && <p className="text-center text-slate-400 italic py-10">Aucune publication pour le moment.</p>}
                </div>
            </div>
        </div>

      </div>

      {/* MODAL ÉDITION ÉVÉNEMENT */}
      {showEventModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 relative">
                  <button onClick={() => setShowEventModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><X size={20}/></button>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">{editingEvent ? 'Modifier Publication' : 'Nouvelle Publication'}</h3>
                  
                  <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="text-xs font-bold text-slate-500 uppercase">Type</label>
                              <select className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-sm dark:text-white" value={eventForm.type} onChange={e => setEventForm({...eventForm, type: e.target.value})}>
                                  <option value="event">Événement</option>
                                  <option value="promotion">Promotion</option>
                                  <option value="communication">Communication</option>
                              </select>
                          </div>
                          <div>
                              <label className="text-xs font-bold text-slate-500 uppercase">Statut</label>
                              <select className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-sm dark:text-white" value={eventForm.status} onChange={e => setEventForm({...eventForm, status: e.target.value})}>
                                  <option value="active">Actif</option>
                                  <option value="finished">Terminé</option>
                                  <option value="archived">Archivé</option>
                              </select>
                          </div>
                      </div>
                      <div>
                          <label className="text-xs font-bold text-slate-500 uppercase">Titre</label>
                          <input type="text" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-sm dark:text-white" value={eventForm.title} onChange={e => setEventForm({...eventForm, title: e.target.value})} />
                      </div>
                      <div>
                          <label className="text-xs font-bold text-slate-500 uppercase">Description</label>
                          <textarea className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-sm dark:text-white h-24" value={eventForm.description || ''} onChange={e => setEventForm({...eventForm, description: e.target.value})} />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="text-xs font-bold text-slate-500 uppercase">Date Début</label>
                              <input type="datetime-local" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-sm dark:text-white" value={eventForm.start_time ? new Date(eventForm.start_time).toISOString().slice(0, 16) : ''} onChange={e => setEventForm({...eventForm, start_time: e.target.value})} />
                          </div>
                          <div>
                              <label className="text-xs font-bold text-slate-500 uppercase">Lieu (Texte)</label>
                              <input type="text" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-sm dark:text-white" value={eventForm.location || ''} onChange={e => setEventForm({...eventForm, location: e.target.value})} />
                          </div>
                      </div>
                      <div>
                          <label className="text-xs font-bold text-slate-500 uppercase">Mentions Légales (Optionnel)</label>
                          <input type="text" placeholder="Ex: L'abus d'alcool..." className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-sm dark:text-white" value={eventForm.legal_mentions || ''} onChange={e => setEventForm({...eventForm, legal_mentions: e.target.value})} />
                      </div>
                  </div>

                  <div className="mt-6 flex justify-end gap-2">
                      <button onClick={() => setShowEventModal(false)} className="px-4 py-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition">Annuler</button>
                      <button onClick={saveEvent} className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition">Enregistrer</button>
                  </div>
              </div>
          </div>
      )}

    </main>
  )
}