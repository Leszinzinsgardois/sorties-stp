'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
// J'ai ajouté ScanFace à la liste des imports
import { ShieldAlert, CheckCircle, MapPin, User, Users, AlertTriangle, ArrowLeft, Ban, Lock, Archive, Database, Search, Filter, ShieldCheck, XCircle, IdCard, Clock, FileText, ScanFace } from 'lucide-react'

export default function AdminPanel() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('reports') // 'reports' (À traiter) ou 'database' (Tout voir)
  
  // Données
  const [reports, setReports] = useState([]) 
  const [allEvents, setAllEvents] = useState([]) 
  const [selectedItem, setSelectedItem] = useState(null) 
  const [details, setDetails] = useState({ participants: [], organizer: null, eventReports: [] })
  const [loadingDetails, setLoadingDetails] = useState(false)

  // Filtres
  const [searchTerm, setSearchTerm] = useState('')
  const [showOnlyReported, setShowOnlyReported] = useState(false)

  useEffect(() => {
    checkAdmin()
  }, [])

  async function checkAdmin() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    if (profile?.role !== 'admin') { router.push('/dashboard'); return }
    
    refreshData()
  }

  function refreshData() {
    fetchPendingReports()
    fetchAllEvents()
  }

  // 1. Récupère signalements NON TRAITÉS
  async function fetchPendingReports() {
    const { data } = await supabase
      .from('reports')
      .select('*, events(title, description, location_name, meeting_point, organizer_id), profiles(pseudo)')
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
    setReports(data || [])
    setLoading(false)
  }

  // 2. Récupère TOUS les événements
  async function fetchAllEvents() {
    const { data } = await supabase
      .from('events')
      .select('*, profiles(pseudo, account_status), reports(*)')
      .order('created_at', { ascending: false })
    setAllEvents(data || [])
  }

  async function logAction(actionType, targetRef, detailsText) {
    const { data: { user } } = await supabase.auth.getUser()
    await supabase.from('admin_logs').insert([{
      admin_id: user.id, action_type: actionType, target_reference: targetRef, details: detailsText
    }])
  }

  async function handleSelect(item, type) {
    setSelectedItem({ ...item, type }) 
    setLoadingDetails(true)

    const eventId = type === 'report_ticket' ? item.event_id : item.id
    const organizerId = type === 'report_ticket' ? item.events?.organizer_id : item.organizer_id 

    // 1. Participants
    const { data: participants } = await supabase.from('participants').select('guest_name, user_id, joined_at, profiles(pseudo)').eq('event_id', eventId)
    
    // 2. Organisateur
    let organizer = item.profiles 
    if (!organizer && organizerId) {
        const { data } = await supabase.from('profiles').select('*').eq('id', organizerId).single()
        organizer = data
    } else if (organizerId) {
        const { data } = await supabase.from('profiles').select('*').eq('id', organizerId).single()
        organizer = data
    }

    // 3. TOUS les signalements
    const { data: eventReports } = await supabase.from('reports').select('*, profiles(pseudo)').eq('event_id', eventId).order('created_at', { ascending: false })

    setDetails({ participants: participants || [], organizer, eventReports: eventReports || [] })
    setLoadingDetails(false)
  }

  async function closeReport(reportId, newStatus) {
    await supabase.from('reports').update({ status: newStatus }).eq('id', reportId)
    refreshData()
    setDetails(prev => ({
        ...prev,
        eventReports: prev.eventReports.map(r => r.id === reportId ? { ...r, status: newStatus } : r)
    }))
  }

  async function sanctionUser(type) {
    if (!details.organizer) return
    if (!confirm(`Confirmer la sanction : ${type} ?`)) return

    await supabase.from('profiles').update({ account_status: type }).eq('id', details.organizer.id) 
    const targetId = selectedItem.type === 'report_ticket' ? selectedItem.events.organizer_id : selectedItem.organizer_id
    
    await supabase.from('profiles').update({ account_status: type }).eq('id', targetId)
    await logAction(type === 'banned' ? 'BAN_USER' : 'SUSPEND_USER', details.organizer.pseudo, "Sanction via Admin Panel")
    
    alert("Sanction appliquée.")
    refreshData()
  }

  async function archiveEvent() {
    if (!confirm("💥 ARCHIVER cet événement ?")) return
    const eventId = selectedItem.type === 'report_ticket' ? selectedItem.event_id : selectedItem.id
    
    await supabase.from('events').update({ is_banned: true, is_visible: false }).eq('id', eventId)
    await logAction('BAN_EVENT', "Event ID " + eventId, "Archivage manuel")
    
    alert("Événement archivé.")
    refreshData()
  }

  const filteredEvents = allEvents.filter(event => {
    const searchLower = searchTerm.toLowerCase()
    const matchSearch = 
        (event.title?.toLowerCase() || '').includes(searchLower) || 
        (event.profiles?.pseudo?.toLowerCase() || '').includes(searchLower) ||
        (event.location_name?.toLowerCase() || '').includes(searchLower)
    
    const matchReport = showOnlyReported ? (event.reports && event.reports.length > 0) : true

    return matchSearch && matchReport
  })

  const getEventDescription = () => {
    if (!selectedItem) return ''
    return selectedItem.type === 'report_ticket' ? selectedItem.events?.description : selectedItem.description
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">Chargement du QG...</div>

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col md:flex-row transition-colors">
      
      {/* --- COLONNE GAUCHE --- */}
      <div className="w-full md:w-1/3 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 h-screen overflow-y-auto flex flex-col">
        <div className="sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-b border-slate-200 dark:border-slate-800 p-4 z-10 space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Link href="/dashboard" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-500"><ArrowLeft size={18}/></Link>
                    <h1 className="font-bold text-lg text-slate-800 dark:text-white flex items-center gap-2">
                        <ShieldAlert /> Modération
                    </h1>
                </div>
                <Link href="/admin/verification" className="p-2 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/40 transition" title="Vérifications CNI">
                    <IdCard size={20} />
                </Link>
            </div>

            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                <button onClick={() => setActiveTab('reports')} className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-bold rounded-lg transition ${activeTab === 'reports' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>
                    <AlertTriangle size={16}/> Inbox ({reports.length})
                </button>
                <button onClick={() => setActiveTab('database')} className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-bold rounded-lg transition ${activeTab === 'database' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>
                    <Database size={16}/> Base de données
                </button>
            </div>

            {activeTab === 'database' && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                    <div className="relative">
                        <Search size={16} className="absolute left-3 top-3 text-slate-400"/>
                        <input 
                            type="text" 
                            placeholder="Rechercher (Pseudo, Titre...)" 
                            className="w-full bg-slate-50 dark:bg-slate-800 pl-10 pr-4 py-2.5 rounded-xl text-sm border-none outline-none focus:ring-2 ring-blue-500/50 transition text-slate-900 dark:text-white"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <label className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 cursor-pointer p-1">
                        <input type="checkbox" checked={showOnlyReported} onChange={e => setShowOnlyReported(e.target.checked)} className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"/>
                        <Filter size={12}/> Afficher uniquement les événements signalés
                    </label>
                </div>
            )}
        </div>

        <div className="flex-1 overflow-y-auto">
            {activeTab === 'reports' && (
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {reports.map(report => (
                        <div key={report.id} onClick={() => handleSelect(report, 'report_ticket')} className={`p-4 cursor-pointer transition hover:bg-slate-50 dark:hover:bg-slate-800 ${selectedItem?.id === report.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}>
                            <div className="flex justify-between items-start mb-1">
                                <span className="bg-red-100 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded uppercase">Urgent</span>
                                <span className="text-xs text-slate-400">{new Date(report.created_at).toLocaleDateString()}</span>
                            </div>
                            <h3 className="font-bold text-sm text-slate-800 dark:text-white mb-1 truncate">{report.events?.title || "Event supprimé"}</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 truncate">Par @{report.profiles?.pseudo || 'Anonyme'}</p>
                            <p className="text-xs text-red-500 mt-1 font-medium line-clamp-1">"{report.reason}"</p>
                        </div>
                    ))}
                    {reports.length === 0 && <p className="text-center p-8 text-slate-400 flex flex-col items-center gap-2"><CheckCircle size={32}/>Tout est propre !</p>}
                </div>
            )}

            {activeTab === 'database' && (
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filteredEvents.map(event => (
                        <div key={event.id} onClick={() => handleSelect(event, 'event_entry')} className={`p-4 cursor-pointer transition hover:bg-slate-50 dark:hover:bg-slate-800 ${selectedItem?.id === event.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}>
                            <div className="flex justify-between items-start mb-1">
                                <div className="flex gap-1">
                                    {event.is_banned && <span className="bg-red-100 text-red-600 text-[10px] font-bold px-1.5 rounded uppercase">Banni</span>}
                                    {!event.is_visible && !event.is_banned && <span className="bg-slate-100 text-slate-500 text-[10px] font-bold px-1.5 rounded uppercase">Terminé</span>}
                                    {event.is_visible && <span className="bg-green-100 text-green-600 text-[10px] font-bold px-1.5 rounded uppercase">Actif</span>}
                                </div>
                                {event.reports && event.reports.length > 0 && (
                                    <span className="flex items-center gap-1 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-[10px] font-bold px-1.5 rounded-full">
                                        <AlertTriangle size={10} /> {event.reports.length}
                                    </span>
                                )}
                            </div>
                            <h3 className="font-bold text-sm text-slate-800 dark:text-white mb-0.5 truncate">{event.title}</h3>
                            <p className="text-xs text-slate-500">Org: <span className="font-medium text-slate-700 dark:text-slate-300">@{event.profiles?.pseudo}</span></p>
                        </div>
                    ))}
                    {filteredEvents.length === 0 && <p className="text-center p-8 text-slate-400 flex flex-col items-center gap-2"><Search size={32}/>Aucun résultat.</p>}
                </div>
            )}
        </div>
      </div>

      {/* --- COLONNE DROITE (Détails) --- */}
      <div className="w-full md:w-2/3 bg-slate-50 dark:bg-slate-950 h-screen overflow-y-auto p-6">
        {selectedItem ? (
            <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                
                {loadingDetails ? (
                    <div className="text-center p-10 text-slate-500 flex flex-col items-center gap-2"><ShieldAlert size={32} className="animate-pulse"/>Chargement des preuves...</div>
                ) : (
                    <>
                        {/* 1. SECTION SIGNALEMENTS */}
                        {details.eventReports.length > 0 ? (
                            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-red-100 dark:border-red-900/30">
                                <h2 className="text-xl font-bold text-red-600 dark:text-red-400 mb-4 flex items-center gap-2">
                                    <AlertTriangle size={24}/> {details.eventReports.length} Signalement(s) reçu(s)
                                </h2>
                                <div className="space-y-3">
                                    {details.eventReports.map((rep) => (
                                        <div key={rep.id} className="bg-red-50 dark:bg-red-900/10 p-4 rounded-xl flex justify-between items-start gap-4">
                                            <div>
                                                <p className="text-sm font-bold text-red-800 dark:text-red-300">"{rep.reason}"</p>
                                                <p className="text-xs text-red-600/70 mt-1">
                                                    Par @{rep.profiles?.pseudo || 'Anonyme'} • {new Date(rep.created_at).toLocaleDateString()} à {new Date(rep.created_at).toLocaleTimeString()}
                                                </p>
                                            </div>
                                            {rep.status === 'pending' ? (
                                                <div className="flex flex-col gap-2">
                                                    <button onClick={() => closeReport(rep.id, 'resolved')} className="p-1.5 bg-green-100 text-green-700 rounded hover:bg-green-200" title="Traiter"><CheckCircle size={16}/></button>
                                                    <button onClick={() => closeReport(rep.id, 'ignored')} className="p-1.5 bg-slate-200 text-slate-600 rounded hover:bg-slate-300" title="Ignorer"><XCircle size={16}/></button>
                                                </div>
                                            ) : (
                                                <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase ${rep.status === 'resolved' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                                                    {rep.status === 'resolved' ? 'Traité' : 'Ignoré'}
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-100 dark:border-green-900/30 text-green-700 dark:text-green-400 flex items-center gap-2 font-medium">
                                <ShieldCheck size={20}/> Aucun signalement sur cet événement.
                            </div>
                        )}

                        {/* 2. L'ORGANISATEUR (Profil Complet + CNI) */}
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
                             <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2"><User className="text-blue-500"/> L'Organisateur</h3>
                             {details.organizer ? (
                                <div className="space-y-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center font-bold text-2xl text-slate-600 dark:text-slate-400">
                                            {details.organizer.pseudo?.[0]?.toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-bold text-xl text-slate-900 dark:text-white">@{details.organizer.pseudo}</p>
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${details.organizer.account_status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                Statut : {details.organizer.account_status}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    {/* Grille d'infos complètes */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                                        <div>
                                            <p className="text-xs text-slate-500 uppercase font-bold mb-1">Identité</p>
                                            <p className="font-medium text-slate-900 dark:text-white">{details.organizer.prenom} {details.organizer.nom}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500 uppercase font-bold mb-1">Date de naissance</p>
                                            <p className="font-medium text-slate-900 dark:text-white">
                                                {new Date(details.organizer.date_naissance).toLocaleDateString()} 
                                                <span className="text-slate-400 font-normal ml-2">
                                                    ({new Date().getFullYear() - new Date(details.organizer.date_naissance).getFullYear()} ans)
                                                </span>
                                            </p>
                                        </div>
                                        <div className="col-span-2">
                                            <p className="text-xs text-slate-500 uppercase font-bold mb-1">ID (Système)</p>
                                            <p className="font-mono text-xs text-slate-400 truncate select-all">{details.organizer.id}</p>
                                        </div>
                                    </div>

                                    {/* --- NOUVEAU BLOC : VÉRIFICATION CNI --- */}
                                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800 flex items-start gap-3">
                                        <div className="bg-white dark:bg-slate-900 p-2 rounded-lg text-slate-400 border border-slate-200 dark:border-slate-700">
                                            <ScanFace size={24} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-sm text-slate-700 dark:text-slate-300 uppercase mb-1">Vérification CNI</h4>
                                            
                                            {details.organizer.cni_status === 'verified' ? (
                                                <div className="flex items-center gap-2 text-green-600 font-bold text-sm">
                                                    <CheckCircle size={16} /> Identité certifiée
                                                </div>
                                            ) : details.organizer.cni_status === 'rejected' ? (
                                                 <div className="flex items-center gap-2 text-red-500 font-bold text-sm">
                                                    <XCircle size={16} /> Refusée (Suspect)
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2 text-slate-500 font-bold text-sm">
                                                    <span className="w-2 h-2 rounded-full bg-slate-400"></span> Non effectué
                                                </div>
                                            )}

                                            <p className="text-xs text-slate-400 mt-1">
                                                {details.organizer.cni_status === 'verified' 
                                                 ? "Ce compte a fourni une pièce d'identité valide." 
                                                 : "Ce compte n'a pas encore demandé de validation de son identité."}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 pt-2">
                                        <button onClick={() => sanctionUser('suspended')} className="bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900/30 p-2 rounded-lg text-sm font-bold transition">Suspendre (Avert.)</button>
                                        <button onClick={() => sanctionUser('banned')} className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 p-2 rounded-lg text-sm font-bold transition">BANNIR</button>
                                    </div>
                                </div>
                             ) : <p className="text-slate-500 italic">Profil introuvable.</p>}
                        </div>

                        {/* 3. L'ÉVÉNEMENT (Avec Description) */}
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2"><MapPin className="text-purple-500"/> L'Événement</h3>
                                <button onClick={archiveEvent} className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-700 transition flex items-center gap-2">
                                    <Archive size={16}/> Archiver
                                </button>
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl space-y-3 text-sm text-slate-700 dark:text-slate-300">
                                <p><span className="font-bold block text-xs text-slate-500 uppercase mb-1">Titre</span> {selectedItem.title || selectedItem.events?.title}</p>
                                <p><span className="font-bold block text-xs text-slate-500 uppercase mb-1">Lieu & RDV</span> {selectedItem.location_name || selectedItem.events?.location_name} ({selectedItem.meeting_point || selectedItem.events?.meeting_point})</p>
                                <p><span className="font-bold block text-xs text-slate-500 uppercase mb-1">Date</span> {new Date(selectedItem.start_time || selectedItem.events?.start_time).toLocaleString()}</p>
                                
                                {/* Description */}
                                <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                                    <span className="font-bold block text-xs text-slate-500 uppercase mb-1 flex items-center gap-1"><FileText size={12}/> Description</span>
                                    <p className="italic text-slate-600 dark:text-slate-400 whitespace-pre-line">
                                        {getEventDescription() || "Aucune description fournie."}
                                    </p>
                                </div>
                            </div>
                            
                            <h4 className="font-bold text-sm text-slate-500 uppercase mt-6 mb-3 flex items-center gap-2"><Users size={16} /> Participants ({details.participants.length})</h4>
                            <div className="max-h-40 overflow-y-auto border border-slate-100 dark:border-slate-700 rounded-xl">
                                {details.participants.map((p, i) => (
                                    <div key={i} className="flex justify-between p-3 hover:bg-slate-50 dark:hover:bg-slate-800 border-b border-slate-50 dark:border-slate-800 last:border-0">
                                        <span className="font-medium text-slate-800 dark:text-white">{p.profiles?.pseudo || p.guest_name}</span>
                                        <span className="text-xs text-slate-400">{p.user_id ? 'Membre' : 'Invité'}</span>
                                    </div>
                                ))}
                                {details.participants.length === 0 && <p className="p-4 text-center text-slate-400 text-sm italic">Personne sur la liste.</p>}
                            </div>
                        </div>
                    </>
                )}
            </div>
        ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-50">
                <ShieldAlert size={64} className="mb-4" />
                <p className="text-lg font-medium">Sélectionnez un élément</p>
                <p className="text-sm">Inbox pour les urgences, Base de données pour l'historique.</p>
            </div>
        )}
      </div>
    </main>
  )
}