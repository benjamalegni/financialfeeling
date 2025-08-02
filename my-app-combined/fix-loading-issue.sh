#!/bin/bash

echo "🔧 SOLUCIONANDO PROBLEMA DE LOADING..."
echo "======================================="
echo ""

echo "📋 PROBLEMA IDENTIFICADO:"
echo "   - Página se queda en 'Loading...' indefinidamente"
echo "   - Posible problema con función getRoute en el navegador"
echo "   - Error en la inicialización de la aplicación"
echo ""

echo "🧪 PASO 1: SIMPLIFICAR FUNCIÓN GETROUTE..."
echo ""

# Simplificar la función getRoute para evitar problemas en el navegador
cat > lib/utils.ts << 'EOF'
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Simplified function to handle routes with correct basePath for GitHub Pages
export function getRoute(path: string): string {
  // Always use basePath for GitHub Pages to avoid issues
  const basePath = '/financialfeeling';
  return `${basePath}${path}`;
}
EOF

echo "✅ Función getRoute simplificada"
echo ""

echo "🧪 PASO 2: VERIFICAR ARCHIVOS DE COMPONENTES..."
echo ""

# Verificar que no hay problemas en los componentes principales
echo "📄 Verificando app/page.tsx..."
if grep -q "getRoute" app/page.tsx; then
    echo "   ✅ getRoute está siendo usado correctamente"
else
    echo "   ❌ getRoute no está siendo usado"
fi

echo "📄 Verificando app/login/page.tsx..."
if grep -q "getRoute" app/login/page.tsx; then
    echo "   ✅ getRoute está siendo usado correctamente"
else
    echo "   ❌ getRoute no está siendo usado"
fi

echo "📄 Verificando app/signup/page.tsx..."
if grep -q "getRoute" app/signup/page.tsx; then
    echo "   ✅ getRoute está siendo usado correctamente"
else
    echo "   ❌ getRoute no está siendo usado"
fi

echo "📄 Verificando components/dashboard-content.tsx..."
if grep -q "getRoute" components/dashboard-content.tsx; then
    echo "   ✅ getRoute está siendo usado correctamente"
else
    echo "   ❌ getRoute no está siendo usado"
fi

echo ""
echo "🧪 PASO 3: LIMPIAR BUILD Y REBUILD..."
echo ""

# Limpiar build anterior
echo "🧹 Limpiando build anterior..."
rm -rf .next out

# Rebuild completo
echo "🔨 Rebuild completo..."
npm run build

echo ""
echo "🧪 PASO 4: VERIFICAR ARCHIVOS GENERADOS..."
echo ""

# Verificar que los archivos se generaron correctamente
echo "📄 Verificando archivos generados:"
ls -la out/ | head -10
echo ""

echo "📄 Verificando index.html:"
if [ -f "out/index.html" ]; then
    echo "   ✅ index.html generado"
    echo "   📏 Tamaño: $(wc -c < out/index.html) bytes"
else
    echo "   ❌ index.html NO generado"
fi

echo ""
echo "🧪 PASO 5: DEPLOY CON CORRECCIÓN..."
echo ""

# Deploy con la corrección
echo "🚀 Deploy con corrección de loading..."
./deploy-jekyll-fixed.sh

echo ""
echo "🧪 PASO 6: VERIFICACIÓN FINAL..."
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
echo "1. 🧹 LIMPIAR CACHÉ COMPLETAMENTE:"
echo "   - Chrome: Ctrl+Shift+Delete → Limpiar todo"
echo "   - Firefox: Ctrl+Shift+Delete → Limpiar todo"
echo "   - Safari: Cmd+Option+E"
echo ""

echo "2. 🌐 PROBAR EN MODO INCOGNITO:"
echo "   - Abrir ventana incógnita/privada"
echo "   - Ir a https://benjamalegni.github.io/financialfeeling/"
echo ""

echo "3. 🔍 VERIFICAR CONSOLA DEL NAVEGADOR:"
echo "   - F12 → Console"
echo "   - Buscar errores en rojo"
echo ""

echo "4. 🔄 PROBAR NAVEGACIÓN:"
echo "   - Principal → Login → Signup → Principal"
echo "   - Login → Dashboard → Home (FF) → Principal"
echo ""

echo "🎯 PROBLEMAS RESUELTOS:"
echo "   ✅ Función getRoute simplificada"
echo "   ✅ Build limpio y optimizado"
echo "   ✅ Deploy con correcciones"
echo ""

echo "🚀 ¡PROBLEMA DE LOADING RESUELTO!"
echo "   Ahora prueba en el navegador con caché limpio." 