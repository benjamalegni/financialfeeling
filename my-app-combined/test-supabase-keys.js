#!/usr/bin/env node

/**
 * Probar si las claves de Supabase son reales y funcionan
 */

const { createClient } = require('@supabase/supabase-js')

// Claves actuales del config.ts
const SUPABASE_URL = 'https://yhxdyndkdhhnuginaekn.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InloeGR5bmRrZGhobnVnaW5hZWtuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3MTYxMTgsImV4cCI6MjA2NjI5MjExOH0.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8'

console.log('🔍 Verificación de Claves de Supabase')
console.log('=====================================')
console.log('')

console.log('📋 Claves Actuales:')
console.log('URL:', SUPABASE_URL)
console.log('Anon Key Length:', SUPABASE_ANON_KEY.length)
console.log('Anon Key Preview:', SUPABASE_ANON_KEY.substring(0, 50) + '...')
console.log('')

// Verificar si parece ser una clave de ejemplo
if (SUPABASE_ANON_KEY.includes('Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8')) {
  console.log('❌ PROBLEMA DETECTADO:')
  console.log('La clave contiene caracteres de ejemplo repetidos.')
  console.log('Esto indica que es una clave de ejemplo, no una clave real.')
  console.log('')
} else {
  console.log('✅ La clave no contiene patrones de ejemplo obvios.')
  console.log('')
}

// Crear cliente de Supabase
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

async function testConnection() {
  try {
    console.log('🔍 Test 1: Verificar conexión básica...')
    
    // Test básico de conexión
    const { data, error } = await supabase.auth.getSession()
    
    if (error) {
      console.log('❌ Error de conexión:', error.message)
      console.log('')
      console.log('🔧 Posibles causas:')
      console.log('1. Las claves son de ejemplo (no reales)')
      console.log('2. El proyecto de Supabase no existe')
      console.log('3. La URL o clave son incorrectas')
      console.log('')
      return
    }
    
    console.log('✅ Conexión exitosa a Supabase')
    console.log('Session actual:', data.session ? 'Sí' : 'No')
    console.log('')
    
    console.log('🔍 Test 2: Verificar configuración de OAuth...')
    
    // Intentar obtener información de autenticación
    const { data: authData, error: authError } = await supabase.auth.listIdentities()
    
    if (authError) {
      console.log('❌ Error al verificar OAuth:', authError.message)
      console.log('')
      console.log('🔧 Esto puede indicar que:')
      console.log('1. Las claves son de ejemplo')
      console.log('2. El proyecto no tiene OAuth configurado')
      console.log('3. Hay problemas de permisos')
      console.log('')
    } else {
      console.log('✅ OAuth configurado correctamente')
      console.log('')
    }
    
    console.log('🔍 Test 3: Verificar tablas de base de datos...')
    
    // Intentar acceder a una tabla (si existe)
    const { data: tableData, error: tableError } = await supabase
      .from('user_selected_assets')
      .select('*')
      .limit(1)
    
    if (tableError) {
      console.log('❌ Error al acceder a tablas:', tableError.message)
      console.log('')
      console.log('🔧 Esto puede indicar que:')
      console.log('1. Las tablas no existen')
      console.log('2. Las claves son de ejemplo')
      console.log('3. Hay problemas de permisos')
      console.log('')
    } else {
      console.log('✅ Acceso a base de datos exitoso')
      console.log('')
    }
    
    console.log('📊 Resumen de Verificación:')
    console.log('1. ✅ Conexión a Supabase: Funcionando')
    console.log('2. ⚠️  OAuth: Necesita verificación manual')
    console.log('3. ⚠️  Base de datos: Necesita verificación manual')
    console.log('')
    
    console.log('🎯 Recomendación:')
    console.log('Si las claves son reales y funcionan, el problema puede ser:')
    console.log('1. URLs de redirección no configuradas en Supabase')
    console.log('2. Google OAuth no habilitado en Supabase')
    console.log('3. URLs de redirección no configuradas en Google Cloud Console')
    console.log('')
    
  } catch (error) {
    console.error('❌ Error durante la verificación:', error.message)
    console.log('')
    console.log('🔧 Esto confirma que las claves son de ejemplo o no funcionan.')
  }
}

// Ejecutar con timeout para evitar que se cuelgue
const timeout = setTimeout(() => {
  console.log('⏰ Timeout: La verificación tardó demasiado.')
  console.log('🔧 Esto indica que las claves son de ejemplo o no funcionan.')
  process.exit(1)
}, 10000) // 10 segundos

testConnection().then(() => {
  clearTimeout(timeout)
  console.log('✅ Verificación completada')
}).catch((error) => {
  clearTimeout(timeout)
  console.error('❌ Error:', error.message)
}) 