#!/bin/bash

echo "🧪 PROBANDO CONFIGURACIÓN DE BUILD..."
echo "======================================"

echo "📋 Variables de entorno actuales:"
echo "   NODE_ENV: ${NODE_ENV:-'no definido'}"
echo "   USE_STATIC_EXPORT: ${USE_STATIC_EXPORT:-'no definido'}"

echo ""
echo "🔍 Verificando configuración de Next.js:"
if grep -q "basePath.*financialfeeling" next.config.mjs; then
    echo "   ✅ basePath configurado en next.config.mjs"
    echo "   📝 Configuración:"
    grep -A 5 "basePath" next.config.mjs
else
    echo "   ❌ basePath NO configurado"
fi

echo ""
echo "🧪 Simulando build con diferentes configuraciones:"

# Test 1: Sin variables de entorno
echo "📋 Test 1: Sin variables de entorno"
unset NODE_ENV
unset USE_STATIC_EXPORT
echo "   NODE_ENV: ${NODE_ENV:-'no definido'}"
echo "   USE_STATIC_EXPORT: ${USE_STATIC_EXPORT:-'no definido'}"

# Test 2: Solo NODE_ENV=production
echo ""
echo "📋 Test 2: Solo NODE_ENV=production"
export NODE_ENV=production
unset USE_STATIC_EXPORT
echo "   NODE_ENV: ${NODE_ENV}"
echo "   USE_STATIC_EXPORT: ${USE_STATIC_EXPORT:-'no definido'}"

# Test 3: NODE_ENV=production + USE_STATIC_EXPORT=true
echo ""
echo "📋 Test 3: NODE_ENV=production + USE_STATIC_EXPORT=true"
export NODE_ENV=production
export USE_STATIC_EXPORT=true
echo "   NODE_ENV: ${NODE_ENV}"
echo "   USE_STATIC_EXPORT: ${USE_STATIC_EXPORT}"

echo ""
echo "✅ Configuración de prueba completada"
echo "💡 Para el deployment correcto, usar:"
echo "   export NODE_ENV=production"
echo "   export USE_STATIC_EXPORT=true"
echo "   npm run build" 