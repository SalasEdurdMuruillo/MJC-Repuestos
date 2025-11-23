const CATEGORIES = [
    { name: 'Motor', image: 'Images/Motor.png' },
    { name: 'Lubricantes', image: 'Images/Lubricantes.png' },
    { name: 'Eléctrico', image: 'Images/Electrico.png' },
    { name: 'Frenos', image: 'Images/Frenos.png' },
    { name: 'Accesorios', image: 'Images/Accesorios.png' },
    { name: 'Transmisión', image: 'Images/Transmision.png' },
    { name: 'Suspensión', image: 'Images/Suspension.png' },
    { name: 'Iluminación', image: 'Images/Iluminacion.png' },
    { name: 'Limpieza', image: 'Images/Limpieza.png' }
];

let PRODUCTS = [
    {
        id: 1,
        name: 'Filtro Aceite',
        cat: 'Motor',
        sku: 'FD-001',
        price: 39.9,
        desc: 'Filtro de alto flujo para mejor performance',
        images: 'Images/FiltroAceite.png',
        featured: true,
        best: true,
        discount: false
    },
    {
        id: 2,
        name: 'Aceite 20W50',
        cat: 'Lubricantes',
        sku: 'AC-020',
        price: 24.5,
        desc: 'Aceite multigrado para motores exigentes',
        images: 'Images/Aceite.png',
        featured: true,
        best: false,
        discount: true
    },
    {
        id: 3,
        name: 'Batería 12V',
        cat: 'Eléctrico',
        sku: 'BT-12',
        price: 119.0,
        desc: 'Batería de larga duración',
        images: 'Images/Bateria.png',
        featured: false,
        best: true,
        discount: false
    },
    {
        id: 4,
        name: 'Pastillas de freno',
        cat: 'Frenos',
        sku: 'PF-450',
        price: 49.0,
        desc: 'Juego de pastillas para distintos modelos',
        images: 'Images/PastillaFreno.png',
        featured: true,
        best: false,
        discount: true
    },
    {
        id: 5,
        name: 'Alfombras',
        cat: 'Accesorios',
        sku: 'TP-11',
        price: 29.0,
        desc: 'Alfombras para todo tipo de vehículo',
        images: 'Images/Alfombras.png',
        featured: false,
        best: true,
        discount: false
    },
    {
        id: 6,
        name: 'Amortiguador',
        cat: 'Suspensión',
        sku: 'AM-X',
        price: 89.0,
        desc: 'Amortiguador reforzado',
        images: 'Images/Amortiguadores.png',
        featured: false,
        best: false,
        discount: false
    },
    {
        id: 7,
        name: 'Luz LED',
        cat: 'Iluminación',
        sku: 'LD-7',
        price: 15.0,
        desc: 'Bombilla LED alta intensidad',
        images: 'Images/BombilloLED.png',
        featured: false,
        best: false,
        discount: true
    },
    {
        id: 9,
        name: 'Limpiador Motor',
        cat: 'Limpieza',
        sku: 'LM-9',
        price: 12.5,
        desc: 'Limpiador concentrado para motor',
        images: 'Images/Limpiador.png',
        featured: false,
        best: false,
        discount: true
    }
];

let cart = JSON.parse(localStorage.getItem('cart') || '[]');
let favorites = JSON.parse(localStorage.getItem('fav') || '[]');
let orders = JSON.parse(localStorage.getItem('orders') || '[]');
let currentProductId = null;
let theme = localStorage.getItem('theme') || 'dark';
let currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
let users = JSON.parse(localStorage.getItem('users') || '[]');

const money = v => '$' + v.toFixed(2);

function toast(msg, type = 'default') {
    const root = document.getElementById('toastApp');
    const el = document.createElement('div');
    el.className = 'toast-card mb-2 ' + (type === 'success' ? 'success' : type === 'warn' ? 'warn' : '');
    el.innerText = msg;
    root.appendChild(el);
    setTimeout(() => el.classList.add('fade-out'), 2000);
    setTimeout(() => el.remove(), 2400);
}

function saveState() {
    localStorage.setItem('cart', JSON.stringify(cart));
    localStorage.setItem('fav', JSON.stringify(favorites));
    localStorage.setItem('orders', JSON.stringify(orders));
    localStorage.setItem('theme', theme);
    localStorage.setItem('products', JSON.stringify(PRODUCTS));
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    localStorage.setItem('users', JSON.stringify(users));
    renderCartCount();
}

function applyTheme() {
    if (theme === 'light') document.documentElement.classList.add('light');
    else document.documentElement.classList.remove('light');
    document.getElementById('themeToggle').innerHTML = theme === 'light' ? '<i class="bi bi-sun"></i>' : '<i class="bi bi-moon-stars"></i>';
}

document.getElementById('themeToggle').addEventListener('click', () => {
    theme = theme === 'light' ? 'dark' : 'light';
    applyTheme();
    saveState();
});

function slidesToShow() {
    const w = window.innerWidth;
    if (w < 576) return 1;
    if (w < 900) return 2;
    if (w < 1200) return 3;
    return 4;
}

function chunkArray(arr, size) {
    const out = [];
    for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
    return out;
}

function initializeCarousels() {
    if (typeof bootstrap === 'undefined') {
        console.error('Bootstrap no está cargado');
        return;
    }

    const carouselElements = document.querySelectorAll('.carousel');
    console.log('Inicializando carruseles:', carouselElements.length);

    carouselElements.forEach(element => {
        try {

            const existingCarousel = bootstrap.Carousel.getInstance(element);
            if (existingCarousel) {
                existingCarousel.dispose();
            }

            const items = element.querySelectorAll('.carousel-item');
            if (items.length > 0) {
                new bootstrap.Carousel(element, {
                    interval: 3000,
                    ride: 'carousel',
                    wrap: true,
                    touch: true,
                    pause: 'hover'
                });
                console.log('Carrusel inicializado:', element.id);
            }
        } catch (error) {
            console.error('Error al inicializar carrusel:', element.id, error);
        }
    });
}

