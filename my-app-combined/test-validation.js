#!/usr/bin/env node

/**
 * Probar la función validateSupabaseConfig arreglada
 */

console.log('🔍 Probando validateSupabaseConfig')
console.log('==================================')
console.log('')

// Simular la función validateSupabaseConfig
function validateSupabaseConfig() {
  const url = 'https://yhxdyndkdhhnuginaekn.supabase.co'
  const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InloeGR5bmRrZGhobnVnaW5hZWtuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3MTYxMTgsImV4cCI6MjA2NjI5MjExOH0.-3qFN_HEZx7i1rGhpaZg9edxoSRDgUkPzDYfrPNiIqI'
  
  // Verificar si la URL es de ejemplo
  const isExampleUrl = !url || url === 'https://yhxdyndkdhhnuginaekn.supabase.co'
  
  // Verificar si la clave es de ejemplo (contiene caracteres repetidos de ejemplo)
  const isExampleKey = !key || key.includes('Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8')
  
  // Verificar si la clave tiene el formato correcto de JWT
  const isValidJWTFormat = key && key.split('.').length === 3
  
  // Verificar si la clave tiene la longitud correcta
  const isValidLength = key && key.length > 100 && key.length < 500
  
  console.log('📋 Análisis de la configuración:')
  console.log('URL:', url)
  console.log('Key Length:', key.length)
  console.log('Key Preview:', key.substring(0, 50) + '...')
  console.log('')
  
  console.log('🔍 Verificaciones:')
  console.log('- isExampleUrl:', isExampleUrl)
  console.log('- isExampleKey:', isExampleKey)
  console.log('- isValidJWTFormat:', isValidJWTFormat)
  console.log('- isValidLength:', isValidLength)
  console.log('')
  
  if (isExampleUrl) {
    console.log('⚠️ Supabase URL parece ser una URL de ejemplo')
  }
  
  if (isExampleKey) {
    console.log('⚠️ Supabase anonKey parece ser una clave de ejemplo')
  }
  
  if (!isValidJWTFormat) {
    console.log('⚠️ Supabase anonKey no tiene el formato JWT correcto')
  }
  
  if (!isValidLength) {
    console.log('⚠️ Supabase anonKey no tiene la longitud correcta')
  }
  
  const isValid = url && key && !isExampleUrl && !isExampleKey && isValidJWTFormat && isValidLength
  
  console.log('')
  console.log('📊 Resultado:')
  console.log('- isValid:', isValid)
  console.log('- Total de problemas:', [isExampleUrl, isExampleKey, !isValidJWTFormat, !isValidLength].filter(Boolean).length)
  console.log('')
  
  return {
    isValid,
    url,
    keyLength: key ? key.length : 0,
    isExampleUrl,
    isExampleKey,
    isValidJWTFormat,
    isValidLength,
    issues: {
      exampleUrl: isExampleUrl,
      exampleKey: isExampleKey,
      invalidJWT: !isValidJWTFormat,
      invalidLength: !isValidLength
    }
  }
}

// Ejecutar la validación
const result = validateSupabaseConfig()

console.log('🎯 Recomendación:')
if (result.isValid) {
  console.log('✅ Las claves parecen ser válidas')
  console.log('El problema de OAuth puede ser:')
  console.log('1. URLs de redirección no configuradas')
  console.log('2. Google OAuth no habilitado')
  console.log('3. Configuración en Google Cloud Console')
} else {
  console.log('❌ Las claves tienen problemas:')
  if (result.issues.exampleUrl) console.log('- URL es de ejemplo')
  if (result.issues.exampleKey) console.log('- Clave es de ejemplo')
  if (result.issues.invalidJWT) console.log('- Formato JWT incorrecto')
  if (result.issues.invalidLength) console.log('- Longitud incorrecta')
  console.log('')
  console.log('🔧 Solución: Obtener claves reales de Supabase')
}

console.log('')
console.log('✅ Validación completada') 