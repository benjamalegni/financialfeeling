# 🔧 Instrucciones para Arreglar OAuth de Google

## 📋 Configuración Requerida

### 1. **Supabase Dashboard**

#### **URL Configuration:**
- Ve a: https://supabase.com/dashboard/project/[tu-proyecto]/auth/url-configuration
- **Site URL**: `https://financialfeeling.com/`
- **Redirect URLs**: 
  ```
  https://financialfeeling.com/auth/callback
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
- En "Authorized redirect URIs" agrega:
  ```
  https://financialfeeling.com/auth/callback
  http://localhost:3000/auth/callback
  ```

### 3. **GitHub Secrets**

#### **Variables de Entorno:**
- Ve a: https://github.com/benjamalegni/financialfeeling/settings/secrets/actions
- Agrega/actualiza estos secrets:

**Para Producción:**
```
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto-real.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-clave-anon-real
NEXT_PUBLIC_APP_URL=https://financialfeeling.com/
```

**Para Desarrollo:**
```
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto-real.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-clave-anon-real
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
        (isProduction ? 'https://financialfeeling.com' : 'http://localhost:3000')
      const basePath = isProduction ? '' : ''
      return `${baseUrl}${basePath}/auth/callback`
    }
  })(),
  
  redirectUrls: {
    development: 'http://localhost:3000/auth/callback',
    production: 'https://financialfeeling.com/auth/callback',
  }
}
```

### 5. **Deploy y Testing**

#### **Deploy:**
- Ve a: https://github.com/benjamalegni/financialfeeling/actions
- Ejecuta el workflow de deploy
- Espera a que termine

#### **Testing:**
- Ve a: https://financialfeeling.com/login
- Haz clic en "Sign in with Google"
- Verifica que redirija a: `https://financialfeeling.com/auth/callback`
- Confirma que la sesión se inicie correctamente

## 🔍 Troubleshooting

### **Problemas Comunes:**

1. **Error 400 - Invalid redirect URI**
   - Verifica que las URLs en Google Cloud Console coincidan exactamente
   - Asegúrate de incluir `https://` y `http://` para desarrollo

2. **Error 401 - Unauthorized**
   - Verifica que las claves de Supabase sean reales (no de ejemplo)
   - Confirma que Google OAuth esté habilitado en Supabase

3. **Redirección incorrecta**
   - Verifica que `NEXT_PUBLIC_APP_URL` esté configurado correctamente
   - Confirma que el dominio esté bien configurado en DNS

### **URLs de Verificación:**

- **Aplicación Principal**: `https://financialfeeling.com/`
- **Login**: `https://financialfeeling.com/login`
- **Auth Callback**: `https://financialfeeling.com/auth/callback`

## ✅ Checklist Final

- [ ] Supabase URL Configuration actualizada
- [ ] Google OAuth habilitado en Supabase
- [ ] Google Cloud Console configurado
- [ ] GitHub Secrets actualizados
- [ ] Deploy ejecutado
- [ ] OAuth probado exitosamente 