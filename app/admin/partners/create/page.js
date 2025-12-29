'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  Building2, Save, ArrowLeft, MapPin, 
  Globe, Mail, BadgeCheck, User, FileText 
} from 'lucide-react'

export default function CreatePartner() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    type: 'private', 
    association_type: '', // NOUVEAU CHAMP
    siret: '',
    address: '',
    city: 'Montpellier',
    email_pro: '',
    description: '',
    logo_url: '',
    website: '',
    is_partner: false,
    status: 'beta',
    is_verified: false
  })

  const [representative, setRepresentative] = useState({
    nom: '',
    prenom: '',
    role: '',
    email: '',
    phone: ''
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleRepChange = (e) => {
    const { name, value } = e.target
    setRepresentative(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()

      // Si ce n'est pas une asso, on nettoie le champ association_type
      const finalPayload = {
          ...formData,
          association_type: formData.type === 'association' ? formData.association_type : null,
          representative_info: representative,
          created_by: user?.id
      }

      const { data, error } = await supabase
        .from('institutions')
        .insert([finalPayload])
        .select()
        .single()

      if (error) throw error
      router.push(`/admin/partners/${data.id}`)

    } catch (error) {
      alert("Erreur lors de la création : " + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20 transition-colors">
      
      {/* HEADER */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-6 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-4">
                <Link href="/admin/partners" className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300">
                    <ArrowLeft size={20}/>
                </Link>
                <h1 className="text-xl font-black text-slate-900 dark:text-white">Nouvelle Structure</h1>
            </div>
            <button onClick={handleSubmit} disabled={loading} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-blue-700 disabled:opacity-50">
                <Save size={20}/> {loading ? 'Création...' : 'Créer'}
            </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* BLOC 1 : IDENTITÉ */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <h2 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                <Building2 size={18} className="text-blue-500"/> Identité Structure
            </h2>
            
            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nom *</label>
                <input type="text" name="name" required className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-sm dark:text-white" value={formData.name} onChange={handleChange} placeholder="Ex: Le Moomba" />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Type *</label>
                    <select name="type" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-sm dark:text-white" value={formData.type} onChange={handleChange}>
                        <option value="private">Établissement (Privé)</option>
                        <option value="public">Institution (Public)</option>
                        <option value="association">Association</option>
                    </select>
                </div>
                
                {/* --- SOUS-TYPE (Conditionnel) --- */}
                {formData.type === 'association' ? (
                    <div>
                        <label className="block text-xs font-bold text-blue-500 uppercase mb-1">Catégorie Asso *</label>
                        <select name="association_type" className="w-full bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-2 text-sm dark:text-white text-blue-900 font-medium" value={formData.association_type} onChange={handleChange}>
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
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">SIRET</label>
                        <input type="text" name="siret" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-sm dark:text-white" value={formData.siret} onChange={handleChange} />
                    </div>
                )}
            </div>
            
            {/* SIRET visible aussi pour les assos en bas si besoin, sinon on le laisse dans le "else" au dessus. 
                Souvent les assos ont un RNA plutôt qu'un SIRET, mais gardons SIRET générique */}
            {formData.type === 'association' && (
                 <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Numéro RNA / SIRET</label>
                    <input type="text" name="siret" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-sm dark:text-white" value={formData.siret} onChange={handleChange} />
                </div>
            )}

            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Description Courte</label>
                <textarea name="description" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-sm dark:text-white h-20" value={formData.description} onChange={handleChange} placeholder="Description..." />
            </div>
        </div>

        {/* BLOC 2 : CONTACT & WEB */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <h2 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                <Globe size={18} className="text-purple-500"/> Contact & Web
            </h2>

            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Adresse</label>
                <div className="flex gap-2">
                    <MapPin size={18} className="text-slate-400 mt-2"/>
                    <input type="text" name="address" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-sm dark:text-white" value={formData.address} onChange={handleChange} placeholder="12 rue..." />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Ville</label>
                    <input type="text" name="city" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-sm dark:text-white" value={formData.city} onChange={handleChange} />
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email Pro</label>
                    <input type="email" name="email_pro" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-sm dark:text-white" value={formData.email_pro} onChange={handleChange} />
                </div>
            </div>

            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Logo URL</label>
                <input type="text" name="logo_url" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-sm dark:text-white" value={formData.logo_url} onChange={handleChange} placeholder="https://..." />
            </div>
             <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Site Web</label>
                <input type="text" name="website" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-sm dark:text-white" value={formData.website} onChange={handleChange} placeholder="https://..." />
            </div>
        </div>

        {/* BLOC 3 : RESPONSABLE LÉGAL */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <h2 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                <User size={18} className="text-orange-500"/> {formData.type === 'association' ? 'Président / Responsable' : 'Représentant Légal'}
            </h2>
            <div className="grid grid-cols-2 gap-4">
                <input type="text" name="nom" placeholder="Nom" className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-sm dark:text-white" value={representative.nom} onChange={handleRepChange} />
                <input type="text" name="prenom" placeholder="Prénom" className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-sm dark:text-white" value={representative.prenom} onChange={handleRepChange} />
            </div>
            <input type="text" name="role" placeholder="Rôle (ex: Gérant, Président...)" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-sm dark:text-white" value={representative.role} onChange={handleRepChange} />
            <div className="grid grid-cols-2 gap-4">
                <input type="email" name="email" placeholder="Email Perso" className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-sm dark:text-white" value={representative.email} onChange={handleRepChange} />
                <input type="tel" name="phone" placeholder="Téléphone" className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-sm dark:text-white" value={representative.phone} onChange={handleRepChange} />
            </div>
        </div>

        {/* BLOC 4 : STATUT & ADMIN */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <h2 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                <BadgeCheck size={18} className="text-green-500"/> Administration
            </h2>
            
            <div className="space-y-3">
                <label className="flex items-center justify-between p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg cursor-pointer">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Statut Partenaire (Badge Bleu)</span>
                    <input type="checkbox" name="is_partner" className="w-5 h-5" checked={formData.is_partner} onChange={handleChange} />
                </label>
                
                <label className="flex items-center justify-between p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg cursor-pointer">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Identité Vérifiée (Kbis/RNA OK)</span>
                    <input type="checkbox" name="is_verified" className="w-5 h-5" checked={formData.is_verified} onChange={handleChange} />
                </label>

                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">État du compte</label>
                    <select name="status" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-sm dark:text-white" value={formData.status} onChange={handleChange}>
                        <option value="beta">Bêta / Simulation</option>
                        <option value="active">Actif</option>
                        <option value="suspended">Suspendu</option>
                    </select>
                </div>
            </div>
        </div>

      </div>
    </main>
  )
}