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
              Oukonsort est un service numérique édité par <strong>Antoine F.</strong>, étudiant, à titre strictement personnel et non professionnel, dans le cadre d’un projet expérimental (MVP).
            </p>
            <p>
              Le projet a vocation à évoluer ultérieurement vers une structure associative, sans que cela n’affecte les droits et obligations des utilisateurs existants.
            </p>
          </div>

          <div className="space-y-2 text-slate-600 dark:text-slate-300">
            <h3 className="font-bold text-slate-900 dark:text-white">Contact</h3>
            <p>Email : antoinef30350@icloud.com</p>
          </div>

          <div className="space-y-2 text-slate-600 dark:text-slate-300">
            <h3 className="font-bold text-slate-900 dark:text-white">Hébergement et infrastructure</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Frontend :</strong> Netlify (via GitHub)</li>
              <li><strong>Backend & Base de données :</strong> Supabase</li>
              <li><strong>Infrastructure :</strong> AWS – Région West Europe (Irlande). Les données sont hébergées au sein de l’Union européenne.</li>
            </ul>
          </div>

          <div className="space-y-2 text-slate-600 dark:text-slate-300">
            <h3 className="font-bold text-slate-900 dark:text-white">Accès au service</h3>
            <p>Le service est accessible à l’adresse suivante : <a href="https://oukonsort.netlify.app" className="text-blue-500 hover:underline">https://oukonsort.netlify.app</a></p>
          </div>
        </section>

        {/* II. CGU */}
        <section className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 space-y-8">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                <FileText size={24}/> II. Conditions Générales d'Utilisation
            </h2>
            <p className="text-sm text-slate-400 mt-2 font-mono">Version V2.1 – MVP (Décembre 2025)</p>
          </div>
          
          <article className="space-y-2 text-slate-600 dark:text-slate-300">
            <h3 className="font-bold text-slate-900 dark:text-white">Article 1 – Présentation du service</h3>
            <p>Oukonsort est une application numérique permettant de faciliter l’organisation logistique de sorties et d’événements privés ou publics, principalement à destination des lycéens et étudiants.</p>
            <p>Oukonsort agit exclusivement en tant qu’intermédiaire technique, mettant à disposition des outils numériques de création, de gestion et de participation à des événements.</p>
            <p>L’application est proposée sous la forme d’une <strong>version MVP (Minimum Viable Product)</strong>, susceptible d’évoluer à tout moment.</p>
          </article>

          <article className="space-y-2 text-slate-600 dark:text-slate-300">
            <h3 className="font-bold text-slate-900 dark:text-white">Article 1 bis – Événements publics et partenariats</h3>
            <p>Oukonsort peut proposer ou relayer des événements publics, organisés en collaboration avec des tiers (groupes privés, acteurs publics, associations).</p>
            <p>La promotion de ces événements est réalisée via des espaces dédiés au sein de l’application, notamment la page Partners. Sauf indication contraire explicite, Oukonsort n’est pas l’organisateur des événements promus et agit uniquement en tant que support de diffusion.</p>
          </article>

          <article className="space-y-2 text-slate-600 dark:text-slate-300">
            <h3 className="font-bold text-slate-900 dark:text-white">Article 1 ter – Événements organisés par Oukonsort</h3>
            <p>Dans l’hypothèse où Oukonsort serait amené à organiser directement un événement, cette qualité serait clairement indiquée par des éléments de certification spécifiques.</p>
            <p>Une attestation ou lettre émise par le représentant désigné d’Oukonsort pourra être associée à l’événement afin d’en certifier l’authenticité. L’intégration de documents justificatifs est réservée aux personnes expressément habilitées.</p>
          </article>

          <article className="space-y-2 text-slate-600 dark:text-slate-300">
            <h3 className="font-bold text-slate-900 dark:text-white">Article 2 – Définitions et rôles des utilisateurs</h3>
            <ul className="list-disc pl-5 space-y-1">
                <li><strong>Utilisateur :</strong> toute personne utilisant le service.</li>
                <li><strong>Organisateur :</strong> utilisateur créant et administrant un événement.</li>
                <li><strong>Invité :</strong> utilisateur participant à un événement, avec ou sans compte.</li>
            </ul>
            <p>Tous les utilisateurs sont soumis aux présentes CGU.</p>
          </article>

          <article className="space-y-2 text-slate-600 dark:text-slate-300">
            <h3 className="font-bold text-slate-900 dark:text-white">Article 3 – Conditions d’accès et âge minimum</h3>
            <p>L’accès au service est réservé aux personnes âgées de <strong>16 ans minimum</strong>.</p>
            <p>Pour les utilisateurs mineurs, l’utilisation du service s’effectue sous la responsabilité exclusive de leurs représentants légaux et avec leur consentement préalable.</p>
            <p>L’Éditeur ne dispose pas de moyens techniques permettant de vérifier systématiquement l’âge réel des utilisateurs, mais se réserve le droit de suspendre ou supprimer un compte en cas de doute, d’abus ou de signalement.</p>
          </article>

          <article className="space-y-2 text-slate-600 dark:text-slate-300">
            <h3 className="font-bold text-slate-900 dark:text-white">Article 4 – Nature du service et limitation de responsabilité</h3>
            <p>Oukonsort n’organise aucun événement (sauf mention contraire), ne participe à aucun événement et n’exerce aucun contrôle sur leur déroulement. L’Éditeur agit uniquement comme intermédiaire technique.</p>
            <p>L’Éditeur ne saurait être tenu responsable des incidents, accidents ou dommages survenant avant, pendant ou après un événement, ni du comportement des participants.</p>
            <p>L’utilisation de moyens de communication externes ou la transmission d’informations privées entre utilisateurs s’effectue sous leur entière responsabilité.</p>
          </article>

          <article className="space-y-2 text-slate-600 dark:text-slate-300">
            <h3 className="font-bold text-slate-900 dark:text-white">Article 5 – Responsabilité des Organisateurs</h3>
            <p>L’Organisateur est seul responsable du contenu de l’événement, du lieu choisi (public ou privé), du respect des lois en vigueur, du comportement des participants et de la sécurité des personnes et des biens.</p>
            <p>Les événements illégaux, rassemblements non autorisés ou toute activité enfreignant la loi sont strictement interdits.</p>
          </article>

          <article className="space-y-2 text-slate-600 dark:text-slate-300">
             <h3 className="font-bold text-slate-900 dark:text-white">Article 6 – Lieux privés et confidentialité</h3>
             <p>Pour les événements privés, Oukonsort invite expressément les utilisateurs à ne pas communiquer d’adresse privée exacte au sein de l’application. Seuls doivent être indiqués un point de rendez-vous public ou un lieu situé à proximité.</p>
             <p>Toute communication d’informations sensibles (adresse exacte, codes d’accès) relève de la responsabilité exclusive de l’Organisateur.</p>
          </article>

          <article className="space-y-2 text-slate-600 dark:text-slate-300">
             <h3 className="font-bold text-slate-900 dark:text-white">Article 6 bis – Communications externes entre utilisateurs</h3>
             <p>Oukonsort ne propose pas de système de messagerie privée. Les échanges effectués en dehors de l’application (réseaux sociaux, etc.) ne relèvent ni du contrôle ni de la responsabilité de l’Éditeur.</p>
          </article>

          <article className="space-y-2 text-slate-600 dark:text-slate-300">
             <h3 className="font-bold text-slate-900 dark:text-white">Article 7 – Accès aux informations des événements</h3>
             <ul className="list-disc pl-5 space-y-1">
                <li>Les <strong>Organisateurs</strong> ont accès à la liste des participants à leur événement.</li>
                <li>Les <strong>Invités</strong> n’ont accès qu’à un compteur de participants, sans visibilité sur l’identité des autres membres.</li>
                <li>L’équipe de modération dispose d’un accès étendu strictement nécessaire à l’exercice de ses missions.</li>
             </ul>
          </article>

          <article className="space-y-2 text-slate-600 dark:text-slate-300">
             <h3 className="font-bold text-slate-900 dark:text-white">Article 8 – Signalement et sécurité</h3>
             <p>Les signalements sont conservés 1 an maximum et peuvent être utilisés à des fins de modération ou de coopération avec les autorités. Le système de signalement ne remplace en aucun cas un dépôt de plainte auprès des autorités compétentes.</p>
          </article>

          <article className="space-y-2 text-slate-600 dark:text-slate-300">
             <h3 className="font-bold text-slate-900 dark:text-white">Article 9 – Modération et sanctions</h3>
             <p>L’Éditeur peut suspendre ou supprimer un compte ou un événement sans obligation de justification publique. Les actions de modération sont journalisées et les archives conservées 1 an maximum.</p>
          </article>

          <article className="space-y-2 text-slate-600 dark:text-slate-300">
             <h3 className="font-bold text-slate-900 dark:text-white">Article 10 – Vérification d’identité</h3>
             <p>Une fonctionnalité de vérification d’identité (CNI) existe mais n’est pas activée par défaut. Si elle devait être déployée, elle servirait uniquement à des fins de sécurité. Les documents d’identité ne sont jamais conservés en tant que tels ; seul le résultat de la vérification est enregistré.</p>
          </article>

          <article className="space-y-2 text-slate-600 dark:text-slate-300">
             <h3 className="font-bold text-slate-900 dark:text-white">Article 11 – Données personnelles</h3>
             <p>Les données collectées (Nom, Prénom, Email, Date de naissance, Pseudo) sont accessibles uniquement par l’utilisateur concerné et le staff habilité.</p>
          </article>

          <article className="space-y-2 text-slate-600 dark:text-slate-300">
             <h3 className="font-bold text-slate-900 dark:text-white">Article 12 – Confidentialité des événements</h3>
             <p>Les événements sont privés par défaut et non référencés. Les événements publics constituent une exception définie par l’Organisateur ou dans le cadre de partenariats.</p>
          </article>

          <article className="space-y-2 text-slate-600 dark:text-slate-300">
             <h3 className="font-bold text-slate-900 dark:text-white">Article 13 – Coopération avec les autorités</h3>
             <p>L’Éditeur coopérera avec les autorités compétentes dans le cadre strict des obligations légales et des réquisitions judiciaires.</p>
          </article>

          <article className="space-y-2 text-slate-600 dark:text-slate-300">
             <h3 className="font-bold text-slate-900 dark:text-white">Article 14 – Modèle économique</h3>
             <p>Le service est actuellement gratuit. L’Éditeur se réserve le droit d’introduire ultérieurement des fonctionnalités payantes ou des commissions.</p>
          </article>

          <article className="space-y-2 text-slate-600 dark:text-slate-300">
             <h3 className="font-bold text-slate-900 dark:text-white">Article 15 – Acceptation des CGU</h3>
             <p>L’utilisation du service implique l’acceptation pleine et entière des présentes CGU.</p>
          </article>
        </section>

        {/* III. CONFIDENTIALITÉ */}
        <section className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 space-y-6">
          <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
            <ShieldCheck size={24}/> III. Politique de Confidentialité (RGPD)
          </h2>
          
          <div className="space-y-2 text-slate-600 dark:text-slate-300">
            <h3 className="font-bold text-slate-900 dark:text-white">Données collectées</h3>
            <ul className="list-disc pl-5">
              <li><strong>Organisateurs :</strong> Email, Nom, Prénom, Date de naissance, Pseudo.</li>
              <li><strong>Invités sans compte :</strong> Pseudo temporaire.</li>
            </ul>
            <p className="mt-2 text-sm italic">Aucune adresse privée exacte d’événement n’est enregistrée par défaut (sauf si elle est directement renseignée dans le champ adresse privée du formulaire, auquel cas le support y aura accès).</p>
          </div>

          <div className="space-y-2 text-slate-600 dark:text-slate-300">
            <h3 className="font-bold text-slate-900 dark:text-white">Durée de conservation</h3>
            <ul className="list-disc pl-5 space-y-1">
                <li><strong>Suppression demandée :</strong> compte désactivé après 30 jours (réactivation possible durant ce délai).</li>
                <li><strong>Après 1 an :</strong> suppression des données d’état civil et des événements.</li>
                <li><strong>Après 5 ans :</strong> suppression définitive du profil et des identifiants techniques.</li>
            </ul>
            <p className="text-sm mt-2">Certaines données peuvent être conservées sous forme anonymisée pour des raisons de sécurité ou d’obligations légales.</p>
          </div>

          <div className="space-y-2 text-slate-600 dark:text-slate-300">
            <h3 className="font-bold text-slate-900 dark:text-white">Vos droits</h3>
            <p>
              Conformément au RGPD, vous disposez d’un droit d’accès, de rectification et de suppression. Ces droits peuvent être exercés depuis la page "Mon Compte" ou par email : <strong>antoinef30350@icloud.com</strong> (en indiquant clairement votre Nom/Prénom et date de naissance ainsi que les raisons de la suppression; une carte d'identité pourra être demandée pour certifier la demande).
            </p>
          </div>
        </section>

      </div>
    </main>
  )
}