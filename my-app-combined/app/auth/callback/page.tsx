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
            },
          }
        )

        // Check if we have OAuth parameters
        const urlParams = new URLSearchParams(window.location.search)
        const code = urlParams.get('code')
        const error = urlParams.get('error')
        
        if (error) {
          console.error('OAuth error:', error)
          setError(`Authentication error: ${error}`)
          setTimeout(() => {
            router.push(getRoute('/login'))
          }, 3000)
          return
        }
        
        if (code) {
          console.log('OAuth code received:', code)
          
          // Exchange the code for a session
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
            console.log('Session created successfully:', data.session.user.email)
            
            // Get the current session to verify
            const { data: { session } } = await supabase.auth.getSession()
            
            if (session) {
              console.log('Session verified, redirecting to main page...')
              setTimeout(() => {
                router.push(getRoute('/'))
              }, 1000)
            } else {
              console.error('Session not found after exchange')
              setError('Session verification failed')
              setTimeout(() => {
                router.push(getRoute('/login'))
              }, 3000)
            }
          } else {
            console.error('No session in exchange response')
            setError('No session received from authentication')
            setTimeout(() => {
              router.push(getRoute('/login'))
            }, 3000)
          }
        } else {
          console.log('No OAuth code found, checking for existing session...')
          
          // Check if user is already authenticated
          const { data: { session } } = await supabase.auth.getSession()
          
          if (session) {
            console.log('User already authenticated, redirecting to main page...')
            setTimeout(() => {
              router.push(getRoute('/'))
            }, 1000)
          } else {
            console.log('No session found, redirecting to login...')
            setTimeout(() => {
              router.push(getRoute('/login'))
            }, 2000)
          }
        }
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