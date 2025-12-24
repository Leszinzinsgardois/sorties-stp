import { createClient } from '@supabase/supabase-js'
import EventClient from './EventClient' // On importe ton composant client

// On recrée un client Supabase juste pour ce fetch serveur (SEO)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

// --- FONCTION MAGIQUE POUR LE SEO ---
export async function generateMetadata({ params }) {
  const { id } = params
  
  // On récupère juste les infos nécessaires pour la bannière
  const { data: event } = await supabase
    .from('events')
    .select('title, start_time, location_name')
    .eq('id', id)
    .single()

  if (!event) {
    return {
      title: 'Soirée Introuvable',
    }
  }

  const date = new Date(event.start_time).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' })
  const titre = `Soirée : ${event.title}`
  const description = `📅 ${date} • 📍 ${event.location_name || 'Lieu secret'} • Rejoins la liste des invités sur Sorties MTP !`

  return {
    title: titre,
    description: description,
    openGraph: {
      title: titre,
      description: description,
      // On pourrait même générer une image dynamique ici plus tard
    },
  }
}

// --- LE COMPOSANT DE PAGE ---
export default function Page() {
  // Ce composant est vide, il sert juste de "coquille" pour le SEO
  // Il charge immédiatement ton interface client
  return <EventClient />
}