'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  Send, ArrowLeft, Megaphone, AlertTriangle, 
  Info, Zap, FileText, CheckCircle 
} from 'lucide-react'

export default function AdminCommunications() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [history, setHistory] = useState([])
  
  const [form, setForm] = useState({
    title: '',
    content: '',
    type: 'info' // info, update, alert
  })

  useEffect(() => {
    checkAdmin()
  }, [])

  async function checkAdmin() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return router.push('/login')
    
    // Vérif role
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    if (profile?.role !== 'admin') return router.push('/dashboard')

    fetchHistory()
  }

  async function fetchHistory() {
    const { data } = await supabase
      .from('admin_notifications')
      .select('*')
      .order('created_at', { ascending: false })
    
    setHistory(data || [])
    setLoading(false)
  }

  async function sendNotification(e) {
    e.preventDefault()
    if(!confirm("Envoyer cette notification à TOUS les utilisateurs ?")) return

    const { data: { user } } = await supabase.auth.getUser()

    const { error } = await supabase.from('admin_notifications').insert([{
        ...form,
        created_by: user.id
    }])

    if (error) alert("Erreur: " + error.message)
    else {
        alert("Notification envoyée !")
        setForm({ title: '', content: '', type: 'info' })
        fetchHistory()
    }
  }

  if (loading) return <div className="p-10 text-white">Chargement...</div>

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 transition-colors">
      <div className="max-w-4xl mx-auto">
        
        {/* HEADER */}
        <div className="flex items-center gap-4 mb-8">
            <Link href="/admin" className="p-2 rounded-full bg-slate-200 dark:bg-slate-800 hover:opacity-80 transition">
                <ArrowLeft size={20} className="text-slate-700 dark:text-white"/>
            </Link>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Megaphone className="text-blue-600"/> Communications Officielles
            </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* FORMULAIRE D'ENVOI */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm h-fit">
                <h2 className="font-bold text-lg text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                    <Send size={18} className="text-green-500"/> Nouvelle Notification
                </h2>
                
                <form onSubmit={sendNotification} className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Type</label>
                        <div className="grid grid-cols-3 gap-2">
                            {['info', 'update', 'alert'].map(t => (
                                <button 
                                    key={t}
                                    type="button"
                                    onClick={() => setForm({...form, type: t})}
                                    className={`py-2 rounded-xl text-sm font-bold capitalize border ${form.type === t ? 'bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900' : 'bg-transparent text-slate-500 border-slate-200 dark:border-slate-700'}`}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Titre</label>
                        <input 
                            type="text" required
                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                            value={form.title}
                            onChange={e => setForm({...form, title: e.target.value})}
                            placeholder="Ex: Mise à jour 2.0 !"
                        />
                    </div>

                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Contenu</label>
                        <textarea 
                            required
                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 min-h-[150px]"
                            value={form.content}
                            onChange={e => setForm({...form, content: e.target.value})}
                            placeholder="Message à envoyer..."
                        />
                    </div>

                    <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition flex items-center justify-center gap-2">
                        <Send size={18}/> Diffuser
                    </button>
                </form>
            </div>

            {/* HISTORIQUE */}
            <div className="bg-slate-100 dark:bg-slate-900/50 p-6 rounded-3xl border border-slate-200 dark:border-slate-800">
                <h2 className="font-bold text-lg text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                    <FileText size={18} className="text-purple-500"/> Historique ({history.length})
                </h2>
                
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                    {history.map(notif => (
                        <div key={notif.id} className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                            <div className="flex justify-between items-start mb-2">
                                <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase ${notif.type === 'alert' ? 'bg-red-100 text-red-600' : notif.type === 'update' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                                    {notif.type}
                                </span>
                                <span className="text-xs text-slate-400">{new Date(notif.created_at).toLocaleDateString()}</span>
                            </div>
                            <h3 className="font-bold text-slate-800 dark:text-white text-sm">{notif.title}</h3>
                            <p className="text-xs text-slate-500 mt-1 line-clamp-2">{notif.content}</p>
                        </div>
                    ))}
                    {history.length === 0 && <p className="text-center text-slate-400 text-sm">Aucun message envoyé.</p>}
                </div>
            </div>

        </div>
      </div>
    </main>
  )
}