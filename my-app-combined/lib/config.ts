// Configuración para variables de entorno en deployment estático
export const config = {
  // Supabase Configuration
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://yhxdyndkdhhnuginaekn.supabase.co',
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InloeGR5bmRrZGhobnVnaW5hZWtuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3MTYxMTgsImV4cCI6MjA2NjI5MjExOH0.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8',
  },
  
  // Railway Backend
  railway: {
    webhookUrl: process.env.NEXT_PUBLIC_RAILWAY_WEBHOOK_URL || 'https://ffaiagent-n8n-production.up.railway.app/webhook-test/analyze-stocks',
  },
  
  // Alpha Vantage API
  alphaVantage: {
    apiKey: process.env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY || 'UVJUR5P1SEQ00P2P',
  },
  
  // App Configuration
  app: {
    basePath: process.env.NODE_ENV === 'production' ? '/financialfeeling' : '',
    isStaticExport: process.env.USE_STATIC_EXPORT === 'true',
    // URL de la aplicación - detecta automáticamente el entorno
    url: process.env.NEXT_PUBLIC_APP_URL || (typeof window !== 'undefined' ? 
      window.location.origin + (window.location.pathname.startsWith('/financialfeeling') ? '/financialfeeling' : '') : 
      'http://localhost:3000'),
  }
}

// Función helper para obtener configuración
export function getConfig() {
  return config
}

// Función para verificar si las claves de Supabase son válidas
export function validateSupabaseConfig() {
  const url = config.supabase.url
  const key = config.supabase.anonKey
  
  if (!url || url === 'https://yhxdyndkdhhnuginaekn.supabase.co') {
    console.warn('Supabase URL parece ser una URL de ejemplo')
  }
  
  if (!key || key.includes('Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8')) {
    console.warn('Supabase anonKey parece ser una clave de ejemplo')
  }
  
  return {
    isValid: url && key && !url.includes('example') && !key.includes('Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8'),
    url,
    keyLength: key ? key.length : 0
  }
} 