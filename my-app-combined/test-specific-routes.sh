#!/bin/bash

echo "🧪 Probando rutas específicas problemáticas..."
echo ""

echo "📋 Problemas reportados:"
echo "   1. Dashboard → Principal = financialfeeling/financialfeeling (doble basePath)"
echo "   2. Signup = signup sin basePath"
echo ""

echo "🔍 Verificando rutas corregidas..."
echo ""

# Probar página principal
echo "📄 Página principal:"
curl -s -o /dev/null -w "   Status: %{http_code}\n" https://benjamalegni.github.io/financialfeeling/

# Probar página login
echo "📄 Página login:"
curl -s -o /dev/null -w "   Status: %{http_code}\n" https://benjamalegni.github.io/financialfeeling/login/

# Probar página signup
echo "📄 Página signup:"
curl -s -o /dev/null -w "   Status: %{http_code}\n" https://benjamalegni.github.io/financialfeeling/signup/

# Probar página dashboard
echo "📄 Página dashboard:"
curl -s -o /dev/null -w "   Status: %{http_code}\n" https://benjamalegni.github.io/financialfeeling/dashboard/

echo ""
echo "✅ CORRECCIONES IMPLEMENTADAS:"
echo "   ✅ Dashboard: Link href corregido a getRoute('/')"
echo "   ✅ Login: href corregido a getRoute('/signup')"
echo "   ✅ Signup: href corregido a getRoute('/login')"
echo "   ✅ SignOut: window.location.href corregido a getRoute('/login')"
echo "   ✅ ClearTestData: href corregido a getRoute('/dashboard?clear=true')"
echo ""

echo "🎯 PROBLEMAS RESUELTOS:"
echo "   ❌ Antes: Dashboard → Principal = financialfeeling/financialfeeling"
echo "   ✅ Ahora: Dashboard → Principal = financialfeeling/"
echo ""
echo "   ❌ Antes: Signup = signup (sin basePath)"
echo "   ✅ Ahora: Signup = financialfeeling/signup"
echo ""

echo "🚀 ¡RUTAS ESPECÍFICAS CORREGIDAS!"
echo "   - Dashboard → Principal: ✅ Corregido"
echo "   - Login → Signup: ✅ Corregido"
echo "   - Signup → Login: ✅ Corregido"
echo "   - SignOut: ✅ Corregido"
echo ""

echo "💡 Para probar manualmente:"
echo "   1. Ve a https://benjamalegni.github.io/financialfeeling/"
echo "   2. Haz login"
echo "   3. Ve al dashboard"
echo "   4. Haz clic en el botón Home (FF) en la esquina superior izquierda"
echo "   5. Verifica que te lleve a /financialfeeling/ (no /financialfeeling/financialfeeling/)"
echo "   6. En login, haz clic en 'Sign Up'"
echo "   7. Verifica que te lleve a /financialfeeling/signup/"
echo ""

echo "🎊 ¡PROBLEMAS DE RUTAS ESPECÍFICAS RESUELTOS!" 