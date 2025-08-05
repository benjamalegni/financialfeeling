#!/usr/bin/env node

/**
 * Script para hacer requests al backend de Railway
 * Uso: node railway-requests.js [stocks...]
 */

const https = require('https');

// Configuración
const RAILWAY_URL = 'https://ffaiagent-n8n-production.up.railway.app/webhook/analyze-stocks';

// Función para hacer request al backend
async function analyzeStocks(stocks) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ stocks });
    
    const options = {
      hostname: 'ffaiagent-n8n-production.up.railway.app',
      port: 443,
      path: '/webhook/analyze-stocks',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    };

    const req = https.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const result = JSON.parse(responseData);
          resolve({
            status: res.statusCode,
            data: result,
            headers: res.headers
          });
        } catch (error) {
          resolve({
            status: res.statusCode,
            data: responseData,
            headers: res.headers
          });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(data);
    req.end();
  });
}

// Función principal
async function main() {
  const stocks = process.argv.slice(2);
  
  if (stocks.length === 0) {
    console.log('📊 Railway Backend Stock Analysis');
    console.log('==================================');
    console.log('');
    console.log('Uso: node railway-requests.js AAPL TSLA MSFT GOOGL');
    console.log('');
    console.log('Ejemplos:');
    console.log('  node railway-requests.js AAPL TSLA');
    console.log('  node railway-requests.js MSFT GOOGL AMZN');
    console.log('');
    return;
  }

  console.log('🚀 Analizando stocks:', stocks.join(', '));
  console.log('📡 URL:', RAILWAY_URL);
  console.log('');

  const startTime = Date.now();

  try {
    const result = await analyzeStocks(stocks);
    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;

    console.log('✅ Response recibida:');
    console.log('Status:', result.status);
    console.log('Tiempo:', duration + 's');
    console.log('Data:', JSON.stringify(result.data, null, 2));
    console.log('');

    if (result.status === 200) {
      console.log('🎉 Request exitoso!');
      console.log('📊 Stocks analizados:', stocks.length);
      console.log('⏱️  Tiempo de respuesta:', duration + 's');
    } else {
      console.log('❌ Error en el request');
      console.log('Status:', result.status);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Ejecutar si es el archivo principal
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { analyzeStocks }; 