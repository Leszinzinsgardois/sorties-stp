'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft, UserX, ShieldAlert } from 'lucide-react'

export default function DeletionPage() {
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
              <UserX size={20} className="text-red-600"/> Suppression & Sanctions
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">Version 1.2 (RGPD)</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto p-6">

        {/* DOCUMENT PAPIER */}
        <article className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 leading-relaxed space-y-8">
            
            {/* TITRE DU DOC */}
            <div className="border-b border-slate-100 dark:border-slate-800 pb-6 text-center">
                <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-2">Suppression & Sanctions</h1>
                <p className="text-slate-500 dark:text-slate-400 font-medium">Clôture de compte et modération</p>
                <div className="mt-4 inline-block bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-lg text-sm font-bold text-slate-700 dark:text-slate-300">
                    "Un cadre clair pour protéger la communauté"
                </div>
            </div>

            {/* 1. OBJECTIF */}
            <section className="space-y-4">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">1. Objectif du document</h2>
                <p>
                    Oukonsort est une plateforme communautaire dédiée à l’organisation et à la participation à des événements réels.
                    Le présent document a pour objectif d’expliquer <strong>comment sont traités les signalements, comment sont appliquées les sanctions et dans quelles conditions un compte peut être restreint ou supprimé.</strong>
                </p>
                <p>Il vise avant tout à :</p>
                <ul className="list-disc pl-6 space-y-1">
                    <li>Protéger les utilisateurs ;</li>
                    <li>Garantir un cadre sain ;</li>
                    <li>Assurer une modération juste, proportionnée et humaine.</li>
                </ul>
            </section>

            {/* 2. PRINCIPES */}
            <section className="space-y-4">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">2. Principes de modération</h2>
                <p>La modération sur Oukonsort repose sur les principes suivants :</p>
                <ul className="list-disc pl-6 space-y-1">
                    <li><strong>Proportionnalité :</strong> les mesures sont adaptées à la gravité des faits.</li>
                    <li><strong>Prévention :</strong> l’objectif est d’éviter les abus avant de sanctionner.</li>
                    <li><strong>Bonne foi :</strong> l’erreur peut être tolérée si elle est corrigée.</li>
                    <li><strong>Responsabilité :</strong> la répétition volontaire des manquements est sanctionnée.</li>
                    <li><strong>Protection de la communauté :</strong> certaines situations nécessitent une action immédiate.</li>
                </ul>
                <p className="italic">La modération est effectuée au cas par cas et ne repose pas sur des automatismes stricts.</p>
            </section>

            {/* 3. SIGNALEMENTS */}
            <section className="space-y-4">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">3. Signalements</h2>
                <p>Tout utilisateur peut signaler :</p>
                <ul className="list-disc pl-6 space-y-1">
                    <li>Un événement ;</li>
                    <li>Un comportement ;</li>
                    <li>Un contenu ;</li>
                    <li>Un profil.</li>
                </ul>
                <p>
                    Les signalements sont analysés avec attention. Les signalements abusifs ou malveillants peuvent eux-mêmes faire l’objet de sanctions.
                    Les accès anonymes ou invités disposent de <strong>capacités de signalement limitées</strong> et peuvent faire l’objet de <strong>restrictions renforcées</strong>.
                </p>
            </section>

            {/* 4. ÉCHELLE DES SANCTIONS */}
            <section className="space-y-4">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">4. Échelle des sanctions</h2>
                <p>Selon la situation, Oukonsort peut appliquer une ou plusieurs des mesures suivantes :</p>
                <div className="space-y-3 pl-2">
                    <div className="border-l-4 border-yellow-400 pl-4">
                        <h4 className="font-bold text-slate-900 dark:text-white">Avertissement</h4>
                        <p className="text-sm">Rappel des règles et invitation à corriger le comportement.</p>
                    </div>
                    <div className="border-l-4 border-orange-500 pl-4">
                        <h4 className="font-bold text-slate-900 dark:text-white">Restriction</h4>
                        <p className="text-sm">Limitation temporaire de certaines fonctionnalités (création d’événements, visibilité, participation, etc.).</p>
                    </div>
                    <div className="border-l-4 border-red-500 pl-4">
                        <h4 className="font-bold text-slate-900 dark:text-white">Suspension</h4>
                        <p className="text-sm">Blocage temporaire du compte.</p>
                    </div>
                    <div className="border-l-4 border-slate-800 dark:border-slate-500 pl-4">
                        <h4 className="font-bold text-slate-900 dark:text-white">Bannissement / Suppression</h4>
                        <p className="text-sm">Clôture définitive du compte.</p>
                    </div>
                </div>
                <p className="mt-2">Cette gradation peut être adaptée selon la gravité des faits.</p>
            </section>

            {/* 5. SANCTIONS IMMÉDIATES */}
            <section className="space-y-4 bg-red-50 dark:bg-red-900/10 p-5 rounded-xl border border-red-100 dark:border-red-900/30">
                <div className="flex items-center gap-2 text-red-700 dark:text-red-400">
                    <ShieldAlert size={20}/>
                    <h2 className="text-xl font-bold">5. Sanctions immédiates</h2>
                </div>
                <p className="text-sm">Certaines situations peuvent entraîner une action immédiate, sans avertissement préalable, notamment :</p>
                <ul className="list-disc pl-6 space-y-1 text-sm font-medium">
                    <li>Diffusion de contenus haineux ou discriminatoires ;</li>
                    <li>Menaces ou violences ;</li>
                    <li>Organisation d’événements illégaux ;</li>
                    <li>Faux événements manifestes (selon la Charte d’Éthique Partenaire) ;</li>
                    <li>Mise en danger des participants ;</li>
                    <li>Usurpation d’identité.</li>
                </ul>
            </section>

            {/* 6. RESPONSABILITÉ */}
            <section className="space-y-4">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">6. Responsabilité et modulation des sanctions</h2>
                <p>
                    Les sanctions sont <strong>identiques dans leur principe</strong> pour tous les utilisateurs.
                    Elles peuvent toutefois être <strong>modulées selon le niveau de responsabilité</strong> :
                </p>
                <ul className="list-disc pl-6 space-y-1">
                    <li>Simple participant ;</li>
                    <li>Organisateur ;</li>
                    <li>Partenaire.</li>
                </ul>
                <p>Chaque utilisateur est considéré comme responsable de ses actes.</p>
            </section>

            {/* 7. MESURES COMPLÉMENTAIRES */}
            <section className="space-y-4">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">7. Mesures de modération complémentaires</h2>
                <p>Oukonsort peut également appliquer des mesures intermédiaires, notamment :</p>
                <ul className="list-disc pl-6 space-y-1">
                    <li>Perte de visibilité ;</li>
                    <li>Limitation du nombre de participants ;</li>
                    <li>Limitation de la création d’événements ;</li>
                    <li>Suppression de fonctionnalités ;</li>
                    <li>Mise sous surveillance du compte.</li>
                </ul>
                <p>Ces mesures peuvent être temporaires ou évoluer dans le temps.</p>
            </section>

            {/* 8. DROIT À L'INFO */}
            <section className="space-y-4">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">8. Droit à l’information et échanges</h2>
                <p>À partir du niveau de <strong>restriction</strong>, l’utilisateur est généralement informé des faits reprochés. Il peut :</p>
                <ul className="list-disc pl-6 space-y-1">
                    <li>Fournir des éléments complémentaires ;</li>
                    <li>Expliquer la situation ;</li>
                    <li>Être contacté pour un échange, notamment par entretien téléphonique.</li>
                </ul>
                <p>Dans certains cas impliquant des enjeux juridiques ou de sécurité, Oukonsort peut décider de <strong>limiter les communications</strong>.</p>
            </section>

            {/* 9. DURÉE */}
            <section className="space-y-4">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">9. Durée et réversibilité des sanctions</h2>
                <p>Les sanctions peuvent être :</p>
                <ul className="list-disc pl-6 space-y-1">
                    <li>Temporaires ou définitives ;</li>
                    <li>Réversibles sous conditions ;</li>
                    <li>Cumulables selon la situation.</li>
                </ul>
                <p className="font-bold">La levée d’une sanction n’est jamais automatique.</p>
            </section>

            {/* 10. CLÔTURE & RGPD */}
            <section className="space-y-4">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">10. Clôture et suppression de compte</h2>
                <p>Un compte peut être clôturé :</p>
                <ul className="list-disc pl-6 space-y-1">
                    <li>À la demande de l’utilisateur ;</li>
                    <li>Par décision d’Oukonsort ;</li>
                    <li>En cas de violations répétées ;</li>
                    <li>En cas de risque pour la communauté.</li>
                </ul>
                
                <div className="bg-slate-50 dark:bg-slate-800 p-5 rounded-xl mt-4">
                    <h3 className="font-bold text-slate-900 dark:text-white mb-2">Données personnelles</h3>
                    <ul className="list-disc pl-6 space-y-1 text-sm">
                        <li>Les données sont conservées intégralement pendant la durée légale nécessaire.</li>
                        <li>Elles sont anonymisées au bout d’un an.</li>
                        <li>Elles sont supprimées définitivement au bout de cinq ans.</li>
                    </ul>
                    <p className="text-sm mt-2">Certaines informations (ex : adresse e-mail) peuvent être conservées conformément aux obligations légales.</p>
                </div>
            </section>

            {/* 11. COM EXTERNE */}
            <section className="space-y-4">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">11. Communication externe</h2>
                <p>En cas de situation grave, Oukonsort peut :</p>
                <ul className="list-disc pl-6 space-y-1">
                    <li>Ne pas communiquer publiquement ;</li>
                    <li>Publier un constat neutre ;</li>
                    <li>Communiquer uniquement en interne.</li>
                </ul>
                <p>Sauf obligation légale ou nécessité particulière, les partenaires ou événements ne sont pas nommés publiquement.</p>
            </section>

            {/* 12. LIENS */}
            <section className="space-y-4">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">12. Lien avec les autres documents</h2>
                <p>Ce document s’applique en complément :</p>
                <ul className="list-disc pl-6 space-y-1">
                    <li>Des Conditions Générales d’Utilisation (CGU) ;</li>
                    <li>De la Charte d’Éthique Utilisateur (CEU) ;</li>
                    <li>De la Charte d’Éthique Partenaire (CEP).</li>
                </ul>
            </section>

            {/* 13. MESSAGE */}
            <section className="space-y-4 border-t border-slate-100 dark:border-slate-800 pt-6 mt-8">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">13. Message à la communauté</h2>
                <p>
                    La modération n’a pas pour vocation de sanctionner à tout prix.
                    Elle existe pour protéger celles et ceux qui utilisent Oukonsort de bonne foi.
                </p>
                <p className="font-bold text-center mt-4">La responsabilité, le respect et la transparence sont l’affaire de tous.</p>
            </section>

        </article>

      </div>
    </main>
  )
}