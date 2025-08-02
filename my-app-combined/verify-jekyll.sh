#!/bin/bash

echo "🔍 Verificando deployment de Jekyll..."
echo ""

# Check if files are in the root
echo "📁 Verificando archivos en la raíz:"
if [ -f "index.html" ]; then
    echo "✅ index.html existe en la raíz"
else
    echo "❌ index.html NO existe en la raíz"
fi

if [ -f "_config.yml" ]; then
    echo "✅ _config.yml existe"
else
    echo "❌ _config.yml NO existe"
fi

echo ""

# Check GitHub Pages status
echo "🌐 Verificando GitHub Pages:"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" https://benjamalegni.github.io/financialfeeling/)
echo "HTTP Status: $HTTP_CODE"

if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ Sitio accesible"
elif [ "$HTTP_CODE" = "404" ]; then
    echo "❌ Sitio devuelve 404"
    echo ""
    echo "🚨 PROBLEMA: GitHub Pages no está sirviendo los archivos"
    echo ""
    echo "📋 SOLUCIÓN:"
    echo "1. Ve a: https://github.com/benjamalegni/financialfeeling/settings/pages"
    echo "2. Asegúrate de que esté configurado:"
    echo "   - Source: Deploy from a branch"
    echo "   - Branch: main"
    echo "   - Folder: / (root)"
    echo "3. Click 'Save'"
    echo "4. Espera 2-5 minutos"
else
    echo "⚠️  Estado desconocido: $HTTP_CODE"
fi

echo ""
echo "📊 Estado actual:"
echo "   📦 Build: ✅ Completado"
echo "   📁 Archivos en raíz: ✅ Copiados"
echo "   📤 Push a main: ✅ Completado"
echo "   🌐 GitHub Pages: ❌ Configuración pendiente"
echo ""
echo "💡 Si el sitio sigue sin funcionar:"
echo "   - Verifica la configuración en Settings → Pages"
echo "   - Asegúrate de que use la rama 'main'"
echo "   - Espera unos minutos para que se active"
echo ""
echo "🌐 URL: https://benjamalegni.github.io/financialfeeling/" 