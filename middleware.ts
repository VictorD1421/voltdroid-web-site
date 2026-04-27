import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({
            request: { headers: request.headers },
          })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({
            request: { headers: request.headers },
          })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  // Usamos getUser para una validación real del lado del servidor
  const { data: { user } } = await supabase.auth.getUser()
  const path = request.nextUrl.pathname

  // 1. PROTECCIÓN DE TRACKING (Estatus)
  if (path.startsWith('/tracking')) {
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // 2. PROTECCIÓN DE ADMIN
  if (path.startsWith('/admin')) {
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // Priorizamos los metadatos del usuario (app_metadata es donde Supabase suele guardar roles)
    // Esto es mucho más rápido que consultar la tabla 'users'
    const role = (user.app_metadata?.role || user.user_metadata?.role || "").toLowerCase()
    const rolesAutorizados = ['admin', 'superusuario', 'engineer', 'superuser']

    if (!rolesAutorizados.includes(role)) {
      // Si tiene sesión pero NO es admin, lo mandamos al inicio, NO al login
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    '/admin/:path*', 
    '/tracking/:path*',
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}