'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft, Search, User, ShieldAlert, BadgeCheck, 
  Mail, Calendar, Fingerprint, History, AlertTriangle, 
  Ban, CheckCircle, XCircle, Clock, MapPin 
} from 'lucide-react'

export default function AdminUsersPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  
  // Données
  const [users, setUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
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
    
    fetchUsers()
  }

  // 1. Récupérer la liste des utilisateurs
  async function fetchUsers() {
    // Note: Pour avoir l'email, il faut idéalement que ton trigger de création de profil l'ait copié.
    // Sinon, on ne l'aura pas ici car auth.users n'est pas accessible directement.
    // On suppose ici que 'profiles' contient les infos de base.
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })
    
    setUsers(data || [])
    setLoading(false)
  }

  // 2. Récupérer les détails complets d'un utilisateur au clic
  async function handleSelectUser(user) {
    setSelectedUser(user)
    setLoadingDetails(true)

    // A. Ses Événements (avec nombre de signalements)
    const { data: userEvents } = await supabase
      .from('events')
      .select('*, reports(count)')
      .eq('organizer_id', user.id)
      .order('start_time', { ascending: false })

    // B. Historique des Sanctions (Admin Logs qui le concernent)
    // On cherche dans les logs où la cible est son pseudo ou son ID
    const { data: userLogs } = await supabase
      .from('admin_logs')
      .select('*')
      .or(`target_reference.eq.${user.pseudo},target_reference.eq.${user.id}`)
      .in('action_type', ['BAN_USER', 'SUSPEND_USER']) // On ne garde que les sanctions
      .order('created_at', { ascending: false })

    setUserDetails({
      events: userEvents || [],
      sanctions: userLogs || []
    })
    setLoadingDetails(false)
  }

  // Helper pour calculer l'âge
  const calculateAge = (dateString) => {
    if (!dateString) return '?'
    const today = new Date()
    const birthDate = new Date(dateString)
    let age = today.getFullYear() - birthDate.getFullYear()
    const m = today.getMonth() - birthDate.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--
    }
    return age
  }

  // Filtrage de la liste
  const filteredUsers = users.filter(u => {
    const term = searchTerm.toLowerCase()
    return (
      (u.pseudo || '').toLowerCase().includes(term) ||
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
            
            <div className="relative">
                <Search size={16} className="absolute left-3 top-3 text-slate-400"/>
                <input 
                    type="text" 
                    placeholder="Rechercher (Nom, Pseudo, ID...)" 
                    className="w-full bg-slate-50 dark:bg-slate-800 pl-10 pr-4 py-2.5 rounded-xl text-sm border-none outline-none focus:ring-2 ring-blue-500/50 transition text-slate-900 dark:text-white"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <p className="text-xs text-slate-400 font-medium px-1">
                {filteredUsers.length} utilisateur(s) trouvé(s)
            </p>
        </div>

        {/* Liste Items */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
            {filteredUsers.map(user => (
                <div 
                    key={user.id} 
                    onClick={() => handleSelectUser(user)}
                    className={`p-4 cursor-pointer transition hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-3 ${selectedUser?.id === user.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
                >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shrink-0 ${user.account_status === 'banned' ? 'bg-red-100 text-red-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                        {user.pseudo?.[0]?.toUpperCase()}
                    </div>
                    <div className="min-w-0">
                        <div className="flex items-center gap-2">
                            <h3 className="font-bold text-sm text-slate-800 dark:text-white truncate">@{user.pseudo}</h3>
                            {user.account_status === 'banned' && <Ban size={12} className="text-red-500"/>}
                            {user.account_status === 'suspended' && <AlertTriangle size={12} className="text-orange-500"/>}
                        </div>
                        <p className="text-xs text-slate-500 truncate">{user.prenom} {user.nom}</p>
                    </div>
                </div>
            ))}
        </div>
      </div>

      {/* --- COLONNE DROITE : DÉTAILS --- */}
      <div className="w-full md:w-2/3 bg-slate-50 dark:bg-slate-950 h-screen overflow-y-auto p-6">
        {selectedUser ? (
            <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                
                {/* 1. HEADER PROFIL */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex items-start justify-between">
                    <div className="flex items-center gap-5">
                        <div className={`w-20 h-20 rounded-full flex items-center justify-center font-bold text-3xl ${selectedUser.account_status === 'banned' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'}`}>
                            {selectedUser.pseudo?.[0]?.toUpperCase()}
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white">@{selectedUser.pseudo}</h2>
                            <div className="flex items-center gap-2 mt-1">
                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${
                                    selectedUser.account_status === 'active' ? 'bg-green-100 text-green-700' :
                                    selectedUser.account_status === 'suspended' ? 'bg-orange-100 text-orange-700' :
                                    'bg-red-100 text-red-700'
                                }`}>
                                    {selectedUser.account_status}
                                </span>
                                <span className="text-xs text-slate-400">Inscrit le {new Date(selectedUser.created_at).toLocaleDateString()}</span>
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
                        <div>
                            <p className="text-xs text-slate-400">Nom complet</p>
                            <p className="font-bold text-slate-800 dark:text-white">{selectedUser.prenom} {selectedUser.nom}</p>
                        </div>
                        <div className="flex gap-6">
                            <div>
                                <p className="text-xs text-slate-400">Date de naissance</p>
                                <p className="font-medium text-slate-800 dark:text-white">{new Date(selectedUser.date_naissance).toLocaleDateString()}</p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-400">Âge</p>
                                <p className="font-medium text-slate-800 dark:text-white">{calculateAge(selectedUser.date_naissance)} ans</p>
                            </div>
                        </div>
                        <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                            <p className="text-xs text-slate-400 mb-1 flex items-center gap-1"><Mail size={10}/> Email</p>
                            <p className="font-mono text-sm text-slate-700 dark:text-slate-300">{selectedUser.email || "Non visible (Voir Auth)"}</p>
                        </div>
                    </div>

                    {/* IDs Système */}
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">
                        <h3 className="font-bold text-slate-500 uppercase text-xs flex items-center gap-2 mb-2">
                            <Fingerprint size={14}/> Identifiants Système
                        </h3>
                        <div>
                            <p className="text-xs text-slate-400 mb-1">ID Système (Interne)</p>
                            <code className="block bg-slate-50 dark:bg-slate-950 p-2 rounded-lg text-xs font-mono text-slate-600 dark:text-slate-400 break-all">
                                {selectedUser.id} {/* Souvent le même dans Supabase Auth/Public */}
                            </code>
                        </div>
                    </div>
                </div>

                {/* 3. STATUT CNI (Placeholder) */}
                <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 relative overflow-hidden">
                    <div className="flex items-start justify-between relative z-10">
                        <div>
                            <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-1">
                                <ShieldAlert size={18} className="text-blue-500"/> Vérification CNI
                            </h3>
                            <p className="text-sm text-slate-500 mb-4">Statut actuel du dossier d'identité.</p>
                            
                            <div className="flex gap-2">
                                {/* Badges inactifs pour la démo */}
                                <span className="opacity-40 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold flex items-center gap-1"><CheckCircle size={12}/> Validée</span>
                                <span className="px-3 py-1 bg-slate-200 text-slate-600 rounded-full text-xs font-bold flex items-center gap-1 ring-2 ring-blue-500 ring-offset-2"><Clock size={12}/> En attente</span>
                                <span className="opacity-40 px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold flex items-center gap-1"><XCircle size={12}/> Refusée</span>
                            </div>
                        </div>
                        <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide">
                            🚧 En développement
                        </div>
                    </div>
                </div>

                {/* 4. HISTORIQUE SANCTIONS */}
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
                        <p className="text-sm text-slate-400 italic">Aucune sanction enregistrée. Utilisateur exemplaire.</p>
                    )}
                </div>

                {/* 5. HISTORIQUE ÉVÉNEMENTS */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
                    <h3 className="font-bold text-slate-500 uppercase text-xs flex items-center gap-2 mb-4">
                        <History size={14}/> Historique des Événements ({userDetails.events.length})
                    </h3>

                    {loadingDetails ? (
                        <div className="text-center py-4 text-slate-400">Chargement de l'historique...</div>
                    ) : userDetails.events.length > 0 ? (
                        <div className="space-y-3">
                            {userDetails.events.map(evt => (
                                <div key={evt.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-bold text-sm text-slate-800 dark:text-white truncate">{evt.title}</h4>
                                            {/* BADGES STATUT EVENT */}
                                            {evt.is_banned ? (
                                                <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-bold uppercase">Banni</span>
                                            ) : evt.is_cancelled ? (
                                                <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-bold uppercase">Annulé</span>
                                            ) : evt.is_visible ? (
                                                <span className="text-[10px] bg-green-100 text-green-600 px-1.5 py-0.5 rounded font-bold uppercase">En ligne</span>
                                            ) : (
                                                <span className="text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded font-bold uppercase">Terminé</span>
                                            )}
                                        </div>
                                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                                            <Calendar size={10}/> {new Date(evt.start_time).toLocaleDateString()}
                                            <span className="mx-1">•</span>
                                            <MapPin size={10}/> {evt.location_name || "Privé"}
                                        </p>
                                    </div>
                                    
                                    {/* Compteur Signalements */}
                                    {evt.reports && evt.reports[0]?.count > 0 ? (
                                        <div className="flex items-center gap-1 bg-orange-100 text-orange-700 px-2 py-1 rounded-lg text-xs font-bold" title="Signalements reçus">
                                            <AlertTriangle size={12}/> {evt.reports[0].count}
                                        </div>
                                    ) : (
                                        <div className="text-xs text-slate-300 font-bold px-2">0 sign.</div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-slate-400 italic">Aucun événement organisé pour le moment.</p>
                    )}
                </div>

            </div>
        ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-50">
                <User size={64} className="mb-4" />
                <p className="text-lg font-medium">Sélectionnez un utilisateur</p>
                <p className="text-sm">Pour voir son dossier complet, ses sanctions et ses événements.</p>
            </div>
        )}
      </div>
    </main>
  )
}