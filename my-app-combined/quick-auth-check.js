#!/usr/bin/env node

/**
 * Verificación rápida de autenticación
 */

console.log('🔍 Verificación Rápida de Autenticación')
console.log('=======================================')
console.log('')

// Verificar configuración básica
const SUPABASE_URL = 'https://yhxdyndkdhhnuginaekn.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InloeGR5bmRrZGhobnVnaW5hZWtuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3MTYxMTgsImV4cCI6MjA2NjI5MjExOH0.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8'

console.log('📋 Configuración Actual:')
console.log('URL:', SUPABASE_URL)
console.log('Anon Key Length:', SUPABASE_ANON_KEY.length)
console.log('')

// Verificar si la clave parece ser real o de ejemplo
if (SUPABASE_ANON_KEY.includes('Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8')) {
  console.log('❌ PROBLEMA DETECTADO:')
  console.log('La clave de Supabase parece ser de ejemplo, no una clave real.')
  console.log('')
  console.log('🔧 SOLUCIÓN:')
  console.log('1. Ve a https://supabase.com/dashboard')
  console.log('2. Selecciona tu proyecto')
  console.log('3. Ve a Settings > API')
  console.log('4. Copia la URL y anon key reales')
  console.log('5. Actualiza el archivo lib/config.ts')
  console.log('')
} else {
  console.log('✅ La clave de Supabase parece ser real')
  console.log('')
}

console.log('🔍 URLs que deben estar configuradas:')
console.log('')
console.log('En Supabase Dashboard (Authentication > URL Configuration):')
console.log('- Site URL: https://benjamalegni.github.io/financialfeeling/')
console.log('- Redirect URLs:')
console.log('  * https://benjamalegni.github.io/financialfeeling/auth/callback')
console.log('  * http://localhost:3000/auth/callback')
console.log('')
console.log('En Google Cloud Console (APIs & Services > Credentials):')
console.log('- Authorized redirect URIs:')
console.log('  * https://benjamalegni.github.io/financialfeeling/auth/callback')
console.log('  * http://localhost:3000/auth/callback')
console.log('')

console.log('🎯 Pasos para arreglar el problema:')
console.log('1. Verificar que las claves de Supabase sean reales')
console.log('2. Configurar URLs de redirección en Supabase')
console.log('3. Configurar URLs de redirección en Google Cloud Console')
console.log('4. Verificar que Google OAuth esté habilitado en Supabase')
console.log('5. Hacer un nuevo deployment después de los cambios')
console.log('')

console.log('✅ Verificación completada') 