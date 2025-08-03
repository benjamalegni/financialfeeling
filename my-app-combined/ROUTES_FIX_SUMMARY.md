# Solución al Problema de Duplicación de Rutas

## Problema Identificado

El problema era que las rutas se estaban duplicando, causando URLs como `/financialfeeling/financialfeeling/login` en lugar de `/financialfeeling/login`.

## Causa Raíz

Había **dos lugares** agregando el prefijo `/financialfeeling`:

1. **Next.js config** (`next.config.mjs`): Configurado con `basePath: '/financialfeeling'` para static export
2. **Función `getRoute`** (`lib/utils.ts`): También agregaba `/financialfeeling/` al path

## Solución Implementada

### 1. Actualización de la función `getRoute`

**Archivo:** `lib/utils.ts`

```typescript
export function getRoute(path: string): string {
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // Check if we're in static export mode (GitHub Pages)
  const isStaticExport = process.env.USE_STATIC_EXPORT === 'true';
  const isProduction = process.env.NODE_ENV === 'production';
  
  // If we're in production and using static export, Next.js will handle the basePath
  // So we just return the clean path without the prefix
  if (isProduction && isStaticExport) {
    return `/${cleanPath}`;
  }
  
  // For development or production without static export, add the prefix manually
  return `/financialfeeling/${cleanPath}`;
}
```

### 2. Actualización del Workflow de GitHub Actions

**Archivo:** `.github/workflows/deploy-pages.yml`

Agregada la variable de entorno:
```yaml
- name: Build
  env:
    NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
    NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}
    NEXT_PUBLIC_N8N_WEBHOOK_URL: ${{ secrets.NEXT_PUBLIC_N8N_WEBHOOK_URL }}
    USE_STATIC_EXPORT: 'true'  # ← Agregada esta línea
  run: npm run build
```

## Comportamiento por Escenario

### Desarrollo
- `NODE_ENV=development`
- `USE_STATIC_EXPORT=undefined`
- **Resultado:** `getRoute('/login')` → `/financialfeeling/login`

### Producción con Static Export (GitHub Pages)
- `NODE_ENV=production`
- `USE_STATIC_EXPORT=true`
- **Resultado:** `getRoute('/login')` → `/login` (Next.js agrega `/financialfeeling` automáticamente)

### Producción sin Static Export
- `NODE_ENV=production`
- `USE_STATIC_EXPORT=undefined`
- **Resultado:** `getRoute('/login')` → `/financialfeeling/login`

## Archivos Modificados

1. ✅ `lib/utils.ts` - Función `getRoute` actualizada
2. ✅ `.github/workflows/deploy-pages.yml` - Variable `USE_STATIC_EXPORT=true` agregada
3. ✅ `test-routes-fix.sh` - Script de prueba creado

## Verificación

Ejecutar el script de prueba:
```bash
./test-routes-fix.sh
```

## Próximos Pasos

1. Hacer commit de los cambios
2. Push a GitHub para activar el nuevo deployment
3. Verificar que las rutas funcionen correctamente en GitHub Pages

## Notas Importantes

- La función `getRoute` ahora detecta automáticamente el modo de deployment
- Next.js maneja el `basePath` automáticamente cuando `USE_STATIC_EXPORT=true`
- El workflow de GitHub Actions ahora configura correctamente las variables de entorno 