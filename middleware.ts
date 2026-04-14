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

  const { data: { session } } = await supabase.auth.getSession()
  const path = request.nextUrl.pathname

  // 1. PROTECCIÓN DE TRACKING (Cualquier usuario logueado)
  if (path.startsWith('/tracking')) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // 2. PROTECCIÓN DE ADMIN (Solo roles autorizados)
  if (path.startsWith('/admin')) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', session.user.id)
      .single()

    const rolesAutorizados = ['admin', 'superusuario', 'engineer', 'superuser']
    
    if (!profile || !rolesAutorizados.includes(profile.role?.toLowerCase())) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return response
}

// ACTUALIZACIÓN CRÍTICA DEL MATCHER
export const config = {
  matcher: [
    '/admin/:path*', 
    '/tracking/:path*' // Agregamos tracking al matcher para que el middleware lo procese
  ],
}