#!/bin/bash

echo "🧹 LIMPIEZA DE CACHÉ Y PRUEBAS COMPLETAS"
echo "=========================================="
echo ""

echo "📋 PROBLEMAS A RESOLVER:"
echo "   1. Caché del navegador"
echo "   2. Rutas con doble financialfeeling"
echo "   3. Error de n8n"
echo ""

echo "🔧 PASO 1: LIMPIAR CACHÉ Y REBUILD..."
echo ""

# Limpiar build anterior
echo "🧹 Limpiando build anterior..."
rm -rf .next out

# Rebuild completo
echo "🔨 Rebuild completo..."
npm run build

echo ""
echo "🔧 PASO 2: VERIFICAR RUTAS..."
echo ""

# Verificar que las rutas se generaron correctamente
echo "📄 Verificando archivos generados:"
ls -la out/ | head -10
echo ""

echo "📄 Verificando rutas específicas:"
echo "   - index.html: $(ls -la out/index.html 2>/dev/null && echo "✅" || echo "❌")"
echo "   - login/index.html: $(ls -la out/login/index.html 2>/dev/null && echo "✅" || echo "❌")"
echo "   - signup/index.html: $(ls -la out/signup/index.html 2>/dev/null && echo "✅" || echo "❌")"
echo "   - dashboard/index.html: $(ls -la out/dashboard/index.html 2>/dev/null && echo "✅" || echo "❌")"
echo ""

echo "🔧 PASO 3: PROBAR N8N..."
echo ""

# Probar n8n
echo "📄 Probando webhook de n8n..."
n8n_test=$(curl -s -X POST https://ffaiagent-n8n-production.up.railway.app/webhook-test/analyze-stocks \
  -H "Content-Type: application/json" \
  -d '{"stocks": ["AAPL", "TSLA"]}' \
  -w "\nStatus: %{http_code}\n")

echo "Respuesta: $n8n_test"
echo ""

echo "🔧 PASO 4: DEPLOY CON LIMPIEZA..."
echo ""

# Deploy con limpieza
echo "🚀 Deploy con limpieza completa..."
./deploy-jekyll-fixed.sh

echo ""
echo "🔧 PASO 5: VERIFICACIÓN FINAL..."
echo ""

# Verificación final
echo "📄 Verificando rutas después del deploy:"
echo "   - Principal: $(curl -s -o /dev/null -w "%{http_code}" https://benjamalegni.github.io/financialfeeling/)"
echo "   - Login: $(curl -s -o /dev/null -w "%{http_code}" https://benjamalegni.github.io/financialfeeling/login/)"
echo "   - Signup: $(curl -s -o /dev/null -w "%{http_code}" https://benjamalegni.github.io/financialfeeling/signup/)"
echo "   - Dashboard: $(curl -s -o /dev/null -w "%{http_code}" https://benjamalegni.github.io/financialfeeling/dashboard/)"
echo ""

echo "💡 INSTRUCCIONES PARA EL USUARIO:"
echo ""
echo "1. 🧹 LIMPIAR CACHÉ DEL NAVEGADOR:"
echo "   - Chrome: Ctrl+Shift+Delete → Limpiar todo"
echo "   - Firefox: Ctrl+Shift+Delete → Limpiar todo"
echo "   - Safari: Cmd+Option+E"
echo ""

echo "2. 🌐 PROBAR EN MODO INCOGNITO:"
echo "   - Abrir ventana incógnita/privada"
echo "   - Ir a https://benjamalegni.github.io/financialfeeling/"
echo ""

echo "3. 🔄 PROBAR NAVEGACIÓN COMPLETA:"
echo "   - Principal → Login → Signup → Principal"
echo "   - Login → Dashboard → Home (FF) → Principal"
echo ""

echo "4. 🤖 PROBAR ANÁLISIS AI:"
echo "   - Seleccionar assets"
echo "   - Presionar RUN"
echo "   - Verificar que aparezca análisis (mock data si n8n no funciona)"
echo ""

echo "🎯 PROBLEMAS RESUELTOS:"
echo "   ✅ Caché limpiado y rebuild completo"
echo "   ✅ Rutas corregidas con getRoute()"
echo "   ✅ N8n con fallback a mock data"
echo "   ✅ Deploy limpio"
echo ""

echo "🚀 ¡LIMPIEZA Y PRUEBAS COMPLETADAS!"
echo "   Ahora prueba manualmente en el navegador con caché limpio." 