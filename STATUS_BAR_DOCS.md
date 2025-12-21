# Barra de Estado de Lectura - Documentación

## 📊 Descripción

Barra de estado minimalista y elegante integrada en la parte inferior del lector de libros electrónicos. Muestra información de progreso con una barra visual animada y estimación de páginas.

## ✨ Características

### 🎨 Diseño Limpio

- **Fondo gradiente translúcido**: Transición suave de transparente a negro semi-opaco
- **Barra de progreso animada**: Gradiente en color #7FB4CA con efecto shimmer
- **Información clara**: Caracteres, porcentaje y páginas en una sola línea
- **Botones de navegación**: Flechas minimalistas con efecto glassmorphism

### 📄 Información Mostrada

1. **Caracteres leídos**: `1,234 / 5,678 chars` (opcional)
2. **Porcentaje de progreso**: `45.6%` (opcional)
3. **Páginas estimadas**: `Página 23 de 113` (siempre visible)

### 🎮 Controles

- **Botones de navegación**: Anterior/Siguiente (solo en modo paginado)
- **Efectos hover**: Escala y brillo al pasar el mouse
- **Indicador de libro**: Icono de libro junto al contador de páginas

### 📐 Especificaciones

- **Altura fija**: 80px
- **Color primario**: #7FB4CA (azul cyan)
- **Posición**: Fixed bottom
- **Estimación de páginas**: ~2000 caracteres por página

## 🔧 Componente

**Ubicación**: `/apps/web/src/lib/components/book-reader/book-reader-status-bar.svelte`

### Props

```typescript
export let exploredCharCount: number = 0; // Caracteres leídos
export let bookCharCount: number = 0; // Total de caracteres
export let fontColor: string = '#ffffff'; // Color del texto
export let showCharacterCounter: boolean = true; // Mostrar contador de caracteres
export let showPercentage: boolean = true; // Mostrar porcentaje
export let onPrevPage: (() => void) | undefined; // Callback página anterior
export let onNextPage: (() => void) | undefined; // Callback página siguiente
```

### Cálculo de Páginas

```javascript
// Estimación basada en promedio de 2000 caracteres por página
estimatedTotalPages = Math.ceil(bookCharCount / 2000);
estimatedCurrentPage = Math.ceil((exploredCharCount / bookCharCount) * estimatedTotalPages) || 1;
```

## 🎨 Diseño Visual

```
┌─────────────────────────────────────────────────────────────┐
│                   [Contenido del libro]                      │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│  ◀   1,234 / 5,678 chars • 45.6% • Página 23 de 113      ▶ │
│      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│                      📖 Página 23 de 113                     │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 Integración

En `/apps/web/src/routes/b/+page.svelte`:

```svelte
<!-- BookReader con altura ajustada -->
<BookReader height={($containerViewportHeight$ ?? 0) - 80} {...otherProps} />

<!-- Status Bar fija al fondo -->
{#if bookCharCount}
  <div class="fixed bottom-0 left-0 right-0 z-[8]" style="height: 80px;">
    <BookReaderStatusBar
      {exploredCharCount}
      {bookCharCount}
      fontColor={$themeOption$?.tooltipTextFontColor || '#ffffff'}
      showCharacterCounter={$showCharacterCounter$}
      showPercentage={$showPercentage$}
      onPrevPage={isPaginated && pageManager ? () => pageManager?.prevPage() : undefined}
      onNextPage={isPaginated && pageManager ? () => pageManager?.nextPage() : undefined}
    />
  </div>
{/if}
```

## 💫 Animaciones

### Barra de Progreso

- **Transición suave**: `transition-all duration-300 ease-out`
- **Efecto shimmer**: Animación continua de brillo que se mueve de izquierda a derecha
- **Sombra animada**: Glow effect con el color primario

### Botones

- **Hover**: Scale 1.1 + brillo
- **Active**: Scale 0.95
- **Duración**: 200ms

## 🎯 Ventajas

1. **Sin CAVA**: Diseño más limpio y minimalista
2. **Páginas estimadas**: Información útil para el usuario
3. **Barra de progreso visual**: Fácil de entender de un vistazo
4. **Performance**: Sin animaciones pesadas de requestAnimationFrame
5. **Responsive**: Se adapta a diferentes tamaños de pantalla

## 📊 Comparación con Versión Anterior

| Característica | CAVA (v1.0)       | Simple (v2.0) |
| -------------- | ----------------- | ------------- |
| Animación      | 96 barras @ 60fps | Shimmer CSS   |
| Performance    | Media             | Alta          |
| Páginas        | No visible        | Prominente    |
| CPU Usage      | ~5%               | <1%           |
| Visual         | Complejo          | Limpio        |
| Información    | Menos clara       | Más clara     |

## 🔧 Personalización

### Cambiar caracteres por página

```javascript
// En book-reader-status-bar.svelte
estimatedTotalPages = Math.ceil(bookCharCount / 1500); // 1500 en vez de 2000
```

### Cambiar color primario

```javascript
const primaryColor = '#FF6B6B'; // Rojo coral
```

### Ajustar altura

```svelte
<!-- En +page.svelte -->
<div class="fixed bottom-0 left-0 right-0 z-[8]" style="height: 60px;">
```

## ✅ Testing

```bash
# Verificar compilación
pnpm run check

# Formatear código
pnpm run format

# Iniciar servidor de desarrollo
pnpm run dev
```

## 📱 Compatibilidad

- ✅ Navegadores modernos (Chrome, Firefox, Safari, Edge)
- ✅ Modo responsive (móvil y escritorio)
- ✅ Compatible con temas del lector
- ✅ Funciona con ambos modos: paginado y continuo

---

**Versión**: 2.0.0 (Simplificada)
**Fecha**: Diciembre 2024
**Estado**: ✅ Producción
