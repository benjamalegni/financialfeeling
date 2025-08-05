import { createClient } from '@supabase/supabase-js'
import { config } from './config'

export const supabase = createClient(config.supabase.url, config.supabase.anonKey)

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
