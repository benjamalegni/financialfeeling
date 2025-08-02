import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import type { Database } from '@/lib/database.types'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  try {
    // Check if environment variables are available
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing Supabase environment variables')
      // Continue without authentication for now
      return res
    }

    // Create a Supabase client configured to use cookies
    const supabase = createServerClient<Database>(
      supabaseUrl,
      supabaseKey,
      {
        cookies: {
          get(name: string) {
            return req.cookies.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            req.cookies.set({
              name,
              value,
              ...options,
            })
            res.cookies.set({
              name,
              value,
              ...options,
            })
          },
          remove(name: string, options: any) {
            req.cookies.set({
              name,
              value: '',
              ...options,
            })
            res.cookies.set({
              name,
              value: '',
              ...options,
            })
          },
        },
      }
    )

    // Refresh session if expired - important for Server Components
    const { data: { session } } = await supabase.auth.getSession()

    const { pathname } = req.nextUrl

    // If the user is not logged in and trying to access a protected route (e.g., /dashboard)
    if (!session && (pathname.startsWith('/dashboard') || pathname.startsWith('/select-assets'))) {
      // Redirect them to the login page
      const url = req.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }

    // If the user is logged in and tries to access /login or /signup, redirect to main page
    if (session && (pathname === '/login' || pathname === '/signup')) {
      const url = req.nextUrl.clone()
      url.pathname = '/' // Redirect to main page instead of dashboard
      return NextResponse.redirect(url)
    }

    // Allow access to the root path without authentication (public landing page)
    // The root page will handle authentication state and show appropriate content
    if(pathname === '/') {
      return res
    }

    return res
  } catch (error) {
    console.error('Middleware error:', error)
    // Return the response without authentication in case of error
    return res
  }
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
