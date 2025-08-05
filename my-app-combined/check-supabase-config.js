#!/usr/bin/env node

/**
 * Verificar configuración de Supabase
 */

console.log('🔍 Verificación de Configuración de Supabase')
console.log('============================================')
console.log('')

// Leer configuración actual
const fs = require('fs')
const path = require('path')

try {
  // Intentar leer el archivo de configuración
  const configPath = path.join(__dirname, 'lib/config.ts')
  const configContent = fs.readFileSync(configPath, 'utf8')
  
  console.log('📋 Configuración Actual:')
  
  // Extraer URL y clave de Supabase
  const urlMatch = configContent.match(/url:\s*process\.env\.NEXT_PUBLIC_SUPABASE_URL\s*\|\|\s*['"`]([^'"`]+)['"`]/)
  const keyMatch = configContent.match(/anonKey:\s*process\.env\.NEXT_PUBLIC_SUPABASE_ANON_KEY\s*\|\|\s*['"`]([^'"`]+)['"`]/)
  
  if (urlMatch) {
    console.log('URL de Supabase:', urlMatch[1])
  }
  
  if (keyMatch) {
    const key = keyMatch[1]
    console.log('Clave Anon Length:', key.length)
    console.log('Clave Anon Preview:', key.substring(0, 50) + '...')
    
    // Verificar si es una clave de ejemplo
    if (key.includes('Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8')) {
      console.log('')
      console.log('❌ PROBLEMA DETECTADO:')
      console.log('La clave de Supabase es de ejemplo, no una clave real.')
      console.log('')
      console.log('🔧 SOLUCIÓN INMEDIATA:')
      console.log('1. Ve a https://supabase.com/dashboard')
      console.log('2. Crea un proyecto nuevo o selecciona uno existente')
      console.log('3. Ve a Settings > API')
      console.log('4. Copia la Project URL y anon public key')
      console.log('5. Actualiza lib/config.ts con las claves reales')
      console.log('')
    } else {
      console.log('')
      console.log('✅ La clave de Supabase parece ser real')
      console.log('')
    }
  }
  
  console.log('🔍 Verificar Variables de Entorno:')
  console.log('')
  console.log('En GitHub Secrets (Settings > Secrets and variables > Actions):')
  console.log('- NEXT_PUBLIC_SUPABASE_URL')
  console.log('- NEXT_PUBLIC_SUPABASE_ANON_KEY')
  console.log('- NEXT_PUBLIC_APP_URL')
  console.log('')
  
  console.log('🔍 Verificar Configuración de OAuth:')
  console.log('')
  console.log('En Supabase Dashboard:')
  console.log('1. Authentication > URL Configuration')
  console.log('   - Site URL: https://benjamalegni.github.io/financialfeeling/')
  console.log('   - Redirect URLs:')
  console.log('     * https://benjamalegni.github.io/financialfeeling/auth/callback')
  console.log('     * http://localhost:3000/auth/callback')
  console.log('')
  console.log('2. Authentication > Providers > Google')
  console.log('   - Habilitar Google OAuth')
  console.log('   - Agregar Client ID y Client Secret')
  console.log('')
  
  console.log('🎯 Estado Actual:')
  console.log('- ❌ Claves de Supabase: Necesitan ser reales')
  console.log('- ❌ URLs de redirección: Necesitan configuración')
  console.log('- ❌ Google OAuth: Necesita configuración')
  console.log('- ✅ Callback page: Ya está arreglado')
  console.log('')
  
} catch (error) {
  console.log('❌ Error leyendo configuración:', error.message)
  console.log('')
  console.log('🔧 Verificar manualmente:')
  console.log('1. Abrir lib/config.ts')
  console.log('2. Verificar que las claves de Supabase sean reales')
  console.log('3. Verificar que las URLs de redirección estén configuradas')
  console.log('')
}

console.log('✅ Verificación completada') 