function renderCarousels() {
    const per = slidesToShow();

    // Carrusel de Categorías CON IMÁGENES
    const catInner = document.getElementById('catCarouselInner');
    if (catInner) {
        catInner.innerHTML = '';
        const catChunks = chunkArray(CATEGORIES, per);
        catChunks.forEach((chunk, i) => {
            const item = document.createElement('div');
            item.className = 'carousel-item ' + (i === 0 ? 'active' : '');
            let cols = '';
            chunk.forEach(c => {
                // 🎯 AQUÍ SE AGREGA LA IMAGEN
                cols += `
                    <div class="col-6 col-md-3">
                        <div class="product-card text-center" tabindex="0" onclick="openCategory('${c.name}')" style="cursor: pointer;">
                            <img src="${c.image}" alt="${c.name}" 
                                 style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px; margin-bottom: 12px;">
                            <h6 class="mt-2">${c.name}</h6>
                            <button class="btn btn-main w-100 mt-2" onclick="event.stopPropagation(); openCategory('${c.name}')">
                                Ver Productos
                            </button>
                        </div>
                    </div>
                `;
            });
            item.innerHTML = `<div class="row g-3">${cols}</div>`;
            catInner.appendChild(item);
        });
    }

    // Carrusel de Productos Recomendados
    const recInner = document.getElementById('recCarouselInner');
    if (recInner) {
        recInner.innerHTML = '';
        const recs = PRODUCTS.filter(p => p.featured);
        const recChunks = chunkArray(recs, per);
        recChunks.forEach((chunk, i) => {
            const item = document.createElement('div');
            item.className = 'carousel-item ' + (i === 0 ? 'active' : '');
            let cols = '';
            chunk.forEach(p => {
                cols += `
                    <div class="col-6 col-md-3">
                        <div class="product-card text-center" tabindex="0">
                            <img src="${p.images}" alt="${p.name}" 
                                 style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px; margin-bottom: 12px; cursor: pointer;"
                                 onclick="viewDetail(${p.id})">
                            <h6 class="mt-2 product-title">${p.name}</h6>
                            <div class="small-muted">${p.cat} · ${p.sku}</div>
                            <div class="mt-2 price">${money(p.price)}</div>
                            <div class="d-grid gap-2 mt-2">
                                <button class="btn btn-ghost btn-sm" onclick="viewDetail(${p.id})">Ver Detalle</button>
                                <button class="btn btn-main btn-sm" onclick="animatedAddToCart(${p.id}, this)">Comprar</button>
                            </div>
                        </div>
                    </div>
                `;
            });
            item.innerHTML = `<div class="row g-3">${cols}</div>`;
            recInner.appendChild(item);
        });
    }

    // 🔥 Carrusel de Más Vendidos CON IMÁGENES
    const bestInner = document.getElementById('bestCarouselInner');
    if (bestInner) {
        bestInner.innerHTML = '';
        const bests = PRODUCTS.filter(p => p.best);
        const bestChunks = chunkArray(bests, per);
        bestChunks.forEach((chunk, i) => {
            const item = document.createElement('div');
            item.className = 'carousel-item ' + (i === 0 ? 'active' : '');
            let cols = '';
            chunk.forEach(p => {
                cols += `
                    <div class="col-6 col-md-3">
                        <div class="product-card text-center" tabindex="0">
                            <img src="${p.images}" alt="${p.name}" 
                                 style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px; margin-bottom: 12px; cursor: pointer;"
                                 onclick="viewDetail(${p.id})">
                            <h6 class="mt-2 product-title">${p.name}</h6>
                            <div class="mt-2 price">${money(p.price)}</div>
                            <div class="d-grid gap-2 mt-2">
                                <button class="btn btn-ghost btn-sm" onclick="viewDetail(${p.id})">Ver</button>
                                <button class="btn btn-main btn-sm" onclick="animatedAddToCart(${p.id}, this)">Comprar</button>
                            </div>
                        </div>
                    </div>
                `;
            });
            item.innerHTML = `<div class="row g-3">${cols}</div>`;
            bestInner.appendChild(item);
        });
    }

    // CRÍTICO: Inicializar después de renderizar
    setTimeout(() => {
        initializeCarousels();
    }, 150);
}

function populateFilters() {
    const sel = document.getElementById('filterCategory');
    
    // 🔥 VALIDACIÓN: Verificar que el elemento existe
    if (!sel) {
        console.warn('Elemento filterCategory no encontrado');
        return;
    }
    
    sel.innerHTML = '';
    
    // Opción "Todas"
    const oAll = document.createElement('option');
    oAll.value = '';
    oAll.text = 'Todas';
    sel.add(oAll);
    
    // Agregar categorías
    CATEGORIES.forEach(c => {
        const o = document.createElement('option');
        o.value = c.name;   // 👈 Usar c.name (no solo c)
        o.text = c.name;    // 👈 Usar c.name (no solo c)
        sel.add(o);
    });
    
    console.log('Filtros poblados correctamente');
}

function showCatalogLoading() {
    const row = document.getElementById('catalogList');
    row.innerHTML = '';
    for (let i = 0; i < 8; i++) {
        const col = document.createElement('div');
        col.className = 'col-6 col-md-3';
        col.innerHTML = `<div class="product-card"><div class="skeleton" style="height:100px;border-radius:8px"></div><div class="skeleton mt-2" style="height:16px;width:60%"></div><div class="skeleton mt-2" style="height:14px;width:40%"></div></div>`;
        row.appendChild(col);
    }
}

function renderCatalog(filter, page = 1, perPage = 8) {
    showCatalogLoading();
    setTimeout(() => {
        const row = document.getElementById('catalogList');
        row.innerHTML = '';
        let items = PRODUCTS.slice();
        if (filter) items = items.filter(p => p.cat === filter);
        const total = items.length;
        const start = (page - 1) * perPage;
        const end = start + perPage;
        const paged = items.slice(start, end);
        paged.forEach(p => {
            const col = document.createElement('div');
            col.className = 'col-6 col-md-3';
            col.innerHTML = cardHtml(p);
            row.appendChild(col);
        });
        renderCatalogPagination(total, page, perPage);
    }, 300);
}

function renderCatalogPagination(total, page, perPage) {
    const container = document.getElementById('catalogPagination');
    container.innerHTML = '';
    const pages = Math.max(1, Math.ceil(total / perPage));
    if (pages <= 1) return;
    const ul = document.createElement('ul');
    ul.className = 'pagination';
    for (let i = 1; i <= pages; i++) {
        const li = document.createElement('li');
        li.className = 'page-item ' + (i === page ? 'active' : '');
        li.innerHTML = `<a class="page-link" onclick="renderCatalog(document.getElementById('filterCategory').value, ${i})">${i}</a>`;
        ul.appendChild(li);
    }
    container.appendChild(ul);
}

function applyFilter() {
    const val = document.getElementById('filterCategory').value;
    renderCatalog(val);
}

function cardHtml(p) {
    const discountHtml = p.discount ? `<div class="small-muted">Oferta</div>` : '';
    return `
        <div class="product-card" tabindex="0" aria-labelledby="p${p.id}-name">
            <img src="${p.images}" alt="${p.name}" 
                 style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px; margin-bottom: 12px; cursor: pointer;"
                 onclick="viewDetail(${p.id})">
            <h6 id="p${p.id}-name" class="mt-2 product-title">${p.name}</h6>
            <div class="small-muted">${p.cat} · ${p.sku}</div>
            <div class="d-flex justify-content-between align-items-center mt-2">
                <div class="price">${money(p.price)}</div>
                <div>
                    <button class="btn btn-ghost btn-sm" onclick="viewDetail(${p.id})">Ver</button>
                    <button class="btn btn-main btn-sm ms-1" onclick="animatedAddToCart(${p.id}, this)">Comprar</button>
                </div>
            </div>
            ${discountHtml}
        </div>
    `;
}

function openCategory(cat) {
    document.getElementById('categoryTitle').innerText = cat;
    const list = document.getElementById('categoryProducts');
    list.innerHTML = '';
    const items = PRODUCTS.filter(p => p.cat === cat);
    if (items.length === 0) list.innerHTML = '<div class="product-card">No hay productos en esta categoría</div>';
    items.forEach(p => {
        const c = document.createElement('div');
        c.className = 'col-6 col-md-3';
        c.innerHTML = cardHtml(p);
        list.appendChild(c);
    });
    openSection('categoryView');
}

