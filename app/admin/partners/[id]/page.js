'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  Building2, Save, Trash2, ArrowLeft, 
  MapPin, Globe, Mail, BadgeCheck, 
  AlertTriangle, Calendar, Megaphone, Plus, X,
  User, FileText, Phone, Briefcase
} from 'lucide-react'

export default function AdminPartnerDetail() {
  const { id } = useParams()
  const router = useRouter()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  
  const [formData, setFormData] = useState({
    representative_info: { nom: '', prenom: '', role: '', email: '', phone: '' }
  })
  
  const [showEventModal, setShowEventModal] = useState(false)
  const [editingEvent, setEditingEvent] = useState(null)
  const [eventForm, setEventForm] = useState({ title: '', type: 'event', status: 'active' })

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    const { data: inst } = await supabase.from('institutions').select('*').eq('id', id).single()
    if (inst) {
        if (!inst.representative_info) inst.representative_info = { nom: '', prenom: '', role: '', email: '', phone: '' }
        // On s'assure que association_type existe (au cas où vieux profil)
        if (!inst.association_type) inst.association_type = ''
        setFormData(inst)
    }

    const { data: evts } = await supabase.from('institutional_events').select('*').eq('institution_id', id).order('created_at', { ascending: false })
    if (evts) setEvents(evts)
    
    setLoading(false)
  }

  const handleRepChange = (field, value) => {
    setFormData(prev => ({
        ...prev,
        representative_info: {
            ...prev.representative_info,
            [field]: value
        }
    }))
  }

  async function updatePartner() {
    const payload = {
        ...formData,
        // Si on change le type pour autre chose qu'association, on vide le sous-type
        association_type: formData.type === 'association' ? formData.association_type : null
    }
    const { error } = await supabase.from('institutions').update(payload).eq('id', id)
    if (error) alert("Erreur update: " + error.message)
    else alert("Fiche mise à jour avec succès ✅")
  }

  async function deletePartner() {
    if (!confirm("ATTENTION: Cela supprimera l'entreprise ET tous ses événements. Continuer ?")) return
    await supabase.from('institutions').delete().eq('id', id)
    router.push('/admin/partners')
  }

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
      const payload = { ...eventForm, institution_id: id }
      let error
      if (editingEvent) {
          const res = await supabase.from('institutional_events').update(payload).eq('id', editingEvent.id)
          error = res.error
      } else {
          const res = await supabase.from('institutional_events').insert([payload])
          error = res.error
      }

      if (error) alert("Erreur save event: " + error.message)
      else {
          setShowEventModal(false)
          fetchData()
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
        <div className="max-w-6xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-4">
                <Link href="/admin/partners" className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"><ArrowLeft size={20}/></Link>
                <div>
                    <h1 className="text-xl font-black text-slate-900 dark:text-white">{formData.name}</h1>
                    <p className="text-xs text-slate-500 font-mono">ID: {id}</p>
                </div>
            </div>
            <div className="flex gap-2">
                <button onClick={deletePartner} className="bg-red-50 text-red-600 p-2 rounded-lg hover:bg-red-100"><Trash2 size={20}/></button>
                <button onClick={updatePartner} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-blue-700"><Save size={20}/> Sauvegarder</button>
            </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* === COLONNE GAUCHE : TOUTES LES INFOS === */}
        <div className="lg:col-span-1 space-y-6">
            
            {/* 1. FICHE IDENTITÉ */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
                <h2 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                    <Building2 size={18} className="text-blue-500"/> Identité
                </h2>
                
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase">Nom</label>
                    <input type="text" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-sm dark:text-white" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase">Type</label>
                        <select className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-sm dark:text-white" value={formData.type || 'private'} onChange={e => setFormData({...formData, type: e.target.value})}>
                            <option value="private">Établissement (Privé)</option>
                            <option value="public">Institution (Public)</option>
                            <option value="association">Association</option>
                        </select>
                    </div>
                    {/* SOUS TYPE */}
                    {formData.type === 'association' ? (
                        <div>
                            <label className="text-xs font-bold text-blue-500 uppercase">Catégorie</label>
                            <select className="w-full bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-2 text-sm dark:text-white text-blue-900 font-medium" value={formData.association_type || ''} onChange={e => setFormData({...formData, association_type: e.target.value})}>
                                <option value="">-- Choisir --</option>
                                <option value="etudiante">Étudiante (BDE/Corpo)</option>
                                <option value="1901">Loi 1901 (Générale)</option>
                                <option value="sportive">Sportive (AS)</option>
                                <option value="culturelle">Culturelle / Artistique</option>
                                <option value="autre">Autre</option>
                            </select>
                        </div>
                    ) : (
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase">SIRET</label>
                            <input type="text" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-sm dark:text-white" value={formData.siret || ''} onChange={e => setFormData({...formData, siret: e.target.value})} />
                        </div>
                    )}
                </div>
                
                {formData.type === 'association' && (
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase">RNA / SIRET</label>
                        <input type="text" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-sm dark:text-white" value={formData.siret || ''} onChange={e => setFormData({...formData, siret: e.target.value})} />
                    </div>
                )}
                
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase">Description</label>
                    <textarea className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-sm dark:text-white min-h-[80px]" value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} />
                </div>
            </div>

            {/* 2. COORDONNÉES */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
                <h2 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                    <MapPin size={18} className="text-purple-500"/> Coordonnées
                </h2>
                
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase">Adresse</label>
                    <input type="text" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-sm dark:text-white" value={formData.address || ''} onChange={e => setFormData({...formData, address: e.target.value})} />
                </div>
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase">Ville</label>
                    <input type="text" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-sm dark:text-white" value={formData.city || ''} onChange={e => setFormData({...formData, city: e.target.value})} />
                </div>
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase">Email Pro</label>
                    <input type="email" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-sm dark:text-white" value={formData.email_pro || ''} onChange={e => setFormData({...formData, email_pro: e.target.value})} />
                </div>
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase">Site Web</label>
                    <input type="text" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-sm dark:text-white" value={formData.website || ''} onChange={e => setFormData({...formData, website: e.target.value})} />
                </div>
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase">Logo URL</label>
                    <input type="text" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-sm dark:text-white" value={formData.logo_url || ''} onChange={e => setFormData({...formData, logo_url: e.target.value})} />
                </div>
            </div>

            {/* 3. REPRÉSENTANT LÉGAL (JSON) */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
                <h2 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                    <User size={18} className="text-orange-500"/> Représentant
                </h2>
                
                <div className="grid grid-cols-2 gap-3">
                    <input type="text" placeholder="Nom" className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-sm dark:text-white" value={formData.representative_info?.nom || ''} onChange={e => handleRepChange('nom', e.target.value)} />
                    <input type="text" placeholder="Prénom" className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-sm dark:text-white" value={formData.representative_info?.prenom || ''} onChange={e => handleRepChange('prenom', e.target.value)} />
                </div>
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase">Rôle</label>
                    <input type="text" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-sm dark:text-white" value={formData.representative_info?.role || ''} onChange={e => handleRepChange('role', e.target.value)} placeholder="Ex: Gérant" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <input type="text" placeholder="Email Perso" className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-sm dark:text-white" value={formData.representative_info?.email || ''} onChange={e => handleRepChange('email', e.target.value)} />
                    <input type="text" placeholder="Téléphone" className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-sm dark:text-white" value={formData.representative_info?.phone || ''} onChange={e => handleRepChange('phone', e.target.value)} />
                </div>
            </div>

            {/* 4. STATUT & ADMIN */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
                <h2 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                    <BadgeCheck size={18} className="text-green-500"/> Administration
                </h2>
                
                <div className="space-y-3">
                    <label className="flex items-center justify-between p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg cursor-pointer">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Partenaire Certifié</span>
                        <input type="checkbox" className="w-5 h-5 rounded" checked={formData.is_partner || false} onChange={e => setFormData({...formData, is_partner: e.target.checked})} />
                    </label>
                    <label className="flex items-center justify-between p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg cursor-pointer">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Identité Vérifiée (Kbis)</span>
                        <input type="checkbox" className="w-5 h-5 rounded" checked={formData.is_verified || false} onChange={e => setFormData({...formData, is_verified: e.target.checked})} />
                    </label>
                    
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
        </div>

        {/* === COLONNE DROITE : GESTION DES ÉVÉNEMENTS (Reste inchangé) === */}
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

      {/* MODAL ÉDITION ÉVÉNEMENT (Inchangé) */}
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