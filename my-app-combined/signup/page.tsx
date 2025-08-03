'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/lib/database.types'
import { getRoute } from '@/lib/utils'
import { config } from '@/lib/config'

export default function SignUpPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  
  // Create Supabase client with fallback for build time
  const supabaseUrl = config.supabase.url
  const supabaseKey = config.supabase.anonKey
  const supabase = createBrowserClient<Database>(supabaseUrl, supabaseKey)

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setMessage(null)

    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }
    setIsSubmitting(true)

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        // emailRedirectTo should point to your app's /auth/callback route
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    })

    if (error) {
      setError(error.message)
      setIsSubmitting(false)
    } else if (data.user && data.user.identities?.length === 0) {
      // This case might indicate that email confirmation is required but the user already exists without a confirmed email.
      // Supabase might have updated the user to require confirmation again.
      setMessage("User already exists. Please check your email to confirm your account or try logging in.")
      setIsSubmitting(false)
    } else if (data.user) {
      // If email confirmation is enabled in Supabase, user will be null until confirmed.
      // If auto-confirm is on, or for OAuth, user object will be present.
      setMessage("Sign up successful! Please check your email to confirm your account.")
      // router.push('/dashboard') // Or redirect to a page indicating to check email
      // For now, we just show message. User will be redirected from callback or upon next login.
      setIsSubmitting(false)
    } else {
       setMessage("Sign up successful! Please check your email to confirm your account.")
       setIsSubmitting(false)
    }
  }

  const handleGitHubSignUp = async () => {
    setIsSubmitting(true);
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    })
    if (error) {
      setError(error.message);
      setIsSubmitting(false);
    }
  }


  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-n8n-dark font-sans">
      <div className="w-full max-w-md p-8 space-y-6 bg-n8n-surface rounded-lg shadow-xl">
        <h1 className="text-3xl font-bold text-center text-n8n-accent">Create Account</h1>
        <form onSubmit={handleSignUp} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-n8n-text-secondary">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-n8n-dark border border-n8n-border rounded-md shadow-sm placeholder-n8n-text-secondary focus:outline-none focus:ring-n8n-accent focus:border-n8n-accent sm:text-sm text-n8n-text-primary"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-n8n-text-secondary">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-n8n-dark border border-n8n-border rounded-md shadow-sm placeholder-n8n-text-secondary focus:outline-none focus:ring-n8n-accent focus:border-n8n-accent sm:text-sm text-n8n-text-primary"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-n8n-text-secondary">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-n8n-dark border border-n8n-border rounded-md shadow-sm placeholder-n8n-text-secondary focus:outline-none focus:ring-n8n-accent focus:border-n8n-accent sm:text-sm text-n8n-text-primary"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-sm text-n8n-error">{error}</p>}
          {message && <p className="text-sm text-n8n-success">{message}</p>}

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-n8n-accent hover:bg-n8n-accent-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-n8n-surface focus:ring-n8n-accent disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Signing Up...' : 'Sign Up'}
            </button>
          </div>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-n8n-border" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-3 bg-n8n-surface text-n8n-text-secondary">Or sign up with</span>
          </div>
        </div>
        <div>
          <button
            onClick={handleGitHubSignUp}
            disabled={isSubmitting}
            className="w-full flex items-center justify-center py-2.5 px-4 border border-n8n-border rounded-md shadow-sm text-sm font-medium text-n8n-text-primary bg-n8n-button hover:bg-n8n-button-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-n8n-surface focus:ring-n8n-accent disabled:opacity-60 disabled:cursor-not-allowed"
          >
             <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path fillRule="evenodd" d="M10 0C4.477 0 0 4.477 0 10c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.483 0-.237-.009-.868-.013-1.703-2.782.602-3.369-1.343-3.369-1.343-.455-1.158-1.11-1.465-1.11-1.465-.909-.62.069-.608.069-.608 1.004.074 1.532 1.03 1.532 1.03.891 1.529 2.341 1.087 2.91.832.091-.647.349-1.086.635-1.337-2.22-.251-4.555-1.111-4.555-4.943 0-1.091.39-1.984 1.03-2.682-.103-.252-.447-1.27.098-2.646 0 0 .84-.269 2.75 1.025A9.548 9.548 0 0110 5.425c.854 0 1.708.115 2.504.336 1.909-1.294 2.748-1.025 2.748-1.025.547 1.376.203 2.394.1 2.646.64.698 1.027 1.59 1.027 2.682 0 3.842-2.338 4.687-4.565 4.935.358.307.679.917.679 1.85 0 1.333-.012 2.407-.012 2.734 0 .268.18.578.688.48C17.138 18.163 20 14.417 20 10c0-5.523-4.477-10-10-10z" clipRule="evenodd" />
            </svg>
            Sign Up with GitHub
          </button>
        </div>

        <p className="mt-8 text-center text-sm text-n8n-text-secondary">
          Already have an account?{' '}
          <a href={getRoute('/login')} className="font-medium text-n8n-accent hover:text-n8n-accent-hover">
            Sign In
          </a>
        </p>
      </div>
    </div>
  )
}
