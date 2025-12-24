'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ShieldAlert, CheckCircle, MapPin, User, Users, AlertTriangle, ArrowLeft, Ban, Lock, Archive, History, Clock } from 'lucide-react'

export default function AdminPanel() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('reports') // 'reports' ou 'history'
  
  // Données
  const [reports, setReports] = useState([])
  const [logs, setLogs] = useState([])
  const [selectedReport, setSelectedReport] = useState(null)
  const [details, setDetails] = useState({ participants: [], organizer: null })
  const [loadingDetails, setLoadingDetails] = useState(false)

  useEffect(() => {
    checkAdmin()
  }, [])

  async function checkAdmin() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    if (profile?.role !== 'admin') { router.push('/dashboard'); return }
    
    fetchReports()
    fetchLogs()
  }

  async function fetchReports() {
    const { data } = await supabase
      .from('reports')
      .select('*, events(title, location_name, meeting_point, organizer_id), profiles(pseudo)')
      .order('created_at', { ascending: false })
    setReports(data || [])
    setLoading(false)
  }

  async function fetchLogs() {
    const { data } = await supabase
      .from('admin_logs')
      .select('*, profiles(pseudo)')
      .order('created_at', { ascending: false })
    setLogs(data || [])
  }

  // --- FONCTIONS LOGIQUES (V2 - JURIDIQUE) ---

  async function logAction(actionType, targetRef, detailsText) {
    const { data: { user } } = await supabase.auth.getUser()
    await supabase.from('admin_logs').insert([{
      admin_id: user.id, action_type: actionType, target_reference: targetRef, details: detailsText
    }])
    fetchLogs()
  }

  async function handleSelectReport(report) {
    setSelectedReport(report)
    setLoadingDetails(true)
    if (!report.events) { setLoadingDetails(false); return }

    const { data: participants } = await supabase.from('participants').select('guest_name, user_id, joined_at, profiles(pseudo)').eq('event_id', report.event_id)
    const { data: organizer } = await supabase.from('profiles').select('*').eq('id', report.events.organizer_id).single()
    
    setDetails({ participants: participants || [], organizer })
    setLoadingDetails(false)
  }

  async function updateReportStatus(status) {
    await supabase.from('reports').update({ status }).eq('id', selectedReport.id)
    fetchReports()
    // On ne ferme pas le panel (setSelectedReport(null)) pour garder le contexte
  }

  async function sanctionUser(type) {
    if (!details.organizer) return
    const confirmMessage = type === 'banned' ? "⛔️ BANNIR DÉFINITIVEMENT ?" : "⚠️ SUSPENDRE (Avertissement) ?";
    if (!confirm(confirmMessage)) return

    await supabase.from('profiles').update({ account_status: type }).eq('id', details.organizer.id)
    await logAction(type === 'banned' ? 'BAN_USER' : 'SUSPEND_USER', details.organizer.pseudo, `Motif report: ${selectedReport.reason}`)

    alert(`Utilisateur passé en statut : ${type}`)
    updateReportStatus('resolved')
  }

  // C'est ici la clé : on Archive (V2 logic) au lieu de Delete, mais avec le bouton rouge (V1 design)
  async function archiveEvent() {
    if (!confirm("💥 ARCHIVER l'événement ? Il deviendra invisible mais sera conservé en base pour raison légale.")) return
    await supabase.from('events').update({ is_banned: true }).eq('id', selectedReport.event_id)
    await logAction('BAN_EVENT', selectedReport.events.title, `ID: ${selectedReport.event_id} - Motif: ${selectedReport.reason}`)
    alert("Événement archivé.")
    updateReportStatus('resolved')
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">Chargement du QG...</div>

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col md:flex-row transition-colors">
      
      {/* --- COLONNE GAUCHE (Liste & Onglets) --- */}
      <div className="w-full md:w-1/3 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 h-screen overflow-y-auto flex flex-col">
        <div className="sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-b border-slate-200 dark:border-slate-800 p-4 z-10">
            <div className="flex items-center gap-3 mb-4">
                <Link href="/dashboard" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-500"><ArrowLeft size={18}/></Link>
                <h1 className="font-bold text-lg text-slate-800 dark:text-white flex items-center gap-2">
                    <ShieldAlert /> Modération
                </h1>
            </div>
             {/* Onglets stylisés */}
             <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl relative z-20">
                <button onClick={() => setActiveTab('reports')} className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-bold rounded-lg transition ${activeTab === 'reports' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>
                    <AlertTriangle size={16}/> Signalements
                </button>
                <button onClick={() => setActiveTab('history')} className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-bold rounded-lg transition ${activeTab === 'history' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>
                    <History size={16}/> Historique
                </button>
            </div>
        </div>

        <div className="flex-1 overflow-y-auto">
            {/* Liste Signalements */}
            {activeTab === 'reports' && (
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {reports.map(report => (
                        <div key={report.id} onClick={() => handleSelectReport(report)} className={`p-4 cursor-pointer transition hover:bg-slate-50 dark:hover:bg-slate-800 ${selectedReport?.id === report.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}>
                            <div className="flex justify-between items-start mb-1">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${report.status === 'pending' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>{report.status === 'pending' ? 'À traiter' : 'Fait'}</span>
                                <span className="text-xs text-slate-400">{new Date(report.created_at).toLocaleDateString()}</span>
                            </div>
                            <h3 className="font-bold text-sm text-slate-800 dark:text-white mb-1 truncate">{report.events?.title || "Event supprimé"}</h3>
                            <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1 font-medium"><AlertTriangle size={14} className="shrink-0" /> {report.reason}</p>
                        </div>
                    ))}
                    {reports.length === 0 && <p className="text-center p-8 text-slate-400 flex flex-col items-center gap-2"><CheckCircle size={32}/>R.A.S</p>}
                </div>
            )}
            {/* Liste Historique */}
            {activeTab === 'history' && (
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {logs.map(log => (
                        <div key={log.id} className="p-4 text-sm">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="font-mono text-xs text-slate-400 flex items-center gap-1"><Clock size={12}/>{new Date(log.created_at).toLocaleDateString()}</span>
                                <span className={`text-[10px] font-bold px-1.5 rounded uppercase ${log.action_type.includes('BAN') ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>{log.action_type}</span>
                            </div>
                            <p className="text-slate-800 dark:text-white font-medium truncate">Cible : {log.target_reference}</p>
                        </div>
                    ))}
                    {logs.length === 0 && <p className="text-center p-8 text-slate-400 flex flex-col items-center gap-2"><History size={32}/>Aucun historique.</p>}
                </div>
            )}
        </div>
      </div>

      {/* --- COLONNE DROITE (Détails avec Design V1 restauré) --- */}
      <div className="w-full md:w-2/3 bg-slate-50 dark:bg-slate-950 h-screen overflow-y-auto p-6">
        {activeTab === 'reports' && selectedReport ? (
            <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                
                {/* EN-TÊTE DU SIGNALEMENT */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Détail du dossier</h2>
                    <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-4 rounded-xl border border-red-100 dark:border-red-900/50 mb-4 flex items-start gap-3">
                        <AlertTriangle size={24} className="shrink-0 mt-1" />
                        <div>
                            <h4 className="font-bold">Motif du signalement :</h4>
                            <p className="text-lg">{selectedReport.reason}</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        {selectedReport.status === 'pending' ? (
                            <>
                                <button onClick={() => updateReportStatus('resolved')} className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-bold transition"><CheckCircle size={16} /> Marquer traité</button>
                                <button onClick={() => updateReportStatus('ignored')} className="flex items-center gap-2 px-4 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-bold transition"><XCircle size={16} /> Ignorer</button>
                            </>
                        ) : <span className="text-green-600 font-bold flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-900/20 rounded-lg"><CheckCircle size={16}/> Dossier clos</span>}
                    </div>
                </div>

                {loadingDetails ? (
                    <div className="text-center p-10 text-slate-500 flex flex-col items-center gap-2"><ShieldAlert size={32} className="animate-pulse"/>Récupération des données...</div>
                ) : (
                    <>
                        {/* L'ORGANISATEUR (Design V1 restauré avec grosses icônes) */}
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-[0.03] dark:opacity-[0.05] pointer-events-none"><User size={120} /></div>
                            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2"><User className="text-blue-500"/> L'Organisateur (Suspect)</h3>
                            
                            {details.organizer ? (
                                <div className="space-y-6 relative z-10">
                                    <div className="grid grid-cols-2 gap-6 text-sm">
                                        <div><p className="text-slate-500 mb-1">Pseudo</p><p className="font-bold text-slate-800 dark:text-white text-xl">@{details.organizer.pseudo}</p></div>
                                        <div><p className="text-slate-500 mb-1">Identité (Privé)</p><p className="font-mono bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded text-slate-700 dark:text-slate-300 inline-block">{details.organizer.prenom} {details.organizer.nom}</p></div>
                                        <div><p className="text-slate-500 mb-1">Statut Compte</p><span className={`inline-block px-2 py-1 rounded text-xs font-bold uppercase ${details.organizer.account_status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{details.organizer.account_status}</span></div>
                                        <div><p className="text-slate-500 mb-1">Âge estimé</p><p className="text-slate-800 dark:text-white font-bold">{new Date().getFullYear() - new Date(details.organizer.date_naissance).getFullYear()} ans</p></div>
                                    </div>
                                    <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex gap-3">
                                        <button onClick={() => sanctionUser('suspended')} className="flex-1 bg-orange-100 text-orange-700 hover:bg-orange-200 py-3 rounded-xl text-sm font-bold transition flex items-center justify-center gap-2"><Lock size={16}/> Suspendre (Avertissement)</button>
                                        <button onClick={() => sanctionUser('banned')} className="flex-1 bg-red-600 text-white hover:bg-red-700 py-3 rounded-xl text-sm font-bold transition flex items-center justify-center gap-2shadow-lg shadow-red-500/20"><Ban size={16}/> BANNIR (Définitif)</button>
                                    </div>
                                </div>
                            ) : <p className="text-slate-500 italic">Profil introuvable.</p>}
                        </div>

                        {/* L'ÉVÉNEMENT (Design V1 restauré avec bouton rouge Archiver) */}
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 relative overflow-hidden">
                             <div className="absolute top-0 right-0 p-4 opacity-[0.03] dark:opacity-[0.05] pointer-events-none"><MapPin size={120} /></div>
                            <div className="flex justify-between items-start mb-6 relative z-10">
                                <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2"><MapPin className="text-purple-500"/> L'Événement</h3>
                                {/* Bouton Archiver style V1 (Rouge) */}
                                <button onClick={archiveEvent} className="px-4 py-2 rounded-lg bg-red-600 text-white font-bold text-sm hover:bg-red-700 shadow-md shadow-red-500/20 transition flex items-center gap-2">
                                    <Archive size={16} /> Archiver (Supprimer)
                                </button>
                            </div>
                            
                            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl mb-6 text-sm text-slate-700 dark:text-slate-300 space-y-2 relative z-10">
                                <p><span className="text-slate-500">Titre :</span> <span className="font-bold">{selectedReport.events?.title}</span></p>
                                <p><span className="text-slate-500">Lieu :</span> {selectedReport.events?.location_name || "Privé"} ({selectedReport.events?.meeting_point})</p>
                            </div>

                            <h4 className="font-bold text-sm text-slate-500 uppercase mb-3 flex items-center gap-2 relative z-10"><Users size={16} /> Participants ({details.participants.length})</h4>
                            <div className="max-h-40 overflow-y-auto space-y-2 border border-slate-100 dark:border-slate-700 rounded-xl p-2 relative z-10">
                                {details.participants.length > 0 ? ( details.participants.map((p, i) => (
                                        <div key={i} className="flex justify-between text-sm p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded transition"><span className="font-medium text-slate-800 dark:text-white">{p.profiles?.pseudo || p.guest_name || "Anonyme"}</span><span className="text-xs text-slate-400">{p.user_id ? 'Membre' : 'Invité'}</span></div>
                                )) ) : <p className="text-sm text-slate-400 italic p-2">Aucun participant.</p>}
                            </div>
                        </div>
                    </>
                )}
            </div>
        ) : (
            // États vides pour les onglets
            <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-50">
                {activeTab === 'reports' ? <><ShieldAlert size={64} className="mb-4" /><p className="text-lg font-medium">Sélectionne un dossier à gauche</p></> : <><History size={64} className="mb-4" /><p className="text-lg font-medium">Historique des sanctions</p><p className="text-sm">Les archives sont conservées légalement.</p></>}
            </div>
        )}
      </div>
    </main>
  )
}