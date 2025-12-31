'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft, Briefcase } from 'lucide-react'

export default function CEPPage() {
  const router = useRouter()

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors pb-20">
      
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
              <Briefcase size={20} className="text-purple-600"/> Charte Partenaire (CEP)
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">Version 1.0 (Standard)</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto p-6">

        {/* DOCUMENT PAPIER */}
        <article className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 leading-relaxed space-y-8">
            
            {/* TITRE DU DOC */}
            <div className="border-b border-slate-100 dark:border-slate-800 pb-6 text-center">
                <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-2">Charte d’Éthique Partenaire</h1>
                <p className="text-slate-500 dark:text-slate-400 font-medium">Comprendre le rôle des partenaires et le cadre éthique associé</p>
            </div>

            {/* 1. POURQUOI */}
            <section className="space-y-4">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">1. Pourquoi une Charte d’Éthique Partenaire ?</h2>
                <p>
                    Oukonsort est une plateforme pensée avant tout pour les <strong>étudiants et jeunes utilisateurs</strong>.
                    La Charte d’Éthique Partenaire (CEP) a pour objectif d’expliquer <strong>pourquoi</strong> certains événements sont proposés avec des partenaires, dans quelles conditions, et <strong>comment</strong> ces partenariats sont encadrés.
                </p>
                <p>Elle vise principalement à :</p>
                <ul className="list-disc pl-6 space-y-1">
                    <li>Éviter les malentendus ;</li>
                    <li>Garantir la transparence ;</li>
                    <li>Préserver l’esprit communautaire d’Oukonsort.</li>
                </ul>
                <p className="font-medium text-purple-600 dark:text-purple-400">
                    Un partenariat sur Oukonsort n’est ni une publicité déguisée, ni un passe-droit.
                </p>
            </section>

            {/* 2. RÔLE DES PARTENAIRES */}
            <section className="space-y-4">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">2. Le rôle des partenaires sur Oukonsort</h2>
                <p>Les partenaires présents sur Oukonsort sont avant tout :</p>
                <ul className="list-disc pl-6 space-y-1">
                    <li>Des <strong>facilitateurs d’événements</strong> ;</li>
                    <li>Des <strong>entités identifiées et encadrées</strong> ;</li>
                    <li>Des acteurs engagés à proposer des sorties <strong>fiables et claires</strong>.</li>
                </ul>
                <p>
                    Un partenariat sur Oukonsort n’est pas un espace publicitaire, mais <strong>un engagement à suggérer des sorties fiables</strong> aux membres du service.
                </p>
                <p>
                    Les partenaires ne sont <strong>ni au-dessus des utilisateurs, ni prioritaires</strong> dans l’application des règles.
                    Ils sont soumis à des exigences <strong>au moins équivalentes</strong>, et souvent renforcées.
                </p>
            </section>

            {/* 3. IDENTIFICATION */}
            <section className="space-y-4">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">3. Identification claire des événements partenaires</h2>
                <p>Tout événement partenaire est <strong>clairement identifiable</strong> par les utilisateurs :</p>
                <ul className="list-disc pl-6 space-y-1">
                    <li>Badge visible « Partenaire » ;</li>
                    <li>Mention explicite sur la page de l’événement ;</li>
                    <li>Page dédiée au partenaire ;</li>
                    <li>Affichage sur une section événementielle distincte.</li>
                </ul>
                <p className="font-bold">Cette identification est obligatoire, sans exception.</p>
            </section>

            {/* 4. CE QUE LES PARTENAIRES PEUVENT FAIRE */}
            <section className="space-y-6">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">4. Ce que les partenaires peuvent (et ne peuvent pas) faire</h2>
                
                <div className="bg-green-50 dark:bg-green-900/10 p-5 rounded-xl border border-green-100 dark:border-green-800/30">
                    <h3 className="font-bold text-green-700 dark:text-green-400 mb-2">4.1 Communication autorisée</h3>
                    <p className="mb-2">Un partenaire peut :</p>
                    <ul className="list-disc pl-6 space-y-1 text-sm">
                        <li>Proposer des événements clairement définis ;</li>
                        <li>Intégrer un lien externe via son profil officiel ;</li>
                        <li>Communiquer des informations exactes et vérifiables.</li>
                    </ul>
                </div>

                <div className="bg-red-50 dark:bg-red-900/10 p-5 rounded-xl border border-red-100 dark:border-red-800/30">
                    <h3 className="font-bold text-red-700 dark:text-red-400 mb-2">4.2 Interdictions</h3>
                    <p className="mb-2">Un partenaire ne peut pas :</p>
                    <ul className="list-disc pl-6 space-y-1 text-sm">
                        <li>Publier de simples promotions sans événement ;</li>
                        <li>Multiplier les annonces sans date ou contenu concret ;</li>
                        <li>Utiliser Oukonsort comme un espace de publicité libre ;</li>
                        <li>Réutiliser les contenus d’Oukonsort sans autorisation contractuelle.</li>
                    </ul>
                </div>
                <p>Toute communication doit rester <strong>mesurée, pertinente et non intrusive</strong>.</p>
            </section>

            {/* 5. VÉRACITÉ */}
            <section className="space-y-4">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">5. Véracité des informations et tolérance zéro</h2>
                <p>Sont considérés comme <strong>manquements graves</strong> :</p>
                <ul className="list-disc pl-6 space-y-1">
                    <li>Faux lieux ;</li>
                    <li>Faux horaires ;</li>
                    <li>Faux intervenants ;</li>
                    <li>Informations volontairement trompeuses.</li>
                </ul>
                <p className="font-bold text-red-600 dark:text-red-400">Ces pratiques entraînent des mesures immédiates, sans tolérance.</p>
                <p>
                    Les informations exagérées bénéficient d’une <strong>marge de tolérance très limitée</strong>, strictement encadrée.
                    Les promesses non tenues peuvent être tolérées <strong>uniquement si elles sont expliquées et corrigées rapidement</strong>.
                </p>
            </section>

            {/* 6. PARTICIPANTS */}
            <section className="space-y-4">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">6. Place et liberté des participants</h2>
                <p>Lors d’un événement partenaire :</p>
                <ul className="list-disc pl-6 space-y-1">
                    <li>L’étudiant reste avant tout un <strong>participant, non un client</strong> ;</li>
                    <li>Il peut refuser toute interaction commerciale ;</li>
                    <li>Il peut quitter l’événement librement ;</li>
                    <li>Tout achat obligatoire doit être <strong>clairement indiqué à l’avance</strong>.</li>
                </ul>
            </section>

            {/* 7. DONNÉES PERSONNELLES */}
            <section className="space-y-4">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">7. Données personnelles et inscriptions externes</h2>
                <p>
                    Oukonsort <strong>ne revend ni ne transmet</strong> les données personnelles des utilisateurs aux partenaires.
                </p>
                <p>Un partenaire peut proposer une inscription externe :</p>
                <ul className="list-disc pl-6 space-y-1">
                    <li>Hors de la responsabilité d’Oukonsort ;</li>
                    <li>À la seule initiative de l’utilisateur ;</li>
                    <li>Sous la responsabilité du partenaire.</li>
                </ul>
                <p>Pour certains événements sensibles, Oukonsort peut instaurer :</p>
                <ul className="list-disc pl-6 space-y-1">
                    <li>Un système de vérification d’identité ;</li>
                    <li>Un contrôle par QR Code ;</li>
                    <li>Une obligation de compte vérifié pour participer.</li>
                </ul>
            </section>

            {/* 8. SIGNALEMENTS & RÉPUTATION */}
            <section className="space-y-4">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">8. Signalements, modération et réputation</h2>
                <p>Les événements partenaires font l’objet :</p>
                <ul className="list-disc pl-6 space-y-1">
                    <li>D’une <strong>attention renforcée</strong> ;</li>
                    <li>D’un <strong>traitement prioritaire</strong> en cas de signalement ;</li>
                    <li>D’analyses approfondies.</li>
                </ul>
                <p>En cas de comportements problématiques répétés, un partenaire peut :</p>
                <ul className="list-disc pl-6 space-y-1">
                    <li>Perdre de la visibilité ;</li>
                    <li>Voir son statut restreint ;</li>
                    <li>Être temporairement interdit.</li>
                </ul>
                <p>Ces décisions sont internes, mais peuvent se <strong>ressentir sur la plateforme</strong>.</p>
                <p>En cas d’événement grave, Oukonsort se réserve le droit de <strong>communiquer publiquement un constat</strong>, en lien avec le partenaire concerné.</p>
            </section>

            {/* 9. RÉPONSES PUBLIQUES */}
            <section className="space-y-4">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">9. Réponses publiques et désaccords</h2>
                <p>Un partenaire dispose d’un <strong>droit de réponse encadré</strong>.</p>
                <p>Les désaccords doivent prioritairement passer par :</p>
                <ul className="list-disc pl-6 space-y-1">
                    <li>Les outils de signalement ;</li>
                    <li>Une communication encadrée par Oukonsort.</li>
                </ul>
                <p>En cas de désinformation publique, des décisions communes peuvent être prises.</p>
            </section>

            {/* 10. CONTRATS */}
            <section className="space-y-4">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">10. Lien avec les contrats et autres chartes</h2>
                <p>Chaque partenariat est défini par un <strong>contrat spécifique</strong>, qui prime juridiquement.</p>
                <p>La CEP s’applique en complément :</p>
                <ul className="list-disc pl-6 space-y-1">
                    <li>Des Conditions Générales d’Utilisation (CGU) ;</li>
                    <li>De la Charte d’Éthique Utilisateur (CEU).</li>
                </ul>
                <p>Selon les situations, une violation éthique peut entraîner des <strong>restrictions ou modifications de statut</strong>, conformément aux engagements contractuels.</p>
            </section>

            {/* 11. COMITÉ D'ÉTHIQUE */}
            <section className="space-y-4">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">11. Comité d’Éthique (évolution future)</h2>
                <p>Lors de la création d’une structure associative, un <strong>Comité d’Éthique</strong> pourra être mis en place.</p>
                <p>Ce comité :</p>
                <ul className="list-disc pl-6 space-y-1">
                    <li>Est indépendant des partenaires ;</li>
                    <li>Agit dans l’intérêt de la communauté ;</li>
                    <li>Peut rendre des décisions sans justification publique ;</li>
                    <li>Peut évoluer dans sa composition.</li>
                </ul>
            </section>

            {/* 12. MESSAGE AUX ÉTUDIANTS */}
            <section className="space-y-4 bg-slate-50 dark:bg-slate-800 p-6 rounded-xl border-l-4 border-purple-500">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">12. Message aux étudiants</h2>
                <p>
                    Les partenariats sur Oukonsort existent pour <strong>élargir l’offre de sorties, pas pour la dénaturer</strong>.
                    La transparence, la confiance et la sécurité restent prioritaires.
                </p>
                <p className="font-bold italic mt-2">"Oukonsort organise des sorties, pas des problèmes."</p>
            </section>

        </article>

      </div>
    </main>
  )
}