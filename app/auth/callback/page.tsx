'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { getRoute } from '@/lib/utils'

export default function AuthCallbackPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(true)

  useEffect(() => {
    console.log('Auth callback page loaded')
    console.log('Current URL:', window.location.href)
    
    const processAuth = async () => {
      try {
        // Check for error params
        const urlParams = new URLSearchParams(window.location.search)
        const oauthError = urlParams.get('error')
        const errorDescription = urlParams.get('error_description')
        
        if (oauthError) {
          console.error('OAuth error:', oauthError, errorDescription)
          let errorMessage = `Authentication error: ${oauthError}`
          if (errorDescription) {
            errorMessage += ` - ${errorDescription}`
          }
          if (oauthError === 'access_denied') {
            errorMessage = 'Access was denied. Please try again or use email login.'
          } else if (oauthError === 'invalid_request') {
            errorMessage = 'Invalid authentication request. Please try again.'
          }
          setError(errorMessage)
          setTimeout(() => {
            router.push(getRoute('/login'))
          }, 3000)
          return
        }

        // Wait a moment for Supabase to process the URL automatically
        // The supabase client has detectSessionInUrl: true which handles PKCE automatically
        await new Promise(resolve => setTimeout(resolve, 500))

        // Check if we have a session now (after detectSessionInUrl processed it)
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError) {
          console.error('Error getting session:', sessionError)
          setError(`Session error: ${sessionError.message}`)
          setTimeout(() => {
            router.push(getRoute('/login'))
          }, 3000)
          return
        }

        if (session) {
          console.log('Session verified successfully, user:', session.user.email)
          setError('Email verified successfully! Redirecting to home...')
          setIsProcessing(false)
          setTimeout(() => {
            router.push(getRoute('/'))
          }, 1500)
          return
        }

        // If still no session, something went wrong
        console.log('No session found after callback processing')
        setError('Authentication failed. Please try signing in again.')
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
      <div className="text-center max-w-md px-4">
        <div className="mb-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        </div>
        
        <h1 className="text-2xl font-bold text-white mb-4">
          {isProcessing ? 'Processing Authentication...' : 'Authentication Complete'}
        </h1>
        
        <p className="text-gray-400 mb-4">
          {isProcessing 
            ? 'Please wait while we verify your email and complete your sign-in.' 
            : error && error.includes('successfully') 
              ? 'Success! Taking you to the app...'
              : error 
                ? 'Redirecting...' 
                : 'Redirecting to login...'
          }
        </p>
        
        {error && (
          <div className={`text-sm p-3 rounded-md border mb-4 ${
            error.includes('successfully') 
              ? 'text-green-400 bg-green-900/20 border-green-800'
              : 'text-red-400 bg-red-900/20 border-red-800'
          }`}>
            {error}
          </div>
        )}
      </div>
    </div>
  )
}

