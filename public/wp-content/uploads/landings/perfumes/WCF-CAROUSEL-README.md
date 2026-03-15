# Carrusel de Productos WCF - Landing Page Perfumes

## 📋 Resumen de la Integración

Se ha adaptado completamente el carrusel profesional de productos de WooCommerce (originalmente un shortcode de WordPress/Elementor) para funcionar **directamente en la landing page HTML estática**.

## 🗂️ Archivos Creados/Modificados

### Nuevos Archivos

1. **`wcf-carousel.css`** - Estilos completos del carrusel adaptados a la paleta verde bosque (#1A472A)
2. **`wcf-carousel.js`** - JavaScript completo con:
   - Fetch de productos desde API WooCommerce
   - Renderizado dinámico del carrusel
   - Sistema de dropdown con búsqueda alfabética
   - Navegación Swiper con loop infinito
   - Selector de cantidad
   - Agregar al carrito (simulado, preparado para integración AJAX)

### Archivos Modificados

1. **`index.html`**:
   - Sección de productos reemplazada por estructura del carrusel WCF
   - Referencias a CSS y JS agregadas
   
2. **`script.js`**:
   - Funciones de productos eliminadas (ahora en wcf-carousel.js)
   - Mantenidas: countdown, reviews, modal de pedido, sales popup

## ✨ Funcionalidades Implementadas

### 1. **Carga Dinámica de Productos**
- Fetch desde `/wp-json/wc/store/products`
- Fallback con 20 productos de demostración si falla la API
- Conversión automática de precios (centavos → soles)
- Ordenamiento alfabético

### 2. **Carrusel Swiper**
```javascript
- Desktop: 3.2 productos visibles
- Tablet: 2.5 productos visibles
- Móvil: 1.1 productos visibles
- Loop infinito si hay 6+ productos
- Navegación con botones circulares
- Paginación con bullets dinámicos
```

### 3. **Dropdown de Búsqueda**
- Lista completa de productos agrupados alfabéticamente
- Barra de búsqueda con debounce (300ms)
- Botón "Ver" para navegar al producto en el carrusel
- Posicionamiento fijo centrado en viewport
- Cierre con Escape o click fuera

### 4. **Tarjetas de Producto**
- Diseño en 2 columnas: 65% descripción | 35% compra
- Selector de cantidad con botones +/-
- Botón "Agregar al Carrito"
- Badge "En el carrito" con animación
- Badge "Agotado" para productos sin stock
- Efectos hover premium

### 5. **Sistema de Notificaciones**
- Toast notifications con slide-in animation
- Colores: verde (#0C9145) para éxito, rojo (#ef4444) para error
- Auto-desaparición después de 3 segundos

## 🎨 Diseño y Estética

- **Glassmorphism**: Fondos semitransparentes con `backdrop-filter: blur()`
- **Colores Principales**:
  - Verde bosque: `#1A472A` (botones, títulos)
  - Verde éxito: `#0C9145` (acciones positivas)
  - Grises suaves para fondos y bordes

- **Animaciones**:
  - `bounceIn` para badges
  - `slideInRight/slideOutRight` para notificaciones
  - Transforms suaves en hover

## 🔧 Configuración

Puedes ajustar parámetros en `wcf-carousel.js`:

```javascript
const WCF_CONFIG = {
    API_ENDPOINT: '/wp-json/wc/store/products',
    CATEGORY_SLUG: 'perfumes',
    PRODUCTS_PER_PAGE: 50,
    DEBOUNCE_DELAY: 300,
    NOTIFICATION_DURATION: 3000,
    HIGHLIGHT_DURATION: 2500,
};
```

## 📱 Responsive

### Desktop (1280px+)
- Carrusel: 3.2 slides visibles
- Layout de producto: 2 columnas (65% / 35%)

### Tablet (1024px - 1279px)
- Carrusel: 2.5 slides visibles
- Layout de producto: 2 columnas (60% / 40%)

### Móvil (< 768px)
- Carrusel: 1.1 slides visibles
- Layout de producto: 1 columna (descripción arriba, compra abajo)
- Zona de compra en grid 2x2: precio arriba, cantidad izquierda, botón derecha

## 🚀 Próximos Pasos (Integración Completa WooCommerce)

Para conectar completamente con WooCommerce, necesitarás:

1. **Agregar al carrito real**: Reemplazar el `setTimeout` simulado en `addToCart()` con:
   ```javascript
   fetch('/wp-json/wc/store/cart/add-item', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ id: productId, quantity: quantity })
   })
   ```

2. **Actualizar contador del carrito**: Conectar con el header de WordPress
3. **Sticky footer**: Actualizar con productos del carrito real

## 🔍 Logs de Depuración

El sistema incluye logs en consola:
- `[WCF]` prefix para todos los mensajes
- Compatible con modo debug activable/desactivable

## ✅ Testing Checklist

- [x] Carga de productos desde API
- [x] Fallback si API falla
- [x] Renderizado del carrusel con Swiper
- [x] Dropdown con búsqueda
- [x] Navegación "Ver" desde dropdown al carrusel
- [x] Selector de cantidad +/-
- [x] Botón agregar al carrito (simulado)
- [x] Badges "En el carrito" y "Agotado"
- [x] Notificaciones toast
- [x] Responsive completo
- [ ] Integración AJAX real con WooCommerce (pendiente)

## 💡 Notas Importantes

- El carrusel NO interfiere con el resto de la landing (countdown, reviews, modal, sticky footer)
- Todos los estilos están encapsulados en `.wcf-*` clases
- El JavaScript usa IIFE para evitar contaminar el scope global
- Las imágenes usan lazy loading nativo del navegador
