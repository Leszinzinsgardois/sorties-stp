'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft, Search, User, BadgeCheck, 
  Mail, History, AlertTriangle, 
  CheckCircle, XCircle, Clock, Trash2, ShieldCheck 
} from 'lucide-react'

export default function AdminUsersPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('active') 
  
  // Données
  const [users, setUsers] = useState([])
  const [deletedUsers, setDeletedUsers] = useState([]) 
  const [selectedUser, setSelectedUser] = useState(null)
  
  // Détails chargés à la demande
  const [userDetails, setUserDetails] = useState({ events: [], sanctions: [] })
  const [loadingDetails, setLoadingDetails] = useState(false)

  // Filtre
  const [searchTerm, setSearchTerm] = useState('')

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
    setLoading(true)
    Promise.all([fetchActiveUsers(), fetchDeletedUsers()]).then(() => setLoading(false))
  }

  async function fetchActiveUsers() {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })
    setUsers(data || [])
  }

  async function fetchDeletedUsers() {
    const { data } = await supabase
      .from('deleted_users')
      .select('*')
      .order('archived_at', { ascending: false })
    setDeletedUsers(data || [])
  }

  async function handleSelectUser(user, isArchived = false) {
    const userWithContext = { ...user, isArchived }
    setSelectedUser(userWithContext)
    setLoadingDetails(true)

    if (isArchived) {
        setUserDetails({ events: [], sanctions: [] })
        setLoadingDetails(false)
    } else {
        const { data: userEvents } = await supabase
            .from('events')
            .select('*, reports(count)')
            .eq('organizer_id', user.id)
            .order('start_time', { ascending: false })

        const { data: userLogs } = await supabase
            .from('admin_logs')
            .select('*')
            .or(`target_reference.eq.${user.pseudo},target_reference.eq.${user.id}`)
            .in('action_type', ['BAN_USER', 'SUSPEND_USER'])
            .order('created_at', { ascending: false })

        setUserDetails({
            events: userEvents || [],
            sanctions: userLogs || []
        })
        setLoadingDetails(false)
    }
  }

  const calculateAge = (dateString) => {
    if (!dateString) return '?'
    const today = new Date()
    const birthDate = new Date(dateString)
    let age = today.getFullYear() - birthDate.getFullYear()
    const m = today.getMonth() - birthDate.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--
    return age
  }

  const getDaysRemaining = (deletedAt) => {
    if (!deletedAt) return null
    const deleteDate = new Date(deletedAt)
    const targetDate = new Date(deleteDate.setDate(deleteDate.getDate() + 30))
    const today = new Date()
    const diffTime = targetDate - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) 
    return diffDays > 0 ? diffDays : 0
  }

  const currentList = activeTab === 'active' ? users : deletedUsers
  const filteredList = currentList.filter(u => {
    const term = searchTerm.toLowerCase()
    return (
      (u.pseudo || '').toLowerCase().includes(term) ||
      (u.email || '').toLowerCase().includes(term) || 
      (u.prenom || '').toLowerCase().includes(term) ||
      (u.nom || '').toLowerCase().includes(term) ||
      (u.id || '').toLowerCase().includes(term)
    )
  })

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">Chargement Annuaire...</div>

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col md:flex-row transition-colors">
      
      {/* --- COLONNE GAUCHE : LISTE --- */}
      <div className="w-full md:w-1/3 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 h-screen overflow-y-auto flex flex-col">
        
        {/* Header Liste */}
        <div className="sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-b border-slate-200 dark:border-slate-800 p-4 z-10 space-y-4">
            <div className="flex items-center gap-3">
                <Link href="/admin" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-500">
                    <ArrowLeft size={18}/>
                </Link>
                <h1 className="font-bold text-lg text-slate-800 dark:text-white flex items-center gap-2">
                    <User className="text-blue-600"/> Utilisateurs
                </h1>
            </div>

            {/* ONGLETS */}
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                <button 
                    onClick={() => { setActiveTab('active'); setSelectedUser(null); }} 
                    className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition ${activeTab === 'active' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                >
                    <User size={14}/> Annuaire ({users.length})
                </button>
                <button 
                    onClick={() => { setActiveTab('deleted'); setSelectedUser(null); }} 
                    className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition ${activeTab === 'deleted' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                >
                    <Trash2 size={14}/> Supprimés ({deletedUsers.length})
                </button>
            </div>
            
            <div className="relative">
                <Search size={16} className="absolute left-3 top-3 text-slate-400"/>
                <input 
                    type="text" 
                    placeholder="Rechercher..." 
                    className="w-full bg-slate-50 dark:bg-slate-800 pl-10 pr-4 py-2.5 rounded-xl text-sm border-none outline-none focus:ring-2 ring-blue-500/50 transition text-slate-900 dark:text-white"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </div>

        {/* Liste Items */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
            {filteredList.map(user => {
                const daysRemaining = activeTab === 'active' ? getDaysRemaining(user.deleted_at) : 0
                const isSoftDeleted = activeTab === 'active' && user.deleted_at

                return (
                <div 
                    key={user.id} 
                    onClick={() => handleSelectUser(user, activeTab === 'deleted')}
                    className={`p-4 cursor-pointer transition hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-3 ${selectedUser?.id === user.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
                >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shrink-0 ${activeTab === 'deleted' ? 'bg-slate-200 dark:bg-slate-700 text-slate-500' : isSoftDeleted ? 'bg-red-50 text-red-500' : 'bg-blue-50 dark:bg-blue-900/30 text-blue-500'}`}>
                        {user.pseudo?.[0]?.toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                            <h3 className="font-bold text-sm text-slate-800 dark:text-white truncate">@{user.pseudo}</h3>
                            
                            {/* TAGS DE STATUT */}
                            {activeTab === 'deleted' ? (
                                <span className="bg-slate-100 dark:bg-slate-800 text-slate-500 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase">Archivé</span>
                            ) : isSoftDeleted ? (
                                <span className="bg-red-100 text-red-600 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase flex items-center gap-1"><Clock size={10}/> J-{daysRemaining}</span>
                            ) : user.account_status === 'banned' ? (
                                <span className="bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded uppercase">Banni</span>
                            ) : (
                                <span className="bg-green-100 text-green-600 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase">Actif</span>
                            )}
                        </div>
                        <p className="text-xs text-slate-500 truncate">
                            {activeTab === 'deleted' ? `Supprimé le ${new Date(user.archived_at).toLocaleDateString()}` : `${user.prenom} ${user.nom}`}
                        </p>
                    </div>
                </div>
            )})}
            {filteredList.length === 0 && <p className="text-center p-8 text-slate-400 text-sm">Aucun utilisateur trouvé.</p>}
        </div>
      </div>

      {/* --- COLONNE DROITE : DÉTAILS --- */}
      <div className="w-full md:w-2/3 bg-slate-50 dark:bg-slate-950 h-screen overflow-y-auto p-6">
        {selectedUser ? (
            <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                
                {/* 1. HEADER PROFIL */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex items-start justify-between">
                    <div className="flex items-center gap-5">
                        <div className={`w-20 h-20 rounded-full flex items-center justify-center font-bold text-3xl ${selectedUser.isArchived ? 'bg-slate-200 dark:bg-slate-800 text-slate-500' : 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'}`}>
                            {selectedUser.pseudo?.[0]?.toUpperCase()}
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                                @{selectedUser.pseudo}
                                {selectedUser.isArchived && <span className="text-xs bg-slate-200 text-slate-600 px-2 py-1 rounded-lg">ARCHIVÉ</span>}
                            </h2>
                            <div className="flex items-center gap-2 mt-1">
                                {selectedUser.isArchived ? (
                                    <p className="text-xs text-slate-500">
                                        ID Archivage: {selectedUser.id}
                                    </p>
                                ) : (
                                    <>
                                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${
                                            selectedUser.deleted_at ? 'bg-red-100 text-red-700 animate-pulse' :
                                            selectedUser.account_status === 'active' ? 'bg-green-100 text-green-700' :
                                            'bg-orange-100 text-orange-700'
                                        }`}>
                                            {selectedUser.deleted_at ? `Suppression dans ${getDaysRemaining(selectedUser.deleted_at)} jours` : selectedUser.account_status}
                                        </span>
                                        <span className="text-xs text-slate-400">Inscrit le {new Date(selectedUser.created_at).toLocaleDateString()}</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. INFOS D'IDENTIFICATION */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Carte d'identité Virtuelle */}
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-3">
                        <h3 className="font-bold text-slate-500 uppercase text-xs flex items-center gap-2 mb-2">
                            <BadgeCheck size={14}/> État Civil
                        </h3>
                        
                        {selectedUser.isArchived && !selectedUser.nom ? (
                            <p className="text-sm text-slate-400 italic">Données personnelles purgées (RGPD).</p>
                        ) : (
                            <>
                                <div>
                                    <p className="text-xs text-slate-400">Nom complet</p>
                                    <p className="font-bold text-slate-800 dark:text-white">{selectedUser.prenom} {selectedUser.nom}</p>
                                </div>
                                <div className="flex gap-6">
                                    <div>
                                        <p className="text-xs text-slate-400">Date de naissance</p>
                                        <p className="font-medium text-slate-800 dark:text-white">
                                            {selectedUser.date_naissance ? new Date(selectedUser.date_naissance).toLocaleDateString() : '?'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400">Âge</p>
                                        <p className="font-medium text-slate-800 dark:text-white">{calculateAge(selectedUser.date_naissance)} ans</p>
                                    </div>
                                </div>
                            </>
                        )}
                        
                        {/* --- MODIFICATION ICI : AJOUT DU BADGE EMAIL --- */}
                        <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                            <p className="text-xs text-slate-400 mb-1 flex items-center gap-1"><Mail size={10}/> Email</p>
                            <div className="flex items-center justify-between">
                                <p className="font-mono text-sm text-slate-700 dark:text-slate-300 truncate pr-2">
                                    {selectedUser.isArchived ? selectedUser.email : (selectedUser.email || "Masqué")}
                                </p>
                                
                                {/* Badge de vérification */}
                                {selectedUser.email_confirmed_at ? (
                                    <span className="flex items-center gap-1 text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full border border-green-200">
                                        <CheckCircle size={10}/> Vérifié
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-1 text-[10px] font-bold bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full border border-orange-200">
                                        <AlertTriangle size={10}/> Non vérifié
                                    </span>
                                )}
                            </div>
                        </div>
                        {/* ----------------------------------------------- */}

                    </div>

                    {/* IDs Système - Identifiants Système */}
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">
                        <h3 className="font-bold text-slate-500 uppercase text-xs flex items-center gap-2 mb-2">
                            <ShieldCheck size={14}/> Identifiants Système
                        </h3>
                        <div>
                            <p className="text-xs text-slate-400 mb-1">ID Unique</p>
                            <code className="block bg-slate-50 dark:bg-slate-950 p-2 rounded-lg text-xs font-mono text-slate-600 dark:text-slate-400 break-all">
                                {selectedUser.id}
                            </code>
                        </div>
                        {selectedUser.isArchived && (
                            <div>
                                <p className="text-xs text-slate-400 mb-1">Raison Archivage</p>
                                <code className="block bg-red-50 dark:bg-red-900/10 p-2 rounded-lg text-xs font-mono text-red-600 dark:text-red-300">
                                    {selectedUser.reason || 'Suppression Manuelle'}
                                </code>
                            </div>
                        )}
                    </div>
                </div>

                {/* 4. HISTORIQUE SANCTIONS */}
                {!selectedUser.isArchived && (
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
                        <h3 className="font-bold text-red-600 dark:text-red-400 uppercase text-xs flex items-center gap-2 mb-4">
                            <AlertTriangle size={14}/> Historique des Sanctions ({userDetails.sanctions.length})
                        </h3>
                        
                        {userDetails.sanctions.length > 0 ? (
                            <div className="space-y-3">
                                {userDetails.sanctions.map(log => (
                                    <div key={log.id} className="bg-red-50 dark:bg-red-900/10 p-3 rounded-lg border border-red-100 dark:border-red-900/30 flex justify-between items-center">
                                        <div>
                                            <p className="text-sm font-bold text-red-800 dark:text-red-300">{log.action_type === 'BAN_USER' ? 'BANNISSEMENT' : 'SUSPENSION'}</p>
                                            <p className="text-xs text-red-600/70">{new Date(log.created_at).toLocaleDateString()}</p>
                                        </div>
                                        <span className="text-xs font-mono text-red-500">{log.details}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-slate-400 italic">Aucune sanction enregistrée.</p>
                        )}
                    </div>
                )}

                {/* 5. HISTORIQUE ÉVÉNEMENTS */}
                {!selectedUser.isArchived && (
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
                        <h3 className="font-bold text-slate-500 uppercase text-xs flex items-center gap-2 mb-4">
                            <History size={14}/> Historique des Événements ({userDetails.events.length})
                        </h3>

                        {loadingDetails ? (
                            <div className="text-center py-4 text-slate-400">Chargement...</div>
                        ) : userDetails.events.length > 0 ? (
                            <div className="space-y-3">
                                {userDetails.events.map(evt => (
                                    <div key={evt.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                                        <div className="min-w-0">
                                            <h4 className="font-bold text-sm text-slate-800 dark:text-white truncate">{evt.title}</h4>
                                            <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                                                <Clock size={10}/> {new Date(evt.start_time).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-slate-400 italic">Aucun événement organisé.</p>
                        )}
                    </div>
                )}

            </div>
        ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-50">
                <User size={64} className="mb-4" />
                <p className="text-lg font-medium">Sélectionnez un utilisateur</p>
                <p className="text-sm">Explorez l'annuaire ou les archives.</p>
            </div>
        )}
      </div>
    </main>
  )
}