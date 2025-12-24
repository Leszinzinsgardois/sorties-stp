import { createClient } from '@supabase/supabase-js'
import EventClient from './EventClient'

// Client Supabase basique pour le SEO (Server Side)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export async function generateMetadata(props) {
  // CORRECTION ICI : On attend que params soit résolu
  const params = await props.params;
  const { id } = params;

  // On récupère les infos
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
  const titre = `${event.title}`
  const description = `📅 ${date} • 📍 ${event.location_name || 'Lieu secret'} • Rejoins la liste des invités !`

  return {
    title: titre,
    description: description,
    openGraph: {
      title: titre,
      description: description,
      // images: ['/opengraph-image.png'] // Ça prendra celle par défaut si on n'en met pas
    },
  }
}

export default function Page() {
  return <EventClient />
}