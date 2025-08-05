# 🔧 INSTRUCCIONES: Arreglar OAuth Google - Redirección a Localhost

## 🎯 Problema Identificado

Cuando intentas hacer login con Google OAuth, el sistema redirige a `http://localhost:3000` en lugar de la página principal desplegada en GitHub Pages.

## 🔍 Causa del Problema

1. **Detección incorrecta del entorno**: La aplicación no detecta correctamente que está en GitHub Pages
2. **Configuración de Supabase**: Las URLs de redirección en Supabase pueden estar configuradas incorrectamente
3. **Variables de entorno**: Falta la variable `NEXT_PUBLIC_APP_URL` en el deployment

## ✅ Solución Paso a Paso

### Paso 1: Verificar Configuración de Supabase

1. **Accede a tu proyecto de Supabase**:
   - Ve a: https://supabase.com/dashboard
   - Selecciona tu proyecto: `yhxdyndkdhhnuginaekn`

2. **Configurar URLs de OAuth**:
   - Ve a: **Authentication** → **URL Configuration**
   - **Site URL**: `https://benjamalegni.github.io/financialfeeling/`
   - **Redirect URLs**: Agrega estas URLs:
     ```
     https://benjamalegni.github.io/financialfeeling/auth/callback
     http://localhost:3000/auth/callback
     ```

3. **Configurar Google OAuth**:
   - Ve a: **Authentication** → **Providers** → **Google**
   - Asegúrate de que esté **habilitado**
   - **Client ID**: Tu Google OAuth Client ID
   - **Client Secret**: Tu Google OAuth Client Secret

### Paso 2: Verificar Google Cloud Console

1. **Accede a Google Cloud Console**:
   - Ve a: https://console.cloud.google.com/
   - Selecciona tu proyecto

2. **Configurar OAuth 2.0**:
   - Ve a: **APIs & Services** → **Credentials**
   - Selecciona tu OAuth 2.0 Client ID
   - **Authorized redirect URIs**: Agrega:
     ```
     https://benjamalegni.github.io/financialfeeling/auth/callback
     http://localhost:3000/auth/callback
     ```

### Paso 3: Actualizar Variables de Entorno

1. **En GitHub Secrets**:
   - Ve a tu repositorio en GitHub
   - **Settings** → **Secrets and variables** → **Actions**
   - Verifica que tengas:
     ```
     NEXT_PUBLIC_SUPABASE_URL=https://yhxdyndkdhhnuginaekn.supabase.co
     NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima
     NEXT_PUBLIC_APP_URL=https://benjamalegni.github.io/financialfeeling/
     ```

2. **En Railway (si usas Railway)**:
   - Ve a tu proyecto en Railway
   - **Variables** → Agrega:
     ```
     NEXT_PUBLIC_APP_URL=https://benjamalegni.github.io/financialfeeling/
     ```

### Paso 4: Verificar Código de la Aplicación

El código ya está actualizado en `lib/config.ts` para detectar correctamente GitHub Pages:

```typescript
// OAuth Configuration - Corregir para detectar correctamente GitHub Pages
oauth: {
  redirectUrl: (() => {
    if (typeof window !== 'undefined') {
      // Cliente - detecta automáticamente si estamos en GitHub Pages
      const origin = window.location.origin
      const pathname = window.location.pathname
      const isGitHubPages = origin === 'https://benjamalegni.github.io' || pathname.startsWith('/financialfeeling')
      const basePath = isGitHubPages ? '/financialfeeling' : ''
      return `${origin}${basePath}/auth/callback`
    } else {
      // Servidor - usa variables de entorno o valores por defecto
      const isProduction = process.env.NODE_ENV === 'production'
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 
        (isProduction ? 'https://benjamalegni.github.io' : 'http://localhost:3000')
      const basePath = isProduction ? '/financialfeeling' : ''
      return `${baseUrl}${basePath}/auth/callback`
    }
  })(),
}
```

### Paso 5: Probar la Configuración

1. **Hacer un nuevo deployment**:
   ```bash
   git add .
   git commit -m "Fix OAuth Google redirect URLs"
   git push origin main
   ```

2. **Verificar el deployment**:
   - Ve a: https://github.com/benjamalegni/financialfeeling/actions
   - Espera a que termine el deployment

3. **Probar OAuth**:
   - Ve a: https://benjamalegni.github.io/financialfeeling/login
   - Haz clic en "Sign In with Google"
   - Verifica que redirija a: `https://benjamalegni.github.io/financialfeeling/auth/callback`

## 🔧 Troubleshooting

### Si sigue redirigiendo a localhost:

1. **Verificar Console del Navegador**:
   - Abre DevTools (F12)
   - Ve a la pestaña Console
   - Busca mensajes de error relacionados con OAuth

2. **Verificar Network Tab**:
   - Ve a la pestaña Network
   - Busca requests a Supabase o Google OAuth
   - Verifica las URLs de redirección

3. **Verificar Variables de Entorno**:
   ```javascript
   // En la consola del navegador
   console.log('NEXT_PUBLIC_APP_URL:', process.env.NEXT_PUBLIC_APP_URL)
   console.log('NODE_ENV:', process.env.NODE_ENV)
   ```

### Si el problema persiste:

1. **Limpiar cache del navegador**
2. **Probar en modo incógnito**
3. **Verificar que no haya redirecciones en el middleware**

## ✅ URLs Correctas

### ✅ URLs de Producción (GitHub Pages)
- **Aplicación Principal**: `https://benjamalegni.github.io/financialfeeling/`
- **Login**: `https://benjamalegni.github.io/financialfeeling/login`
- **Auth Callback**: `https://benjamalegni.github.io/financialfeeling/auth/callback`

### ✅ URLs de Desarrollo
- **Localhost**: `http://localhost:3000/auth/callback`

## 🎯 Resultado Esperado

Después de aplicar estos cambios:

1. **✅ OAuth Google redirigirá correctamente** a GitHub Pages
2. **✅ No más redirecciones a localhost** en producción
3. **✅ Login funcionando** en ambos entornos (desarrollo y producción)

---
**Fecha**: 3 de Agosto, 2025  
**Estado**: ✅ **INSTRUCCIONES COMPLETAS**  
**Próximo paso**: Aplicar los cambios y probar OAuth 