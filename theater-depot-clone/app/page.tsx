"use client"

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/lib/database.types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Send, LogOut, BarChart3, Search, Star, X } from 'lucide-react';
import SimpleTypewriter from '@/components/simple-typewriter';
import { getRandomText } from '@/lib/texts';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import SharedSidebar from '@/components/shared-sidebar';
import { getRoute } from '@/lib/utils';
import { config } from '@/lib/config';

export default function TheaterDepotHomepage() {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleFinancialFeelingClick = () => {
    setIsExpanded(true)
  }

  const handleBackClick = () => {
    setIsExpanded(false)
  }

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Navigation - completely hidden when expanded */}
      <nav
        className={`absolute left-6 right-6 z-20 transition-all duration-700 ease-in-out ${
          isExpanded ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        <div className="flex flex-col space-y-2 text-black font-medium">
          <button className="hover:opacity-70 transition-opacity text-left">Program</button>
          <button className="hover:opacity-70 transition-opacity text-left">Calendar</button>
          <button className="hover:opacity-70 transition-opacity text-left">Tickets</button>
          <button className="hover:opacity-70 transition-opacity text-left">Rental</button>
        </div>

        <div className="absolute top-0 right-0 flex flex-col space-y-2 text-black font-medium text-right">
          <button className="hover:opacity-70 transition-opacity">About</button>
          <button className="hover:opacity-70 transition-opacity">Service</button>
          <div className="mt-4">
            <Button
              variant="outline"
              size="sm"
              className="border-black text-black hover:bg-black hover:text-white bg-transparent"
            >
              EN
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="relative h-screen flex items-center justify-center">
        {/* Large Theater Text - completely hidden when expanded */}
        <div
          className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ease-in-out ${
            isExpanded ? "opacity-0 scale-50 pointer-events-none" : "opacity-100 scale-100"
          }`}
        >
          <h1 className="text-[12rem] md:text-[16rem] lg:text-[20rem] font-black text-black leading-none tracking-tighter select-none">
            THEATER
          </h1>
        </div>

        <div
          className={`absolute inset-0 flex items-center justify-center mt-32 transition-all duration-700 ease-in-out ${
            isExpanded ? "opacity-0 scale-50 pointer-events-none" : "opacity-100 scale-100"
          }`}
        >
          <h1 className="text-[8rem] md:text-[12rem] lg:text-[16rem] font-black text-black leading-none tracking-tighter select-none">
            IM DEPOT
          </h1>
        </div>

        {/* Transforming Financial Feeling Frame */}
        <div
          className={`fixed z-10 bg-white flex items-center justify-center transition-[width,height,border-radius,top,left,transform] duration-700 ease-in-out overflow-hidden ${
            isExpanded
              ? "w-[98vw] h-[98vh] rounded-[32px] md:rounded-[16px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 shadow-2xl"
              : "w-[600px] h-[300px] rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 hover:bg-gray-50 cursor-pointer"
          }`}
          style={{
            transitionProperty: 'width, height, border-radius, top, left, transform',
            transitionDuration: '700ms',
            transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
          }}
          onClick={!isExpanded ? handleFinancialFeelingClick : undefined}
        >
          {!isExpanded ? (
            // Original Financial Feeling Content (Oval) - Fades out quickly
            <div className="text-center px-8 transition-opacity duration-200">
              <h2 className="text-4xl font-bold text-black mb-4">Financial Feeling</h2>

              {/* Geometric Spheres */}
              <div className="flex justify-center space-x-4 mb-4">
                <div className="w-16 h-16 border-2 border-gray-400 rounded-full relative">
                  <div className="absolute inset-2 border border-gray-400 rounded-full"></div>
                  <div className="absolute inset-1 border border-gray-400 rounded-full"></div>
                  <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-400 transform -translate-x-1/2"></div>
                  <div className="absolute left-1/4 top-0 bottom-0 w-px bg-gray-400"></div>
                  <div className="absolute right-1/4 top-0 bottom-0 w-px bg-gray-400"></div>
                  <div className="absolute top-1/2 left-0 right-0 h-px bg-gray-400 transform -translate-y-1/2"></div>
                  <div className="absolute top-1/4 left-0 right-0 h-px bg-gray-400"></div>
                  <div className="absolute bottom-1/4 left-0 right-0 h-px bg-gray-400"></div>
                </div>

                <div className="w-16 h-16 border-2 border-gray-400 rounded-full relative">
                  <div className="absolute inset-2 border border-gray-400 rounded-full"></div>
                  <div className="absolute inset-1 border border-gray-400 rounded-full"></div>
                  <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-400 transform -translate-x-1/2"></div>
                  <div className="absolute top-1/2 left-0 right-0 h-px bg-gray-400 transform -translate-y-1/2"></div>
                  <div className="absolute left-1/4 top-0 bottom-0 w-px bg-gray-400"></div>
                  <div className="absolute right-1/4 top-0 bottom-0 w-px bg-gray-400"></div>
                  <div className="absolute top-1/4 left-0 right-0 h-px bg-gray-400"></div>
                  <div className="absolute bottom-1/4 left-0 right-0 h-px bg-gray-400"></div>
                </div>

                <div className="w-16 h-16 border-2 border-gray-400 rounded-full relative overflow-hidden">
                  <div className="absolute inset-2 border border-gray-400 rounded-full"></div>
                  <div className="absolute inset-1 border border-gray-400 rounded-full"></div>
                  <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gray-200 rounded-r-full"></div>
                  <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-400 transform -translate-x-1/2"></div>
                  <div className="absolute top-1/2 left-0 right-0 h-px bg-gray-400 transform -translate-y-1/2"></div>
                </div>
              </div>

              <p className="text-sm text-black italic">
                <strong>SAVE THE DATE!</strong> - Financial Feeling 2025, the new
                <br />
                Economic Theater opens on September 4th
              </p>
            </div>
          ) : (
            // --- INICIO: Pantalla principal Financial Feeling ---
            <FinancialFeelingMain />
            // --- FIN: Pantalla principal Financial Feeling ---
          )}
        </div>

        {/* Side Text Elements - completely hidden when expanded */}
        <div
          className={`absolute left-8 top-1/2 transform -translate-y-1/2 -rotate-90 origin-center transition-all duration-700 ${
            isExpanded ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        >
          <div className="text-black text-lg font-medium whitespace-nowrap">
            <p>We're back from August 4th</p>
          </div>
        </div>

        <div
          className={`absolute left-12 bottom-1/3 text-black text-sm transition-all duration-700 ${
            isExpanded ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        >
          <div className="space-y-1">
            <p>Financial Advisors</p>
            <p>Economic Experts /</p>
            <p>Performers /</p>
            <p>Artists</p>
            <p>Interdisciplinary</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// --- INICIO: FinancialFeelingMain ---
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/lib/database.types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Send, LogOut, BarChart3, Search, Star, X } from 'lucide-react';
import SimpleTypewriter from '@/components/simple-typewriter';
import { getRandomText } from '@/lib/texts';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import SharedSidebar from '@/components/shared-sidebar';
import { getRoute } from '@/lib/utils';
import { config } from '@/lib/config';

function FinancialFeelingMain() {
  // ... Copio aquí el cuerpo de la función HomePage de my-app-combined/app/page.tsx, adaptando los imports si es necesario ...
  // ... existing code ...
}
// --- FIN: FinancialFeelingMain ---
