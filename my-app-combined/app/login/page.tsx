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
import { Github, X } from 'lucide-react'
import { getRoute } from '@/lib/utils'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  
  // Create Supabase client with fallback for build time
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'
  const supabase = createBrowserClient<Database>(supabaseUrl, supabaseKey)

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setIsSubmitting(false)
    } else {
      router.push(getRoute('/'))
    }
  }

  const handleGitHubSignIn = async () => {
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
          <CardTitle className="text-2xl font-bold text-center text-white">Access FF</CardTitle>
          <CardDescription className="text-center text-gray-400">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSignIn} className="space-y-4">
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
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
              />
            </div>

            {error && (
              <div className="text-sm text-red-400 bg-red-900/20 p-3 rounded-md border border-red-800">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isSubmitting}>
              {isSubmitting ? 'Signing In...' : 'Sign In'}
            </Button>
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

          <Button
            variant="outline"
            onClick={handleGitHubSignIn}
            disabled={isSubmitting}
            className="w-full border-gray-600 text-black hover:text-white hover:bg-gray-800 transition-colors"
          >
            <Github className="mr-2 h-4 w-4" />
            Sign In with GitHub
          </Button>

          <div className="text-center text-sm text-gray-400">
            Don&apos;t have an account?{' '}
            <a onClick={() => router.push(getRoute('/signup'))} className="font-medium text-blue-400 hover:text-blue-300 underline cursor-pointer">
              Sign Up
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
