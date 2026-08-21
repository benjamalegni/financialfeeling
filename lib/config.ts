// Configuración para variables de entorno en deployment estático
export const config = {
  // Supabase Configuration
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co',
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key',
  },

// Local/External Server API (Express in /server)
  server: {
    baseUrl: process.env.NEXT_PUBLIC_SERVER_URL || '',
  },

  // Alpha Vantage Configuration
  alphaVantage: {
    apiKey: process.env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY || 'UVJUR5P1SEQ00P2P',
    baseUrl: 'https://www.alphavantage.co/query',
  },

  // Financial Modeling Prep Configuration (free tier supported)
  fmp: {
    apiKey: process.env.NEXT_PUBLIC_FMP_API_KEY || '',
    baseUrl: 'https://financialmodelingprep.com/api/v3',
  },

  // App Configuration
  app: {
    url: (() => {
      if (typeof window !== 'undefined') {
        return window.location.origin
      }
      return process.env.NEXT_PUBLIC_APP_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')
    })(),
    name: 'Financial Feeling',
    description: 'AI-powered financial analysis and trading insights',
    twelveDataApiKey: process.env.NEXT_PUBLIC_TWELVE_DATA_API_KEY || 'fa7cfa25e2a0433a8f7fb2aaca442880',
  },

  // OAuth Configuration
  oauth: {
    redirectUrl: (() => {
      if (typeof window !== 'undefined') {
        return `${window.location.origin}/auth/callback`
      } else {
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 
          (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')
        return `${baseUrl}/auth/callback`
      }
    })(),
    
    redirectUrls: {
      development: 'http://localhost:3000/auth/callback',
      production: process.env.NEXT_PUBLIC_APP_URL ? `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback` : '/auth/callback',
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

export function forceHTTPS() {
  if (typeof window !== 'undefined' && window.location.protocol === 'http:' && 
      !window.location.hostname.includes('localhost') && 
      !window.location.hostname.includes('127.0.0.1')) {
    window.location.href = window.location.href.replace('http:', 'https:');
  }
}

// Función para verificar si las claves de Supabase son válidas
export function validateSupabaseConfig() {
  const url = config.supabase.url
  const key = config.supabase.anonKey
  
  // Verificar si la URL existe y no es de ejemplo
  const isExampleUrl = !url || url === 'https://your-project.supabase.co' || url.includes('your-project')
  
  // Verificar si la clave existe y no es de ejemplo
  const isExampleKey = !key || key === 'your-anon-key' || key.includes('your-anon-key')
  
  // Verificar si la clave tiene el formato básico de JWT (3 partes separadas por puntos)
  const isValidJWTFormat = key && key.split('.').length === 3
  
  // Verificar si la clave tiene una longitud razonable
  const isValidLength = key && key.length > 50
  
  const isValid = url && key && !isExampleUrl && !isExampleKey && isValidJWTFormat && isValidLength
  
  if (!isValid) {
    console.warn('⚠️ Supabase configuration validation failed:', {
      hasUrl: !!url,
      hasKey: !!key,
      isExampleUrl,
      isExampleKey,
      isValidJWTFormat,
      isValidLength
    })
  }
  
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
