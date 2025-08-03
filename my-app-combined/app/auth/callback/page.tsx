'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getRoute } from '@/lib/utils'

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    // Simular el procesamiento del callback
    console.log('Auth callback processed')
    
    // Redirigir al usuario a la página principal después de un breve delay
    setTimeout(() => {
      router.push(getRoute('/'))
    }, 1000)
  }, [router])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-white mb-4">Processing Authentication...</h1>
        <p className="text-gray-400">Please wait while we complete your sign-in.</p>
      </div>
    </div>
  )
} 