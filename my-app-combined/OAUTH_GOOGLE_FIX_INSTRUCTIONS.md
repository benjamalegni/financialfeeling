# 🔧 Instrucciones para Arreglar OAuth de Google

## 📋 Configuración Requerida

### 1. **Supabase Dashboard**

#### **URL Configuration:**
- Ve a: https://supabase.com/dashboard/project/[tu-proyecto]/auth/url-configuration
- **Site URL**: `https://financialfeeling.com/`
- **Redirect URLs**: 
  ```
  https://financialfeeling.com/auth/callback
  https://www.financialfeeling.com/auth/callback
  http://localhost:3000/auth/callback
  ```

#### **Google Provider:**
- Ve a: https://supabase.com/dashboard/project/[tu-proyecto]/auth/providers
- Habilita Google provider
- **Client ID**: Tu Google Client ID
- **Client Secret**: Tu Google Client Secret

### 2. **Google Cloud Console**

#### **OAuth 2.0 Credentials:**
- Ve a: https://console.cloud.google.com/apis/credentials
- Selecciona tu proyecto
- Abre tu OAuth 2.0 Client ID (Web application)
- Configura lo siguiente:
  - **Authorized JavaScript origins** (dominios desde donde se inicia la petición):
    - `https://financialfeeling.com`
    - `https://www.financialfeeling.com`
    - `http://localhost:3000`
  - **Authorized redirect URIs** (la URL a la que Google redirige tras consentir — en Supabase SIEMPRE es el callback de Supabase):
    - `https://<PROJECT_REF>.supabase.co/auth/v1/callback`

  Donde `<PROJECT_REF>` es el identificador de tu proyecto en Supabase (lo ves en Supabase → Project Settings → API → Project URL). Ejemplo: `https://abcd1234.supabase.co` ⇒ `https://abcd1234.supabase.co/auth/v1/callback`.

> Nota: No agregues aquí las URLs de tu app (`/auth/callback`). Esas van en Supabase (Redirect URLs). Google debe apuntar al callback de Supabase.

### 3. **GitHub Secrets**

#### **Variables de Entorno:**
- Ve a: https://github.com/benjamalegni/financialfeeling/settings/secrets/actions
- Agrega/actualiza estos secrets:

**Para Producción:**
```
NEXT_PUBLIC_SUPABASE_URL=https://<PROJECT_REF>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key-real>
NEXT_PUBLIC_APP_URL=https://www.financialfeeling.com
```

**Para Desarrollo:**
```
NEXT_PUBLIC_SUPABASE_URL=https://<PROJECT_REF>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key-real>
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. **Código Actualizado**

#### **config.ts:**
```typescript
oauth: {
  redirectUrl: (() => {
    if (typeof window !== 'undefined') {
      const origin = window.location.origin
      const isProduction = origin === 'https://financialfeeling.com' || origin === 'https://www.financialfeeling.com'
      const basePath = isProduction ? '' : ''
      return `${origin}${basePath}/auth/callback`
    } else {
      const isProduction = process.env.NODE_ENV === 'production'
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 
        (isProduction ? 'https://www.financialfeeling.com' : 'http://localhost:3000')
      const basePath = isProduction ? '' : ''
      return `${baseUrl}${basePath}/auth/callback`
    }
  })(),
  redirectUrls: {
    development: 'http://localhost:3000/auth/callback',
    production: 'https://www.financialfeeling.com/auth/callback',
  }
}
```

### 5. **Deploy y Testing**

#### **Deploy:**
- Ve a: https://github.com/benjamalegni/financialfeeling/actions
- Ejecuta el workflow de deploy
- Espera a que termine

#### **Testing:**
- Ve a: `https://www.financialfeeling.com/login`
- Haz clic en "Sign in with Google"
- Verifica que te lleva a Google sin error 400
- Tras consentir, redirige a: `https://www.financialfeeling.com/auth/callback` y crea sesión

## 🔍 Troubleshooting

### **Problemas Comunes:**

1. **Error 400 - redirect_uri_mismatch (Google)**
   - En Google Cloud, el `Authorized redirect URI` debe ser `https://<PROJECT_REF>.supabase.co/auth/v1/callback`.
   - No pongas aquí `https://www.financialfeeling.com/auth/callback`.
   - Asegúrate de que los "Authorized JavaScript origins" incluyan el dominio correcto (con/sin www según tu uso) y `http://localhost:3000` si desarrollas local.

2. **Error 400 - Invalid redirect URI (Supabase)**
   - En Supabase → URL Configuration, agrega exactamente tus callbacks de app:
     - `https://www.financialfeeling.com/auth/callback`
     - `http://localhost:3000/auth/callback`

3. **Error 401 - Unauthorized**
   - Verifica que las claves de Supabase sean reales y válidas (no placeholders)
   - Confirma que Google OAuth esté habilitado en Supabase

4. **Redirección incorrecta / pérdida de PKCE**
   - Usa siempre `https://www.financialfeeling.com` (se fuerza con componente `CanonicalHost`)
   - No cambies de dominio (www ↔ sin www) entre inicio y callback
   - Borra cookies/localStorage y vuelve a intentar

### **URLs de Verificación:**

- **Aplicación Principal**: `https://www.financialfeeling.com/`
- **Login**: `https://www.financialfeeling.com/login`
- **Auth Callback (App)**: `https://www.financialfeeling.com/auth/callback`
- **Auth Callback (Supabase/Google)**: `https://<PROJECT_REF>.supabase.co/auth/v1/callback`

## ✅ Checklist Final

- [ ] Supabase URL Configuration actualizada (Site URL + Redirect URLs de la app)
- [ ] Google OAuth con `Authorized redirect URI` de Supabase (`/auth/v1/callback`)
- [ ] Google JavaScript origins incluyen tus dominios y localhost
- [ ] Secrets/variables de entorno actualizadas
- [ ] Deploy ejecutado
- [ ] OAuth probado exitosamente 