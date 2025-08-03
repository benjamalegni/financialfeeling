# Configuración Detallada de Google OAuth en Supabase

## Paso 1: Configurar Google Cloud Console

### 1.1 Crear/Seleccionar Proyecto
1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Asegúrate de que el proyecto esté seleccionado en la barra superior

### 1.2 Habilitar APIs
1. Ve a **APIs & Services** → **Library**
2. Busca y habilita estas APIs:
   - **Google+ API**
   - **Google Identity API**
   - **Google Identity and Access Management (IAM) API**

### 1.3 Crear Credenciales OAuth 2.0
1. Ve a **APIs & Services** → **Credentials**
2. Haz clic en **Create Credentials** → **OAuth 2.0 Client IDs**
3. Si es la primera vez, configura la pantalla de consentimiento:
   - Selecciona **External** (a menos que tengas Google Workspace)
   - Completa la información básica de la aplicación
   - Agrega tu email como desarrollador
   - Guarda y continúa

4. Crea las credenciales OAuth:
   - **Application type**: Web application
   - **Name**: Financial Feeling OAuth
   - **Authorized redirect URIs** (agrega estas URLs):
     ```
     https://yhxdyndkdhhnuginaekn.supabase.co/auth/v1/callback
     http://localhost:54321/auth/v1/callback
     https://your-domain.com/auth/callback
     http://localhost:3000/auth/callback
     ```

5. Copia el **Client ID** y **Client Secret**

## Paso 2: Configurar Supabase

### 2.1 Habilitar Google Provider
1. Ve a tu [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecciona tu proyecto: `yhxdyndkdhhnuginaekn`
3. Ve a **Authentication** → **Providers**
4. Busca **Google** en la lista
5. Haz clic en **Enable**
6. Ingresa las credenciales:
   - **Client ID**: Tu Google OAuth Client ID
   - **Client Secret**: Tu Google OAuth Client Secret
7. Haz clic en **Save**

### 2.2 Configurar URLs de Redirección
1. En Supabase, ve a **Authentication** → **URL Configuration**
2. Configura:
   - **Site URL**: `https://your-domain.com` (o tu dominio)
   - **Redirect URLs**: 
     ```
     https://your-domain.com/auth/callback
     http://localhost:3000/auth/callback
     ```

## Paso 3: Probar la Configuración

### 3.1 Ejecutar Script de Prueba
```bash
cd my-app-combined
node test-google-oauth.js
```

### 3.2 Verificar en el Navegador
1. Abre tu aplicación
2. Ve a la página de login
3. Haz clic en "Sign In with Google"
4. Deberías ser redirigido a Google para autorización

## Paso 4: Solucionar Problemas Comunes

### Error: "Provider not enabled"
- **Solución**: Asegúrate de que Google esté habilitado en Supabase Authentication → Providers

### Error: "Invalid redirect URI"
- **Solución**: Verifica que las URLs de redirección en Google Cloud Console coincidan exactamente

### Error: "Client ID not found"
- **Solución**: Verifica que estés usando las credenciales correctas de "Web application"

### Error: "Access blocked"
- **Solución**: Agrega tu dominio a las URLs autorizadas en Google Cloud Console

## Paso 5: Configuración de Producción

### 5.1 Dominio de Producción
Cuando despliegues a producción:
1. Agrega tu dominio de producción a las URLs autorizadas en Google Cloud Console
2. Actualiza las URLs de redirección en Supabase
3. Prueba el flujo completo en producción

### 5.2 Variables de Entorno
Para mayor seguridad, considera usar variables de entorno:
```env
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-client-id
NEXT_PUBLIC_GOOGLE_CLIENT_SECRET=your-client-secret
```

## Verificación Final

### Checklist de Configuración
- [ ] Google OAuth Client creado en Google Cloud Console
- [ ] APIs habilitadas (Google+, Identity)
- [ ] URLs de redirección configuradas en Google Cloud Console
- [ ] Google provider habilitado en Supabase
- [ ] Credenciales ingresadas correctamente en Supabase
- [ ] URLs de redirección configuradas en Supabase
- [ ] Prueba exitosa en desarrollo
- [ ] Prueba exitosa en producción

### Comandos de Verificación
```bash
# Probar configuración
node test-google-oauth.js

# Build del proyecto
npm run build

# Verificar que no hay errores
npm run lint
```

## Soporte

Si encuentras problemas:
1. Revisa los logs del navegador (F12 → Console)
2. Ejecuta el script de prueba
3. Verifica la configuración paso a paso
4. Contacta soporte si persisten los problemas 