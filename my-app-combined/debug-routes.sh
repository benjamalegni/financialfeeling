#!/bin/bash

echo "🔍 DIAGNÓSTICO ESPECÍFICO DE RUTAS"
echo "===================================="
echo ""

echo "📋 PROBLEMAS REPORTADOS:"
echo "   - Rutas con doble 'financialfeeling'"
echo "   - No se puede acceder a nada"
echo "   - Página se queda en 'Loading...'"
echo ""

echo "🧪 PASO 1: VERIFICAR FUNCIÓN GETROUTE..."
echo ""

# Verificar la función getRoute
echo "📄 Función getRoute actual:"
grep -A 10 "export function getRoute" lib/utils.ts
echo ""

echo "🧪 PASO 2: VERIFICAR USO DE GETROUTE..."
echo ""

# Verificar uso de getRoute en archivos clave
echo "📄 Uso de getRoute en archivos:"
echo "   - app/page.tsx: $(grep -c 'getRoute' app/page.tsx) usos"
echo "   - app/login/page.tsx: $(grep -c 'getRoute' app/login/page.tsx) usos"
echo "   - app/signup/page.tsx: $(grep -c 'getRoute' app/signup/page.tsx) usos"
echo "   - components/dashboard-content.tsx: $(grep -c 'getRoute' components/dashboard-content.tsx) usos"
echo ""

echo "🧪 PASO 3: VERIFICAR RUTAS HARDCODEADAS..."
echo ""

# Buscar rutas hardcodeadas problemáticas
echo "📄 Rutas hardcodeadas encontradas:"
grep -r "router\.push('/')" app/ --include="*.tsx" || echo "   ✅ No hay router.push('/') problemático"
grep -r "href='/'" app/ --include="*.tsx" || echo "   ✅ No hay href='/' problemático"
grep -r "href='/login'" app/ --include="*.tsx" || echo "   ✅ No hay href='/login' problemático"
grep -r "href='/signup'" app/ --include="*.tsx" || echo "   ✅ No hay href='/signup' problemático"
echo ""

echo "🧪 PASO 4: VERIFICAR CONFIGURACIÓN NEXT..."
echo ""

# Verificar next.config.mjs
echo "📄 Configuración de Next.js:"
cat next.config.mjs
echo ""

echo "🧪 PASO 5: VERIFICAR ARCHIVOS GENERADOS..."
echo ""

# Verificar archivos generados
echo "📄 Archivos en out/:"
ls -la out/ | head -10
echo ""

echo "📄 Contenido de index.html:"
head -5 out/index.html
echo ""

echo "🧪 PASO 6: PROBAR RUTAS ESPECÍFICAS..."
echo ""

# Probar rutas específicas
echo "📄 Probando rutas:"
echo "   - Principal: $(curl -s -o /dev/null -w "%{http_code}" https://benjamalegni.github.io/financialfeeling/)"
echo "   - Login: $(curl -s -o /dev/null -w "%{http_code}" https://benjamalegni.github.io/financialfeeling/login/)"
echo "   - Signup: $(curl -s -o /dev/null -w "%{http_code}" https://benjamalegni.github.io/financialfeeling/signup/)"
echo "   - Dashboard: $(curl -s -o /dev/null -w "%{http_code}" https://benjamalegni.github.io/financialfeeling/dashboard/)"
echo ""

echo "🧪 PASO 7: VERIFICAR PROBLEMA DE LOADING..."
echo ""

# Verificar si hay algún problema con el loading
echo "📄 Verificando contenido de la página principal:"
curl -s https://benjamalegni.github.io/financialfeeling/ | grep -i "loading\|error" | head -5
echo ""

echo "🎯 DIAGNÓSTICO COMPLETADO"
echo ""
echo "💡 POSIBLES CAUSAS:"
echo "   1. Problema con la función getRoute en el navegador"
echo "   2. Error en la carga de JavaScript"
echo "   3. Problema con Supabase en el cliente"
echo "   4. Caché del navegador"
echo ""
echo "🔧 SOLUCIONES RECOMENDADAS:"
echo "   1. Limpiar caché del navegador completamente"
echo "   2. Probar en modo incógnito"
echo "   3. Verificar consola del navegador para errores"
echo "   4. Revisar si hay errores de JavaScript"
echo ""
echo "🚀 PRÓXIMO PASO:"
echo "   Ejecutar: ./fix-loading-issue.sh" 