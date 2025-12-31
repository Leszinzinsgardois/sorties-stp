'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ScrollText } from 'lucide-react'

export default function CEUPage() {
  const router = useRouter()

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors pb-20">
      
      {/* HEADER */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10 px-6 py-4 flex items-center gap-4">
        <button 
          onClick={() => router.back()} 
          className="bg-slate-100 dark:bg-slate-800 p-2 rounded-full text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
            <h1 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <ScrollText size={20} className="text-blue-600"/> Charte d'Éthique (CEU)
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">Version 1.0</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto p-6">

        {/* DOCUMENT PAPIER */}
        <article className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 leading-relaxed space-y-8">
            
            {/* TITRE DU DOC */}
            <div className="border-b border-slate-100 dark:border-slate-800 pb-6 text-center">
                <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-2">Charte d’Éthique Utilisateur</h1>
                <p className="text-slate-500 dark:text-slate-400 font-medium">Respect, savoir-vivre et règles de la communauté</p>
            </div>

            {/* 1. PRÉAMBULE */}
            <section className="space-y-4">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">1. Préambule</h2>
                <p>
                    Oukonsort est une plateforme dédiée à la découverte, l’organisation et la participation à des événements et sorties réelles.
                    Elle repose sur une idée simple :
                </p>
                <blockquote className="border-l-4 border-blue-500 pl-4 italic text-lg font-medium text-slate-700 dark:text-slate-300 my-4">
                    "Organiser des sorties, pas des problèmes."
                </blockquote>
                <p>
                    La présente Charte d’Éthique Utilisateur (CEU) s’applique à <strong>toute personne interagissant avec la plateforme</strong> ou un événement, qu’elle soit :
                </p>
                <ul className="list-disc pl-6 space-y-1">
                    <li>Utilisateur disposant d’un compte ;</li>
                    <li>Ou invité à un événement, dès lors qu’une interaction existe (inscription, participation, présence, échange ou signalement).</li>
                </ul>
                <p>
                    L’utilisation d’Oukonsort implique des conséquences réelles, dans des lieux réels, avec de vraies personnes.
                    Cette charte vise à poser un cadre <strong>clair, humain et responsable</strong> pour l’ensemble de la communauté.
                </p>
            </section>

            {/* 2. VALEURS */}
            <section className="space-y-4">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">2. Valeurs et esprit de la plateforme</h2>
                <p>Oukonsort repose sur les valeurs suivantes :</p>
                <ul className="list-disc pl-6 space-y-1">
                    <li><strong>Respect et bienveillance</strong> envers tous</li>
                    <li><strong>Transparence</strong> dans les informations partagées</li>
                    <li><strong>Responsabilité et sérieux</strong>, notamment dans l’organisation d’événements</li>
                    <li><strong>Sécurité</strong>, des personnes comme des lieux</li>
                    <li><strong>Inclusion et accessibilité</strong>, dans le respect du cadre légal</li>
                </ul>
                <p className="font-medium bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                    Chaque utilisateur est invité à agir en gardant à l’esprit que : 
                    Ce qu’il publie, organise ou partage peut avoir un impact réel sur les autres.
                </p>
            </section>

            {/* 3. CADRE COMPORTEMENTAL */}
            <section className="space-y-4">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">3. Cadre comportemental attendu</h2>
                <p>L’utilisation d’Oukonsort implique un comportement responsable et respectueux. Les utilisateurs et invités s’engagent notamment à :</p>
                <ul className="list-disc pl-6 space-y-1">
                    <li>Adopter un ton <strong>courtois, respectueux et bienveillant</strong> ;</li>
                    <li>Faire preuve de <strong>bonne foi</strong> dans leurs interactions ;</li>
                    <li>Éviter toute forme de mépris, d’ironie agressive ou de comportement ambigu visant à nuire ;</li>
                    <li>Respecter les autres membres, même en cas de désaccord.</li>
                </ul>
                <p>Oukonsort n’est pas un espace de confrontation, de clash ou de débat conflictuel.</p>
            </section>

            {/* 4. BONNE FOI */}
            <section className="space-y-4">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">4. Bonne foi, erreurs et abus</h2>
                <p>Oukonsort reconnaît que des <strong>imprévus</strong> peuvent survenir dans l’organisation d’un événement.</p>
                <p>Sont considérées comme des erreurs acceptables, lorsqu’elles sont traitées avec transparence :</p>
                <ul className="list-disc pl-6 space-y-1">
                    <li>Un changement ou une indisponibilité du lieu ;</li>
                    <li>Un retard ou une modification d’horaire ;</li>
                    <li>Une annulation imprévue ;</li>
                    <li>Une erreur initiale de capacité ou d’organisation.</li>
                </ul>
                <p className="font-bold">L’erreur n’est pas une faute. La mauvaise foi, en revanche, l’est.</p>
                <p>Sont notamment considérés comme des comportements de mauvaise foi :</p>
                <ul className="list-disc pl-6 space-y-1">
                    <li>Ignorer volontairement les règles de la plateforme ;</li>
                    <li>Répéter les mêmes erreurs malgré des avertissements ;</li>
                    <li>Détourner ou exploiter les fonctionnalités de manière abusive.</li>
                </ul>
                <p>La bonne foi est appréciée au cas par cas, en distinguant les situations manifestement abusives des erreurs ponctuelles.</p>
            </section>

            {/* 5. CE QUE OUKONSORT N'EST PAS */}
            <section className="space-y-4">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">5. Ce que Oukonsort n’est pas</h2>
                <p>Afin d’éviter toute confusion, Oukonsort n’est pas :</p>
                <ul className="list-disc pl-6 space-y-1">
                    <li>Une plateforme de clash ou de débat conflictuel ;</li>
                    <li>Un outil de publicité libre ou non encadrée ;</li>
                    <li>Une marketplace ;</li>
                    <li>Un espace totalement anonyme.</li>
                </ul>
                <p>La plateforme privilégie la <strong>qualité des événements</strong> plutôt que leur quantité.</p>
            </section>

            {/* 6. ENGAGEMENTS */}
            <section className="space-y-4">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">6. Engagements des utilisateurs</h2>
                <p>Chaque utilisateur ou organisateur s’engage à :</p>
                <ul className="list-disc pl-6 space-y-1">
                    <li>Fournir des informations exactes, sincères et à jour ;</li>
                    <li>Ne pas publier de faux événements ou de contenus trompeurs ;</li>
                    <li>Ne pas fausser les statistiques, inscriptions ou listes de participants ;</li>
                    <li>Respecter les capacités maximales définies pour chaque événement ;</li>
                    <li>Informer les participants en cas de modification ou d’annulation ;</li>
                    <li>Assumer ses responsabilités en tant qu’organisateur ou participant.</li>
                </ul>
            </section>

            {/* 7. INTERDITS */}
            <section className="space-y-4">
                <h2 className="text-xl font-bold text-red-600 dark:text-red-400">7. Usages strictement interdits</h2>
                <p>Il est formellement interdit d’utiliser Oukonsort pour :</p>
                <ul className="list-disc pl-6 space-y-1 font-medium text-red-700 dark:text-red-300">
                    <li>Diffuser des contenus haineux, violents ou discriminatoires ;</li>
                    <li>Organiser ou promouvoir des événements illégaux ou non autorisés ;</li>
                    <li>Harceler, menacer ou intimider d’autres personnes ;</li>
                    <li>Diffuser des informations personnelles sensibles sans consentement ;</li>
                    <li>Collecter, exploiter ou revendre des données personnelles illégalement ;</li>
                    <li>Détourner la plateforme à des fins abusives ou dangereuses.</li>
                </ul>
            </section>

            {/* 8. RESPONSABILITÉS */}
            <section className="space-y-6">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">8. Responsabilités et cadre légal</h2>
                
                <div>
                    <h3 className="font-bold text-lg mb-2">8.1 Responsabilité de la plateforme</h3>
                    <p>
                        Oukonsort agit en tant qu’<strong>intermédiaire technique</strong> facilitant la mise en relation entre organisateurs et participants.
                        À ce titre, la plateforme ne peut être tenue responsable :
                    </p>
                    <ul className="list-disc pl-6 space-y-1 mt-2">
                        <li>Du déroulement réel des événements ;</li>
                        <li>Des comportements individuels des participants ou invités ;</li>
                        <li>Des incidents survenus lors ou autour d’un événement ;</li>
                        <li>Des décisions prises par les organisateurs ou les lieux d’accueil.</li>
                    </ul>
                    <p className="mt-2">Oukonsort ne se substitue ni aux organisateurs, ni aux autorités compétentes.</p>
                </div>

                <div>
                    <h3 className="font-bold text-lg mb-2">8.2 Responsabilité des organisateurs</h3>
                    <p>L’organisateur est responsable :</p>
                    <ul className="list-disc pl-6 space-y-1 mt-2">
                        <li>De la conformité de l’événement aux règles du lieu concerné ;</li>
                        <li>De l’exactitude des informations communiquées via la plateforme ;</li>
                        <li>Du respect du cadre légal applicable.</li>
                    </ul>
                    <p className="mt-2">Il s’engage à informer les participants de toute modification ou annulation dans les meilleurs délais.</p>
                    <p>L’organisateur n’est toutefois <strong>pas responsable individuellement</strong> du comportement de chaque participant, sauf en cas de manquement manifeste, volontaire ou de négligence grave.</p>
                </div>

                <div>
                    <h3 className="font-bold text-lg mb-2">8.3 Responsabilité des participants et invités</h3>
                    <p>Chaque participant ou invité reste <strong>pleinement responsable</strong> de ses actes et de son comportement.</p>
                    <p>Toute interaction avec un événement implique l’acceptation de la présente charte, même sans création de compte.</p>
                </div>
            </section>

            {/* 9. CONFIANCE */}
            <section className="space-y-4">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">9. Confiance, réputation et usage dans le temps</h2>
                <p>Oukonsort repose sur un principe fondamental : <strong>La confiance se construit dans le temps. Elle se perd aussi.</strong></p>
                <p>L’historique d’utilisation, la fiabilité et le respect des règles peuvent :</p>
                <ul className="list-disc pl-6 space-y-1">
                    <li>Renforcer la confiance accordée à un profil ;</li>
                    <li>Ouvrir l’accès à certaines fonctionnalités futures ;</li>
                    <li>Permettre une mise en avant des événements, lorsque les outils concernés seront disponibles.</li>
                </ul>
                <p>À l’inverse, des comportements problématiques répétés peuvent entraîner des restrictions progressives ou des sanctions.</p>
            </section>

            {/* 10. SANCTIONS */}
            <section className="space-y-4">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">10. Signalement, modération et sanctions</h2>
                <p>Les utilisateurs et invités peuvent signaler tout comportement ou événement problématique.</p>
                <p>Chaque signalement peut donner lieu à :</p>
                <ul className="list-disc pl-6 space-y-1">
                    <li>Une analyse du contenu ou du profil ;</li>
                    <li>Une suppression de l’événement concerné ;</li>
                    <li>Une restriction, suspension ou clôture de compte ;</li>
                    <li>Une demande de vérification d’identité, si nécessaire.</li>
                </ul>
                <p>Les modalités complètes sont détaillées dans le document :</p>
                <Link href="/legal/deletion" className="block w-full text-center bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 py-3 rounded-lg text-blue-600 dark:text-blue-400 font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition">
                    « Suppression & Sanctions – Clôture de compte et modération »
                </Link>
            </section>

            {/* 11. ACCEPTATION */}
            <section className="space-y-4">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">11. Acceptation et évolution de la charte</h2>
                <p>
                    Toute utilisation de la plateforme ou participation à un événement implique l’acceptation pleine et entière de la présente charte.
                    Oukonsort se réserve le droit de la faire évoluer afin de s’adapter aux usages et aux besoins de la communauté.
                </p>
            </section>

        </article>

      </div>
    </main>
  )
}