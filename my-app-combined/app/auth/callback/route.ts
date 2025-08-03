import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse, type NextRequest } from 'next/server'
import type { Database } from '@/lib/database.types'

export async function GET(request: NextRequest) {
  try {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')

    if (code) {
      const cookieStore = await cookies()
      
      // Check if environment variables are available
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      if (!supabaseUrl || !supabaseKey) {
        console.error('Missing Supabase environment variables in callback')
        return NextResponse.redirect(`${requestUrl.origin}/login?error=configuration`)
      }

      const supabase = createServerClient<Database>(
        supabaseUrl,
        supabaseKey,
        {
          cookies: {
            get(name: string) {
              return cookieStore.get(name)?.value
            },
            set(name: string, value: string, options: any) {
              cookieStore.set(name, value, options)
            },
            remove(name: string, options: any) {
              cookieStore.set(name, '', options)
            },
          },
        }
      )
      
      await supabase.auth.exchangeCodeForSession(code)
    }

    // URL to redirect to after sign in process completes
    // Redirect to a specific dashboard page or home page
    return NextResponse.redirect(`${requestUrl.origin}/dashboard`)
  } catch (error) {
    console.error('Auth callback error:', error)
    // Redirect to login with error
    const requestUrl = new URL(request.url)
    return NextResponse.redirect(`${requestUrl.origin}/login?error=auth_failed`)
  }
} 