import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'

import type { NextRequest } from 'next/server'
import type { Database } from '@/lib/database.types'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  // Create a Supabase client configured to use cookies
  const supabase = createMiddlewareClient<Database>({ req, res })

  // Refresh session if expired - important for Server Components
  // getCurrentSession() is deprecated, use getSession()
  const { data: { session } } = await supabase.auth.getSession()

  const { pathname } = req.nextUrl

  // If the user is not logged in and trying to access a protected route (e.g., /dashboard)
  if (!session && (pathname.startsWith('/dashboard') || pathname.startsWith('/select-assets'))) {
    // Redirect them to the login page
    const url = req.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // If the user is logged in and tries to access /login or /signup, redirect to dashboard
  if (session && (pathname === '/login' || pathname === '/signup')) {
    const url = req.nextUrl.clone()
    url.pathname = '/dashboard' // Or your main app page
    return NextResponse.redirect(url)
  }

  // If the user is not logged in and on the root path, show them the login page by default
  // or a specific landing page. For now, let's redirect to login.
  // You might want a public landing page at '/' later.
  if(!session && pathname === '/') {
    const url = req.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }


  return res
}

// Ensure the middleware is only called for relevant paths.
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - auth/callback (Supabase auth callback)
     * - api (API routes, if you have any public ones)
     */
    '/((?!_next/static|_next/image|favicon.ico|auth/callback|api).*)',
  ],
}
