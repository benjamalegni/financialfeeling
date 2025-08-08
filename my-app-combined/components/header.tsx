'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { LogOut, BarChart3 } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { getRoute } from '@/lib/utils'

interface HeaderProps {
  user: any
  onSignOut: () => void
}

export default function Header({ user, onSignOut }: HeaderProps) {
  const router = useRouter()

  const getDashboardColorClasses = () => {
    return 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'
  }

  return (
    <div className="fixed top-0 left-0 right-0 h-16 bg-black/20 backdrop-blur-md border-b border-white/20 z-40">
      <div className="flex justify-between items-center h-full px-8">
        {/* Left side - Logo/Brand */}
        <button
          type="button"
          onClick={() => router.push(getRoute('/'))}
          className="flex items-center space-x-4 group cursor-pointer select-none"
          aria-label="Go to home"
        >
          <div className="relative">
            <div className="text-white text-xl font-bold group-hover:opacity-90 transition-opacity">FF</div>
            <div className="absolute top-0 right-0.5 text-white text-xl font-bold group-hover:opacity-90 transition-opacity">FF</div>
          </div>
          <h1 className="text-white text-lg font-semibold group-hover:text-gray-200 transition-colors">Financial Feeling</h1>
        </button>

        {/* Right side - User menu and Dashboard button */}
        <div className="flex items-center space-x-4">
          {/* Dashboard Button */}
          {user ? (
            <Button
              size="sm"
              className={`text-white transition-all duration-500 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 border border-gray-600 ${getDashboardColorClasses()}`}
              onClick={() => router.push(getRoute('/dashboard'))}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
          ) : (
            <div className="relative group">
              <Button
                size="sm"
                className={`text-white transition-all duration-500 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 border border-gray-600 cursor-not-allowed ${getDashboardColorClasses()}`}
                disabled
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
              {/* Tooltip */}
              <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
                Login to access Dashboard
                <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
              </div>
            </div>
          )}

          {/* User Menu */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full hover:bg-gray-800 transition-colors">
                  <Avatar className="h-8 w-8 shadow-md bg-white text-black">
                    <AvatarImage src="/avatars/01.png" alt={user.email} />
                    <AvatarFallback className="bg-white text-black">{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-80 bg-gray-900 border-gray-700 shadow-xl" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none text-white">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={onSignOut}
                  className="text-red-400 hover:text-red-300 hover:bg-gray-800 transition-colors"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button 
              variant="ghost" 
              onClick={() => router.push('/login')}
              className="text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
            >
              Login to FF
            </Button>
          )}
        </div>
      </div>
    </div>
  )
} 