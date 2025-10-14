'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/database.types'
import { getRoute } from '@/lib/utils'
import { config } from '@/lib/config'

export default function AuthCallbackPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(true)

  useEffect(() => {
    console.log('Auth callback page loaded')
    console.log('Current URL:', window.location.href)
    console.log('URL search params:', window.location.search)
    
    const processAuth = async () => {
      try {
        // Create Supabase client
        const supabase = createClient<Database>(
          config.supabase.url,
          config.supabase.anonKey,
          {
            auth: {
              flowType: 'pkce',
              detectSessionInUrl: true,
            },
          }
        )

        // Debug: inspect localStorage keys
        try {
          const keys = Object.keys(window.localStorage)
          const sbKeys = keys.filter((k) => k.toLowerCase().includes('sb-') || k.toLowerCase().includes('supabase'))
          console.log('LocalStorage supabase-related keys:', sbKeys)
          for (const k of sbKeys) {
            console.log(`localStorage[${k}] length:`, (window.localStorage.getItem(k) || '').length)
          }
        } catch (e) {
          console.warn('Unable to inspect localStorage:', e)
        }

        // Check for error param
        const urlParams = new URLSearchParams(window.location.search)
        const code = urlParams.get('code')
        const oauthError = urlParams.get('error')
        
        if (oauthError) {
          console.error('OAuth error:', oauthError)
          setError(`Authentication error: ${oauthError}`)
          setTimeout(() => {
            router.push(getRoute('/login'))
          }, 3000)
          return
        }

        // Give detectSessionInUrl a moment to complete
        await new Promise((r) => setTimeout(r, 200))

        // Verify session
        const { data: { session } } = await supabase.auth.getSession()
        if (session) {
          console.log('Session verified via detectSessionInUrl, redirecting to main page...')
          setTimeout(() => {
            router.push(getRoute('/'))
          }, 500)
          return
        }

        if (code) {
          console.log('No session yet; attempting manual exchange as fallback')
          const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
          
          if (exchangeError) {
            console.error('Error exchanging code for session:', exchangeError)
            setError(`Session error: ${exchangeError.message}`)
            setTimeout(() => {
              router.push(getRoute('/login'))
            }, 3000)
            return
          }

          if (data.session) {
            console.log('Session created successfully after fallback exchange')
            setTimeout(() => {
              router.push(getRoute('/'))
            }, 500)
            return
          }
        }

        console.log('No OAuth code found or session still missing, redirecting to login...')
        setTimeout(() => {
          router.push(getRoute('/login'))
        }, 2000)
      } catch (err) {
        console.error('Unexpected error during auth callback:', err)
        setError('An unexpected error occurred during authentication')
        setTimeout(() => {
          router.push(getRoute('/login'))
        }, 3000)
      } finally {
        setIsProcessing(false)
      }
    }

    processAuth()
  }, [router])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-white mb-4">
          {isProcessing ? 'Processing Authentication...' : 'Authentication Complete'}
        </h1>
        <p className="text-gray-400 mb-4">
          {isProcessing 
            ? 'Please wait while we complete your sign-in.' 
            : error ? 'Redirecting to login...' : 'Redirecting to main page...'
          }
        </p>
        
        {error && (
          <div className="text-red-400 bg-red-900/20 p-3 rounded-md border border-red-800 mb-4">
            {error}
          </div>
        )}
        
        <div className="mt-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </div>
    </div>
  )
} 