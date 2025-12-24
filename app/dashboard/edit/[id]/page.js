'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Trash2, AlertTriangle, MapPin, Clock, ChevronDown, X, AlertOctagon } from 'lucide-react'

const TRAM_OPTIONS = ["Ligne 1", "Ligne 2", "Ligne 3", "Ligne 4", "Ligne 5", "Bus / Autre"]

export default function EditEventPage({ params }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [event, setEvent] = useState(null)
  
  // Modale Annulation
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [cancelReason, setCancelReason] = useState('')

  const [formData, setFormData] = useState({
    title: '', description: '', tram_stop: 'Ligne 1', start_time: ''
  })

  useEffect(() => { fetchEvent() }, [])

  async function fetchEvent() {
    const resolvedParams = await params
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    const { data, error } = await supabase.from('events').select('*').eq('id', resolvedParams.id).single()

    if (error || data.organizer_id !== user.id) { router.push('/dashboard'); return }

    setEvent(data)
    setFormData({
      title: data.title,
      description: data.description || '',
      tram_stop: data.tram_stop || 'Ligne 1',
      start_time: new Date(data.start_time).toISOString().slice(0, 16)
    })
    setLoading(false)
  }

  async function handleUpdate(e) {
    e.preventDefault()
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()

    let changesLog = []
    if (formData.title !== event.title) changesLog.push(`📝 Titre : "${event.title}" ➝ "${formData.title}"`)
    if (formData.tram_stop !== event.tram_stop) changesLog.push(`🚊 Tram : "${event.tram_stop}" ➝ "${formData.tram_stop}"`)
    if (formData.description !== (event.description || '')) changesLog.push(`📄 Description modifiée`)
    
    const newDateIso = new Date(formData.start_time).toISOString()
    const oldDateIso = new Date(event.start_time).toISOString()
    let initialDateToSave = event.initial_start_time

    if (newDateIso !== oldDateIso) {
        changesLog.push(`⏰ Horaire : ${new Date(event.start_time).toLocaleString()} ➝ ${new Date(formData.start_time).toLocaleString()}`)
        if (!event.initial_start_time) initialDateToSave = event.start_time
    }

    if (changesLog.length === 0) { alert("Aucune modification."); setSaving(false); return }

    await supabase.from('events').update({
        title: formData.title, description: formData.description, tram_stop: formData.tram_stop,
        start_time: newDateIso, initial_start_time: initialDateToSave
    }).eq('id', event.id)

    await supabase.from('event_logs').insert([{
        event_id: event.id, modified_by: user.id, change_type: 'UPDATE', details: changesLog.join('\n')
    }])

    alert("Modifications enregistrées !")
    router.push('/dashboard')
  }

  // --- LOGIQUE D'ANNULATION ---
  async function confirmCancellation() {
    if (!cancelReason.trim()) return alert("Merci d'indiquer une raison.")
    
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    
    // 1. Update Event : is_visible = false (caché du public), is_cancelled = true
    await supabase.from('events').update({ 
        is_visible: false,
        is_cancelled: true,
        cancellation_reason: cancelReason,
        cancelled_at: new Date().toISOString()
    }).eq('id', event.id)
    
    // 2. Log Admin
    await supabase.from('event_logs').insert([{
        event_id: event.id,
        modified_by: user.id,
        change_type: 'CANCEL',
        details: `ANNULATION PAR L'ORGANISATEUR.\nRaison : "${cancelReason}"`
    }])

    setShowCancelModal(false)
    router.push('/dashboard')
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">Chargement...</div>

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20 px-4 pt-8 transition-colors">
        <div className="max-w-lg mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/dashboard" className="p-2 bg-white dark:bg-slate-900 rounded-full border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"><ArrowLeft size={20}/></Link>
                <h1 className="text-2xl font-black text-slate-900 dark:text-white">Modifier l'événement</h1>
            </div>

            {/* FORMULAIRE (Désactivé si annulé) */}
            <form onSubmit={handleUpdate} className={`space-y-6 ${event?.is_cancelled ? 'opacity-50 pointer-events-none' : ''}`}>
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
                    {/* ... (Champs existants identiques à avant) ... */}
                    <div><label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Titre</label><input type="text" required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 font-bold focus:ring-2 ring-blue-500 outline-none text-slate-900 dark:text-white"/></div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Ligne de Tram</label>
                        <div className="relative"><select value={formData.tram_stop} onChange={(e) => setFormData({...formData, tram_stop: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 appearance-none font-medium focus:ring-2 ring-blue-500 outline-none text-slate-900 dark:text-white cursor-pointer">{TRAM_OPTIONS.map(opt => (<option key={opt} value={opt} className="dark:bg-slate-900">{opt}</option>))}</select><ChevronDown className="absolute right-4 top-3.5 text-slate-400 pointer-events-none" size={18}/></div>
                    </div>
                    <div><label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Description</label><textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} rows="4" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 focus:ring-2 ring-blue-500 outline-none text-slate-900 dark:text-white resize-none"/></div>
                    <div><label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-2">Date & Heure <Clock size={14}/></label><input type="datetime-local" required value={formData.start_time} onChange={(e) => setFormData({...formData, start_time: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 font-medium focus:ring-2 ring-blue-500 outline-none text-slate-900 dark:text-white"/><div className="bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 p-3 rounded-lg mt-3 text-xs flex items-start gap-2"><AlertTriangle size={14} className="mt-0.5 shrink-0"/> <p>Modifier l'heure affichera une alerte rouge aux invités.</p></div></div>
                </div>

                <div className="flex flex-col gap-3 pt-4">
                    <button type="submit" disabled={saving} className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 disabled:opacity-50">{saving ? '...' : <><Save size={20}/> Enregistrer</>}</button>
                    <button type="button" onClick={() => setShowCancelModal(true)} className="w-full bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 py-4 rounded-xl font-bold hover:bg-red-100 dark:hover:bg-red-900/20 transition flex items-center justify-center gap-2"><Trash2 size={20}/> Annuler l'événement</button>
                </div>
            </form>

            {/* --- MODALE D'ANNULATION --- */}
            {showCancelModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-3xl shadow-2xl p-6 border border-slate-200 dark:border-slate-800 relative animate-in zoom-in-95">
                        <div className="flex items-center gap-3 text-red-600 mb-4">
                            <div className="bg-red-100 p-2 rounded-full"><AlertOctagon size={24}/></div>
                            <h3 className="font-bold text-lg">Annuler la soirée ?</h3>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
                            L'événement sera marqué comme <strong className="text-red-600">Annulé</strong> immédiatement. Les invités verront ce statut.
                        </p>
                        
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Raison de l'annulation (Obligatoire)</label>
                        <textarea 
                            autoFocus
                            placeholder="Ex: Malade, problème de salle, reporté..."
                            value={cancelReason}
                            onChange={e => setCancelReason(e.target.value)}
                            className="w-full bg-slate-100 dark:bg-slate-800 rounded-xl p-3 text-sm focus:ring-2 ring-red-500 outline-none mb-6 text-slate-900 dark:text-white"
                            rows="3"
                        />

                        <div className="flex gap-3">
                            <button onClick={() => setShowCancelModal(false)} className="flex-1 py-3 font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition">Retour</button>
                            <button onClick={confirmCancellation} className="flex-1 py-3 font-bold bg-red-600 text-white hover:bg-red-700 rounded-xl shadow-lg shadow-red-500/30 transition">Confirmer</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    </main>
  )
}