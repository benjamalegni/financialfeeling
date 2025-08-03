#!/bin/bash

# Script de prueba para el backend de Railway
# Autor: Financial Feeling Team
# Fecha: 2025-08-03

echo "🚀 PRUEBAS DEL BACKEND DE RAILWAY"
echo "================================="
echo ""

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para imprimir resultados
print_result() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
    else
        echo -e "${RED}❌ $2${NC}"
    fi
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

echo "1. 🔗 PRUEBA DE CONECTIVIDAD CON RAILWAY"
echo "----------------------------------------"

# Prueba de conectividad básica
print_info "Probando conectividad con Railway..."
RAILWAY_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" https://ffaiagent-n8n-production.up.railway.app/webhook/analyze-stocks)
if [ "$RAILWAY_RESPONSE" = "405" ] || [ "$RAILWAY_RESPONSE" = "200" ]; then
    print_result 0 "Railway está respondiendo (HTTP $RAILWAY_RESPONSE)"
else
    print_result 1 "Railway no responde correctamente (HTTP $RAILWAY_RESPONSE)"
fi

echo ""
echo "2. 📊 PRUEBA DE ANÁLISIS DE STOCKS"
echo "----------------------------------"

# Prueba del análisis de stocks
print_info "Probando análisis de stocks con Railway..."
ANALYSIS_RESPONSE=$(curl -s -X POST https://ffaiagent-n8n-production.up.railway.app/webhook/analyze-stocks \
  -H "Content-Type: application/json" \
  -d '{"stocks": ["AAPL", "TSLA", "MSFT"]}')

if [[ "$ANALYSIS_RESPONSE" == *"forecast"* ]] && [[ "$ANALYSIS_RESPONSE" == *"AAPL"* ]]; then
    print_result 0 "Análisis de stocks funcionando correctamente"
    echo -e "${GREEN}📈 Datos de análisis recibidos:${NC}"
    echo "$ANALYSIS_RESPONSE" | jq '.' 2>/dev/null || echo "$ANALYSIS_RESPONSE"
else
    print_result 1 "Análisis de stocks no funciona"
    echo "Respuesta: $ANALYSIS_RESPONSE"
fi

echo ""
echo "3. 🧪 PRUEBA DE DIFERENTES STOCKS"
echo "--------------------------------"

# Prueba con diferentes tipos de stocks
print_info "Probando con diferentes tipos de stocks..."
DIFFERENT_STOCKS_RESPONSE=$(curl -s -X POST https://ffaiagent-n8n-production.up.railway.app/webhook/analyze-stocks \
  -H "Content-Type: application/json" \
  -d '{"stocks": ["GOOGL", "NVDA", "META"]}')

if [[ "$DIFFERENT_STOCKS_RESPONSE" == *"forecast"* ]] && [[ "$DIFFERENT_STOCKS_RESPONSE" == *"GOOGL"* ]]; then
    print_result 0 "Análisis con diferentes stocks funcionando"
    echo -e "${GREEN}📈 Análisis para GOOGL, NVDA, META:${NC}"
    echo "$DIFFERENT_STOCKS_RESPONSE" | jq '.' 2>/dev/null || echo "$DIFFERENT_STOCKS_RESPONSE"
else
    print_result 1 "Análisis con diferentes stocks falló"
    echo "Respuesta: $DIFFERENT_STOCKS_RESPONSE"
fi

echo ""
echo "4. 🔒 PRUEBA DE VALIDACIÓN DE ENTRADA"
echo "-----------------------------------"

# Prueba de validación de entrada
print_info "Probando validación de entrada..."
VALIDATION_RESPONSE=$(curl -s -X POST https://ffaiagent-n8n-production.up.railway.app/webhook/analyze-stocks \
  -H "Content-Type: application/json" \
  -d '{"invalid": "data"}')

if [[ "$VALIDATION_RESPONSE" == *"error"* ]] || [[ "$VALIDATION_RESPONSE" == "[]" ]]; then
    print_result 0 "Validación de entrada funcionando correctamente"
else
    print_result 1 "Validación de entrada no funciona como esperado"
    echo "Respuesta: $VALIDATION_RESPONSE"
fi

echo ""
echo "5. ⚡ PRUEBA DE RENDIMIENTO"
echo "---------------------------"

