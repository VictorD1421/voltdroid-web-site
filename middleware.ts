import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // 1. Creamos una respuesta base
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // 2. Inicializamos el cliente de Supabase
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          // Actualizamos la petición y la respuesta simultáneamente
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

  // 3. Obtenemos el usuario (getUser es fundamental para seguridad en Server Side)
  const { data: { user } } = await supabase.auth.getUser()
  const path = request.nextUrl.pathname

  // Lógica de Redirección
  if (path.startsWith('/tracking')) {
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  if (path.startsWith('/admin')) {
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    const role = (user.app_metadata?.role || user.user_metadata?.role || "").toLowerCase()
    const rolesAutorizados = ['admin', 'superusuario', 'engineer', 'superuser']

    if (!rolesAutorizados.includes(role)) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  // Si ya está logueado e intenta ir al login, lo mandamos al panel
  if (user && path === '/login') {
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match todas las rutas excepto:
     * - api (rutas de API)
     * - _next/static (archivos estáticos)
     * - _next/image (optimización de imágenes)
     * - favicon.ico (icono del sitio)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}