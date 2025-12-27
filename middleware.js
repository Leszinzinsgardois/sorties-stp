import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export async function middleware(request) {
  // 1. Initialisation de la réponse par défaut
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // 2. Création du client Supabase (Version @supabase/ssr)
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          )
          response = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // 3. Récupération de l'utilisateur (Sécurisé)
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // --- CONFIGURATION MAINTENANCE ---
  const MAINTENANCE_MODE = false // <--- METTRE A FALSE QUAND FINI
  // --------------------------------

  const url = request.nextUrl.clone()

  // Si la maintenance est désactivée, on laisse tout passer
  if (!MAINTENANCE_MODE) {
    return response
  }

  // Liste des routes toujours accessibles (Login, Assets, API, etc.)
  if (
    url.pathname.startsWith('/_next') || 
    url.pathname.startsWith('/static') || 
    url.pathname.startsWith('/api') ||
    url.pathname === '/maintenance' ||
    url.pathname === '/login' ||
    url.pathname === '/auth/callback' 
  ) {
    return response
  }

  // --- LOGIQUE DE FILTRAGE ---

  // Cas 1 : Pas connecté ? -> Direction Maintenance
  if (!user) {
    url.pathname = '/maintenance'
    return NextResponse.redirect(url)
  }

  // Cas 2 : Connecté ? -> On vérifie si c'est un Admin
  // Note : Assure-toi d'avoir la colonne 'role' dans ta table 'profiles'
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  // Si c'est un admin, c'est open bar, sinon dehors
  if (profile && profile.role === 'admin') {
    return response
  } else {
    url.pathname = '/maintenance'
    return NextResponse.redirect(url)
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}