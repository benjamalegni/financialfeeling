#!/bin/bash

echo "🔍 MONITOREANDO DEPLOYMENT EN GITHUB ACTIONS..."
echo "================================================"

echo "📋 Información del repositorio:"
echo "   Repo: benjamalegni/financialfeeling"
echo "   Branch: main"
echo "   Último commit: $(git log --oneline -1)"

echo ""
echo "🌐 Estado actual de GitHub Pages:"
curl -s -o /dev/null -w "   Status: %{http_code}\n" "https://benjamalegni.github.io/financialfeeling/"

echo ""
echo "📊 Verificando rutas principales:"
routes=("login" "signup" "dashboard" "stock-analysis")

for route in "${routes[@]}"; do
    echo "   /$route/: $(curl -s -o /dev/null -w "%{http_code}" "https://benjamalegni.github.io/financialfeeling/$route/")"
done

echo ""
echo "🔍 Verificando archivos en la raíz:"
files=("index.html" "_config.yml" ".nojekyll")

for file in "${files[@]}"; do
    if [ -f "../$file" ]; then
        echo "   ✅ $file existe"
    else
        echo "   ❌ $file NO existe"
    fi
done

echo ""
echo "📁 Verificando archivos estáticos:"
if [ -d "../_next" ]; then
    echo "   ✅ _next/ existe"
    if [ -d "../_next/static" ]; then
        echo "   ✅ _next/static/ existe"
        echo "   📊 Archivos CSS: $(ls ../_next/static/css/ | wc -l)"
        echo "   📊 Archivos JS: $(ls ../_next/static/chunks/ | wc -l)"
    else
        echo "   ❌ _next/static/ NO existe"
    fi
else
    echo "   ❌ _next/ NO existe"
fi

echo ""
echo "⏰ Estado del deployment:"
echo "   🔍 Puedes verificar el progreso manualmente en:"
echo "   🌐 https://github.com/benjamalegni/financialfeeling/actions"
echo ""
echo "   📋 Workflows disponibles:"
echo "   - deploy-pages.yml (GitHub Pages)"
echo "   - pages.yml (GitHub Pages)"

echo ""
echo "💡 Si el deployment no se inicia automáticamente:"
echo "   1. Ve a https://github.com/benjamalegni/financialfeeling/actions"
echo "   2. Selecciona 'deploy-pages' o 'pages'"
echo "   3. Haz clic en 'Run workflow'"
echo "   4. Selecciona la rama 'main'"
echo "   5. Haz clic en 'Run workflow'"

echo ""
echo "✅ Monitoreo completado" 