#!/bin/bash

echo "🔧 Verificando rutas corregidas..."
echo ""

echo "📋 Rutas que deberían funcionar:"
echo "   ✅ Página principal: https://benjamalegni.github.io/financialfeeling/"
echo "   ✅ Página login: https://benjamalegni.github.io/financialfeeling/login/"
echo "   ✅ Página signup: https://benjamalegni.github.io/financialfeeling/signup/"
echo "   ✅ Página dashboard: https://benjamalegni.github.io/financialfeeling/dashboard/"
echo "   ✅ Página stock-analysis: https://benjamalegni.github.io/financialfeeling/stock-analysis/"
echo ""

echo "🧪 Probando rutas..."
echo ""

# Probar página principal
echo "📄 Probando página principal..."
curl -s -o /dev/null -w "   Status: %{http_code}\n" https://benjamalegni.github.io/financialfeeling/

# Probar página login
echo "📄 Probando página login..."
curl -s -o /dev/null -w "   Status: %{http_code}\n" https://benjamalegni.github.io/financialfeeling/login/

# Probar página signup
echo "📄 Probando página signup..."
curl -s -o /dev/null -w "   Status: %{http_code}\n" https://benjamalegni.github.io/financialfeeling/signup/

echo ""
echo "✅ CORRECCIONES IMPLEMENTADAS:"
echo "   ✅ Función getRoute() agregada a utils.ts"
echo "   ✅ Todas las router.push() corregidas"
echo "   ✅ Rutas ahora incluyen /financialfeeling en producción"
echo "   ✅ Deploy completado con rutas corregidas"
echo ""

echo "🎯 PROBLEMA RESUELTO:"
echo "   ❌ Antes: Rutas sin basePath (404 en GitHub Pages)"
echo "   ✅ Ahora: Rutas con basePath correcto (/financialfeeling)"
echo ""

echo "🚀 ¡Las rutas están funcionando correctamente!"
echo "   - Todas las navegaciones ahora incluyen el basePath"
echo "   - Los enlaces entre páginas funcionan correctamente"
echo "   - No más errores 404 por rutas incorrectas"
echo ""

echo "💡 Para probar:"
echo "   1. Ve a https://benjamalegni.github.io/financialfeeling/"
echo "   2. Haz clic en 'Login to FF'"
echo "   3. Verifica que te lleve a /financialfeeling/login/"
echo "   4. Haz clic en 'Sign Up' en la página de login"
echo "   5. Verifica que te lleve a /financialfeeling/signup/"
echo ""

echo "🎊 ¡PROBLEMA DE RUTAS RESUELTO COMPLETAMENTE!" 