'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getRoute } from '@/lib/utils'

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    console.log('Auth callback page loaded')
    console.log('Current URL:', window.location.href)
    console.log('URL search params:', window.location.search)
    
    // Check if we have OAuth parameters
    const urlParams = new URLSearchParams(window.location.search)
    const code = urlParams.get('code')
    const error = urlParams.get('error')
    
    if (error) {
      console.error('OAuth error:', error)
      // Redirect to login with error
      setTimeout(() => {
        router.push(getRoute('/login'))
      }, 2000)
      return
    }
    
    if (code) {
      console.log('OAuth code received:', code)
      // Process the OAuth code
      console.log('Processing OAuth callback...')
    }
    
    // Simular el procesamiento del callback
    console.log('Auth callback processed')
    
    // Redirigir al usuario a la página principal después de un breve delay
    setTimeout(() => {
      console.log('Redirecting to main page...')
      router.push(getRoute('/'))
    }, 1000)
  }, [router])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-white mb-4">Processing Authentication...</h1>
        <p className="text-gray-400">Please wait while we complete your sign-in.</p>
        <div className="mt-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </div>
    </div>
  )
} 