function showDetailLoading() {
    document.getElementById('detailImages').innerHTML = `<div class="skeleton" style="height:260px;border-radius:10px"></div>`;
    document.getElementById('detailName').innerText = '';
    document.getElementById('detailCategory').innerText = '';
    document.getElementById('detailPrice').innerText = '';
    document.getElementById('detailDesc').innerText = '';
}

function viewDetail(id) {
    showDetailLoading();
    setTimeout(() => {
        const p = PRODUCTS.find(x => x.id === id);
        if (!p) return;
        currentProductId = id;
        document.getElementById('detailName').innerText = p.name;
        document.getElementById('breadProd').innerText = p.name;
        document.getElementById('detailCategory').innerText = p.cat;
        document.getElementById('detailPrice').innerText = money(p.price);
        document.getElementById('detailDesc').innerText = p.desc;

        const imgs = document.getElementById('detailImages');
        imgs.innerHTML = '';

        // Si 'images' es un string (una sola imagen)
        if (typeof p.images === 'string') {
            const d = document.createElement('div');
            d.className = 'carousel-item active';
            d.innerHTML = `
                <img src="${p.images}" alt="${p.name}" 
                     style="width: 100%; height: 400px; object-fit: contain; border-radius: 8px;">
            `;
            imgs.appendChild(d);
        }
        // Si 'images' es un array (múltiples imágenes)
        else if (Array.isArray(p.images)) {
            p.images.forEach((img, i) => {
                const d = document.createElement('div');
                d.className = 'carousel-item ' + (i === 0 ? 'active' : '');
                d.innerHTML = `
                    <img src="${img}" alt="${p.name} - Imagen ${i + 1}" 
                         style="width: 100%; height: 400px; object-fit: contain; border-radius: 8px;">
                `;
                imgs.appendChild(d);
            });
        }

        // 🔥 ACTUALIZAR ESTADO DEL BOTÓN DE FAVORITOS
        updateFavoriteButton(id);

        renderRelated(p);
        openSection('productDetail');

        // Inicializar carrusel de detalle
        setTimeout(() => {
            const detailCarousel = document.getElementById('detailCarousel');
            if (detailCarousel && typeof bootstrap !== 'undefined') {
                const existingInstance = bootstrap.Carousel.getInstance(detailCarousel);
                if (existingInstance) {
                    existingInstance.dispose();
                }
                new bootstrap.Carousel(detailCarousel, {
                    interval: 3000,
                    ride: 'carousel',
                    wrap: true
                });
            }
        }, 150);
    }, 300);
}

function updateFavoriteButton(id) {
    const favBtn = document.getElementById('favBtn');
    if (!favBtn) return;
    
    const isFavorite = favorites.includes(id);
    
    if (isFavorite) {
        favBtn.innerHTML = '<i class="bi bi-heart-fill"></i>';
        favBtn.classList.add('text-danger');
        favBtn.setAttribute('aria-pressed', 'true');
    } else {
        favBtn.innerHTML = '<i class="bi bi-heart"></i>';
        favBtn.classList.remove('text-danger');
        favBtn.setAttribute('aria-pressed', 'false');
    }
}

function renderRelated(p) {
    const container = document.getElementById('relatedProducts');
    container.innerHTML = '<h6>Productos relacionados</h6><div class="row g-2 mt-2"></div>';
    const row = container.querySelector('.row');
    PRODUCTS.filter(x => x.cat === p.cat && x.id !== p.id).forEach(r => {
        const c = document.createElement('div');
        c.className = 'col-4';
        c.innerHTML = `<div class="product-card text-center" style="cursor:pointer" onclick="viewDetail(${r.id})">${r.name}</div>`;
        row.appendChild(c);
    });
}

function addToCartDirect(id, qty = 1) {
    const p = PRODUCTS.find(x => x.id === id);
    if (!p) return;
    const existing = cart.find(c => c.id === id);
    if (existing) existing.qty += qty;
    else cart.push({ id: id, qty: qty });
    saveState();
    renderCart();
    toast('Producto añadido', 'success');
}

function animatedAddToCart(id, btn) {
    const rectBtn = (btn && btn.getBoundingClientRect) ? btn.getBoundingClientRect() : { left: window.innerWidth / 2, top: window.innerHeight / 2 };
    const f = document.createElement('div');
    f.className = 'fly-img';
    f.style.left = rectBtn.left + 'px';
    f.style.top = rectBtn.top + 'px';
    f.innerHTML = '<i class="bi bi-bag"></i>';
    document.body.appendChild(f);
    const cartBtn = document.querySelector('[onclick="openSection(\'cart\')"]') || document.querySelector('.btn-ghost[aria-label="Carrito"]');
    const cartRect = cartBtn ? cartBtn.getBoundingClientRect() : { left: window.innerWidth - 80, top: 20 };
    requestAnimationFrame(() => {
        f.style.transform = `translate(${cartRect.left - rectBtn.left}px,${cartRect.top - rectBtn.top}px) scale(.2)`;
        f.style.opacity = '0.0';
    });
    setTimeout(() => {
        f.remove();
        addToCartDirect(id, parseInt(document.getElementById('qtyInput')?.value || 1));
    }, 700);
}

