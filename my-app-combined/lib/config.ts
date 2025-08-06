// Configuración para variables de entorno en deployment estático
export const config = {
  // Supabase Configuration
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://yhxdyndkdhhnuginaekn.supabase.co',
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InloeGR5bmRrZGhobnVnaW5hZWtuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3MTYxMTgsImV4cCI6MjA2NjI5MjExOH0.-3qFN_HEZx7i1rGhpaZg9edxoSRDgUkPzDYfrPNiIqI'
  },
  
  // Railway Backend - Actualizar a la URL que funciona
  railway: {
    webhookUrl: process.env.NEXT_PUBLIC_RAILWAY_WEBHOOK_URL || 'https://ffaiagent-n8n-production.up.railway.app/webhook/analyze-stocks',
  },
  
  // Alpha Vantage API
  alphaVantage: {
    apiKey: process.env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY || 'UVJUR5P1SEQ00P2P',
  },
  
  // App Configuration
  app: {
    basePath: process.env.NODE_ENV === 'production' ? '' : '',
    isStaticExport: process.env.USE_STATIC_EXPORT === 'true',
    // URL de la aplicación - detecta automáticamente el entorno
    url: process.env.NEXT_PUBLIC_APP_URL || (typeof window !== 'undefined' ? 
      window.location.origin : 
      'http://localhost:3000'),
  },

  // OAuth Configuration - Actualizado para financialfeeling.com
  oauth: {
    // Detecta automáticamente la URL de redirección basada en el entorno
    redirectUrl: (() => {
      if (typeof window !== 'undefined') {
        // Cliente - detecta automáticamente si estamos en el dominio personalizado
        const origin = window.location.origin
        const isProduction = origin === 'https://financialfeeling.com' || origin === 'https://www.financialfeeling.com'
        const basePath = isProduction ? '' : ''
        return `${origin}${basePath}/auth/callback`
      } else {
        // Servidor - usa variables de entorno o valores por defecto
        const isProduction = process.env.NODE_ENV === 'production'
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 
          (isProduction ? 'https://financialfeeling.com' : 'http://localhost:3000')
        const basePath = isProduction ? '' : ''
        return `${baseUrl}${basePath}/auth/callback`
      }
    })(),
    
    // URLs de redirección para diferentes entornos
    redirectUrls: {
      development: 'http://localhost:3000/auth/callback',
      production: 'https://financialfeeling.com/auth/callback',
    }
  }
}

// Función helper para obtener configuración
export function getConfig() {
  return config
}

// Función para obtener la URL de redirección correcta
export function getRedirectUrl() {
  return config.oauth.redirectUrl
}

// Función para forzar HTTPS en producción
export function forceHTTPS() {
  if (typeof window !== 'undefined' && window.location.protocol === 'http:' && 
      (window.location.hostname === 'financialfeeling.com' || window.location.hostname === 'www.financialfeeling.com')) {
    window.location.href = window.location.href.replace('http:', 'https:');
  }
}

// Función para verificar si las claves de Supabase son válidas
export function validateSupabaseConfig() {
  const url = config.supabase.url
  const key = config.supabase.anonKey
  
  // Verificar si la URL es de ejemplo
  const isExampleUrl = !url || url === 'https://yhxdyndkdhhnuginaekn.supabase.co'
  
  // Verificar si la clave es de ejemplo (contiene caracteres repetidos de ejemplo)
  const isExampleKey = !key || key.includes('Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8')
  
  // Verificar si la clave tiene el formato correcto de JWT
  const isValidJWTFormat = key && key.split('.').length === 3
  
  // Verificar si la clave tiene la longitud correcta
  const isValidLength = key && key.length > 100 && key.length < 500
  
  if (isExampleUrl) {
    console.warn('⚠️ Supabase URL parece ser una URL de ejemplo')
  }
  
  if (isExampleKey) {
    console.warn('⚠️ Supabase anonKey parece ser una clave de ejemplo')
  }
  
  if (!isValidJWTFormat) {
    console.warn('⚠️ Supabase anonKey no tiene el formato JWT correcto')
  }
  
  if (!isValidLength) {
    console.warn('⚠️ Supabase anonKey no tiene la longitud correcta')
  }
  
  const isValid = url && key && !isExampleUrl && !isExampleKey && isValidJWTFormat && isValidLength
  
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