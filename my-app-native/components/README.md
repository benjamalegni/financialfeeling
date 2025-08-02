# Header Component

Un header profesional y elegante para la aplicación Financial Feeling con estilo financiero moderno, logo animado estilizado y tipografía blanca sobre fondo dorado.

## Características

- **Diseño elegante** con gradiente y elementos decorativos dorados
- **Tipografía blanca** robusta y elegante con fuente Mozilla Headline
- **Logo animado estilizado** que puede ser rojo o verde
- **Animaciones sutiles** de entrada y movimiento
- **Elementos decorativos** dorados para mayor sofisticación
- **Responsive** y adaptable a diferentes tamaños de pantalla
- **Modo compacto** para pantallas de autenticación

## Uso

```tsx
import Header from '../components/Header';

// Uso básico
<Header />

// Sin subtítulo
<Header showSubtitle={false} />

// Modo compacto (para pantallas de login/signup)
<Header compact={true} />

// Modo compacto sin subtítulo
<Header compact={true} showSubtitle={false} />
```

## Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `showSubtitle` | `boolean` | `true` | Muestra/oculta el subtítulo "Smart Investment Insights" |
| `compact` | `boolean` | `false` | Modo compacto con menos espacio vertical y elementos más pequeños |

## Estilo

### Colores
- **Fondo**: Gradiente de `#1a1a1a` a `#2a2a2a`
- **Texto principal**: `#ffffff` (blanco)
- **Texto secundario**: `#FFA500` (naranja dorado)
- **Acentos**: `#FFD700` (dorado)
- **Elementos decorativos**: Tonos dorados y naranjas

### Tipografía
- **Fuente**: Mozilla Headline para mayor elegancia y impacto visual
- **Título principal**: 28px (compact: 24px), peso 300, espaciado 2
- **Subtítulo**: 32px (compact: 28px), peso 700, espaciado 1
- **Tagline**: 14px, peso 400, mayúsculas
- **Efectos**: Sombra de texto blanca para profundidad

### Animaciones
- **Entrada suave**: Fade-in y slide-up al cargar
- **Logo animado**: Rotación continua, pulso y escala sutil
- **Movimiento fluido**: Transiciones suaves entre estados

### Elementos Decorativos
- **Círculos**: Posicionados estratégicamente en tonos dorados
- **Líneas**: Rotadas para crear dinamismo
- **Logo animado**: Diseño estilizado con círculos y líneas

### Modo Compacto
- **Padding reducido**: 30px top, 15px bottom (vs 50px/20px)
- **Logo más pequeño**: 28px (vs 36px)
- **Tipografía reducida**: Títulos 20% más pequeños
- **Sin tagline**: Automáticamente oculto en modo compacto

## Componentes Relacionados

### AnimatedLogo
Logo animado estilizado con múltiples efectos:
- **Rotación continua**: 8 segundos por vuelta
- **Pulso**: Escala 1.0 ↔ 1.2 (1.5 segundos)
- **Escala sutil**: 1.0 ↔ 1.1 (3 segundos)
- **Tamaño configurable**: Por defecto 24px
- **Colores**: Rojo (#ff4444, #ff6666) o Verde (#44ff44, #66ff66)
- **Diseño**: Círculo exterior, círculo interior, líneas decorativas y punto central

## Integración

El header está diseñado para integrarse perfectamente con:
- **Pantallas de autenticación** (Login/Signup) - Usar `compact={true}`
- **Dashboard principal** - Usar modo normal
- **Pantallas de funcionalidad** - Usar modo normal
- **Mantiene consistencia visual** en toda la app

## Personalización

Para personalizar el header, puedes modificar:
- Colores del gradiente en `colors`
- Tipografía en `title`, `subtitle`, `tagline`
- Elementos decorativos en `decorativeCircle1`, etc.
- Espaciado y dimensiones según necesidades
- Modo compacto ajustando `containerCompact`, `titleCompact`, etc.
- Animaciones en `AnimatedLogo.tsx`
- Colores del logo (rojo o verde) en el componente
- Elementos decorativos dorados en los estilos 