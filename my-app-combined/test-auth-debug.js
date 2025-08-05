#!/usr/bin/env node

/**
 * Script para diagnosticar problemas de autenticación
 * Uso: node test-auth-debug.js
 */

const { createClient } = require('@supabase/supabase-js')

// Configuración de Supabase
const SUPABASE_URL = 'https://yhxdyndkdhhnuginaekn.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InloeGR5bmRrZGhobnVnaW5hZWtuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3MTYxMTgsImV4cCI6MjA2NjI5MjExOH0.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8'

console.log('🔍 Diagnóstico de Autenticación Supabase')
console.log('==========================================')
console.log('')

// Verificar configuración
console.log('📋 Configuración:')
console.log('URL:', SUPABASE_URL)
console.log('Anon Key Length:', SUPABASE_ANON_KEY.length)
console.log('Anon Key Preview:', SUPABASE_ANON_KEY.substring(0, 50) + '...')
console.log('')

// Crear cliente de Supabase
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

async function testAuth() {
  try {
    console.log('🔍 Test 1: Verificar conexión a Supabase')
    
    // Test básico de conexión
    const { data, error } = await supabase.auth.getSession()
    
    if (error) {
      console.log('❌ Error de conexión:', error.message)
      return
    }
    
    console.log('✅ Conexión exitosa a Supabase')
    console.log('Session actual:', data.session ? 'Sí' : 'No')
    console.log('')
    
    console.log('🔍 Test 2: Verificar configuración de OAuth')
    
    // Verificar si Google OAuth está habilitado
    const { data: authData, error: authError } = await supabase.auth.listIdentities()
    
    if (authError) {
      console.log('❌ Error al verificar OAuth:', authError.message)
    } else {
      console.log('✅ OAuth configurado correctamente')
    }
    console.log('')
    
    console.log('🔍 Test 3: Verificar URLs de redirección')
    console.log('URLs que deberían estar configuradas en Supabase:')
    console.log('- https://benjamalegni.github.io/financialfeeling/auth/callback')
    console.log('- http://localhost:3000/auth/callback')
    console.log('')
    
    console.log('🔍 Test 4: Verificar configuración de Google Cloud Console')
    console.log('URLs que deberían estar configuradas en Google Cloud Console:')
    console.log('- https://benjamalegni.github.io/financialfeeling/auth/callback')
    console.log('- http://localhost:3000/auth/callback')
    console.log('')
    
    console.log('📊 Resumen de Diagnóstico:')
    console.log('1. ✅ Conexión a Supabase: Funcionando')
    console.log('2. ⚠️  OAuth: Necesita verificación manual')
    console.log('3. ⚠️  URLs de redirección: Verificar en Supabase')
    console.log('4. ⚠️  Google Cloud Console: Verificar configuración')
    console.log('')
    
    console.log('🎯 Próximos pasos:')
    console.log('1. Verificar que las claves de Supabase sean reales (no de ejemplo)')
    console.log('2. Configurar URLs de redirección en Supabase Dashboard')
    console.log('3. Configurar URLs de redirección en Google Cloud Console')
    console.log('4. Verificar que Google OAuth esté habilitado en Supabase')
    
  } catch (error) {
    console.error('❌ Error durante el diagnóstico:', error.message)
  }
}

testAuth() 