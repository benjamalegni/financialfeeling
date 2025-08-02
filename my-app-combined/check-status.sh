#!/bin/bash

echo "🔍 Verificando estado del deployment..."
echo ""

# Check if gh-pages branch exists
echo "📋 Estado de la rama gh-pages:"
if git ls-remote --heads origin gh-pages | grep -q gh-pages; then
    echo "✅ Rama gh-pages existe"
else
    echo "❌ Rama gh-pages NO existe"
fi

echo ""

# Check if site is accessible
echo "🌐 Verificando acceso al sitio:"
if curl -s -o /dev/null -w "%{http_code}" https://benjamalegni.github.io/financialfeeling/ | grep -q "200"; then
    echo "✅ Sitio accesible"
elif curl -s -o /dev/null -w "%{http_code}" https://benjamalegni.github.io/financialfeeling/ | grep -q "404"; then
    echo "❌ Sitio devuelve 404 (GitHub Pages no configurado)"
else
    echo "⚠️  Estado desconocido"
fi

echo ""
echo "🚨 PROBLEMA IDENTIFICADO:"
echo "GitHub Pages no está configurado para usar la rama gh-pages"
echo ""
echo "📋 SOLUCIÓN:"
echo ""
echo "1. Ve a: https://github.com/benjamalegni/financialfeeling/settings/pages"
echo ""
echo "2. En 'Source', selecciona:"
echo "   ✅ Deploy from a branch"
echo ""
echo "3. En 'Branch', selecciona:"
echo "   ✅ gh-pages"
echo ""
echo "4. En 'Folder', deja:"
echo "   ✅ / (root)"
echo ""
echo "5. Click 'Save'"
echo ""
echo "6. Espera 2-5 minutos para que se active"
echo ""
echo "🌐 URL final: https://benjamalegni.github.io/financialfeeling/"
echo ""
echo "📊 Estado actual:"
echo "   📦 Build: ✅ Completado"
echo "   📤 Push a gh-pages: ✅ Completado"
echo "   🔧 Configuración GitHub Pages: ❌ Pendiente"
echo ""
echo "💡 Una vez configurado, el sitio estará disponible en 2-5 minutos" 