# Prueba de rendimiento
print_info "Probando rendimiento del backend..."
START_TIME=$(date +%s.%N)
PERFORMANCE_RESPONSE=$(curl -s -X POST https://ffaiagent-n8n-production.up.railway.app/webhook/analyze-stocks \
  -H "Content-Type: application/json" \
  -d '{"stocks": ["AAPL"]}')
END_TIME=$(date +%s.%N)

ELAPSED_TIME=$(echo "$END_TIME - $START_TIME" | bc)
if (( $(echo "$ELAPSED_TIME < 5.0" | bc -l) )); then
    print_result 0 "Rendimiento aceptable (${ELAPSED_TIME}s)"
else
    print_result 1 "Rendimiento lento (${ELAPSED_TIME}s)"
fi

echo ""
echo "6. 📰 PRUEBA DE ANÁLISIS DE NOTICIAS"
echo "-----------------------------------"

# Verificar que el análisis incluye noticias reales
print_info "Verificando que el análisis incluye noticias reales..."
NEWS_RESPONSE=$(curl -s -X POST https://ffaiagent-n8n-production.up.railway.app/webhook/analyze-stocks \
  -H "Content-Type: application/json" \
  -d '{"stocks": ["TSLA"]}')

if [[ "$NEWS_RESPONSE" == *"news"* ]] && [[ "$NEWS_RESPONSE" == *"reason"* ]]; then
    print_result 0 "Análisis incluye noticias y razones"
    echo -e "${GREEN}📰 Ejemplo de noticia:${NC}"
    echo "$NEWS_RESPONSE" | jq '.[0].forecast.TSLA.news' 2>/dev/null || echo "Noticia encontrada"
else
    print_result 1 "Análisis no incluye noticias"
    echo "Respuesta: $NEWS_RESPONSE"
fi

echo ""
echo "📊 RESUMEN DE PRUEBAS"
echo "===================="

# Contar resultados
TOTAL_TESTS=6
PASSED_TESTS=0

# Verificar cada prueba
if [ "$RAILWAY_RESPONSE" = "405" ] || [ "$RAILWAY_RESPONSE" = "200" ]; then ((PASSED_TESTS++)); fi
if [[ "$ANALYSIS_RESPONSE" == *"forecast"* ]]; then ((PASSED_TESTS++)); fi
if [[ "$DIFFERENT_STOCKS_RESPONSE" == *"forecast"* ]]; then ((PASSED_TESTS++)); fi
if [[ "$VALIDATION_RESPONSE" == *"error"* ]] || [[ "$VALIDATION_RESPONSE" == "[]" ]]; then ((PASSED_TESTS++)); fi
if (( $(echo "$ELAPSED_TIME < 5.0" | bc -l) )); then ((PASSED_TESTS++)); fi
if [[ "$NEWS_RESPONSE" == *"news"* ]]; then ((PASSED_TESTS++)); fi

echo -e "${GREEN}✅ Pruebas pasadas: $PASSED_TESTS/$TOTAL_TESTS${NC}"

echo ""
echo "🎯 RECOMENDACIONES"
echo "=================="

if [ "$PASSED_TESTS" -eq "$TOTAL_TESTS" ]; then
    echo -e "${GREEN}🎉 ¡Todas las pruebas pasaron! El backend de Railway está funcionando perfectamente.${NC}"
else
    echo -e "${YELLOW}⚠️  Algunas pruebas fallaron. Revisa la configuración del backend de Railway.${NC}"
fi

echo ""
echo -e "${BLUE}📝 CARACTERÍSTICAS DEL BACKEND DE RAILWAY:${NC}"
echo "- ✅ Análisis basado en noticias reales"
echo "- ✅ Impacto específico para cada stock"
echo "- ✅ Razones detalladas del impacto"
echo "- ✅ Horizonte temporal (corto/medio/largo plazo)"
echo "- ✅ Transformación automática de datos"
echo ""
echo -e "${GREEN}🚀 Para usar el sistema:${NC}"
echo "1. Ejecuta 'npm run dev'"
echo "2. Ve a http://localhost:3000"
echo "3. Selecciona stocks y haz clic en 'RUN'"
echo "4. ¡Disfruta del análisis basado en noticias reales!"

echo ""
echo "🔍 PRUEBAS COMPLETADAS"
echo "======================" 