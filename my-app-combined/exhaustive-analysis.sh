#!/bin/bash

echo "🔍 ANÁLISIS EXHAUSTIVO DE PROBLEMAS"
echo "====================================="
echo ""

echo "📋 PROBLEMAS REPORTADOS:"
echo "   1. Rutas con doble 'financialfeeling'"
echo "   2. No se puede acceder a nada"
echo "   3. Error: Failed to fetch sentiment analysis"
echo ""

echo "🧪 DIAGNÓSTICO DE RUTAS..."
echo ""

# Probar todas las rutas principales
echo "📄 Probando rutas principales:"
echo "   - Principal: $(curl -s -o /dev/null -w "%{http_code}" https://benjamalegni.github.io/financialfeeling/)"
echo "   - Login: $(curl -s -o /dev/null -w "%{http_code}" https://benjamalegni.github.io/financialfeeling/login/)"
echo "   - Signup: $(curl -s -o /dev/null -w "%{http_code}" https://benjamalegni.github.io/financialfeeling/signup/)"
echo "   - Dashboard: $(curl -s -o /dev/null -w "%{http_code}" https://benjamalegni.github.io/financialfeeling/dashboard/)"
echo ""

# Probar rutas problemáticas
echo "📄 Probando rutas problemáticas:"
echo "   - Doble financialfeeling: $(curl -s -o /dev/null -w "%{http_code}" https://benjamalegni.github.io/financialfeeling/financialfeeling/)"
echo "   - Signup sin basePath: $(curl -s -o /dev/null -w "%{http_code}" https://benjamalegni.github.io/signup/)"
echo ""

# Verificar contenido de las páginas
echo "📄 Verificando contenido de páginas:"
echo "   - Principal tiene 'Financial Feeling': $(curl -s https://benjamalegni.github.io/financialfeeling/ | grep -c 'Financial Feeling')"
echo "   - Login tiene 'Access FF': $(curl -s https://benjamalegni.github.io/financialfeeling/login/ | grep -c 'Access FF')"
echo "   - Signup tiene 'Create Account': $(curl -s https://benjamalegni.github.io/financialfeeling/signup/ | grep -c 'Create Account')"
echo ""

echo "🔧 DIAGNÓSTICO DE N8N..."
echo ""

# Probar webhook de n8n
echo "📄 Probando webhook de n8n:"
n8n_response=$(curl -s -X POST https://ffaiagent-n8n-production.up.railway.app/webhook-test/analyze-stocks \
  -H "Content-Type: application/json" \
  -d '{"stocks": ["AAPL", "TSLA"]}' \
  -w "\nStatus: %{http_code}\nTime: %{time_total}s\n")

echo "   Respuesta n8n: $n8n_response"
echo ""

echo "📋 ANÁLISIS DE CÓDIGO..."
echo ""

# Verificar función getRoute
echo "📄 Verificando función getRoute:"
if grep -q "getRoute" lib/utils.ts; then
    echo "   ✅ Función getRoute encontrada"
    echo "   📝 Implementación:"
    grep -A 5 "export function getRoute" lib/utils.ts
else
    echo "   ❌ Función getRoute NO encontrada"
fi
echo ""

# Verificar uso de getRoute en archivos
echo "📄 Verificando uso de getRoute:"
echo "   - En app/page.tsx: $(grep -c "getRoute" app/page.tsx) usos"
echo "   - En app/login/page.tsx: $(grep -c "getRoute" app/login/page.tsx) usos"
echo "   - En app/signup/page.tsx: $(grep -c "getRoute" app/signup/page.tsx) usos"
echo "   - En components/dashboard-content.tsx: $(grep -c "getRoute" components/dashboard-content.tsx) usos"
echo ""

# Verificar rutas hardcodeadas
echo "📄 Verificando rutas hardcodeadas (problemáticas):"
echo "   - router.push('/'): $(grep -c "router\.push('/')" app/ --include="*.tsx" -r)"
echo "   - href='/': $(grep -c "href='/'" app/ --include="*.tsx" -r)"
echo "   - href='/login': $(grep -c "href='/login'" app/ --include="*.tsx" -r)"
echo "   - href='/signup': $(grep -c "href='/signup'" app/ --include="*.tsx" -r)"
echo ""

echo "🎯 PROBLEMAS IDENTIFICADOS:"
echo ""

# Identificar problemas específicos
echo "1. 🔍 PROBLEMA DE RUTAS:"
if grep -q "router\.push('/')" app/ --include="*.tsx" -r; then
    echo "   ❌ Hay router.push('/') sin getRoute"
    grep -n "router\.push('/')" app/ --include="*.tsx" -r
else
    echo "   ✅ No hay router.push('/') problemático"
fi
echo ""

echo "2. 🔍 PROBLEMA DE ENLACES:"
if grep -q "href='/'" app/ --include="*.tsx" -r; then
    echo "   ❌ Hay href='/' sin getRoute"
    grep -n "href='/'" app/ --include="*.tsx" -r
else
    echo "   ✅ No hay href='/' problemático"
fi
echo ""

echo "3. 🔍 PROBLEMA DE N8N:"
echo "   📄 Verificando variables de entorno..."
if [ -f ".env.local" ]; then
    echo "   ✅ .env.local existe"
    if grep -q "NEXT_PUBLIC_N8N_WEBHOOK_URL" .env.local; then
        echo "   ✅ NEXT_PUBLIC_N8N_WEBHOOK_URL configurada"
    else
        echo "   ❌ NEXT_PUBLIC_N8N_WEBHOOK_URL NO configurada"
    fi
else
    echo "   ❌ .env.local NO existe"
fi
echo ""

echo "💡 SOLUCIONES RECOMENDADAS:"
echo ""

echo "1. 🔧 CORREGIR RUTAS:"
echo "   - Asegurar que TODAS las rutas usen getRoute()"
echo "   - Verificar que no haya rutas hardcodeadas"
echo "   - Probar navegación completa"
echo ""

echo "2. 🔧 CORREGIR N8N:"
echo "   - Verificar configuración de CORS en n8n"
echo "   - Asegurar que el webhook esté activo"
echo "   - Verificar variables de entorno"
echo ""

echo "3. 🔧 VERIFICAR DESPLIEGUE:"
echo "   - Limpiar caché del navegador"
echo "   - Verificar que los archivos JS se carguen correctamente"
echo "   - Probar en modo incógnito"
echo ""

echo "🚀 PRÓXIMOS PASOS:"
echo "   1. Ejecutar: ./fix-all-routes.sh"
echo "   2. Ejecutar: ./test-n8n-backend.sh"
echo "   3. Ejecutar: ./deploy-jekyll-fixed.sh"
echo "   4. Probar manualmente en el navegador"
echo ""

echo "🎊 ANÁLISIS EXHAUSTIVO COMPLETADO!" 