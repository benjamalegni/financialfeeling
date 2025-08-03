#!/bin/bash

echo "🔍 VERIFICANDO URL DE RAILWAY..."
echo "=================================="

# URLs a probar
URL1="https://ffaiagent-n8n-production.up.railway.app/webhook/analyze-stocks"
URL2="https://ffaiagent-n8n-production.up.railway.app/webhook-test/analyze-stocks"

echo "📋 URLs a verificar:"
echo "   1. $URL1"
echo "   2. $URL2"

echo ""
echo "🧪 Probando URL 1 (/webhook/analyze-stocks):"
RESPONSE1=$(curl -s -X POST "$URL1" \
  -H "Content-Type: application/json" \
  -d '{"stocks":["AAPL","TSLA"]}' \
  -w "\nHTTP Status: %{http_code}\nResponse Time: %{time_total}s\n")

echo "$RESPONSE1"

echo ""
echo "🧪 Probando URL 2 (/webhook-test/analyze-stocks):"
RESPONSE2=$(curl -s -X POST "$URL2" \
  -H "Content-Type: application/json" \
  -d '{"stocks":["AAPL","TSLA"]}' \
  -w "\nHTTP Status: %{http_code}\nResponse Time: %{time_total}s\n")

echo "$RESPONSE2"

echo ""
echo "📊 RESULTADOS:"

# Verificar URL 1
if echo "$RESPONSE1" | grep -q "HTTP Status: 200"; then
    echo "   ✅ URL 1 (/webhook/analyze-stocks): FUNCIONA"
    WORKING_URL="$URL1"
else
    echo "   ❌ URL 1 (/webhook/analyze-stocks): NO FUNCIONA"
fi

# Verificar URL 2
if echo "$RESPONSE2" | grep -q "HTTP Status: 200"; then
    echo "   ✅ URL 2 (/webhook-test/analyze-stocks): FUNCIONA"
    WORKING_URL="$URL2"
else
    echo "   ❌ URL 2 (/webhook-test/analyze-stocks): NO FUNCIONA"
fi

echo ""
echo "🔧 CONFIGURACIÓN ACTUAL:"
echo "   Config file: $(grep -o 'webhookUrl.*' lib/config.ts)"

echo ""
echo "📝 RECOMENDACIÓN:"
if [ ! -z "$WORKING_URL" ]; then
    echo "   ✅ URL correcta: $WORKING_URL"
    echo "   📋 Esta URL está funcionando correctamente"
else
    echo "   ❌ Ninguna URL está funcionando"
    echo "   🔧 Revisar configuración de Railway"
fi

echo ""
echo "✅ Verificación completada" 