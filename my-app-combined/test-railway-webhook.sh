#!/bin/bash

echo "🧪 PROBANDO WEBHOOK DE RAILWAY..."
echo "=================================="

# URL del webhook
WEBHOOK_URL="https://ffaiagent-n8n-production.up.railway.app/webhook/analyze-stocks"

echo "📋 Información del webhook:"
echo "   URL: $WEBHOOK_URL"

echo ""
echo "🔍 Probando webhook con datos de prueba..."

# Datos de prueba
TEST_DATA='{"stocks":["AAPL","TSLA"]}'

echo "📤 Enviando datos de prueba:"
echo "   $TEST_DATA"

# Hacer la petición POST
RESPONSE=$(curl -s -X POST "$WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d "$TEST_DATA" \
  -w "\nHTTP Status: %{http_code}\nResponse Time: %{time_total}s\n")

echo ""
echo "📥 Respuesta del webhook:"
echo "$RESPONSE"

echo ""
echo "🔍 Verificando si el webhook responde..."

# Verificar si la respuesta contiene datos
if echo "$RESPONSE" | grep -q "HTTP Status: 200"; then
    echo "   ✅ Webhook responde correctamente (200 OK)"
else
    echo "   ❌ Webhook no responde correctamente"
fi

if echo "$RESPONSE" | grep -q "analysis\|data\|result"; then
    echo "   ✅ Webhook devuelve datos de análisis"
else
    echo "   ❌ Webhook no devuelve datos de análisis"
fi

echo ""
echo "🌐 Verificando configuración en la aplicación:"
echo "   Config URL: $(grep -o 'webhookUrl.*' lib/config.ts)"

echo ""
echo "💡 Si el webhook no funciona:"
echo "   1. Verificar que Railway esté funcionando"
echo "   2. Verificar que la URL sea correcta"
echo "   3. Verificar que el webhook esté configurado en n8n"
echo "   4. Revisar los logs de Railway"

echo ""
echo "✅ Prueba completada" 