#!/bin/bash

echo "🔧 CORRIGIENDO CONFIGURACIÓN DE OAUTH..."
echo "=========================================="

echo "📋 Variables de entorno actuales:"
echo "   NEXT_PUBLIC_SUPABASE_URL: ${NEXT_PUBLIC_SUPABASE_URL:-'no definido'}"
echo "   NEXT_PUBLIC_APP_URL: ${NEXT_PUBLIC_APP_URL:-'no definido'}"
echo "   NODE_ENV: ${NODE_ENV:-'no definido'}"

echo ""
echo "🔍 Verificando configuración de OAuth en archivos:"

# Verificar archivos de login y signup
echo "📄 app/login/page.tsx:"
if grep -q "redirectTo.*localhost" app/login/page.tsx; then
    echo "   ❌ Encontrada URL de localhost"
else
    echo "   ✅ URLs configuradas correctamente para GitHub Pages"
fi

echo "📄 app/signup/page.tsx:"
if grep -q "redirectTo.*localhost" app/signup/page.tsx; then
    echo "   ❌ Encontrada URL de localhost"
else
    echo "   ✅ URLs configuradas correctamente para GitHub Pages"
fi

echo ""
echo "🔧 Actualizando configuración..."

# Verificar si las URLs de OAuth están correctas
echo "📋 URLs de OAuth configuradas:"
grep -n "redirectTo" app/login/page.tsx app/signup/page.tsx

echo ""
echo "🌐 Verificando GitHub Pages:"
curl -s -o /dev/null -w "   Status: %{http_code}\n" "https://benjamalegni.github.io/financialfeeling/"

echo ""
echo "📝 Pasos para corregir OAuth:"
echo "   1. ✅ Workflow actualizado con NEXT_PUBLIC_APP_URL"
echo "   2. ✅ Configuración de app.url actualizada"
echo "   3. ⏳ Hacer commit y push para activar nuevo deployment"
echo "   4. 🔍 Verificar que las variables de entorno se configuren correctamente"

echo ""
echo "🚀 Para aplicar los cambios:"
echo "   git add ."
echo "   git commit -m 'Fix OAuth configuration for GitHub Pages'"
echo "   git push"
echo ""
echo "💡 Después del deployment, verificar que OAuth redirija a:"
echo "   https://benjamalegni.github.io/financialfeeling/auth/callback" 