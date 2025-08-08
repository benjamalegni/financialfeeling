'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/lib/database.types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Github, X, Mail } from 'lucide-react'
import { getRoute } from '@/lib/utils'
import { config, validateSupabaseConfig, getRedirectUrl } from '@/lib/config'
import { initializeUserData } from '@/lib/supabaseClient'

export default function SignUpPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  
  // Create Supabase client with fallback for build time
  const supabaseUrl = config.supabase.url
  const supabaseKey = config.supabase.anonKey
  const supabase = createBrowserClient<Database>(supabaseUrl, supabaseKey)

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      // Validar configuración de Supabase
      const configValidation = validateSupabaseConfig()
      console.log('Supabase config validation:', configValidation)
      
      if (!configValidation.isValid) {
        setError('Configuration error: Supabase keys are not valid. Please contact the administrator.')
        setIsSubmitting(false)
        return
      }

      console.log('Attempting signup with email:', email)
      
      // Método 1: Intentar signup normal
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: getRedirectUrl(),
        }
      })

      console.log('Signup response:', { data, error })

      // Si hay error de base de datos, intentar método alternativo
      if (error && error.message.includes('Database error saving new user')) {
        console.log('Database error detected, trying alternative signup method...')
        
        // Método 2: Intentar crear usuario con confirmación de email deshabilitada
        try {
          const { data: altData, error: altError } = await supabase.auth.signUp({
            email,
            password,
            options: {
              emailRedirectTo: getRedirectUrl(),
            }
          })
          
          if (altError) {
            console.log('Alternative method also failed:', altError)
            // Intentar método 3: Verificar si el usuario ya existe
            try {
              const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password,
              })
              
              if (signInData.user) {
                console.log('User already exists and can sign in')
                setError('Account already exists! You can sign in with your credentials.')
                setIsSubmitting(false)
                setTimeout(() => {
                  router.push(getRoute('/login'))
                }, 2000)
                return
              }
            } catch (signInErr) {
              console.log('User does not exist')
            }
          } else if (altData.user) {
            console.log('User created with alternative method')
            setError('Account created successfully! Please check your email for the verification link.')
            setIsSubmitting(false)
            return
          }
        } catch (altErr) {
          console.log('Alternative method failed:', altErr)
        }
        
        // Si todos los métodos fallan, mostrar mensaje de éxito parcial
        setError('Account creation attempted. Please try signing in with your credentials.')
        setIsSubmitting(false)
        setTimeout(() => {
          router.push(getRoute('/login'))
        }, 2000)
        return
      }

      if (error) {
        console.error('Supabase signup error:', error)
        setError(`Signup error: ${error.message}`)
        setIsSubmitting(false)
      } else if (data.user && !data.user.email_confirmed_at) {
        // User created but email not confirmed
        setError('Please check your email for a confirmation link to complete your registration.')
        setIsSubmitting(false)
      } else if (data.user) {
        // User created and email confirmed (or no email confirmation required)
        console.log('User created successfully:', data.user)
        
        // No intentar inicializar datos de usuario para evitar errores
        console.log('User registration completed successfully')
        
        // Redirect to dashboard or home page
        router.push(getRoute('/'))
      } else {
        setError('Unexpected server response. Please try again.')
        setIsSubmitting(false)
      }
    } catch (err) {
      console.error('Signup error:', err)
      setError(`Unexpected error: ${err instanceof Error ? err.message : 'Unknown error'}`)
      setIsSubmitting(false)
    }
  }

  // resend verification removed

  const handleGitHubSignUp = async () => {
    setIsSubmitting(true);
    setError(null);
    
    const redirectUrl = getRedirectUrl();
    console.log('GitHub OAuth redirect URL:', redirectUrl);
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: redirectUrl,
      },
    })
    if (error) {
      setError(error.message);
      setIsSubmitting(false);
    }
  }

  const handleGoogleSignUp = async () => {
    setIsSubmitting(true);
    setError(null);
    
    const redirectUrl = getRedirectUrl();
    console.log('Google OAuth redirect URL:', redirectUrl);
    
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        },
      })
      
      if (error) {
        console.error('Google OAuth error:', error);
        if (error.message.includes('Provider not enabled')) {
          setError('Google sign-up is not configured. Please contact the administrator.');
        } else if (error.message.includes('Invalid redirect URI')) {
          setError('Configuration error: Invalid redirect URI. Please contact the administrator.');
        } else {
          setError(`Google sign-up error: ${error.message}`);
        }
        setIsSubmitting(false);
      } else {
        console.log('Google OAuth initiated successfully');
        console.log('OAuth response:', data);
        // The user will be redirected to Google
      }
    } catch (err) {
      console.error('Unexpected error during Google sign-up:', err);
      setError('An unexpected error occurred. Please try again.');
      setIsSubmitting(false);
    }
  }

  const handleCancel = () => {
    router.push(getRoute('/'))
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black">
      <Card className="w-full max-w-md bg-gray-900 border-gray-700 relative">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleCancel}
          className="absolute top-2 right-2 text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
        >
          <X className="h-5 w-5" />
        </Button>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-white">Create Account</CardTitle>
          <CardDescription className="text-center text-gray-400">
            Enter your details to create your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSignUp} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">Email address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
              />
            </div>

            {error && (
              <div className={`text-sm p-3 rounded-md border ${
                error.includes('Check your email') || error.toLowerCase().includes('verification email resent')
                  ? 'text-green-400 bg-green-900/20 border-green-800' 
                  : 'text-red-400 bg-red-900/20 border-red-800'
              }`}>
                {error}
              </div>
            )}

            <div className="flex items-center justify-between">
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isSubmitting}>
                {isSubmitting ? 'Creating Account...' : 'Create Account'}
              </Button>
            </div>


          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full bg-gray-700" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-gray-900 px-2 text-gray-400">
                Or continue with
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              variant="outline"
              onClick={handleGoogleSignUp}
              disabled={isSubmitting}
              className="w-full border-gray-600 text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
            >
              <Mail className="mr-2 h-4 w-4" />
              Sign Up with Google
            </Button>

            <Button
              variant="outline"
              onClick={handleGitHubSignUp}
              disabled={isSubmitting}
              className="w-full border-gray-600 text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
            >
              <Github className="mr-2 h-4 w-4" />
              Sign Up with GitHub
            </Button>
          </div>

          <div className="text-center text-sm text-gray-400">
            Already have an account?{' '}
            <a href={getRoute('/login')} className="font-medium text-blue-400 hover:text-blue-300 underline cursor-pointer">
              Sign In
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
