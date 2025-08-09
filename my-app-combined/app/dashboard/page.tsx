'use client'

import React, { useState, useEffect } from 'react'
import type { Database } from '@/lib/database.types'
import { supabase } from '@/lib/supabaseClient'
import DashboardContent from '@/components/dashboard-content'
import { getRoute } from '@/lib/utils'
import Header from '@/components/header'

interface SelectedAsset {
  id: string;
  asset_identifier: string;
  asset_type: string | null;
  asset_name: string | null;
  notes: string | null;
  selected_at: string;
}

export default function DashboardPage() {
  const [selectedAssets, setSelectedAssets] = useState<SelectedAsset[]>([])
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initSupabase = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        window.location.href = getRoute('/login')
        return
      }

      setSession(session)

      // Fetch user assets
      const { data: assets, error } = await supabase
        .from('user_selected_assets')
        .select('*')
        .eq('user_id', session.user.id)
        .not('asset_identifier', 'is', null)
        .order('selected_at', { ascending: false })

      if (error) {
        console.error('Error fetching selected assets:', error.message)
      } else {
        setSelectedAssets(assets || [])
      }

      setLoading(false)
    }

    initSupabase()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header user={session.user} onSignOut={() => { window.location.href = getRoute('/login') }} />
      <div className="pt-24 p-8">
        <DashboardContent
          selectedAssets={selectedAssets}
          session={session}
        />
      </div>
    </div>
  )
}
