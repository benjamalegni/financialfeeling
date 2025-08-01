# Guía de Desarrollo - Financial Feeling React Native

## Configuración Inicial

### Variables de Entorno
Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
```

### Estructura de Base de Datos

Asegúrate de tener las siguientes tablas en tu proyecto de Supabase:

#### Tabla: user_selected_assets
```sql
CREATE TABLE user_selected_assets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  asset_identifier TEXT NOT NULL,
  asset_type TEXT,
  asset_name TEXT,
  notes TEXT,
  selected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Comandos Útiles

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm start

# Ejecutar en Android
npm run android

# Ejecutar en iOS
npm run ios

# Ejecutar en web
npm run web

# Verificar tipos TypeScript
npx tsc --noEmit

# Linting
npm run lint
```

## Características Implementadas

### ✅ Completado
- [x] Autenticación con Supabase
- [x] Navegación entre pantallas
- [x] Pantalla de Login
- [x] Pantalla de Registro
- [x] Dashboard principal
- [x] Gestión de sesiones
- [x] Pull-to-refresh en dashboard
- [x] Manejo de errores
- [x] Estados de carga
- [x] Tema oscuro consistente

### 🚧 En Desarrollo
- [ ] Selección de activos
- [ ] Análisis de IA
- [ ] Notificaciones push
- [ ] Modo offline

### 📋 Pendiente
- [ ] Tests unitarios
- [ ] Tests de integración
- [ ] CI/CD pipeline
- [ ] Analytics
- [ ] Crash reporting

## Arquitectura

### Navegación
- `AppNavigator`: Maneja la navegación principal basada en el estado de autenticación
- Stack Navigator para transiciones entre pantallas

### Estado
- Estado de sesión manejado por Supabase
- Estado local para UI (loading, refreshing, etc.)

### Estilo
- Tema oscuro consistente
- Componentes reutilizables
- Diseño responsive

## Debugging

### Logs
```javascript
// En cualquier componente
console.log('Debug info:', data);
```

### React Native Debugger
1. Instalar React Native Debugger
2. Ejecutar `npm start`
3. Abrir React Native Debugger
4. Conectar a la aplicación

### Supabase Dashboard
- Monitorear autenticación en tiempo real
- Ver logs de errores
- Gestionar usuarios

## Notas de Desarrollo

- La aplicación usa Expo para facilitar el desarrollo
- TypeScript está configurado para type safety
- React Navigation para navegación nativa
- Supabase para backend-as-a-service
- Tema oscuro optimizado para móviles 