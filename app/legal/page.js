'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function LegalPage() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors pb-20">
      
      {/* HEADER SIMPLE */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10 px-6 py-4 flex items-center gap-4">
        <Link href="/login" className="bg-slate-100 dark:bg-slate-800 p-2 rounded-full text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-xl font-bold text-slate-800 dark:text-white">
          Mentions Légales & CGU
        </h1>
      </div>

      <div className="max-w-3xl mx-auto p-6 space-y-8">
        
        {/* I. MENTIONS LÉGALES */}
        <section className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 space-y-4">
          <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400">I. Mentions légales</h2>
          
          <div className="space-y-2 text-slate-600 dark:text-slate-300">
            <h3 className="font-bold text-slate-900 dark:text-white">Éditeur du service</h3>
            <p>
              Sorties MTP est un service numérique édité par <strong>[Ton Nom et Prénom]</strong>, étudiant, à titre non professionnel, dans le cadre d'un projet expérimental (MVP).
            </p>
          </div>

          <div className="space-y-2 text-slate-600 dark:text-slate-300">
            <h3 className="font-bold text-slate-900 dark:text-white">Contact</h3>
            <p>Email : contact@sortiesmtp.fr</p>
          </div>

          <div className="space-y-2 text-slate-600 dark:text-slate-300">
            <h3 className="font-bold text-slate-900 dark:text-white">Hébergement</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Frontend :</strong> Netlify (via GitHub).</li>
              <li><strong>Backend & Données :</strong> Supabase (infrastructure AWS, serveurs situés dans l'Union Européenne).</li>
            </ul>
          </div>
          
          <p className="text-sm text-slate-500 italic mt-4">
            Le service est fourni à titre gratuit, sans obligation de résultat, et peut évoluer à tout moment.
          </p>
        </section>

        {/* II. CGU */}
        <section className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 space-y-6">
          <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400">II. Conditions Générales d'Utilisation (CGU)</h2>
          
          <article className="space-y-2 text-slate-600 dark:text-slate-300">
            <h3 className="font-bold text-slate-900 dark:text-white">Article 1 - Objet du service</h3>
            <p>
              Sorties MTP a pour objet de faciliter l'organisation logistique de sorties privées entre personnes inscrites dans un établissement d'enseignement secondaire ou supérieur. 
              Le service agit exclusivement en tant qu'intermédiaire technique. L'Éditeur n'est en aucun cas organisateur, coorganisateur ou participant aux événements créés via la plateforme.
            </p>
          </article>

          <article className="space-y-2 text-slate-600 dark:text-slate-300">
            <h3 className="font-bold text-slate-900 dark:text-white">Article 2 - Accès et âge minimum</h3>
            <p>
              L'accès au service est réservé aux personnes âgées de 16 ans minimum. 
              Pour les utilisateurs mineurs, l'utilisation du service s'effectue sous la responsabilité de leurs représentants légaux.
            </p>
          </article>

          <article className="space-y-2 text-slate-600 dark:text-slate-300">
            <h3 className="font-bold text-slate-900 dark:text-white">Article 3 - Responsabilité de l'Organisateur</h3>
            <p>L'Organisateur est seul responsable du contenu, du lieu, de la sécurité des personnes et du respect des lois lors de son événement. L'Éditeur ne saurait être tenu responsable de tout incident ou accident survenu lors d'un événement.</p>
          </article>

          <article className="space-y-2 text-slate-600 dark:text-slate-300">
            <h3 className="font-bold text-slate-900 dark:text-white">Article 4 - Lieux privés</h3>
            <p>
              Pour les événements en lieu privé, l'adresse exacte n'est jamais stockée par le service. L'Organisateur doit définir un point de rendez-vous public.
            </p>
          </article>

          <article className="space-y-2 text-slate-600 dark:text-slate-300">
             <h3 className="font-bold text-slate-900 dark:text-white">Article 5 - Limites</h3>
             <p>Chaque événement est soumis à une limite technique stricte de 30 participants maximum. Il est interdit d'organiser des rassemblements soumis à déclaration administrative (manif, concert public...).</p>
          </article>
        </section>

        {/* III. CONFIDENTIALITÉ */}
        <section className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 space-y-6">
          <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400">III. Politique de Confidentialité (RGPD)</h2>
          
          <div className="space-y-2 text-slate-600 dark:text-slate-300">
            <h3 className="font-bold text-slate-900 dark:text-white">Données collectées</h3>
            <ul className="list-disc pl-5">
              <li><strong>Organisateurs :</strong> Email, Pseudo, Nom, Prénom, Date de naissance.</li>
              <li><strong>Invités :</strong> Pseudo uniquement (temporaire).</li>
            </ul>
            <p className="mt-2">Aucune adresse privée exacte n'est enregistrée en base de données.</p>
          </div>

          <div className="space-y-2 text-slate-600 dark:text-slate-300">
            <h3 className="font-bold text-slate-900 dark:text-white">Durée de conservation</h3>
            <p>
              Les événements deviennent invisibles 24h après leur fin. Les données techniques sont conservées 1 an maximum pour obligation légale, puis supprimées.
            </p>
          </div>

          <div className="space-y-2 text-slate-600 dark:text-slate-300">
            <h3 className="font-bold text-slate-900 dark:text-white">Vos droits</h3>
            <p>
              Conformément au RGPD, vous disposez d'un droit d'accès, modification et suppression de vos données en contactant : contact@sortiesmtp.fr.
            </p>
          </div>
        </section>

      </div>
    </main>
  )
}
