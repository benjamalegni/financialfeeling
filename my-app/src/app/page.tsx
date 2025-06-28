// This will be the default landing page.
// For now, middleware redirects to /login if not authenticated.
// If authenticated, it could redirect to /dashboard or show a landing page here.

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import type { Database } from '@/lib/database.types'

export default async function HomePage() {
  const supabase = createServerComponentClient<Database>({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  if (session) {
    redirect('/dashboard') // Or your main app page after login
  } else {
    redirect('/login') // If no session, redirect to login
  }

  // Unreachable code due to redirects, but good for structure
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-sky-400">Welcome</h1>
      <p className="mt-4 text-lg text-gray-300">
        Please log in to continue.
      </p>
    </div>
  );
}
