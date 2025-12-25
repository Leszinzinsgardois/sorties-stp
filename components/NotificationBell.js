'use client'

import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { supabase } from '@/lib/supabase'
import { 
  Bell, Check, X, Megaphone, Zap, Info, 
  AlertTriangle, BadgeCheck, Clock, CheckCircle2 
} from 'lucide-react'

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([])
  const [readIds, setReadIds] = useState(new Set())
  const [isOpen, setIsOpen] = useState(false)
  const [selectedNotif, setSelectedNotif] = useState(null)
  const [mounted, setMounted] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    setMounted(true)
    fetchNotifications()
    
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  async function fetchNotifications() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: allNotifs } = await supabase
      .from('admin_notifications')
      .select('*')
      .order('created_at', { ascending: false })

    const { data: userReads } = await supabase
      .from('user_notification_reads')
      .select('notification_id')
      .eq('user_id', user.id)

    setNotifications(allNotifs || [])
    setReadIds(new Set(userReads?.map(r => r.notification_id) || []))
  }

  async function markAsRead(notifId) {
    if (readIds.has(notifId)) {
        setSelectedNotif(null)
        return
    }

    const { data: { user } } = await supabase.auth.getUser()
    
    await supabase.from('user_notification_reads').insert({
        user_id: user.id,
        notification_id: notifId
    })

    setReadIds(prev => new Set(prev).add(notifId))
    setSelectedNotif(null) 
  }

  const unreadCount = notifications.filter(n => !readIds.has(n.id)).length

  const getTypeIcon = (type) => {
    switch(type) {
        case 'update': return <Zap size={18} className="text-purple-500"/>
        case 'alert': return <AlertTriangle size={18} className="text-red-500"/>
        default: return <Info size={18} className="text-blue-500"/>
    }
  }

  // --- LE MODAL (PORTAL) ---
  const ModalContent = selectedNotif ? (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
        <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-200 border border-slate-200 dark:border-slate-800">
            
            {/* Header Stylé */}
            <div className="bg-slate-50 dark:bg-slate-950 p-6 text-center border-b border-slate-100 dark:border-slate-800 relative">
                <button 
                    onClick={() => setSelectedNotif(null)}
                    className="absolute top-4 right-4 p-2 bg-slate-200 dark:bg-slate-800 rounded-full hover:bg-slate-300 dark:hover:bg-slate-700 transition"
                >
                    <X size={18}/>
                </button>

                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mx-auto mb-3 flex items-center justify-center shadow-lg shadow-blue-500/30">
                    <Megaphone className="text-white" size={32}/>
                </div>
                
                <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Oukonsort • DEV TEAM</h2>
                <div className="inline-flex items-center gap-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-[10px] font-bold uppercase mt-2">
                    <BadgeCheck size={12}/> Développeurs Certifiés
                </div>
            </div>

            {/* Contenu */}
            <div className="p-6">
                <div className="flex items-center gap-2 mb-4 text-slate-500 text-xs font-bold uppercase tracking-wide">
                    {getTypeIcon(selectedNotif.type)}
                    <span>{selectedNotif.type === 'update' ? 'Mise à jour' : selectedNotif.type === 'alert' ? 'Alerte Importante' : 'Information'}</span>
                    <span className="mx-1">•</span>
                    {/* DATE ET HEURE AJOUTÉES ICI */}
                    <Clock size={12}/> {new Date(selectedNotif.created_at).toLocaleDateString()} à {new Date(selectedNotif.created_at).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
                </div>

                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 leading-tight">
                    {selectedNotif.title}
                </h3>
                
                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 mb-6 max-h-[40vh] overflow-y-auto">
                    <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                        {selectedNotif.content}
                    </p>
                </div>

                {/* Action */}
                <button 
                    onClick={() => markAsRead(selectedNotif.id)}
                    className={`w-full py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition ${
                        readIds.has(selectedNotif.id) 
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700' 
                        : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/30'
                    }`}
                >
                    {readIds.has(selectedNotif.id) ? (
                        <> <Check size={18}/> Fermer (Lu) </>
                    ) : (
                        "Marquer comme lu"
                    )}
                </button>
            </div>
        </div>
    </div>
  ) : null

  return (
    <div className="relative" ref={dropdownRef}>
      
      {/* CLOCHE */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition text-slate-600 dark:text-slate-300"
      >
        <Bell size={24} />
        {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white border-2 border-white dark:border-slate-900 animate-pulse">
                {unreadCount}
            </span>
        )}
      </button>

      {/* DROPDOWN MENU */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 md:w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 origin-top-right">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 backdrop-blur-sm">
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">Notifications Officielles</h3>
                <p className="text-xs text-slate-500">L'équipe Oukonsort</p>
            </div>
            
            <div className="max-h-[60vh] overflow-y-auto">
                {notifications.length === 0 ? (
                    <div className="p-8 text-center text-slate-400 text-sm">
                        Rien à signaler, tout roule ! 🛹
                    </div>
                ) : (
                    notifications.map(notif => {
                        const isRead = readIds.has(notif.id)
                        return (
                            <button 
                                key={notif.id}
                                onClick={() => { setIsOpen(false); setSelectedNotif(notif); }}
                                className={`w-full text-left p-4 border-b border-slate-50 dark:border-slate-800/50 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800 transition flex gap-3 ${!isRead ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}
                            >
                                <div className={`mt-1 shrink-0 ${!isRead ? 'animate-bounce' : ''}`}>
                                    {getTypeIcon(notif.type)}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-1">
                                        <h4 className={`text-sm ${!isRead ? 'font-bold text-slate-900 dark:text-white' : 'font-medium text-slate-600 dark:text-slate-400'}`}>
                                            {notif.title}
                                        </h4>
                                        {isRead && <CheckCircle2 size={14} className="text-green-500 shrink-0 ml-2"/>}
                                    </div>
                                    <p className="text-xs text-slate-500 line-clamp-2">{notif.content}</p>
                                    <span className="text-[10px] text-slate-400 mt-2 block">
                                        {new Date(notif.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                            </button>
                        )
                    })
                )}
            </div>
        </div>
      )}

      {/* MODAL TÉLÉPORTÉ */}
      {mounted && createPortal(ModalContent, document.body)}

    </div>
  )
}