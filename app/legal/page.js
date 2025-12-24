'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft, Scale, FileText, ShieldCheck } from 'lucide-react'

export default function LegalPage() {
  const router = useRouter()

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors pb-20">
      
      {/* HEADER SIMPLE */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10 px-6 py-4 flex items-center gap-4">
        <button 
          onClick={() => router.back()} 
          className="bg-slate-100 dark:bg-slate-800 p-2 rounded-full text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold text-slate-800 dark:text-white">
          Mentions Légales & CGU
        </h1>
      </div>

      <div className="max-w-3xl mx-auto p-6 space-y-8">
        
        {/* I. MENTIONS LÉGALES */}
        <section className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 space-y-4">
          <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
            <Scale size={24}/> I. Mentions légales
          </h2>
          
          <div className="space-y-2 text-slate-600 dark:text-slate-300">
            <h3 className="font-bold text-slate-900 dark:text-white">Éditeur du service</h3>
            <p>
              Oukonsort est un service numérique édité par <strong>Antoine F.</strong>, étudiant, à titre non professionnel, dans le cadre d'un projet expérimental (MVP).
            </p>
          </div>

          <div className="space-y-2 text-slate-600 dark:text-slate-300">
            <h3 className="font-bold text-slate-900 dark:text-white">Contact</h3>
            <p>Email : contact@oukonsort.fr</p>
          </div>

          <div className="space-y-2 text-slate-600 dark:text-slate-300">
            <h3 className="font-bold text-slate-900 dark:text-white">Hébergement</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Frontend :</strong> Netlify (via GitHub).</li>
              <li><strong>Backend & Données :</strong> Supabase (infrastructure AWS, serveurs situés dans l'Union Européenne).</li>
            </ul>
          </div>
        </section>

        {/* II. CGU */}
        <section className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 space-y-8">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                <FileText size={24}/> II. Conditions Générales d'Utilisation
            </h2>
            <p className="text-sm text-slate-400 mt-2 font-mono">Dernière mise à jour : V1 (MVP)</p>
          </div>
          
          <article className="space-y-2 text-slate-600 dark:text-slate-300">
            <h3 className="font-bold text-slate-900 dark:text-white">Article 1 – Présentation du service et éditeur</h3>
            <p>Oukonsort est une application numérique ayant pour objet de faciliter l’organisation logistique de sorties privées entre personnes inscrites dans un établissement d’enseignement secondaire ou supérieur.</p>
            <p>Le service est édité et développé par le développeur de l’application, agissant à titre non professionnel (ci-après « l’Éditeur »).</p>
            <p>L’application est actuellement proposée sous la forme d’une <strong>version MVP (Minimum Viable Product)</strong> susceptible d’évoluer régulièrement.</p>
          </article>

          <article className="space-y-2 text-slate-600 dark:text-slate-300">
            <h3 className="font-bold text-slate-900 dark:text-white">Article 2 – Définitions et rôles des utilisateurs</h3>
            <p>Les utilisateurs du service se divisent en deux sous-rôles distincts :</p>
            <ul className="list-disc pl-5 space-y-1">
                <li><strong>Organisateur :</strong> utilisateur créant et gérant un événement ;</li>
                <li><strong>Invité :</strong> utilisateur rejoignant un événement via un lien de participation.</li>
            </ul>
            <p>Tous les utilisateurs sont soumis aux présentes CGU.</p>
          </article>

          <article className="space-y-2 text-slate-600 dark:text-slate-300">
            <h3 className="font-bold text-slate-900 dark:text-white">Article 3 – Accès au service et conditions d’âge</h3>
            <p>L’accès au service est réservé aux personnes âgées de <strong>16 ans minimum</strong>.</p>
            <p>Pour les utilisateurs mineurs, l’utilisation du service s’effectue sous la responsabilité de leurs représentants légaux.</p>
            <p>L’Éditeur ne dispose pas des moyens techniques permettant de vérifier systématiquement l’âge réel des utilisateurs ni l’existence d’un consentement parental.</p>
          </article>

          <article className="space-y-2 text-slate-600 dark:text-slate-300">
            <h3 className="font-bold text-slate-900 dark:text-white">Article 4 – Nature du service et responsabilité de l’Éditeur</h3>
            <p>Oukonsort agit exclusivement en tant qu’intermédiaire technique.</p>
            <p>L’Éditeur n’organise aucun événement, ne participe à aucun événement, et ne contrôle pas le déroulement des événements.</p>
            <p>En conséquence, l’Éditeur ne saurait être tenu responsable de tout incident, accident, dommage corporel, matériel ou moral survenant avant, pendant ou après un événement.</p>
          </article>

          <article className="space-y-2 text-slate-600 dark:text-slate-300">
            <h3 className="font-bold text-slate-900 dark:text-white">Article 5 – Responsabilité des Organisateurs</h3>
            <p>L’Organisateur est seul responsable du contenu de l’événement créé, du lieu choisi (public ou privé), du respect de la législation en vigueur, du comportement des participants, de la sécurité des personnes et des biens, et des consommations éventuelles.</p>
          </article>

          <article className="space-y-2 text-slate-600 dark:text-slate-300">
             <h3 className="font-bold text-slate-900 dark:text-white">Article 6 – Lieux privés et confidentialité</h3>
             <p>Pour les événements se déroulant dans un lieu privé, l’adresse exacte du lieu n’est jamais demandée ni stockée. Un <strong>point de rendez-vous public</strong> est obligatoire.</p>
             <p>L’Organisateur est seul responsable des informations complémentaires qu’il choisit de communiquer aux participants par des moyens externes.</p>
          </article>

          <article className="space-y-2 text-slate-600 dark:text-slate-300">
             <h3 className="font-bold text-slate-900 dark:text-white">Article 7 – Accès aux informations des événements</h3>
             <ul className="list-disc pl-5 space-y-1">
                <li>Les <strong>Organisateurs</strong> ont accès à la liste des participants à leur événement.</li>
                <li>Les <strong>Invités</strong> n’ont accès qu’à un compteur de participants, sans visibilité sur l’identité des autres membres.</li>
                <li>L’équipe de modération dispose d’un accès étendu nécessaire à l’exercice de ses missions.</li>
             </ul>
          </article>

          <article className="space-y-2 text-slate-600 dark:text-slate-300">
             <h3 className="font-bold text-slate-900 dark:text-white">Article 8 – Signalement et sécurité</h3>
             <p>L’application permet le signalement d’événement. Les signalements sont conservés 1 an maximum et peuvent être utilisés pour la modération ou la coopération avec les autorités.</p>
             <p className="italic text-sm">Le système de signalement ne remplace en aucun cas un dépôt de plainte auprès des autorités compétentes.</p>
          </article>

          <article className="space-y-2 text-slate-600 dark:text-slate-300">
             <h3 className="font-bold text-slate-900 dark:text-white">Article 9 – Modération et sanctions</h3>
             <p>L’Éditeur peut suspendre ou supprimer un compte/événement en cas de violation des CGU. Les archives de modération sont conservées 1 an.</p>
          </article>

          <article className="space-y-2 text-slate-600 dark:text-slate-300">
             <h3 className="font-bold text-slate-900 dark:text-white">Article 10 – Vérification d’identité</h3>
             <p>La fonctionnalité de vérification d’identité (CNI) n'est pas active à ce jour. L’Éditeur se réserve le droit de l’activer ultérieurement pour sécuriser le service.</p>
          </article>

          <article className="space-y-2 text-slate-600 dark:text-slate-300">
             <h3 className="font-bold text-slate-900 dark:text-white">Article 11 – Données personnelles</h3>
             <p>Les données privées (Nom, Prénom, Email, Date de naissance) sont accessibles uniquement par l’utilisateur et le staff. Le Pseudo est public.</p>
             <p>Chaque utilisateur peut modifier ses accès ou demander la suppression de son compte (délai 30 jours).</p>
          </article>

          <article className="space-y-2 text-slate-600 dark:text-slate-300">
             <h3 className="font-bold text-slate-900 dark:text-white">Article 12 – Confidentialité par défaut</h3>
             <p>Les événements sont privés par défaut (non référencés). Les événements publics sont une exception définie par l’Organisateur.</p>
          </article>

          <article className="space-y-2 text-slate-600 dark:text-slate-300">
             <h3 className="font-bold text-slate-900 dark:text-white">Article 13 – Coopération avec les autorités</h3>
             <p>L’Éditeur coopérera avec les autorités compétentes dans le cadre légal strict (réquisitions judiciaires).</p>
          </article>

          <article className="space-y-2 text-slate-600 dark:text-slate-300">
             <h3 className="font-bold text-slate-900 dark:text-white">Article 14 – Modèle économique</h3>
             <p>Le service est actuellement gratuit. L'Éditeur se réserve le droit d'introduire des fonctionnalités payantes ou des commissions sur billetterie à l'avenir.</p>
          </article>

          <article className="space-y-2 text-slate-600 dark:text-slate-300">
             <h3 className="font-bold text-slate-900 dark:text-white">Article 15 – Acceptation</h3>
             <p>L’utilisation du service implique l’acceptation pleine et entière des présentes CGU.</p>
          </article>
        </section>

        {/* III. CONFIDENTIALITÉ (Restauré et Complété) */}
        <section className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 space-y-6">
          <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
            <ShieldCheck size={24}/> III. Politique de Confidentialité (RGPD)
          </h2>
          
          <div className="space-y-2 text-slate-600 dark:text-slate-300">
            <h3 className="font-bold text-slate-900 dark:text-white">Données collectées</h3>
            <ul className="list-disc pl-5">
              <li><strong>Organisateurs :</strong> Email, Pseudo, Nom, Prénom, Date de naissance (Vérification d'âge).</li>
              <li><strong>Invités :</strong> Pseudo uniquement (temporaire) pour la liste des participants.</li>)
            </ul>
            <p className="mt-2 text-sm italic">Aucune adresse privée exacte d'événement n'est enregistrée en base de données.(sauf si elle est directement renseignée dans l'adresse privée sur le formulaire de création d'évènement. Auquel cas le support y aura accès)</p>
          </div>

          <div className="space-y-2 text-slate-600 dark:text-slate-300">
            <h3 className="font-bold text-slate-900 dark:text-white">Durée de conservation</h3>
            <p>
              Les événements deviennent invisibles 24h après leur fin. Les données techniques (logs, signalements) sont conservées 1 an maximum pour obligation légale, puis supprimées.
            </p>
          </div>

          <div className="space-y-2 text-slate-600 dark:text-slate-300">
            <h3 className="font-bold text-slate-900 dark:text-white">Vos droits</h3>
            <p>
              Conformément au RGPD, vous disposez d'un droit d'accès, de rectification et de suppression de vos données. Vous pouvez exercer ce droit directement depuis votre page "Mon Compte" ou en contactant : contact@sortiesmtp.fr.
            </p>
          </div>
        </section>

      </div>
    </main>
  )
}