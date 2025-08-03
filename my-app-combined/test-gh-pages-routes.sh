#!/bin/bash

echo "🧪 PROBANDO RUTAS EN GITHUB PAGES..."
echo "======================================"

BASE_URL="https://benjamalegni.github.io/financialfeeling"

echo "📋 Probando rutas principales:"

# Test 1: Página principal
echo "🔍 Página principal:"
curl -s -o /dev/null -w "   Status: %{http_code}\n" "$BASE_URL/"

# Test 2: Login
echo "🔍 Login:"
curl -s -o /dev/null -w "   Status: %{http_code}\n" "$BASE_URL/login"

# Test 3: Signup
echo "🔍 Signup:"
curl -s -o /dev/null -w "   Status: %{http_code}\n" "$BASE_URL/signup"

# Test 4: Dashboard
echo "🔍 Dashboard:"
curl -s -o /dev/null -w "   Status: %{http_code}\n" "$BASE_URL/dashboard"

# Test 5: Stock Analysis
echo "🔍 Stock Analysis:"
curl -s -o /dev/null -w "   Status: %{http_code}\n" "$BASE_URL/stock-analysis"

echo ""
echo "🔍 Verificando contenido HTML de la página principal:"
echo "   Buscando enlaces de navegación..."

# Descargar la página principal y buscar enlaces
curl -s "$BASE_URL/" > /tmp/gh_pages_main.html

echo "   Enlaces encontrados:"
grep -o 'href="[^"]*"' /tmp/gh_pages_main.html | grep -E "(login|signup|dashboard)" | head -10

echo ""
echo "🔍 Verificando si hay duplicación de rutas:"
grep -o 'href="[^"]*"' /tmp/gh_pages_main.html | grep "financialfeeling" | head -5

echo ""
echo "✅ Pruebas completadas"
echo "💡 Si ves rutas duplicadas como '/financialfeeling/financialfeeling/',"
echo "   el problema persiste. Si ves rutas limpias como '/financialfeeling/login',"
echo "   el problema está resuelto."

# Limpiar archivo temporal
rm -f /tmp/gh_pages_main.html 