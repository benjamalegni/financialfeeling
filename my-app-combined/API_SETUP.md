# API Setup Instructions

## Twelve Data API Configuration

Para mostrar datos reales de acciones en la sección "Daily Picks", necesitas configurar la API key de Twelve Data.

### Paso 1: Obtener API Key Gratuita

1. Ve a [Twelve Data](https://twelvedata.com/)
2. Crea una cuenta gratuita
3. Obtén tu API key desde el dashboard

### Paso 2: Configurar Variables de Entorno

1. Crea un archivo `.env.local` en la raíz del proyecto `my-app-combined/`
2. Agrega la siguiente línea:

```bash
NEXT_PUBLIC_TWELVE_DATA_API_KEY=tu_api_key_aqui
```

### Paso 3: Reiniciar el Servidor

1. Detén el servidor de desarrollo (Ctrl+C)
2. Reinicia el servidor: `npm run dev`

### Ejemplo de .env.local

```bash
# Twelve Data API Key
NEXT_PUBLIC_TWELVE_DATA_API_KEY=abc123def456ghi789

# Supabase Configuration (opcional)
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
```

### Notas Importantes

- La API key gratuita tiene límites de uso (1000 requests por día)
- Los datos se actualizan cada día
- Si no hay API key configurada, la sección "Daily Picks" no mostrará datos
- La API key debe comenzar con `NEXT_PUBLIC_` para ser accesible en el cliente

### Troubleshooting

Si no ves datos después de configurar la API key:

1. Verifica que el archivo `.env.local` esté en la ubicación correcta
2. Reinicia el servidor de desarrollo
3. Revisa la consola del navegador para errores
4. Verifica que la API key sea válida en [Twelve Data Dashboard](https://twelvedata.com/dashboard) 