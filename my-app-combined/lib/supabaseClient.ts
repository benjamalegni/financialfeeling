import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'
import { config } from './config'

export const supabase = createClient<Database>(config.supabase.url, config.supabase.anonKey, {
  auth: {
    flowType: 'pkce',
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})

// Daily Picks helpers
export async function getDailyPicksFromDB(pickDateISO: string) {
  const { data, error } = await supabase
    .from('daily_picks')
    .select('*')
    .eq('pick_date', pickDateISO)
    .maybeSingle()
  if (error) {
    console.warn('getDailyPicksFromDB error:', error.message)
    return null
  }
  return data
}

export async function upsertDailyPicks(pickDateISO: string, symbols: string[], charts: any) {
  const payload = {
    pick_date: pickDateISO,
    symbols,
    charts,
  } as any
  const { data, error } = await supabase
    .from('daily_picks')
    .upsert(payload, { onConflict: 'pick_date' })
    .select('*')
    .maybeSingle()
  if (error) {
    console.warn('upsertDailyPicks error:', error.message)
    return null
  }
  return data
}

// Función para inicializar datos de usuario después del registro (completamente opcional)
export async function initializeUserData(userId: string) {
  try {
    console.log('Attempting to initialize user data for:', userId)
    
    // Verificar si la tabla existe y es accesible
    const { data: tableCheck, error: tableError } = await supabase
      .from('user_selected_assets')
      .select('id')
      .limit(1)
    
    if (tableError) {
      console.warn('Table user_selected_assets not accessible:', tableError.message)
      return
    }
    
    // Intentar crear un registro en user_selected_assets (opcional)
    const { error } = await supabase
      .from('user_selected_assets')
      .insert([
        {
          user_id: userId,
          asset_identifier: 'AAPL',
          asset_type: 'stock',
          asset_name: 'Apple Inc.',
          notes: 'Example asset added automatically'
        }
      ])
    
    if (error) {
      console.warn('Could not initialize user data:', error.message)
      // No es crítico, el usuario puede funcionar sin esto
    } else {
      console.log('User data initialized successfully')
    }
  } catch (err) {
    console.warn('Error initializing user data:', err)
    // No es crítico, continuar
  }
}

// Función para verificar si el usuario puede acceder a las tablas personalizadas
export async function checkUserTableAccess(userId: string) {
  try {
    const { error } = await supabase
      .from('user_selected_assets')
      .select('id')
      .eq('user_id', userId)
      .limit(1)
    
    return !error
  } catch (err) {
    console.warn('User table access check failed:', err)
    return false
  }
}

export async function saveAIAnalysisHistory(userId: string, selectedAssets: string[], result: any) {
  try {
    const payload = {
      user_id: userId,
      selected_assets: selectedAssets,
      result,
    }
    const { data, error } = await supabase
      .from('ai_analysis_history')
      .insert(payload)
      .select('*')
      .maybeSingle()
    if (error) throw error
    return data
  } catch (e) {
    console.warn('saveAIAnalysisHistory error:', e)
    return null
  }
}

export async function listAIAnalysisHistory(userId: string, limit = 20) {
  try {
    const { data, error } = await supabase
      .from('ai_analysis_history')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)
    if (error) throw error
    return data || []
  } catch (e) {
    console.warn('listAIAnalysisHistory error:', e)
    return []
  }
}