function renderCart() {
    const cont = document.getElementById('cartList');
    cont.innerHTML = '';
    if (cart.length === 0) {
        cont.innerHTML = '<div class="product-card">El carrito está vacío</div>';
        document.getElementById('cartSubtotal').innerText = '$0.00';
        return;
    }
    let subtotal = 0;
    cart.forEach(ci => {
        const p = PRODUCTS.find(x => x.id === ci.id);
        if (!p) return;
        subtotal += p.price * ci.qty;
        const div = document.createElement('div');
        div.className = 'product-card mb-2';
        div.innerHTML = `
            <div class="d-flex align-items-center">
                <img src="${p.images}" alt="${p.name}" 
                     style="width:72px; height:72px; object-fit:cover; border-radius:8px; margin-right:12px;">
                <div class="flex-grow-1">
                    <strong>${p.name}</strong>
                    <div class="small-muted">${p.cat}</div>
                </div>
                <div class="text-end">
                    <div>${money(p.price)}</div>
                    <div class="d-flex gap-1 mt-2">
                        <input type="number" min="1" value="${ci.qty}" style="width:70px" 
                               onchange="changeQty(${ci.id},this.value)" class="form-control form-control-sm" />
                        <button class="btn btn-ghost btn-sm ms-1" onclick="removeFromCart(${ci.id})">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
        cont.appendChild(div);
    });
    document.getElementById('cartSubtotal').innerText = money(subtotal);
}

function changeQty(id, v) {
    const it = cart.find(c => c.id === id);
    if (!it) return;
    it.qty = parseInt(v);
    if (it.qty < 1) it.qty = 1;
    saveState();
    renderCart();
}

function removeFromCart(id) {
    cart = cart.filter(c => c.id !== id);
    saveState();
    renderCart();
    toast('Producto eliminado');
}

function clearCart() {
    if (!confirm('¿Vaciar carrito?')) return;
    cart = [];
    saveState();
    renderCart();
}

function toggleFavorite(id) {
    if (!id) return;
    
    const favBtn = document.getElementById('favBtn');
    
    if (favorites.includes(id)) {
        favorites = favorites.filter(x => x !== id);
        toast('Eliminado de favoritos', 'warn');
    } else {
        favorites.push(id);
        toast('Agregado a favoritos', 'success');
        
        // 🎨 Animación
        if (favBtn) {
            favBtn.classList.add('adding');
            setTimeout(() => favBtn.classList.remove('adding'), 300);
        }
    }
    
    saveState();
    updateFavoriteButton(id);
    
    const favSection = document.getElementById('favorites');
    if (favSection && !favSection.classList.contains('page-hidden')) {
        renderFavorites();
    }
}

function renderFavorites() {
    const cont = document.getElementById('favList');
    cont.innerHTML = '';
    if (favorites.length === 0) {
        cont.innerHTML = '<div class="col-12"><div class="product-card text-center py-5"><i class="bi bi-heart" style="font-size: 48px; opacity: 0.3;"></i><h5 class="mt-3">No tienes favoritos</h5><p class="small-muted">Agrega productos a favoritos para verlos aquí</p></div></div>';
        return;
    }
    favorites.forEach(id => {
        const p = PRODUCTS.find(x => x.id === id);
        if (!p) return;
        const col = document.createElement('div');
        col.className = 'col-6 col-md-3';
        col.innerHTML = `
            <div class="product-card favorite-card">
                <button class="btn btn-ghost btn-sm favorite-remove" onclick="toggleFavorite(${p.id})">
                    <i class="bi bi-x-circle"></i>
                </button>
                <img src="${p.images}" alt="${p.name}" 
                     style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px; margin-bottom: 12px; cursor: pointer;"
                     onclick="viewDetail(${p.id})">
                <h6 class="mt-2 product-title">${p.name}</h6>
                <div class="small-muted">${p.cat}</div>
                <div class="mt-2 price">${money(p.price)}</div>
                <div class="d-grid gap-2 mt-2">
                    <button class="btn btn-ghost btn-sm" onclick="viewDetail(${p.id})">Ver</button>
                    <button class="btn btn-main btn-sm" onclick="animatedAddToCart(${p.id}, this)">Comprar</button>
                </div>
            </div>
        `;
        cont.appendChild(col);
    });
}

function clearFavorites() {
    if (!confirm('¿Eliminar todos los favoritos?')) return;
    favorites = [];
    saveState();
    renderFavorites();
    toast('Favoritos eliminados');
}

document.getElementById('searchTop').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') doSearch(e.target.value);
});

function doSearch(q) {
    if (!q) return;
    const out = PRODUCTS.filter(p => p.name.toLowerCase().includes(q.toLowerCase()) || p.cat.toLowerCase().includes(q.toLowerCase()) || p.sku.toLowerCase().includes(q.toLowerCase()));
    if (out.length === 0) {
        toast('No se encontraron resultados', 'warn');
        return;
    }
    document.getElementById('catalogList').innerHTML = '';
    out.forEach(p => {
        const col = document.createElement('div');
        col.className = 'col-6 col-md-3';
        col.innerHTML = cardHtml(p);
        document.getElementById('catalogList').appendChild(col);
    });
    openSection('catalog');
}

function openCheckout() {
    if (cart.length === 0) {
        toast('Carrito vacío');
        return;
    }
    openSection('checkout');
}

function goToStep(n) {
    document.querySelectorAll('#checkoutSteps > div').forEach(d => {
        d.classList.add('page-hidden');
        d.setAttribute('aria-hidden', 'true');
    });
    document.getElementById('step' + n).classList.remove('page-hidden');
    document.getElementById('step' + n).setAttribute('aria-hidden', 'false');
}

function processCheckout() {
    const name = document.getElementById('custName').value;
    if (!name) {
        toast('Ingrese nombre', 'warn');
        return;
    }
    openSection('processing');
    setTimeout(() => {
        const orderId = 'ORD' + (Math.floor(Math.random() * 90000) + 10000);
        const total = cart.reduce((s, i) => {
            const p = PRODUCTS.find(p => p.id === i.id);
            return s + (p ? p.price * i.qty : 0);
        }, 0);
        orders.push({
            id: orderId,
            items: cart.slice(),
            total: total,
            name: name,
            date: new Date().toISOString(),
            status: 'pending'
        });
        cart = [];
        saveState();
        document.getElementById('orderId').innerText = orderId;
        openSection('confirmation');
        toast('Compra realizada', 'success');
    }, 1200);
}

function renderOrders() {
    const c = document.getElementById('ordersList');
    c.innerHTML = '';
    if (orders.length === 0) {
        c.innerHTML = '<div class="product-card text-center py-5"><i class="bi bi-bag" style="font-size: 48px; opacity: 0.3;"></i><h5 class="mt-3">No tienes pedidos</h5><p class="small-muted">Tus pedidos aparecerán aquí</p></div>';
        return;
    }
    orders.slice().reverse().forEach(o => {
        const statusClass = o.status === 'completed' ? 'status-completed' : o.status === 'processing' ? 'status-processing' : o.status === 'cancelled' ? 'status-cancelled' : 'status-pending';
        const statusText = o.status === 'completed' ? 'Completado' : o.status === 'processing' ? 'En proceso' : o.status === 'cancelled' ? 'Cancelado' : 'Pendiente';
        const d = document.createElement('div');
        d.className = 'product-card mb-2';
        d.innerHTML = `<div class='d-flex justify-content-between align-items-start'><div class='flex-grow-1'><div class='d-flex align-items-center gap-2 mb-2'><strong>${o.id}</strong><span class='order-status ${statusClass}'>${statusText}</span></div><div class='small-muted'><i class="bi bi-person me-1"></i>${o.name}</div><div class='small-muted'><i class="bi bi-calendar me-1"></i>${new Date(o.date).toLocaleDateString()} ${new Date(o.date).toLocaleTimeString()}</div><div class='small-muted'><i class="bi bi-box me-1"></i>${o.items.length} producto(s)</div></div><div class='text-end'><h5 class='mb-2'>${money(o.total)}</h5><button class='btn btn-ghost btn-sm' onclick="viewOrder('${o.id}')"><i class="bi bi-eye me-1"></i>Ver detalles</button></div></div>`;
        c.appendChild(d);
    });
}

function viewOrder(id) {
    const o = orders.find(x => x.id === id);
    if (!o) return;
    const statusClass = o.status === 'completed' ? 'status-completed' : o.status === 'processing' ? 'status-processing' : o.status === 'cancelled' ? 'status-cancelled' : 'status-pending';
    const statusText = o.status === 'completed' ? 'Completado' : o.status === 'processing' ? 'En proceso' : o.status === 'cancelled' ? 'Cancelado' : 'Pendiente';
    let html = `<div class='d-flex justify-content-between align-items-center mb-3'><h5>Pedido ${o.id}</h5><span class='order-status ${statusClass}'>${statusText}</span></div><div class='mb-3'><div class='small-muted'>Cliente: ${o.name}</div><div class='small-muted'>Fecha: ${new Date(o.date).toLocaleDateString()} ${new Date(o.date).toLocaleTimeString()}</div></div><h6>Productos:</h6><ul class='list-unstyled'>`;
    o.items.forEach(it => {
        const p = PRODUCTS.find(pp => pp.id === it.id);
        if (p) html += `<li class='mb-2'><div class='d-flex justify-content-between'><span>${it.qty} x ${p.name}</span><span>${money(p.price * it.qty)}</span></div></li>`;
    });
    html += `</ul><hr><div class='d-flex justify-content-between align-items-center'><h5>Total:</h5><h5>${money(o.total)}</h5></div>`;
    document.getElementById('ordersList').innerHTML = `<div class='product-card'>${html}<div class='mt-3'><button class='btn btn-ghost' onclick="renderOrders()"><i class="bi bi-arrow-left me-1"></i>Volver</button></div></div>`;
}

function checkLoginAndOpen() {
    if (!currentUser) {
        openSection('login');
    } else {
        if (currentUser.isAdmin) {
            openSection('login');
        } else {
            openSection('account');
        }
    }
}

function doLoginPage() {
    const email = document.getElementById('loginEmailPage').value.trim();
    const pass = document.getElementById('loginPassPage').value;
    const remember = document.getElementById('rememberMe').checked;

    if (!email) {
        toast('Por favor ingresa tu correo electrónico', 'warn');
        document.getElementById('loginEmailPage').focus();
        return;
    }

    if (!isValidEmail(email)) {
        toast('Por favor ingresa un correo válido', 'warn');
        document.getElementById('loginEmailPage').focus();
        return;
    }

    if (!pass) {
        toast('Por favor ingresa tu contraseña', 'warn');
        document.getElementById('loginPassPage').focus();
        return;
    }

    const user = users.find(u => u.email === email && u.password === pass);

    if (!user) {
        toast('Correo o contraseña incorrectos', 'warn');
        return;
    }

    if (user.isAdmin) {
        toast('Redirigiendo a Panel de Administración...', 'success');
        document.getElementById('loginEmailPage').value = '';
        document.getElementById('loginPassPage').value = '';
        window.location.href = 'admin/admin.html';
        return;
    }

    user.lastLogin = new Date().toISOString();
    currentUser = user;

    if (remember) {
        localStorage.setItem('rememberUser', JSON.stringify({
            email: email,
            timestamp: Date.now()
        }));
    } else {
        localStorage.removeItem('rememberUser');
    }

    saveState();
    toast('¡Bienvenido ' + user.name + '!', 'success');
    openSection('account');

    document.getElementById('loginEmailPage').value = '';
    document.getElementById('loginPassPage').value = '';
}

function doRegister() {
    const name = document.getElementById('regName').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const pass = document.getElementById('regPass').value;
    const passConfirm = document.getElementById('regPassConfirm').value;
    const acceptTerms = document.getElementById('acceptTerms').checked;

    if (!name) {
        toast('Por favor ingresa tu nombre completo', 'warn');
        document.getElementById('regName').focus();
        return;
    }

    if (name.length < 3) {
        toast('El nombre debe tener al menos 3 caracteres', 'warn');
        return;
    }

    if (!email) {
        toast('Por favor ingresa tu correo electrónico', 'warn');
        document.getElementById('regEmail').focus();
        return;
    }

    if (!isValidEmail(email)) {
        toast('Por favor ingresa un correo válido', 'warn');
        return;
    }

    if (!pass) {
        toast('Por favor ingresa una contraseña', 'warn');
        document.getElementById('regPass').focus();
        return;
    }

    if (pass.length < 8) {
        toast('La contraseña debe tener al menos 8 caracteres', 'warn');
        return;
    }

    if (!passConfirm) {
        toast('Por favor confirma tu contraseña', 'warn');
        document.getElementById('regPassConfirm').focus();
        return;
    }

    if (pass !== passConfirm) {
        toast('Las contraseñas no coinciden', 'warn');
        return;
    }

    if (!acceptTerms) {
        toast('Debes aceptar los términos y condiciones', 'warn');
        return;
    }

    if (users.find(u => u.email === email)) {
        toast('Este correo ya está registrado', 'warn');
        return;
    }

    const newUser = {
        id: users.length + 1,
        name: name,
        email: email,
        password: pass,
        provider: 'email',
        isAdmin: false,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
    };

    users.push(newUser);
    currentUser = newUser;
    saveState();

    toast('¡Cuenta creada exitosamente!', 'success');
    openSection('account');

    document.getElementById('regName').value = '';
    document.getElementById('regEmail').value = '';
    document.getElementById('regPass').value = '';
    document.getElementById('regPassConfirm').value = '';
    document.getElementById('acceptTerms').checked = false;
}

function doLogout() {
    if (!confirm('¿Cerrar sesión?')) return;
    currentUser = null;
    saveState();
    toast('Sesión cerrada exitosamente', 'success');
    openSection('home');
}

function saveProfile() {
    const name = document.getElementById('profName').value;
    const email = document.getElementById('profEmail').value;
    const pass = document.getElementById('profPass').value;
    if (!name || !email) {
        toast('Complete los campos obligatorios', 'warn');
        return;
    }
    if (currentUser) {
        currentUser.name = name;
        currentUser.email = email;
        if (pass) currentUser.password = pass;
        const userIndex = users.findIndex(u => u.id === currentUser.id);
        if (userIndex !== -1) users[userIndex] = currentUser;
        saveState();
    }
    toast('Perfil guardado', 'success');
}

function showAdminPanel(panel) {
    document.querySelectorAll('.admin-sidebar a').forEach(a => a.classList.remove('active'));
    if (panel === 'products') {
        document.getElementById('adminLinkProducts').classList.add('active');
        renderAdminProducts();
    } else if (panel === 'stats') {
        document.getElementById('adminLinkStats').classList.add('active');
        renderAdminStats();
    } else if (panel === 'adminOrders') {
        document.getElementById('adminLinkOrders').classList.add('active');
        renderAdminOrders();
    }
}

function renderAdminProducts() {
    const content = document.getElementById('adminContent');
    content.innerHTML = `<div class="product-card">
        <div class="d-flex justify-content-between align-items-center mb-3">
            <h4>Gestión de Productos</h4>
            <button class="btn btn-main" onclick="openProductModal()">
                <i class="bi bi-plus-circle me-2"></i>Nuevo Producto
            </button>
        </div>
        <div class="table-responsive">
            <table class="table" id="adminProductsTable">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Categoría</th>
                        <th>SKU</th>
                        <th>Precio</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody id="adminProductsList"></tbody>
            </table>
        </div>
    </div>`;

    const tbody = document.getElementById('adminProductsList');
    tbody.innerHTML = '';
    PRODUCTS.forEach(p => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${p.id}</td><td>${p.name}</td><td>${p.cat}</td><td>${p.sku}</td><td>${money(p.price)}</td><td><button class='btn btn-ghost btn-sm me-1' onclick='editProduct(${p.id})'><i class="bi bi-pencil"></i></button><button class='btn btn-ghost btn-sm' onclick='deleteProduct(${p.id})'><i class="bi bi-trash"></i></button></td>`;
        tbody.appendChild(tr);
    });
}

