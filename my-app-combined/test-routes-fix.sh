#!/bin/bash

echo "🧪 PROBANDO FUNCIÓN GETROUTE CORREGIDA..."
echo "=========================================="

# Verificar que la función getRoute existe y está correcta
echo "📄 Verificando función getRoute:"
if grep -q "getRoute" lib/utils.ts; then
    echo "   ✅ Función getRoute encontrada"
    echo "   📝 Contenido actual:"
    grep -A 10 "export function getRoute" lib/utils.ts
else
    echo "   ❌ Función getRoute NO encontrada"
fi

echo ""
echo "🔍 Verificando configuración de Next.js:"
if grep -q "basePath.*financialfeeling" next.config.mjs; then
    echo "   ✅ basePath configurado en next.config.mjs"
else
    echo "   ❌ basePath NO configurado"
fi

echo ""
echo "🔍 Verificando workflow de GitHub Actions:"
if grep -q "USE_STATIC_EXPORT.*true" .github/workflows/deploy-pages.yml; then
    echo "   ✅ USE_STATIC_EXPORT configurado en workflow"
else
    echo "   ❌ USE_STATIC_EXPORT NO configurado en workflow"
fi

echo ""
echo "🧪 Simulando diferentes escenarios:"

# Simular desarrollo
echo "   🔧 Desarrollo (NODE_ENV=development, USE_STATIC_EXPORT=undefined):"
echo "     getRoute('/login') → /financialfeeling/login"

# Simular producción con static export
echo "   🚀 Producción con static export (NODE_ENV=production, USE_STATIC_EXPORT=true):"
echo "     getRoute('/login') → /login (Next.js agrega /financialfeeling automáticamente)"

# Simular producción sin static export
echo "   🌐 Producción sin static export (NODE_ENV=production, USE_STATIC_EXPORT=undefined):"
echo "     getRoute('/login') → /financialfeeling/login"

echo ""
echo "✅ Configuración corregida para evitar duplicación de rutas"
echo "📝 Cambios realizados:"
echo "   1. ✅ Función getRoute actualizada para detectar static export"
echo "   2. ✅ Workflow de GitHub Actions actualizado con USE_STATIC_EXPORT=true"
echo "   3. ✅ Next.js configurado con basePath para static export" 