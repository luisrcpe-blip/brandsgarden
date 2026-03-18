/**
 * WCF Product Carousel - Adapted for Static Landing Page
 * Integración completa con WooCommerce API
 */

(function () {
    'use strict';

    console.log('🔧 Inicializando WCF Product Carousel...');

    // ===== CONFIGURACIÓN =====
    // ===== CONFIGURACIÓN =====
    const WCF_CONFIG = {
        API_ENDPOINT: '/wp-json/wc/store/products',
        CATEGORY_SLUG: 'perfumes',
        INITIAL_LOAD_LIMIT: 4, // Carga rápida inicial (4 productos)
        BACKGROUND_LOAD_LIMIT: 100, // Carga completa posterior
        DEBOUNCE_DELAY: 300,
        NOTIFICATION_DURATION: 3000,
        HIGHLIGHT_DURATION: 2500,
    };

    // ===== ESTADO GLOBAL =====
    let STATE = {
        allProducts: [],
        carouselProducts: [],
        swiper: null,
        isLoadingMore: false,
    };

    // ===== CART MANAGER GLOBAL =====
    window.CartManager = {
        items: new Map(), // productId => { id, name, price, quantity, image }

        // Cargar desde localStorage
        load() {
            try {
                const saved = localStorage.getItem('perfumes_cart');
                if (saved) {
                    const data = JSON.parse(saved);
                    // Asegurar que las claves sean números si es posible
                    this.items = new Map(data.map(([k, v]) => [parseInt(k) || k, v]));
                    this.notify();
                }
            } catch (error) {
                console.error('Error loading cart:', error);
            }
        },

        // Guardar en localStorage
        save() {
            try {
                const data = Array.from(this.items.entries());
                localStorage.setItem('perfumes_cart', JSON.stringify(data));
            } catch (error) {
                console.error('Error saving cart:', error);
            }
        },

        add(product) {
            const existing = this.items.get(product.id);
            if (existing) {
                existing.quantity += product.quantity;
                // Si la cantidad llega a 0 o menos, eliminar del carrito
                if (existing.quantity <= 0) {
                    this.items.delete(product.id);
                }
            } else {
                // Solo agregar si la cantidad es positiva
                if (product.quantity > 0) {
                    this.items.set(product.id, { ...product });
                }
            }
            this.save();
            this.notify();
        },

        remove(productId) {
            this.items.delete(productId);
            this.save();
            this.notify();
        },

        getTotal() {
            let total = 0;
            this.items.forEach(item => total += item.price * item.quantity);
            return total;
        },

        getCount() {
            let count = 0;
            this.items.forEach(item => count += item.quantity);
            return count;
        },

        getItems() {
            return Array.from(this.items.values());
        },

        notify() {
            window.dispatchEvent(new CustomEvent('cart-updated', {
                detail: {
                    count: this.getCount(),
                    total: this.getTotal(),
                    items: this.getItems()
                }
            }));
        }
    };

    // Cargar carrito inmediatamente
    window.CartManager.load();

    // Cargar carrito al iniciar
    window.CartManager.load();

    // ===== UTILIDADES =====

    function debounce(func, wait) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    function log(message, data = null) {
        // Debug siempre activo para diagnóstico
        console.log(`[WCF] ${message}`, data || '');
    }

    // ===== FETCH DE PRODUCTOS =====

    async function fetchProducts() {
        try {
            log('📦 Cargando productos iniciales (fase 1)...');

            // FASE 1: Carga rápida de 12 productos
            const response = await fetch(`${WCF_CONFIG.API_ENDPOINT}?per_page=${WCF_CONFIG.INITIAL_LOAD_LIMIT}`);
            if (!response.ok) throw new Error('Error en la API');

            // Obtener el total real del header X-WP-Total
            const totalProducts = response.headers.get('X-WP-Total');
            if (totalProducts) {
                const countEl = document.getElementById('total-product-count');
                if (countEl) {
                    countEl.textContent = `${totalProducts} productos`;
                }
                log(`📊 Total real reportado por API: ${totalProducts}`);
            }

            let data = await response.json();

            // Procesar y renderizar Fase 1
            processAndRenderProducts(data);

            // Inicializar Swiper y mover dropdown solo la primera vez
            moveDropdownToBody();
            initSwiper();

            // FASE 2: Carga en background del resto (si hay más)
            // Esperar un poco para no bloquear el hilo principal
            STATE.isLoadingMore = true;
            renderCarouselProducts(); // Re-renderizar para mostrar loader

            setTimeout(() => {
                fetchRemainingProducts();
            }, 1000);

        } catch (error) {
            console.error('[WCF] Error cargando productos:', error);
            const container = document.getElementById('carousel-products');
            if (container) {
                container.innerHTML = '<div style="text-align:center; padding: 40px; color: #ef4444;">Error cargando productos. Por favor recarga la página.</div>';
            }
        }
    }

    async function fetchRemainingProducts() {
        try {
            log('📦 Cargando resto de productos (fase 2)...');
            const response = await fetch(`${WCF_CONFIG.API_ENDPOINT}?per_page=${WCF_CONFIG.BACKGROUND_LOAD_LIMIT}&offset=${WCF_CONFIG.INITIAL_LOAD_LIMIT}`);
            STATE.isLoadingMore = false; // Finalizar carga

            if (!response.ok) {
                renderCarouselProducts(); // Quitar loader si falla
                return;
            }

            const moreData = await response.json();

            if (moreData && moreData.length > 0) {
                log(`📦 Se encontraron ${moreData.length} productos adicionales.`);
                // Combinar con los existentes
                processAndRenderProducts(moreData, true); // true = append
                // Actualizar swiper después de agregar nuevos slides
                if (STATE.swiper) STATE.swiper.update();
            } else {
                renderCarouselProducts(); // Quitar loader si no hay más
            }
        } catch (err) {
            console.log('Error carga background:', err);
            STATE.isLoadingMore = false;
            renderCarouselProducts(); // Quitar loader
        }
    }

    function processAndRenderProducts(rawData, isAppend = false) {
        const newProducts = rawData.map(p => {
            // Optimizar imágenes: preferir thumbnail para mejorar rendimiento
            let imgUrl = 'https://placehold.co/600x600/1A472A/ffffff?text=Perfume';
            if (p.images && p.images.length > 0) {
                // Intentar obtener la versión de 300x300 o similar si la API la entrega en 'thumbnail' o similar
                imgUrl = p.images[0].thumbnail || p.images[0].src;
            }

            return {
                id: p.id,
                name: p.name,
                price: parseFloat(p.prices?.price || 0) / 100,
                priceHtml: `S/ ${(parseFloat(p.prices?.price || 0) / 100).toFixed(2)}`,
                description: p.description ? stripHtml(p.description) : (p.short_description ? stripHtml(p.short_description) : 'Perfume original de alta calidad garantizada'),
                image: imgUrl,
                inStock: p.is_purchasable && p.is_in_stock,
                stockQuantity: p.stock_quantity || 999,
            };
        });

        if (isAppend) {
            // Filtrar duplicados por si acaso
            const existingIds = new Set(STATE.allProducts.map(p => p.id));
            const uniqueNew = newProducts.filter(p => !existingIds.has(p.id));
            STATE.allProducts = [...STATE.allProducts, ...uniqueNew];
        } else {
            STATE.allProducts = newProducts;
        }

        // Ordenar alfabéticamente
        STATE.allProducts.sort((a, b) => a.name.localeCompare(b.name));

        // Actualizar estado del carrusel
        STATE.carouselProducts = STATE.allProducts;

        // Exponer globalmente para otros scripts (como el popup de ventas)
        window.WCF_PRODUCTS = STATE.allProducts;

        // Re-renderizar
        renderCarouselProducts();
        renderDropdownProducts();

        // Solo actualizar contador si es la carga final (append) para no sobrescribir el total real leído del header
        if (isAppend) {
            updateProductCount();
        }
    }


    function useFallbackProducts() {
        STATE.allProducts = Array.from({ length: 20 }, (_, i) => ({
            id: i + 1,
            name: `Perfume Original ${['Chanel', 'Dior', 'Versace', 'YSL', 'Givenchy'][i % 5]} - Modelo ${i + 1}`,
            price: 149 + (Math.floor(Math.random() * 50)),
            priceHtml: `S/ ${(149 + Math.floor(Math.random() * 50)).toFixed(2)}`,
            description: 'Perfume original importado de alta duración. Aroma sofisticado y elegante.',
            image: 'https://placehold.co/600x600/1A472A/ffffff?text=Perfume',
            inStock: true,
            stockQuantity: 10,
        }));

        // Todos los productos en el carrusel para el fallback
        STATE.carouselProducts = STATE.allProducts;

        updateProductCount();
        renderCarouselProducts();
        renderDropdownProducts();
        moveDropdownToBody();
        initSwiper();
    }

    function stripHtml(html) {
        const tmp = document.createElement('div');
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || '';
    }

    // ===== RENDERIZADO =====

    function updateProductCount() {
        const countEl = document.getElementById('total-product-count');
        if (countEl) {
            countEl.textContent = `${STATE.allProducts.length} productos`;
        }
    }

    function renderCarouselProducts() {
        const container = document.getElementById('carousel-products');
        if (!container) return;

        container.innerHTML = STATE.carouselProducts.map(product => {
            // Comparación robusta de ID (Number vs String)
            const productId = parseInt(product.id);
            const inCart = window.CartManager.items.has(productId);
            const cartItem = inCart ? window.CartManager.items.get(productId) : null;
            const quantity = cartItem ? cartItem.quantity : 1;

            return `
            <div class="swiper-slide">
                <article class="wcf-product-card ${inCart ? 'in-cart' : ''}" data-product-id="${product.id}">
                    
                    <h3 class="wcf-product-title">${escapeHtml(product.name)}</h3>

                    <div class="wcf-product-image">
                        <img src="${product.image}" alt="${escapeHtml(product.name)}" width="300" height="300" loading="lazy">
                        ${!product.inStock ? '<div class="wcf-out-of-stock-badge">Agotado</div>' : ''}
                        ${inCart ? `
                        <div class="wcf-in-cart-badge">
                            <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
                            En el carrito
                        </div>` : ''}
                    </div>
                    
                    <div class="wcf-product-content-row">
                        <div class="wcf-product-description">
                            <p>${product.description}</p>
                        </div>
                        
                        <div class="wcf-product-purchase single-column">
                            <div class="wcf-product-price">
                                ${product.priceHtml}
                            </div>
                            
                            <div class="wcf-purchase-actions">
                                ${product.inStock ? (inCart ? `
                                <div class="wcf-quantity-selector active-mode">
                                    <button type="button" class="wcf-qty-btn wcf-qty-minus" data-id="${product.id}">-</button>
                                    <span class="wcf-qty-display">${quantity}</span>
                                    <button type="button" class="wcf-qty-btn wcf-qty-plus" data-id="${product.id}">+</button>
                                </div>
                                ` : `
                                <button class="wcf-add-to-cart-btn initial-add" type="button" data-product-id="${product.id}" data-product-name="${escapeHtml(product.name)}" data-price="${product.price}" data-image="${product.image}">
                                    Agregar
                                </button>
                                `) : `
                                <button class="wcf-add-to-cart-btn" type="button" disabled style="width: 100%; opacity: 0.6; cursor: not-allowed;">
                                    Agotado
                                </button>
                                `}
                            </div>
                        </div>
                    </div>
                </article>
            </div>
        `}).join('');

        // Agregar slide de carga si es necesario
        if (STATE.isLoadingMore) {
            container.innerHTML += `
            <div class="swiper-slide">
                <article class="wcf-product-card" style="justify-content: center; align-items: center; min-height: 400px; background: #f9f9f9;">
                    <div style="width: 40px; height: 40px; border: 4px solid rgba(26, 71, 42, 0.1); border-left-color: #1A472A; border-radius: 50%; animation: rotate 1s linear infinite;"></div>
                    <p style="margin-top: 15px; color: #666; font-weight: 500;">Cargando más productos...</p>
                </article>
            </div>
            `;
        }

        log('✅ Productos del carrusel renderizados');
        initQuantityButtons();
    }

    function renderDropdownProducts() {
        const container = document.getElementById('dropdown-product-list');
        if (!container) return;

        let currentLetter = '';
        let html = '';

        STATE.allProducts.forEach(product => {
            const firstLetter = product.name.charAt(0).toUpperCase();

            if (firstLetter !== currentLetter) {
                if (currentLetter !== '') html += '</div>';
                html += '<div class="wcf-letter-group">';
                html += `<div class="wcf-letter-divider">${firstLetter}</div>`;
                currentLetter = firstLetter;
            }

            html += `
                <div class="wcf-dropdown-item" data-product-name="${product.name.toLowerCase()}">
                    <div class="wcf-dropdown-product-info">
                        <img src="${product.image}" alt="${escapeHtml(product.name)}" width="50" height="50" loading="lazy">
                        <div class="wcf-dropdown-product-text">
                            <span class="wcf-dropdown-product-name">${escapeHtml(product.name)}</span>
                            <span class="wcf-dropdown-product-price">${product.priceHtml}</span>
                        </div>
                    </div>
                    <button class="wcf-quick-view" type="button" data-product-id="${product.id}" data-product-name="${escapeHtml(product.name)}">
                        Ver
                    </button>
                </div>
            `;
        });

        if (currentLetter !== '') html += '</div>';
        // Añadir un espaciador al final para evitar recortes visuales
        html += '<div style="height: 30px; width: 100%;"></div>';
        container.innerHTML = html;

        log('✅ Dropdown de productos renderizado');
    }

    function moveDropdownToBody() {
        const dropdown = document.querySelector('.wcf-products-dropdown');
        if (dropdown) {
            // Mover el dropdown al final del body
            document.body.appendChild(dropdown);
            log('✅ Dropdown movido al body para position:fixed correcto');
        }
    }

    function escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }

    // ===== SWIPER =====

    function initSwiper() {
        if (typeof Swiper === 'undefined') {
            log('❌ Swiper no está cargado, reintentando...');
            setTimeout(initSwiper, 500);
            return;
        }

        const swiperEl = document.querySelector('.wcf-product-swiper');
        if (!swiperEl) {
            log('❌ Contenedor Swiper no encontrado');
            return;
        }

        const totalSlides = STATE.carouselProducts.length;

        const config = {
            // Móvil: 1 producto completo + un pedacito
            slidesPerView: 1.15,
            spaceBetween: 15,
            speed: 600,
            grabCursor: true,
            slidesPerGroup: 1, // SIEMPRE 1 en 1 para precisión
            navigation: {
                nextEl: '.wcf-carousel-next',
                prevEl: '.wcf-carousel-prev',
            },
            pagination: {
                el: '.wcf-product-swiper .swiper-pagination',
                clickable: true,
                dynamicBullets: true,
            },
            breakpoints: {
                // Tablet pequeño: 2 productos + pedacito
                640: {
                    slidesPerView: 2.15,
                    spaceBetween: 20,
                    slidesPerGroup: 1  // 1 en 1
                },
                // Tablet grande: 2.5 productos + pedacito
                900: {
                    slidesPerView: 2.5,
                    spaceBetween: 25,
                    slidesPerGroup: 1  // 1 en 1
                },
                // Desktop: 3 productos completos + pedacito del 4to
                1280: {
                    slidesPerView: 3.15,
                    spaceBetween: 30,
                    slidesPerGroup: 1  // 1 en 1 para navegación precisa
                },
            },
            // DESACTIVAR LOOP para evitar problemas de índices
            loop: false,
        };

        STATE.swiper = new Swiper('.wcf-product-swiper', config);

        log('✅ Swiper inicializado (sin loop, navegación 1 en 1)');
    }

    // ===== DROPDOWN =====

    document.addEventListener('click', (e) => {
        const toggleBtn = e.target.closest('.wcf-toggle-dropdown');

        if (toggleBtn) {
            e.preventDefault();
            e.stopPropagation();

            // Buscar el dropdown globalmente (ya no es hermano del botón)
            const dropdown = document.querySelector('.wcf-products-dropdown');
            if (!dropdown) {
                log('❌ Dropdown no encontrado');
                return;
            }

            const isActive = toggleBtn.classList.contains('active');

            // Cerrar otros dropdowns (si hubiera más en el futuro)
            document.querySelectorAll('.wcf-products-dropdown').forEach(d => d.style.display = 'none');
            document.querySelectorAll('.wcf-toggle-dropdown').forEach(b => b.classList.remove('active'));

            if (!isActive) {
                const rect = toggleBtn.getBoundingClientRect();
                const dropdownWidth = Math.min(450, window.innerWidth * 0.9);

                // Posicionar el dropdown
                let left, top;

                if (window.innerWidth >= 768) {
                    // DESKTOP/TABLET: Alinear a la derecha del botón
                    left = rect.right - dropdownWidth;
                    // Si se sale por la izquierda, ajustar
                    if (left < 10) left = 10;
                } else {
                    // MÓVIL: Centrar en la pantalla
                    left = (window.innerWidth - dropdownWidth) / 2;
                }

                // Posicionar debajo del botón
                top = rect.bottom + 10;

                dropdown.style.cssText = `
                    display: block;
                    position: fixed;
                    top: ${top}px;
                    left: ${left}px;
                    width: ${dropdownWidth}px;
                    z-index: 90;
                `;

                toggleBtn.classList.add('active');

                setTimeout(() => {
                    const searchInput = dropdown.querySelector('.wcf-search-input');
                    if (searchInput) searchInput.focus();
                }, 100);
            }
        } else if (!e.target.closest('.wcf-products-dropdown-wrapper') && !e.target.closest('.wcf-products-dropdown')) {
            document.querySelectorAll('.wcf-products-dropdown').forEach(d => d.style.display = 'none');
            document.querySelectorAll('.wcf-toggle-dropdown').forEach(b => b.classList.remove('active'));
        }
    });

    // Cerrar con Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.wcf-products-dropdown').forEach(d => d.style.display = 'none');
            document.querySelectorAll('.wcf-toggle-dropdown').forEach(b => b.classList.remove('active'));
        }
    });

    // Reposicionar dropdown al hacer scroll para que siempre esté debajo del botón
    window.addEventListener('scroll', () => {
        const openDropdown = document.querySelector('.wcf-products-dropdown[style*="display: block"]');
        const activeButton = document.querySelector('.wcf-toggle-dropdown.active');

        if (openDropdown && activeButton) {
            const rect = activeButton.getBoundingClientRect();
            const dropdownWidth = Math.min(450, window.innerWidth * 0.9);

            let left;
            if (window.innerWidth >= 768) {
                // DESKTOP/TABLET: Alinear a la derecha del botón
                left = rect.right - dropdownWidth;
                if (left < 10) left = 10;
            } else {
                // MÓVIL: Centrar
                left = (window.innerWidth - dropdownWidth) / 2;
            }

            const top = rect.bottom + 10;

            // Actualizar posición
            openDropdown.style.top = `${top}px`;
            openDropdown.style.left = `${left}px`;
        }
    }, { passive: true });

    // ===== BÚSQUEDA =====

    const searchProducts = debounce((input) => {
        const term = input.value.toLowerCase();
        const dropdown = input.closest('.wcf-products-dropdown');

        dropdown.querySelectorAll('.wcf-dropdown-item').forEach(item => {
            const name = item.dataset.productName;
            item.style.display = name.includes(term) ? 'flex' : 'none';
        });

        dropdown.querySelectorAll('.wcf-letter-group').forEach(group => {
            const visible = group.querySelectorAll('.wcf-dropdown-item[style="display: flex;"]').length;
            group.style.display = visible > 0 ? 'block' : 'none';
        });

        const totalVisible = dropdown.querySelectorAll('.wcf-dropdown-item[style="display: flex;"]').length;
        let noResults = dropdown.querySelector('.wcf-no-results');

        if (totalVisible === 0 && term.length > 0) {
            if (!noResults) {
                noResults = document.createElement('div');
                noResults.className = 'wcf-no-results';
                noResults.style.cssText = 'padding: 20px; text-align: center; color: #9ca3af;';
                noResults.textContent = 'No se encontraron productos';
                dropdown.querySelector('.wcf-dropdown-list').prepend(noResults);
            }
        } else if (noResults) {
            noResults.remove();
        }
    }, WCF_CONFIG.DEBOUNCE_DELAY);

    document.addEventListener('input', (e) => {
        if (e.target.classList.contains('wcf-search-input')) {
            searchProducts(e.target);
        }
    });

    // ===== VER PRODUCTO EN CARRUSEL =====

    document.addEventListener('click', (e) => {
        const quickViewBtn = e.target.closest('.wcf-quick-view');
        if (!quickViewBtn) return;

        e.preventDefault();
        const productId = parseInt(quickViewBtn.dataset.productId);
        const productName = quickViewBtn.dataset.productName;

        log(`👁️ Ver producto: ${productName} (ID: ${productId})`);

        // Cerrar dropdown
        document.querySelectorAll('.wcf-products-dropdown').forEach(d => d.style.display = 'none');
        document.querySelectorAll('.wcf-toggle-dropdown').forEach(b => b.classList.remove('active'));

        // Verificar que Swiper esté inicializado
        if (!STATE.swiper) {
            log('❌ Swiper no inicializado');
            showNotification('Error: Carrusel no cargado', 'error');
            return;
        }

        // Buscar producto en carrusel
        const slides = STATE.swiper.slides;
        let targetIndex = -1;
        let foundMatches = []; // Para detectar duplicados

        log(`🔍 Buscando producto ID ${productId} en ${slides.length} slides...`);

        for (let i = 0; i < slides.length; i++) {
            const card = slides[i].querySelector('.wcf-product-card');
            if (card) {
                const cardId = parseInt(card.dataset.productId);
                const cardName = card.dataset.productId; // Guardar para debug

                if (cardId === productId) {
                    foundMatches.push({
                        index: i,
                        id: cardId,
                        name: card.querySelector('.wcf-product-title')?.textContent || 'Sin nombre'
                    });

                    // Tomar el primer match
                    if (targetIndex === -1) {
                        targetIndex = i;
                    }
                }

                // Log de los primeros y últimos slides para debug
                if (i < 3 || i >= slides.length - 3 || cardId === productId) {
                    log(`  Slide ${i}: ID ${cardId}, Nombre: ${card.querySelector('.wcf-product-title')?.textContent?.substring(0, 30)}`);
                }
            }
        }

        // Verificar duplicados
        if (foundMatches.length > 1) {
            log(`⚠️ ADVERTENCIA: Producto ID ${productId} encontrado ${foundMatches.length} veces:`, foundMatches);
        }

        if (targetIndex !== -1) {
            log(`✅ Producto encontrado en slide ${targetIndex} (producto #${targetIndex + 1})`);
            log(`   Nombre: ${foundMatches[0].name}`);
        }

        if (targetIndex === -1) {
            log(`❌ Producto ${productId} no encontrado en carrusel`);
            showNotification(`⚠️ "${productName}" no encontrado en el carrusel`, 'error');
            return;
        }

        // ===== NAVEGACIÓN INTELIGENTE =====
        const totalSlides = slides.length;
        let navigateToIndex = targetIndex;

        // Determinar cuántos slides están visibles (depende del breakpoint)
        const windowWidth = window.innerWidth;
        let visibleSlides = 1; // Default móvil

        if (windowWidth >= 1280) {
            visibleSlides = 3; // Desktop: 3 productos completos
        } else if (windowWidth >= 900) {
            visibleSlides = 2.5; // Tablet grande
        } else if (windowWidth >= 640) {
            visibleSlides = 2; // Tablet pequeño
        }

        log(`📱 Ancho: ${windowWidth}px, Slides visibles: ${visibleSlides}`);

        // LÓGICA DE CENTRADO MEJORADA:
        // El objetivo es que el producto seleccionado SIEMPRE se vea COMPLETO

        if (visibleSlides >= 3) {
            // DESKTOP: 3 productos completos visibles

            // Definir los "primeros 3" y "últimos 3"
            const firstThree = targetIndex <= 2;
            const lastThree = targetIndex >= totalSlides - 3;

            if (firstThree) {
                // Productos 0, 1, 2: Mostrar [1][2][3][pedacito 4]
                navigateToIndex = 0;
                log(`📍 Producto ${targetIndex + 1} (primeros 3): mostrando desde el inicio`);
            }
            else if (lastThree) {
                // Últimos 3 productos: Mostrar [pedacito N-3][N-2][N-1][N]
                navigateToIndex = Math.max(0, totalSlides - 3);
                log(`📍 Producto ${targetIndex + 1} (últimos 3): mostrando últimos 3 completos`);
            }
            else {
                // PRODUCTOS DEL MEDIO: Para centrar el producto seleccionado
                // Con 3 productos visibles [A][B][C][pedacito D]
                // Para que el producto seleccionado esté en posición B (centro):
                // navigateToIndex debe ser targetIndex - 1

                // Ejemplo: producto 25 (índice 24)
                // Queremos ver: [24][25✓][26][ped.27]
                // navigateToIndex = 24 - 1 = 23

                navigateToIndex = targetIndex - 1;

                // Asegurar límites
                navigateToIndex = Math.max(0, navigateToIndex);
                navigateToIndex = Math.min(totalSlides - 3, navigateToIndex);

                log(`📍 Producto ${targetIndex + 1} del medio: navegando a índice ${navigateToIndex}`);
                log(`   → Vista esperada: [${navigateToIndex + 1}][${navigateToIndex + 2} ✓][${navigateToIndex + 3}][ped.${navigateToIndex + 4}]`);
            }
        }
        else if (visibleSlides >= 2) {
            // TABLET: 2-2.5 productos completos visibles

            const firstTwo = targetIndex <= 1;
            const lastTwo = targetIndex >= totalSlides - 2;

            if (firstTwo) {
                navigateToIndex = 0;
                log(`📍 Tablet: Producto ${targetIndex + 1} (primeros 2)`);
            }
            else if (lastTwo) {
                navigateToIndex = Math.max(0, totalSlides - 2);
                log(`📍 Tablet: Producto ${targetIndex + 1} (últimos 2)`);
            }
            else {
                // Para 2.5 productos visibles [A][B][C.5]
                // Para centrar el producto seleccionado en posición B:
                // navigateToIndex = targetIndex - 1

                navigateToIndex = targetIndex - 1;
                navigateToIndex = Math.max(0, navigateToIndex);
                navigateToIndex = Math.min(totalSlides - 2, navigateToIndex);

                log(`📍 Tablet: Producto ${targetIndex + 1} del medio`);
                log(`   → Vista esperada: [${navigateToIndex + 1}][${navigateToIndex + 2} ✓][${navigateToIndex + 3}.5]`);
            }
        }
        else {
            // MÓVIL: 1 producto visible
            // Siempre centrar el producto seleccionado
            navigateToIndex = targetIndex;
            log(`📍 Móvil: Centrar producto ${targetIndex + 1}`);
        }

        log(`🎯 Navegando al índice ${navigateToIndex} (producto seleccionado: índice ${targetIndex})`);

        // NAVEGACIÓN SIMPLE SIN LOOP
        STATE.swiper.slideTo(navigateToIndex, 800);

        // Verificar resultado
        setTimeout(() => {
            const finalIndex = STATE.swiper.activeIndex;
            log(`✅ Navegación completada: activeIndex ${finalIndex} (target: ${navigateToIndex})`);
        }, 850);

        // Log del estado después de navegar
        setTimeout(() => {
            const activeIndex = STATE.swiper.activeIndex;
            const realIndex = STATE.swiper.realIndex;
            log(`📊 Estado post-navegación:`);
            log(`   - activeIndex: ${activeIndex}`);
            log(`   - realIndex: ${realIndex}`);
            log(`   - Producto objetivo en índice: ${targetIndex}`);
            log(`   - Productos visibles aproximados: ${realIndex} a ${realIndex + Math.ceil(visibleSlides)}`);
        }, 50);

        // Scroll y highlight
        setTimeout(() => {
            const swiperEl = document.querySelector('.wcf-product-swiper');
            if (!swiperEl) return;

            const scrollY = swiperEl.getBoundingClientRect().top + window.pageYOffset - 150;

            window.scrollTo({
                top: scrollY,
                behavior: 'smooth'
            });

            const card = slides[targetIndex].querySelector('.wcf-product-card');
            if (!card) return;

            // Highlight verde
            card.style.cssText = 'box-shadow: 0 0 0 5px #0C9145; transform: scale(1.03); z-index: 10;';

            setTimeout(() => {
                card.style.cssText = '';
            }, WCF_CONFIG.HIGHLIGHT_DURATION);

            log('✅ Navegación completada con highlight');
        }, 100);
    });

    // ===== CANTIDAD =====

    // ===== MANEJO DE EVENTOS (NUEVA LÓGICA DIRECTA) =====

    document.addEventListener('click', (e) => {
        // 1. Botón "Agregar" inicial
        const initialAddBtn = e.target.closest('.initial-add');
        if (initialAddBtn) {
            e.preventDefault();
            const productId = parseInt(initialAddBtn.dataset.productId);
            const product = STATE.allProducts.find(p => p.id == productId);

            if (product) {
                // Agregar 1 unidad
                window.CartManager.add({
                    id: productId,
                    name: product.name,
                    price: product.price,
                    quantity: 1,
                    image: product.image
                });

                updateCardUI(productId);
                showNotification(`¡${product.name} agregado!`);
            }
            return;
        }

        // 2. Botones de cantidad (+ / -)
        const qtyBtn = e.target.closest('.wcf-qty-btn');
        if (qtyBtn) {
            e.preventDefault();
            const productId = parseInt(qtyBtn.dataset.id);
            const isPlus = qtyBtn.classList.contains('wcf-qty-plus');

            // Obtener estado actual
            const cartItem = window.CartManager.items.get(productId);
            if (!cartItem) return;

            // Verificar stock antes de sumar
            if (isPlus) {
                const product = STATE.allProducts.find(p => p.id == productId);
                if (product && cartItem.quantity >= product.stockQuantity) {
                    showNotification('Stock máximo alcanzado', 'error');
                    return;
                }
                // Sumar 1
                window.CartManager.add({ ...cartItem, quantity: 1 });
            } else {
                // Restar 1. Si llega a 0, CartManager debería eliminar?
                // Mi CartManager actual solo suma/resta y guarda. NO elimina si es <= 0 automáticamente.
                // Debo manejarlo aquí.

                const newQty = cartItem.quantity - 1;

                if (newQty <= 0) {
                    window.CartManager.remove(productId);
                } else {
                    // Restar 1 pasando -1
                    window.CartManager.add({ ...cartItem, quantity: -1 });
                }
            }

            updateCardUI(productId);
        }
    });

    // Función para actualizar SOLO la tarjeta afectada sin romper Swiper
    function updateCardUI(productId) {
        const pId = parseInt(productId);
        const cards = document.querySelectorAll(`.wcf-product-card[data-product-id="${pId}"]`);

        if (cards.length === 0) return;

        cards.forEach(card => {
            const inCart = window.CartManager.items.has(pId);
            const cartItem = inCart ? window.CartManager.items.get(pId) : null;
            const quantity = cartItem ? cartItem.quantity : 0;
            const product = STATE.allProducts.find(p => p.id == pId);

            if (inCart) card.classList.add('in-cart');
            else card.classList.remove('in-cart');

            const imageContainer = card.querySelector('.wcf-product-image');
            if (imageContainer) {
                let existingBadge = imageContainer.querySelector('.wcf-in-cart-badge');
                if (inCart) {
                    if (!existingBadge) {
                        imageContainer.insertAdjacentHTML('beforeend', `
                            <div class="wcf-in-cart-badge">
                                <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
                                En el carrito
                            </div>
                        `);
                    }
                } else {
                    if (existingBadge) existingBadge.remove();
                }
            }

            const actionsContainer = card.querySelector('.wcf-purchase-actions');
            if (actionsContainer && product) {
                const currentSelector = actionsContainer.querySelector('.wcf-quantity-selector');

                if (inCart) {
                    if (currentSelector) {
                        const display = currentSelector.querySelector('.wcf-qty-display');
                        if (display) display.textContent = quantity;
                    } else {
                        actionsContainer.innerHTML = `
                            <div class="wcf-quantity-selector active-mode">
                                <button type="button" class="wcf-qty-btn wcf-qty-minus" data-id="${pId}">-</button>
                                <span class="wcf-qty-display">${quantity}</span>
                                <button type="button" class="wcf-qty-btn wcf-qty-plus" data-id="${pId}">+</button>
                            </div>
                        `;
                    }
                } else {
                    actionsContainer.innerHTML = `
                        <button class="wcf-add-to-cart-btn initial-add" type="button" data-product-id="${product.id}" data-product-name="${escapeHtml(product.name)}">
                            Agregar
                        </button>
                    `;
                }
            }
        });
    }

    // SINCRONIZACIÓN GLOBAL: Escuchar cambios en el carrito y actualizar tarjetas
    window.addEventListener('cart-updated', (e) => {
        // En lugar de actualizar todo, actualizamos solo lo que hay en el DOM actualmente
        document.querySelectorAll('.wcf-product-card[data-product-id]').forEach(card => {
            updateCardUI(card.dataset.productId);
        });
    });

    // ===== NOTIFICACIONES =====

    // ===== NOTIFICACIONES =====

    function showNotification(message, type = 'success') {
        document.querySelectorAll('.wcf-cart-notification').forEach(n => n.remove());

        const bgColor = type === 'success' ? '#0C9145' : '#ef4444';
        const icon = type === 'success'
            ? '<path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>'
            : '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>';

        const notification = document.createElement('div');
        notification.className = 'wcf-cart-notification';
        notification.style.background = bgColor;
        notification.innerHTML = `
            <svg width="24" height="24" fill="white" viewBox="0 0 24 24">${icon}</svg>
            <span>${message}</span>
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('hiding');
            setTimeout(() => notification.remove(), 400);
        }, WCF_CONFIG.NOTIFICATION_DURATION);
    }

    function initQuantityButtons() {
        // No op
    }

    // ===== INICIALIZACIÓN =====

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', fetchProducts);
    } else {
        fetchProducts();
    }

    log('✅ WCF Carousel Script cargado');

})();
