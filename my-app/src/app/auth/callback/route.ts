import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse, type NextRequest } from 'next/server'
// Ensure this path is correct and the file is generated
import type { Database } from '@/lib/database.types'

export const dynamic = 'force-dynamic' // Ensures the route is dynamically rendered

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = createRouteHandlerClient<Database>({ cookies })
    await supabase.auth.exchangeCodeForSession(code)
  }

  // URL to redirect to after sign in process completes
  // Redirect to a specific dashboard page or home page
  return NextResponse.redirect(`${requestUrl.origin}/dashboard`)
}
