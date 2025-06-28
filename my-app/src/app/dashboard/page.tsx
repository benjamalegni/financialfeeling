// This is a placeholder for the main dashboard page after login.
// It will eventually display selected financial assets and news.

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import type { Database } from '@/lib/database.types'

// Component for Sign Out Button
async function SignOutButton() {
  // 'use server' // Not needed here as it's a server component handling a form action

  const handleSignOut = async () => {
    'use server' // This marks the function to be callable from the client as a server action
    const supabase = createServerComponentClient<Database>({ cookies })
    await supabase.auth.signOut()
    // After sign out, redirect to login. The middleware should also handle this.
    // However, explicit redirect here ensures behavior.
    redirect('/login')
  }

  return (
    <form action={handleSignOut}>
      <button
        type="submit"
        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-md transition duration-150 ease-in-out"
      >
        Sign Out
      </button>
    </form>
  )
}


export default async function DashboardPage() {
  const supabase = createServerComponentClient<Database>({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    // This should ideally be handled by middleware, but as a fallback:
    redirect('/login')
  }

  const { data: user, error: userError } = await supabase
    .from('users')
    .select('email')
    .eq('id', session.user.id)
    .single()

  if (userError && userError.code !== 'PGRST116') { // PGRST116: single row not found, which is ok if profile not yet created
    console.error('Error fetching user profile:', userError.message)
    // Handle error appropriately, maybe show an error message
  }


  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <header className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold text-sky-400">Dashboard</h1>
        <SignOutButton />
      </header>

      <section>
        <h2 className="text-2xl font-semibold text-gray-300 mb-4">Welcome, {user?.email || session.user.email}!</h2>
        <p className="text-gray-400 mb-6">
          This is your main dashboard. Soon you&apos;ll be able to select financial assets to track and see relevant news.
        </p>
        {/* Placeholder for financial asset selection and news display */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <p className="text-center text-gray-500">Financial asset tracking and news will appear here.</p>
        </div>
      </section>

      <div className="mt-8">
        <a
          href="/select-assets"
          className="px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg shadow-md transition duration-150 ease-in-out"
        >
          Select Financial Assets
        </a>
      </div>
    </div>
  );
}
