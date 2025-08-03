#!/bin/bash

echo "🔍 VERIFICANDO ESTADO DEL DEPLOYMENT..."
echo "========================================"

echo "📋 Últimos commits:"
git log --oneline -3

echo ""
echo "🌐 Verificando GitHub Pages:"
curl -I https://benjamalegni.github.io/financialfeeling/ 2>/dev/null | head -1

echo ""
echo "📊 Verificando archivos en la raíz:"
if [ -f "../index.html" ]; then
    echo "   ✅ index.html existe en la raíz"
else
    echo "   ❌ index.html NO existe en la raíz"
fi

if [ -f "../_config.yml" ]; then
    echo "   ✅ _config.yml existe en la raíz"
else
    echo "   ❌ _config.yml NO existe en la raíz"
fi

echo ""
echo "🔍 Verificando archivos estáticos:"
if [ -d "../_next" ]; then
    echo "   ✅ _next/ existe en la raíz"
    ls -la ../_next/static/css/ | head -3
else
    echo "   ❌ _next/ NO existe en la raíz"
fi

echo ""
echo "📝 Estado del repositorio:"
git status --porcelain

echo ""
echo "🚀 Forzando nuevo deployment..."

# Hacer un pequeño cambio para forzar el deployment
echo "# Deployment trigger - $(date)" >> ../README.md

# Agregar y commitear el cambio
cd ..
git add README.md
git commit -m "Trigger deployment - $(date)"
git push

echo ""
echo "✅ Deployment forzado enviado a GitHub"
echo "⏰ Esperando activación del workflow..."
echo "🔍 Puedes verificar el progreso en:"
echo "   https://github.com/benjamalegni/financialfeeling/actions" 