function renderAdminStats() {
    const totalProducts = PRODUCTS.length;
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
    const content = document.getElementById('adminContent');
    content.innerHTML = `<div class='product-card'><h4 class='mb-4'>Estadísticas</h4><div class='row g-3'><div class='col-md-4'><div class='product-card text-center'><h2>${totalProducts}</h2><p class='small-muted mb-0'>Total Productos</p></div></div><div class='col-md-4'><div class='product-card text-center'><h2>${totalOrders}</h2><p class='small-muted mb-0'>Total Pedidos</p></div></div><div class='col-md-4'><div class='product-card text-center'><h2>${money(totalRevenue)}</h2><p class='small-muted mb-0'>Ingresos Totales</p></div></div></div></div>`;
}

function renderAdminOrders() {
    const content = document.getElementById('adminContent');
    content.innerHTML = `<div class='product-card'><h4 class='mb-3'>Gestión de Pedidos</h4><div class='table-responsive'><table class='table'><thead><tr><th>ID</th><th>Cliente</th><th>Fecha</th><th>Total</th><th>Estado</th><th>Acciones</th></tr></thead><tbody id='adminOrdersList'></tbody></table></div></div>`;
    const tbody = document.getElementById('adminOrdersList');
    orders.slice().reverse().forEach(o => {
        const statusClass = o.status === 'completed' ? 'status-completed' : o.status === 'processing' ? 'status-processing' : o.status === 'cancelled' ? 'status-cancelled' : 'status-pending';
        const statusText = o.status === 'completed' ? 'Completado' : o.status === 'processing' ? 'En proceso' : o.status === 'cancelled' ? 'Cancelado' : 'Pendiente';
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${o.id}</td><td>${o.name}</td><td>${new Date(o.date).toLocaleDateString()}</td><td>${money(o.total)}</td><td><span class='order-status ${statusClass}'>${statusText}</span></td><td><select class='form-select form-select-sm' onchange='changeOrderStatus("${o.id}", this.value)'><option value='pending' ${o.status === 'pending' ? 'selected' : ''}>Pendiente</option><option value='processing' ${o.status === 'processing' ? 'selected' : ''}>En proceso</option><option value='completed' ${o.status === 'completed' ? 'selected' : ''}>Completado</option><option value='cancelled' ${o.status === 'cancelled' ? 'selected' : ''}>Cancelado</option></select></td>`;
        tbody.appendChild(tr);
    });
}

function changeOrderStatus(orderId, newStatus) {
    const order = orders.find(o => o.id === orderId);
    if (order) {
        order.status = newStatus;
        saveState();
        toast('Estado actualizado', 'success');
    }
}

function openProductModal(id = null) {
    const modal = new bootstrap.Modal(document.getElementById('productModal'));
    const select = document.getElementById('prodCat');
    select.innerHTML = '';

    CATEGORIES.forEach(c => {
        const opt = document.createElement('option');
        opt.value = c.name;
        opt.text = c.name;
        select.add(opt);
    });

    if (id) {
        const p = PRODUCTS.find(x => x.id === id);
        if (p) {
            document.getElementById('productModalTitle').innerText = 'Editar Producto';
            document.getElementById('editProductId').value = p.id;
            document.getElementById('prodName').value = p.name;
            document.getElementById('prodCat').value = p.cat;
            document.getElementById('prodSku').value = p.sku;
            document.getElementById('prodPrice').value = p.price;
            document.getElementById('prodDesc').value = p.desc;
            document.getElementById('prodFeatured').checked = p.featured;
            document.getElementById('prodBest').checked = p.best;
            document.getElementById('prodDiscount').checked = p.discount;
        }
    } else {
        document.getElementById('productModalTitle').innerText = 'Nuevo Producto';
        document.getElementById('editProductId').value = '';
        document.getElementById('prodName').value = '';
        document.getElementById('prodCat').value = CATEGORIES[0].name;  // 👈 CAMBIO AQUÍ
        document.getElementById('prodSku').value = '';
        document.getElementById('prodPrice').value = '';
        document.getElementById('prodDesc').value = '';
        document.getElementById('prodFeatured').checked = false;
        document.getElementById('prodBest').checked = false;
        document.getElementById('prodDiscount').checked = false;
    }
    modal.show();
}

function saveProduct() {
    const editId = document.getElementById('editProductId').value;
    const name = document.getElementById('prodName').value;
    const cat = document.getElementById('prodCat').value;
    const sku = document.getElementById('prodSku').value;
    const price = parseFloat(document.getElementById('prodPrice').value);
    const desc = document.getElementById('prodDesc').value;
    const featured = document.getElementById('prodFeatured').checked;
    const best = document.getElementById('prodBest').checked;
    const discount = document.getElementById('prodDiscount').checked;

    if (!name || !sku || !price) {
        toast('Complete los campos obligatorios', 'warn');
        return;
    }

    if (editId) {
        const p = PRODUCTS.find(x => x.id == editId);
        if (p) {
            p.name = name;
            p.cat = cat;
            p.sku = sku;
            p.price = price;
            p.desc = desc;
            p.featured = featured;
            p.best = best;
            p.discount = discount;
            toast('Producto actualizado', 'success');
        }
    } else {
        const newId = PRODUCTS.length > 0 ? Math.max(...PRODUCTS.map(p => p.id)) + 1 : 1;
        PRODUCTS.push({
            id: newId,
            name: name,
            cat: cat,
            sku: sku,
            price: price,
            desc: desc,
            images: [0],
            featured: featured,
            best: best,
            discount: discount
        });
        toast('Producto creado', 'success');
    }

    saveState();
    renderAdminProducts();
    renderCarousels();
    const modal = bootstrap.Modal.getInstance(document.getElementById('productModal'));
    modal.hide();
}

function editProduct(id) {
    openProductModal(id);
}

function deleteProduct(id) {
    if (!confirm('¿Eliminar este producto?')) return;
    PRODUCTS = PRODUCTS.filter(p => p.id !== id);
    saveState();
    renderAdminProducts();
    renderCarousels();
    toast('Producto eliminado');
}

function openSection(id) {
    document.querySelectorAll('.spa-section').forEach(s => {
        s.classList.add('page-hidden');
        s.setAttribute('aria-hidden', 'true');
    });
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.remove('page-hidden');
    el.setAttribute('aria-hidden', 'false');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (id === 'catalog') renderCatalog();
    if (id === 'offers') renderOffers();  // 👈 ESTA LÍNEA DEBE ESTAR
    if (id === 'orders') renderOrders();
    if (id === 'favorites') renderFavorites();
    if (id === 'profile' && currentUser) {
        document.getElementById('profName').value = currentUser.name;
        document.getElementById('profEmail').value = currentUser.email;
        document.getElementById('profPass').value = '';
    }
    if (id === 'admin') {
        if (!currentUser || !currentUser.isAdmin) {
            toast('Acceso denegado', 'warn');
            openSection('home');
            return;
        }
        showAdminPanel('products');
    }
}

function renderOffers() {
    console.log('=== RENDERIZANDO OFERTAS ===');
    
    const c = document.getElementById('offersList');
    const h = document.getElementById('offersHome');
    
    if (!c) {
        console.error('ERROR: No se encontró elemento offersList');
        return;
    }
    
    c.innerHTML = '';
    const discounted = PRODUCTS.filter(p => p.discount);
    
    console.log('Productos en oferta:', discounted.length);
    console.log('Productos:', discounted);
    
    if (discounted.length === 0) {
        c.innerHTML = '<div class="col-12"><div class="product-card text-center py-5"><i class="bi bi-tag" style="font-size: 48px; opacity: 0.3;"></i><h5 class="mt-3">No hay ofertas disponibles</h5><p class="small-muted">Pronto tendremos promociones especiales</p></div></div>';
        if (h) h.innerHTML = '';
        return;
    }
    
    // Renderizar ofertas en la página de Ofertas
    discounted.forEach(p => {
        const col = document.createElement('div');
        col.className = 'col-6 col-md-4';
        col.innerHTML = `
            <div class='product-card'>
                <img src="${p.images}" 
                     alt="${p.name}" 
                     style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px; margin-bottom: 12px; cursor: pointer;"
                     onclick="viewDetail(${p.id})"
                     onerror="this.style.background='#333'; this.style.display='flex'; this.style.alignItems='center'; this.style.justifyContent='center'; this.innerHTML='<span style=color:#999>Sin imagen</span>';">
                <h6 class='mt-2'>${p.name}</h6>
                <div class='small-muted'>${p.cat}</div>
                <div class='mt-2 d-flex align-items-center gap-2'>
                    <strong class="price">${money(p.price * 0.9)}</strong> 
                    <span class='small-muted' style='text-decoration:line-through'>${money(p.price)}</span>
                    <span class="badge bg-danger">-10%</span>
                </div>
                <div class='mt-2'>
                    <button class='btn btn-main btn-sm w-100' onclick='viewDetail(${p.id})'>Ver detalle</button>
                </div>
            </div>
        `;
        c.appendChild(col);
    });

    // Renderizar ofertas en la página de Inicio (máximo 3)
    if (h) {
        h.innerHTML = '';
        discounted.slice(0, 3).forEach(p => {
            const col = document.createElement('div');
            col.className = 'col-6 col-md-4';
            col.innerHTML = `
                <div class='product-card' onclick='viewDetail(${p.id})' style='cursor:pointer'>
                    <img src="${p.images}" 
                         alt="${p.name}" 
                         style="width: 100%; height: 150px; object-fit: cover; border-radius: 8px; margin-bottom: 12px;"
                         onerror="this.style.background='#333'; this.style.display='flex'; this.style.alignItems='center'; this.style.justifyContent='center'; this.innerHTML='<span style=color:#999>Sin imagen</span>';">
                    <div class='d-flex justify-content-between align-items-center'>
                        <div>
                            <strong>${p.name}</strong>
                            <div class='small-muted'>${p.cat}</div>
                        </div>
                        <div class='text-end'>
                            <strong class='price'>${money(p.price * 0.9)}</strong>
                            <div class='small-muted' style='text-decoration:line-through'>${money(p.price)}</div>
                        </div>
                    </div>
                </div>
            `;
            h.appendChild(col);
        });
    }
    
    console.log('Ofertas renderizadas correctamente');
}

function renderCartCount() {
    document.getElementById('cartCount').innerText = cart.reduce((s, i) => s + i.qty, 0);
}

function initCategoryGrid() {
    const grid = document.getElementById('categoryGrid');
    grid.innerHTML = '';
    CATEGORIES.forEach(c => {
        const col = document.createElement('div');
        col.className = 'col-6 col-md-3';
        col.innerHTML = `
            <div class="product-card text-center" onclick="openCategory('${c.name}')" style="cursor:pointer">
                <img src="${c.image}" alt="${c.name}" 
                     style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px; margin-bottom: 12px;">
                <h6 class="mt-2">${c.name}</h6>
                <button class="btn btn-main btn-sm w-100 mt-2" onclick="event.stopPropagation(); openCategory('${c.name}')">
                    Ver productos
                </button>
            </div>
        `;
        grid.appendChild(col);
    });
}

function togglePolicyMenu() {
    document.getElementById('policyMenu').classList.toggle('open');
}

function showPolicy(type, el) {
    document.querySelectorAll('#policyMenu a').forEach(a => a.classList.remove('active'));
    el.classList.add('active');

    const title = document.getElementById('policyTitle');
    const body = document.getElementById('policyBody');

    const policies = {
        terms: {
            title: 'Términos y Condiciones',
            content: '<h5>1. ACEPTACIÓN DE TÉRMINOS</h5><p class="small-muted">Al acceder y utilizar el sitio web de JC Repuestos, usted acepta estos Términos y Condiciones de Uso.</p><h5>2. USO DEL SITIO WEB</h5><p class="small-muted">Este sitio web es propiedad de JC Repuestos SA. El uso del sitio está sujeto a las leyes de Costa Rica.</p><h5>3. MODIFICACIONES</h5><p class="small-muted">Nos reservamos el derecho de modificar estos términos en cualquier momento.</p>'
        },
        use: {
            title: 'Uso del Sitio',
            content: '<h5>USO PERMITIDO</h5><p class="small-muted">Este sitio está diseñado para uso personal y comercial legítimo. Está prohibido el uso para actividades ilegales.</p><h5>RESPONSABILIDAD DEL USUARIO</h5><p class="small-muted">El usuario es responsable de mantener la confidencialidad de su cuenta.</p>'
        },
        prices: {
            title: 'Productos y Precios',
            content: '<h5>PRECIOS</h5><p class="small-muted">Todos los precios están en dólares e incluyen IVA. Los precios pueden variar sin previo aviso.</p><h5>DISPONIBILIDAD</h5><p class="small-muted">Los productos están sujetos a disponibilidad de inventario.</p>'
        },
        orders: {
            title: 'Pedidos y Pagos',
            content: '<h5>PROCESO DE PEDIDO</h5><p class="small-muted">Los pedidos deben ser pagados antes del envío. Aceptamos tarjetas de crédito y transferencias.</p><h5>CONFIRMACIÓN</h5><p class="small-muted">Recibirá un correo de confirmación después de realizar su pedido.</p>'
        },
        shipping: {
            title: 'Política de Entrega',
            content: '<h5>TIEMPOS DE ENTREGA</h5><p class="small-muted">GAM: 24-48 horas. Resto del país: 3-5 días hábiles.</p><h5>COSTOS</h5><p class="small-muted">El costo de envío varía según ubicación y peso del paquete.</p>'
        },
        ip: {
            title: 'Propiedad Intelectual',
            content: '<h5>DERECHOS DE AUTOR</h5><p class="small-muted">Todo el contenido de este sitio es propiedad de JC Repuestos SA.</p><h5>USO DE MARCAS</h5><p class="small-muted">Las marcas comerciales mostradas son propiedad de sus respectivos dueños.</p>'
        },
        liability: {
            title: 'Limitación de Responsabilidad',
            content: '<h5>GARANTÍA</h5><p class="small-muted">Los productos tienen garantía del fabricante según especificaciones.</p><h5>LIMITACIONES</h5><p class="small-muted">No nos hacemos responsables por daños indirectos o consecuenciales.</p>'
        },
        changes: {
            title: 'Modificaciones',
            content: '<h5>CAMBIOS EN POLÍTICAS</h5><p class="small-muted">Nos reservamos el derecho de modificar estas políticas en cualquier momento.</p><h5>NOTIFICACIÓN</h5><p class="small-muted">Los cambios serán publicados en esta página.</p>'
        },
        law: {
            title: 'Ley Aplicable',
            content: '<h5>JURISDICCIÓN</h5><p class="small-muted">Estos términos se rigen por las leyes de Costa Rica.</p><h5>RESOLUCIÓN DE DISPUTAS</h5><p class="small-muted">Cualquier disputa será resuelta en los tribunales de San José, Costa Rica.</p>'
        }
    };

    if (policies[type]) {
        title.innerText = policies[type].title;
        body.innerHTML = policies[type].content;
    }

    const menu = document.getElementById('policyMenu');
    if (menu.classList.contains('open')) {
        menu.classList.remove('open');
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function togglePasswordVisibility(inputId) {
    const input = document.getElementById(inputId);
    const icon = document.getElementById(inputId + '-icon');

    if (input.type === 'password') {
        input.type = 'text';
        icon.className = 'bi bi-eye-slash';
    } else {
        input.type = 'password';
        icon.className = 'bi bi-eye';
    }
}

function showForgotPassword() {
    const email = prompt('Ingresa tu correo electrónico para recuperar tu contraseña:');

    if (!email) return;

    if (!isValidEmail(email)) {
        toast('Por favor ingresa un correo válido', 'warn');
        return;
    }

    const user = users.find(u => u.email === email);

    if (!user) {
        toast('No encontramos una cuenta con ese correo', 'warn');
        return;
    }

    toast('Se ha enviado un enlace de recuperación a tu correo', 'success');
}

function checkRememberedUser() {
    const remembered = localStorage.getItem('rememberUser');

    if (remembered) {
        try {
            const data = JSON.parse(remembered);
            const daysSince = (Date.now() - data.timestamp) / (1000 * 60 * 60 * 24);

            if (daysSince < 30) {
                const emailInput = document.getElementById('loginEmailPage');
                if (emailInput) {
                    emailInput.value = data.email;
                    document.getElementById('rememberMe').checked = true;
                }
            } else {
                localStorage.removeItem('rememberUser');
            }
        } catch (e) {
            localStorage.removeItem('rememberUser');
        }
    }
}

function loginWithGoogle() {
    toast('Conectando con Google...', 'default');

    setTimeout(() => {
        const googleUser = {
            id: 'google_' + Date.now(),
            name: 'Usuario de Google',
            email: 'usuario@gmail.com',
            provider: 'google',
            profilePicture: null,
            isAdmin: false,
            createdAt: new Date().toISOString()
        };

        let existingUser = users.find(u => u.email === googleUser.email);

        if (existingUser) {
            existingUser.provider = 'google';
            existingUser.lastLogin = new Date().toISOString();
            currentUser = existingUser;
        } else {
            googleUser.id = users.length + 1;
            users.push(googleUser);
            currentUser = googleUser;
        }

        saveState();
        toast('Sesión iniciada con Google', 'success');
        openSection('account');
    }, 1500);
}

function loginWithFacebook() {
    toast('Conectando con Facebook...', 'default');

    setTimeout(() => {
        const facebookUser = {
            id: 'facebook_' + Date.now(),
            name: 'Usuario de Facebook',
            email: 'usuario@facebook.com',
            provider: 'facebook',
            profilePicture: null,
            isAdmin: false,
            createdAt: new Date().toISOString()
        };

        let existingUser = users.find(u => u.email === facebookUser.email);

        if (existingUser) {
            existingUser.provider = 'facebook';
            existingUser.lastLogin = new Date().toISOString();
            currentUser = existingUser;
        } else {
            facebookUser.id = users.length + 1;
            users.push(facebookUser);
            currentUser = facebookUser;
        }

        saveState();
        toast('Sesión iniciada con Facebook', 'success');
        openSection('account');
    }, 1500);
}

function registerWithGoogle() {
    loginWithGoogle();
}

function registerWithFacebook() {
    loginWithFacebook();
}

function initApp() {
    applyTheme();
    renderCarousels();
    populateFilters();
    renderCatalog();
    renderOffers();
    renderCart();
    renderFavorites();
    renderCartCount();
    initCategoryGrid();
    checkRememberedUser();

    document.getElementById('catalogSearch')?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') applyFilter();
    });

    if (users.length === 0) {
        users.push({
            id: 1,
            name: 'Administrador',
            email: 'admin@mjc.com',
            password: 'admin123',
            isAdmin: true
        });
        saveState();
    }

    setTimeout(() => {
        initializeCarousels();
    }, 300);
}

document.addEventListener('DOMContentLoaded', function () {
    const loginEmail = document.getElementById('loginEmailPage');
    const loginPass = document.getElementById('loginPassPage');

    if (loginEmail) {
        loginEmail.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                document.getElementById('loginPassPage').focus();
            }
        });
    }

    if (loginPass) {
        loginPass.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                doLoginPage();
            }
        });
    }
});

window.addEventListener('resize', () => {
    renderCarousels();
});

// Exportar funciones globales
window.openSection = openSection;
window.openCategory = openCategory;
window.viewDetail = viewDetail;
window.animatedAddToCart = animatedAddToCart;
window.addToCartDirect = addToCartDirect;
window.toggleFavorite = toggleFavorite;
window.clearCart = clearCart;
window.clearFavorites = clearFavorites;
window.openCheckout = openCheckout;
window.processCheckout = processCheckout;
window.changeQty = changeQty;
window.removeFromCart = removeFromCart;
window.doSearch = doSearch;
window.renderOrders = renderOrders;
window.viewOrder = viewOrder;
window.saveProfile = saveProfile;
window.renderCartCount = renderCartCount;
window.renderFavorites = renderFavorites;
window.showPolicy = showPolicy;
window.togglePolicyMenu = togglePolicyMenu;
window.checkLoginAndOpen = checkLoginAndOpen;
window.doLoginPage = doLoginPage;
window.doRegister = doRegister;
window.doLogout = doLogout;
window.showAdminPanel = showAdminPanel;
window.openProductModal = openProductModal;
window.saveProduct = saveProduct;
window.editProduct = editProduct;
window.deleteProduct = deleteProduct;
window.changeOrderStatus = changeOrderStatus;
window.goToStep = goToStep;
window.applyFilter = applyFilter;
window.renderCatalog = renderCatalog;
window.loginWithGoogle = loginWithGoogle;
window.loginWithFacebook = loginWithFacebook;
window.registerWithGoogle = registerWithGoogle;
window.registerWithFacebook = registerWithFacebook;
window.togglePasswordVisibility = togglePasswordVisibility;
window.showForgotPassword = showForgotPassword;
window.initializeCarousels = initializeCarousels;

// Iniciar la aplicación
initApp();
