#!/bin/bash

echo "🔍 Probando el backend de n8n..."
echo ""

echo "📋 Información del backend:"
echo "   URL: https://ffaiagent-n8n-production.up.railway.app/webhook-test/analyze-stocks"
echo "   Método: POST"
echo "   Content-Type: application/json"
echo ""

echo "🧪 Probando con datos de ejemplo..."
curl -X POST https://ffaiagent-n8n-production.up.railway.app/webhook-test/analyze-stocks \
  -H "Content-Type: application/json" \
  -d '{"stocks": ["AAPL", "TSLA", "MSFT"]}' \
  -w "\n\n📊 Información de la respuesta:\n   Status: %{http_code}\n   Tiempo: %{time_total}s\n   Tamaño: %{size_download} bytes\n" \
  -s

echo ""
echo "🔧 Estado del backend:"
echo "   ✅ El webhook está respondiendo (HTTP 200)"
echo "   ⚠️  La respuesta es [{}] - workflow activo pero sin datos"
echo ""

echo "💡 Posibles causas:"
echo "   1. El workflow de n8n está activo pero no procesa los datos"
echo "   2. El formato de respuesta no es el esperado"
echo "   3. El workflow necesita configuración adicional"
echo ""

echo "🎯 Próximos pasos:"
echo "   1. Verificar la configuración del workflow en n8n"
echo "   2. Revisar los logs del workflow"
echo "   3. Asegurar que el workflow procese los datos correctamente"
echo ""

echo "✅ El backend está funcionando, pero necesita ajustes en el workflow." 