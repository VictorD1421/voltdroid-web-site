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

  // USAR getUser() en lugar de getSession() para mayor seguridad en el Middleware
  const { data: { user } } = await supabase.auth.getUser()
  const path = request.nextUrl.pathname

  // 1. PROTECCIÓN DE TRACKING
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

    // Consultamos el perfil
    const { data: profile, error } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    const rolesAutorizados = ['admin', 'superusuario', 'engineer', 'superuser']
    
    // LOG DE DEPURACIÓN (Míralo en tu terminal de VS Code, no en el navegador)
    console.log(`Middleware Auth - Usuario: ${user.email}, Rol DB: ${profile?.role}`);

    if (error || !profile || !rolesAutorizados.includes(profile.role?.toLowerCase())) {
      // Si no es admin, lo mandamos al home. 
      // IMPORTANTE: Si te manda al login es porque 'user' es null arriba.
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    '/admin/:path*', 
    '/tracking/:path*'
  ],
}