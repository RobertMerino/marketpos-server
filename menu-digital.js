// ============================================ //
// VARIABLES GLOBALES                           //
// ============================================ //
let cart = [];
let activeCategory = 'entradas';
let selectedType = 'mesa';
let clienteData = null;

// Variables para sabores
let saborSeleccionado = [];
let currentProduct = null;
let maxSaboresPermitidos = 0;
let minSaboresPermitidos = 1;

// ============================================ //
// FUNCIÓN PARA VERIFICAR STOCK                 //
// ============================================ //
function verificarStock(productoNombre, cantidadSolicitada) {
    const inventarioGuardado = localStorage.getItem('tito_inventario');
    if (!inventarioGuardado) {
        return { disponible: true, stock: 999 };
    }
    
    const inventario = JSON.parse(inventarioGuardado);
    const stockDisponible = inventario[productoNombre] || 0;
    
    if (cantidadSolicitada > stockDisponible) {
        return { 
            disponible: false, 
            stock: stockDisponible,
            faltante: cantidadSolicitada - stockDisponible
        };
    }
    
    return { disponible: true, stock: stockDisponible };
}

// ============================================ //
// FUNCIÓN PARA MOSTRAR ALERTA DE STOCK         //
// ============================================ //
function mostrarAlertaStock(productoNombre) {
    const overlay = document.createElement('div');
    overlay.className = 'stock-alert-overlay';
    overlay.id = 'stockAlertOverlay';
    
    const modal = document.createElement('div');
    modal.className = 'stock-alert-modal';
    modal.innerHTML = `
        <div class="stock-alert-icon">😔</div>
        <h3>¡Lo sentimos!</h3>
        <p>No disponemos de <strong>${productoNombre}</strong> en este momento.</p>
        <p class="stock-alert-sub">Mil disculpas por las molestias.</p>
        <button class="stock-alert-btn" onclick="cerrarAlertaStock()">Entendido</button>
    `;
    
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    document.body.classList.add('no-scroll');
    
    if (navigator.vibrate) navigator.vibrate(50);
}

function cerrarAlertaStock() {
    const overlay = document.getElementById('stockAlertOverlay');
    if (overlay) {
        overlay.classList.add('closing');
        setTimeout(() => {
            overlay.remove();
            document.body.classList.remove('no-scroll');
        }, 300);
    }
}

// ============================================ //
// DATOS DEL MENÚ                               //
// ============================================ //
const categories = [
    { key: 'entradas', label: '🥣 Entradas' },
    { key: 'sopas', label: '🍲 Sopas' },
    { key: 'hamburguesas', label: '🍔 Hamburguesas' },
    { key: 'cortes', label: '🥩 Cortes' },
    { key: 'alitas', label: '🍗 Alitas' },
    { key: 'parrilla', label: '🔥 Parrilla' },
    { key: 'extras', label: '➕ Extras' },
    { key: 'bebidas', label: '🥤 Bebidas' }
];

function getMenuData() {
    return [
        // ENTRADAS
        { 
            id: 1, 
            nombre: "LOCRITO", 
            precio: 8.20, 
            categoria: "entradas", 
            emoji: "🥣", 
            img: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=200", 
            desc: "Tradicional sopa de papas con aguacate y queso fresco, ideal para nostalgia.",
            subcategoria: "SOPAS"
        },
        { 
            id: 2, 
            nombre: "GULASH HÚNGARO", 
            precio: 10.76, 
            categoria: "entradas", 
            emoji: "🍲", 
            img: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=200", 
            desc: "Estofado húngaro de cocción lenta con crema agrícola, servido con arroz blanco.",
            subcategoria: "SOPAS"
        },
        
        // SOPAS
        { 
            id: 3, 
            nombre: "CREMA DE CAMARONES", 
            precio: 9.50, 
            categoria: "sopas", 
            emoji: "🍤", 
            img: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=200", 
            desc: "Sopa cremosa de camarones con un toque de jengibre y coco.",
            subcategoria: "SOPAS"
        },
        { 
            id: 4, 
            nombre: "SOPA DE TORTILLA", 
            precio: 7.80, 
            categoria: "sopas", 
            emoji: "🌮", 
            img: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=200", 
            desc: "Caldo de pollo con tortilla frita, aguacate, queso y crema.",
            subcategoria: "SOPAS"
        },
        
        // HAMBURGUESAS
        { id: 5, nombre: "Brasa Clásica", precio: 6.50, categoria: "hamburguesas", emoji: "🍔", img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=85", desc: "Carne al carbón, queso cheddar, lechuga, tomate y salsa de la casa." },
        { id: 6, nombre: "Brasa Doble", precio: 8.90, categoria: "hamburguesas", emoji: "🔥", img: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?auto=format&fit=crop&w=800&q=85", desc: "Doble carne al carbón, doble cheddar, tocino crujiente y salsa BBQ." },
        { id: 7, nombre: "BBQ Bacon", precio: 7.90, categoria: "hamburguesas", emoji: "🥓", img: "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?auto=format&fit=crop&w=800&q=85", desc: "Carne al carbón, queso cheddar, tocino, cebolla caramelizada y BBQ." },
        
        // ALITAS CON CONFIGURACIÓN DE SABORES
        { 
            id: 8, 
            nombre: "4 ALITAS", 
            precio: 6.00, 
            categoria: "alitas", 
            emoji: "🍗", 
            img: "https://images.unsplash.com/photo-1605710379250-f332254b96de?w=200", 
            desc: "8 piezas · Elige 1-2 sabores",
            piezas: 8,
            saboresMin: 1,
            saboresMax: 2
        },
        { 
            id: 9, 
            nombre: "8 ALITAS", 
            precio: 10.00, 
            categoria: "alitas", 
            emoji: "🍗", 
            img: "https://images.unsplash.com/photo-1605710379250-f332254b96de?w=200", 
            desc: "16 piezas · Elige 2-3 sabores",
            piezas: 16,
            saboresMin: 2,
            saboresMax: 3
        },
        { 
            id: 10, 
            nombre: "12 ALITAS", 
            precio: 14.00, 
            categoria: "alitas", 
            emoji: "🍗", 
            img: "https://images.unsplash.com/photo-1605710379250-f332254b96de?w=200", 
            desc: "24 piezas · Elige 2-4 sabores",
            piezas: 24,
            saboresMin: 2,
            saboresMax: 4
        },
        { 
            id: 11, 
            nombre: "15 ALITAS", 
            precio: 16.00, 
            categoria: "alitas", 
            emoji: "🍗", 
            img: "https://images.unsplash.com/photo-1605710379250-f332254b96de?w=200", 
            desc: "30 piezas · Elige 2-4 sabores",
            piezas: 30,
            saboresMin: 2,
            saboresMax: 4
        },
        { 
            id: 12, 
            nombre: "20 ALITAS", 
            precio: 21.00, 
            categoria: "alitas", 
            emoji: "🍗", 
            img: "https://images.unsplash.com/photo-1605710379250-f332254b96de?w=200", 
            desc: "40 piezas · Elige 3-5 sabores",
            piezas: 40,
            saboresMin: 3,
            saboresMax: 5
        },
        
        // CORTES
        { id: 13, nombre: "PICAÑA", precio: 10.00, categoria: "cortes", emoji: "🥩", img: "https://images.unsplash.com/photo-1544025162-d76694265947?w=200", desc: "+ Chorizo, Ensalada, Chimichurri + Papas Tito" },
        { id: 14, nombre: "BIFE DE CHORIZO", precio: 10.00, categoria: "cortes", emoji: "🥩", img: "https://images.unsplash.com/photo-1600891964092-4316c288032e?w=200", desc: "+ Chorizo, Ensalada, Chimichurri + Papas Tito" },
        
        // PARRILLA
        { id: 15, nombre: "SUPER PICADITA", precio: 7.00, categoria: "parrilla", emoji: "🎯", img: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=200", desc: "Pollo, Lomo, Doble chorizo, Cuero, Chimichurri + Papas Tito" },
        { id: 16, nombre: "PARRILLADA TITO", precio: 9.00, categoria: "parrilla", emoji: "🔥", img: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=200", desc: "Pollo, Lomo, Chuleta, Triple Chorizo, Cuero, Ensalada, Chimichurri + Papas Tito" },
        
        // EXTRAS
        { id: 17, nombre: "PAPAS TITO", precio: 1.50, categoria: "extras", emoji: "🍟", img: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=200", desc: "Papas fritas crujientes" },
        { id: 18, nombre: "CHORIZO PAISA", precio: 1.50, categoria: "extras", emoji: "🌭", img: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=200", desc: "" },
        { id: 19, nombre: "CARNE HAMBURGUESA", precio: 1.50, categoria: "extras", emoji: "🥩", img: "https://images.unsplash.com/photo-1544025162-d76694265947?w=200", desc: "" },
        
        // BEBIDAS
        { id: 20, nombre: "LIMONADA", precio: 2.50, categoria: "bebidas", emoji: "🍋", img: "https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=200", desc: "Natural" },
        { id: 21, nombre: "COCA-COLA", precio: 1.50, categoria: "bebidas", emoji: "🥤", img: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=200", desc: "" },
        { id: 22, nombre: "AGUA", precio: 1.00, categoria: "bebidas", emoji: "💧", img: "https://images.unsplash.com/photo-1616118132534-381148898bb4?w=200", desc: "" }
    ];
}

// ============================================ //
// FUNCIONES DE CARRITO                         //
// ============================================ //
function calculateTotal() { return cart.reduce((s, i) => s + i.precio * i.cantidad, 0); }

function updateCartCount() { 
    const el = document.getElementById('cartCount'); 
    if (el) el.textContent = cart.reduce((s, i) => s + i.cantidad, 0); 
}

// ============================================ //
// PANTALLA DE BIENVENIDA                        //
// ============================================ //
function showMenu() {
    if (!clienteData) {
        clienteData = {
            tipo: 'mesa',
            mesa: '1',
            nombre: 'Cliente',
            telefono: '',
            direccion: ''
        };
        
        document.getElementById('tipoPedidoBadge').textContent = '🪑 En Mesa';
        document.getElementById('clienteBadge').textContent = '👤 Cliente';
        document.getElementById('clienteSaludo').textContent = 'Elige lo que más se te antoje';
    }
    
    const welcome = document.getElementById('welcomeScreen');
    welcome.classList.add('hidden');
    setTimeout(() => {
        welcome.style.display = 'none';
        document.getElementById('header').style.display = 'flex';
        document.getElementById('heroSection').style.display = 'flex';
        document.getElementById('orderSection').style.display = 'block';
        document.getElementById('menuSection').style.display = 'block';
        renderProducts();
        updateCartFloat();
        updateCartCount();
    }, 600);
}

function showWelcome() {
    cart = [];
    clienteData = null;
    selectedType = 'mesa';
    activeCategory = 'entradas';
    saborSeleccionado = [];
    currentProduct = null;
    
    document.getElementById('header').style.display = 'none';
    document.getElementById('heroSection').style.display = 'none';
    document.getElementById('orderSection').style.display = 'none';
    document.getElementById('menuSection').style.display = 'none';
    document.getElementById('cartFloat').style.display = 'none';
    
    const welcome = document.getElementById('welcomeScreen');
    welcome.style.display = 'flex';
    welcome.classList.remove('hidden');
    
    updateCartCount();
    updateCartFloat();
    
    document.getElementById('tipoPedidoBadge').textContent = '🪑 En Mesa';
    document.getElementById('clienteBadge').textContent = '👤 Cliente';
    document.getElementById('clienteSaludo').textContent = 'Elige lo que más se te antoje';
    
    document.getElementById('formMesa').value = '';
    document.getElementById('formNombre').value = '';
    document.getElementById('formTelefono').value = '';
    document.getElementById('formDireccion').value = '';
    
    document.querySelectorAll('.form-type-option').forEach(o => o.classList.remove('active'));
    document.querySelector('.form-type-option[data-type="mesa"]')?.classList.add('active');
    document.getElementById('mesaGroup').style.display = 'block';
    document.getElementById('nombreGroup').style.display = 'none';
    document.getElementById('telefonoGroup').style.display = 'none';
    document.getElementById('direccionGroup').style.display = 'none';
    
    closeCart();
    closeSaborModal();
    cerrarConfirmacion();
    closeOrderForm();
    
    document.querySelectorAll('.category-btn').forEach(c => c.classList.remove('active'));
    const firstCategory = document.querySelector('.category-btn');
    if (firstCategory) firstCategory.classList.add('active');
    
    renderProducts();
    
    setTimeout(() => {
        showToast('🔥 ¡Bienvenido de vuelta a TITO\'S RESTAURANT!');
    }, 500);
}

// ============================================ //
// FORMULARIO DE PEDIDO                         //
// ============================================ //
function openOrderForm() {
    document.getElementById('orderFormOverlay').classList.add('open');
    document.body.classList.add('no-scroll');
}

function closeOrderForm() {
    document.getElementById('orderFormOverlay').classList.remove('open');
    document.body.classList.remove('no-scroll');
}

function selectOrderType(type, el) {
    selectedType = type;
    document.querySelectorAll('.form-type-option').forEach(o => o.classList.remove('active'));
    el.classList.add('active');
    
    document.getElementById('mesaGroup').style.display = type === 'mesa' ? 'block' : 'none';
    document.getElementById('nombreGroup').style.display = type !== 'mesa' ? 'block' : 'none';
    document.getElementById('telefonoGroup').style.display = type !== 'mesa' ? 'block' : 'none';
    document.getElementById('direccionGroup').style.display = type === 'delivery' ? 'block' : 'none';
}

function submitOrderForm(e) {
    e.preventDefault();
    
    const tipo = selectedType;
    const mesa = document.getElementById('formMesa').value;
    const nombre = document.getElementById('formNombre').value;
    const telefono = document.getElementById('formTelefono').value;
    const direccion = document.getElementById('formDireccion').value;
    
    if (tipo === 'mesa' && !mesa) {
        showToast('⚠️ Por favor ingresa el número de mesa');
        return;
    }
    
    if (tipo !== 'mesa') {
        if (!nombre) {
            showToast('⚠️ Por favor ingresa tu nombre');
            return;
        }
        if (!telefono) {
            showToast('⚠️ Por favor ingresa tu teléfono');
            return;
        }
    }
    
    if (tipo === 'delivery' && !direccion) {
        showToast('⚠️ Por favor ingresa la dirección de entrega');
        return;
    }
    
    clienteData = {
        tipo,
        mesa: mesa || null,
        nombre: nombre || 'Cliente Mesa ' + mesa,
        telefono: telefono || '',
        direccion: direccion || ''
    };
    
    const tipoLabels = { mesa: '🪑 En Mesa', llevar: '🛵 Para Llevar', delivery: '🚀 Delivery' };
    document.getElementById('tipoPedidoBadge').textContent = tipoLabels[tipo];
    document.getElementById('clienteBadge').textContent = '👤 ' + (nombre || 'Cliente Mesa ' + mesa);
    document.getElementById('clienteSaludo').textContent = '¡Bienvenido ' + (nombre || 'Cliente') + '! Elige lo que más se te antoje';
    
    closeOrderForm();
    showMenu();
}

// ============================================ //
// FUNCIONES DEL MENÚ                            //
// ============================================ //
function changeCategory(cat, el) {
    activeCategory = cat;
    document.querySelectorAll('.category-btn').forEach(c => c.classList.remove('active'));
    if (el) el.classList.add('active');
    renderProducts();
}

function renderProducts() {
    const products = getMenuData().filter(p => p.categoria === activeCategory);
    const grid = document.getElementById('productsGrid');
    if (!grid) return;
    
    const grouped = products.reduce((acc, item) => {
        const key = item.subcategoria || 'Otros';
        if (!acc[key]) acc[key] = [];
        acc[key].push(item);
        return acc;
    }, {});
    
    let html = '';
    
    Object.keys(grouped).forEach(subcat => {
        const items = grouped[subcat];
        html += `<div class="subcategory-title">${subcat}</div>`;
        
        items.forEach(p => {
            html += `
                <div class="menu-item">
                    <div class="menu-item-header">
                        <span class="menu-item-title">${p.emoji} ${p.nombre}</span>
                        <span class="menu-item-price">$${p.precio.toFixed(2)}</span>
                    </div>
                    <hr class="menu-item-divider">
                    <p class="menu-item-desc">${p.desc || 'Deliciosa opción'}</p>
                    <div class="menu-item-actions">
                        ${p.categoria === 'alitas' ? `<span class="menu-item-badge">🍗 ${p.piezas || ''} piezas</span>` : ''}
                        <button class="btn-add-item" onclick="addToCart(${p.id})">+</button>
                    </div>
                </div>
            `;
        });
    });
    
    grid.innerHTML = html;
}

// ============================================ //
// AGREGAR AL CARRITO CON VALIDACIÓN DE STOCK   //
// ============================================ //
function addToCart(id) {
    const p = getMenuData().find(x => x.id === id);
    if (!p) return;
    
    const stockInfo = verificarStock(p.nombre, 1);
    if (!stockInfo.disponible) {
        mostrarAlertaStock(p.nombre);
        return;
    }
    
    if (p.categoria === 'alitas') {
        currentProduct = p;
        maxSaboresPermitidos = p.saboresMax || 5;
        minSaboresPermitidos = p.saboresMin || 1;
        saborSeleccionado = [];
        openSaborModal();
    } else {
        agregarAlCarrito(p, null);
    }
}

function agregarAlCarrito(p, saboresStr) {
    let sabor = saboresStr;
    const nombreConSabor = sabor ? p.nombre + ' (' + sabor + ')' : p.nombre;
    const exist = cart.find(i => i.id === p.id && i.sabor === sabor);
    
    const cantidadActual = exist ? exist.cantidad : 0;
    const nuevaCantidad = cantidadActual + 1;
    
    const stockInfo = verificarStock(p.nombre, nuevaCantidad);
    if (!stockInfo.disponible) {
        mostrarAlertaStock(p.nombre);
        return;
    }
    
    if (exist) { 
        exist.cantidad++; 
    } else { 
        cart.push({ 
            id: p.id, 
            nombre: nombreConSabor, 
            precio: p.precio, 
            emoji: p.emoji, 
            img: p.img || 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=200',
            cantidad: 1, 
            sabor: sabor,
            piezas: p.piezas || 0,
            productoBase: p.nombre
        }); 
    }
    updateCartFloat(); 
    updateCartCount();
    showToast(`✅ ${p.nombre} agregado al carrito`);
    if (navigator.vibrate) navigator.vibrate(10);
}

// ============================================ //
// MODAL DE SABORES                             //
// ============================================ //
function openSaborModal() {
    saborSeleccionado = [];
    document.querySelectorAll('.sabor-card').forEach(card => {
        card.classList.remove('selected');
    });
    updateSelectedList();
    actualizarInfoSabores();
    document.getElementById('modalSabores').style.display = 'flex';
    document.body.classList.add('no-scroll');
}

function closeSaborModal() {
    document.getElementById('modalSabores').style.display = 'none';
    document.body.classList.remove('no-scroll');
    currentProduct = null;
}

function actualizarInfoSabores() {
    const infoContainer = document.getElementById('saboresInfo');
    if (!infoContainer) return;
    
    if (currentProduct) {
        const piezas = currentProduct.piezas || 0;
        const min = currentProduct.saboresMin || 1;
        const max = currentProduct.saboresMax || 5;
        const seleccionados = saborSeleccionado.length;
        
        let mensaje = `🍗 ${piezas} piezas · `;
        if (min === max) {
            mensaje += `Elige exactamente ${min} sabor${min > 1 ? 'es' : ''}`;
        } else {
            mensaje += `Elige de ${min} a ${max} sabores`;
        }
        mensaje += ` (${seleccionados} seleccionado${seleccionados !== 1 ? 's' : ''})`;
        
        infoContainer.textContent = mensaje;
        infoContainer.style.color = seleccionados >= min && seleccionados <= max ? '#27ae60' : '#e67e22';
    }
}

function updateSelectedList() {
    const container = document.getElementById('selectedSaboresList');
    if (!container) return;
    
    if (saborSeleccionado.length === 0) {
        container.innerHTML = '<span style="color:var(--text-light);font-size:13px;">Ningún sabor seleccionado</span>';
        return;
    }
    
    container.innerHTML = saborSeleccionado.map((sabor, idx) => `
        <span class="sabor-tag">
            ${sabor.nombre}
            <span class="remove-sabor" onclick="removeSabor(${idx})">×</span>
        </span>
    `).join('');
    
    actualizarInfoSabores();
}

function removeSabor(index) {
    saborSeleccionado.splice(index, 1);
    const saboresNombres = saborSeleccionado.map(s => s.nombre);
    document.querySelectorAll('.sabor-card').forEach(card => {
        const saborNombre = card.dataset.sabor;
        if (saboresNombres.includes(saborNombre)) {
            card.classList.add('selected');
        } else {
            card.classList.remove('selected');
        }
    });
    updateSelectedList();
}

function confirmarSabores() {
    if (!currentProduct) return;
    
    const min = currentProduct.saboresMin || 1;
    const max = currentProduct.saboresMax || 5;
    const seleccionados = saborSeleccionado.length;
    
    if (seleccionados < min) {
        showToast(`⚠️ Selecciona al menos ${min} sabor${min > 1 ? 'es' : ''} para tus alitas`);
        return;
    }
    
    if (seleccionados > max) {
        showToast(`⚠️ Máximo ${max} sabor${max > 1 ? 'es' : ''} permitido${max > 1 ? 's' : ''}`);
        return;
    }
    
    const saboresStr = saborSeleccionado.map(s => s.nombre).join(', ');
    agregarAlCarrito(currentProduct, saboresStr);
    closeSaborModal();
}

// ============================================ //
// CARRITO FLOTANTE Y MODAL                      //
// ============================================ //
function updateCartFloat() {
    const count = cart.reduce((s, i) => s + i.cantidad, 0);
    const total = calculateTotal();
    const floatEl = document.getElementById('cartFloat');
    if (!floatEl) return;
    if (count > 0) { 
        floatEl.style.display = 'flex'; 
        document.getElementById('cartFloatCount').textContent = count; 
        document.getElementById('cartFloatTotal').textContent = '$' + total.toFixed(2); 
    } else { 
        floatEl.style.display = 'none'; 
    }
}

function goToCart() { 
    renderCartItems(); 
    document.getElementById('cartOverlay').classList.add('open');
    document.body.classList.add('no-scroll');
}

function closeCart() {
    document.getElementById('cartOverlay').classList.remove('open');
    document.body.classList.remove('no-scroll');
}

function renderCartItems() {
    const total = calculateTotal();
    document.getElementById('cartTotal').textContent = '$' + total.toFixed(2);
    const itemsEl = document.getElementById('cartItems');
    if (!itemsEl) return;
    if (cart.length === 0) { 
        itemsEl.innerHTML = `
            <div class="empty-cart">
                <div>🍽️</div>
                <strong>Tu carrito está vacío</strong>
                <p style="font-size:13px;margin-top:5px;color:var(--text-light);">Agrega algo delicioso.</p>
            </div>
        `; 
        return; 
    }
    itemsEl.innerHTML = cart.map((i, idx) => `
        <div class="cart-item">
            <img src="${i.img}" class="cart-item-image" alt="${i.nombre}">
            <div class="cart-item-info">
                <h4>${i.emoji} ${i.nombre}</h4>
                ${i.sabor ? `<small style="color:var(--orange-light);font-size:11px;">🔥 ${i.sabor}</small>` : ''}
                ${i.piezas ? `<small style="color:var(--text-light);font-size:10px;display:block;">🍗 ${i.piezas} piezas</small>` : ''}
                <div class="cart-item-price">$${(i.precio * i.cantidad).toFixed(2)}</div>
                <div class="quantity">
                    <button onclick="cambiarCantidad(${idx}, -1)">−</button>
                    <span>${i.cantidad}</span>
                    <button onclick="cambiarCantidad(${idx}, 1)">+</button>
                    <button class="remove" onclick="eliminarItem(${idx})">🗑</button>
                </div>
            </div>
        </div>
    `).join('');
}

// ============================================ //
// CAMBIAR CANTIDAD CON VALIDACIÓN DE STOCK     //
// ============================================ //
function cambiarCantidad(idx, delta) {
    const item = cart[idx];
    const nuevaCantidad = item.cantidad + delta;
    
    if (nuevaCantidad <= 0) {
        cart.splice(idx, 1);
        renderCartItems();
        updateCartFloat();
        updateCartCount();
        return;
    }
    
    const productoBase = item.productoBase || item.nombre;
    const stockInfo = verificarStock(productoBase, nuevaCantidad);
    
    if (!stockInfo.disponible) {
        mostrarAlertaStock(productoBase);
        return;
    }
    
    item.cantidad = nuevaCantidad;
    renderCartItems();
    updateCartFloat();
    updateCartCount();
}

function eliminarItem(idx) {
    const removed = cart[idx].nombre;
    cart.splice(idx, 1);
    renderCartItems();
    updateCartFloat();
    updateCartCount();
    showToast(`${removed} eliminado`);
}

// ============================================ //
// CONFIRMAR PEDIDO - GUARDA EN MARKETPOS      //
// ============================================ //
function confirmOrder() {
    if (cart.length === 0) { 
        showToast('⚠️ Agrega productos al carrito');
        return; 
    }
    
    // Verificar stock para todos los items
    let stockInsuficiente = false;
    let productoFaltante = '';
    
    for (const item of cart) {
        const productoBase = item.productoBase || item.nombre;
        const stockInfo = verificarStock(productoBase, item.cantidad);
        
        if (!stockInfo.disponible) {
            stockInsuficiente = true;
            productoFaltante = productoBase;
            break;
        }
    }
    
    if (stockInsuficiente) {
        mostrarAlertaStock(productoFaltante);
        return;
    }
    
    const total = calculateTotal();
    
    let clienteInfo = clienteData;
    if (!clienteInfo) {
        clienteInfo = {
            tipo: 'mesa',
            mesa: '1',
            nombre: 'Cliente',
            telefono: '',
            direccion: ''
        };
    }
    
    // Obtener el número de mesa o "Llevar" según el tipo
    let mesaNumero = clienteInfo.mesa || '1';
    let nombreCliente = clienteInfo.nombre || 'Cliente';
    
    // Para tipo "llevar", no usar número de mesa
    const tipoPedido = clienteInfo.tipo || 'mesa';
    const mostrarMesa = tipoPedido === 'mesa' ? mesaNumero : 'Llevar';
    
    // Crear el pedido en el formato que espera la caja
    const pedido = { 
        id: 'ped_' + Date.now(),
        cliente: { 
            nombre: tipoPedido === 'mesa' ? 'Cliente Mesa ' + mesaNumero : nombreCliente,
            mesa: tipoPedido === 'mesa' ? mesaNumero : 'Llevar',
            tipoPedido: tipoPedido,
            telefono: clienteInfo.telefono || '',
            direccion: clienteInfo.direccion || ''
        }, 
        items: cart.map(i => ({ 
            id: i.id, 
            nombre: i.nombre, 
            precio: i.precio, 
            emoji: i.emoji, 
            cantidad: i.cantidad, 
            sabor: i.sabor || '',
            piezas: i.piezas || 0,
            productoBase: i.productoBase || i.nombre
        })), 
        total: total,
        estado: 'nuevo',
        fecha: new Date().toISOString(),
        timestamp: Date.now(),
        fuente: 'digital'
    };
    
    // IMPORTANTE: Guardar en marketpos_pedidos_online para que la caja lo vea
    const pedidosLocal = JSON.parse(localStorage.getItem('marketpos_pedidos_online') || '[]');
    
    // Verificar si ya existe (evitar duplicados)
    const existe = pedidosLocal.some(p => p.id === pedido.id);
    if (!existe) {
        pedidosLocal.unshift(pedido);
        localStorage.setItem('marketpos_pedidos_online', JSON.stringify(pedidosLocal));
        
        // También guardar en pedidos digitales específicos
        const pedidosDigital = JSON.parse(localStorage.getItem('marketpos_pedidos_digital') || '[]');
        pedidosDigital.unshift(pedido);
        localStorage.setItem('marketpos_pedidos_digital', JSON.stringify(pedidosDigital));
        
        console.log('📦 Pedido guardado en marketpos_pedidos_online:', pedido);
    }
    
    // SOLO si es MESA, actualizar estado de la mesa
    if (tipoPedido === 'mesa') { 
        const mesasLocal = JSON.parse(localStorage.getItem('marketpos_mesas') || '[]'); 
        const mesa = mesasLocal.find(m => m.numero === parseInt(mesaNumero)); 
        if (mesa) { 
            mesa.estado = 'ocupada'; 
            mesa.orden = pedido.items; 
        } 
        localStorage.setItem('marketpos_mesas', JSON.stringify(mesasLocal)); 
    }
    
    // Notificar a la caja que hay un nuevo pedido
    window.dispatchEvent(new StorageEvent('storage', {
        key: 'marketpos_pedidos_online',
        newValue: JSON.stringify(pedidosLocal)
    }));
    
    // Mostrar mensaje según el tipo de pedido
    let mensajeConfirmacion = '✅ ¡Pedido enviado a cocina!';
    if (tipoPedido === 'llevar') {
        mensajeConfirmacion = '🛵 ¡Pedido para llevar enviado a cocina! Estará listo para recoger.';
    } else if (tipoPedido === 'delivery') {
        mensajeConfirmacion = '🚀 ¡Pedido a domicilio enviado a cocina! Llegará pronto.';
    }
    
    mostrarConfirmacion(pedido, clienteInfo, mensajeConfirmacion);
    
    // Descontar del stock después de confirmar
    for (const item of cart) {
        const productoBase = item.productoBase || item.nombre;
        actualizarStock(productoBase, item.cantidad);
    }
    
    cart = []; 
    updateCartCount(); 
    updateCartFloat();
    closeCart();
    renderProducts();
}

// ============================================ //
// FUNCIÓN PARA ACTUALIZAR STOCK                //
// ============================================ //
function actualizarStock(productoNombre, cantidad) {
    const inventarioGuardado = localStorage.getItem('tito_inventario');
    if (!inventarioGuardado) return false;
    
    const inventario = JSON.parse(inventarioGuardado);
    const stockActual = inventario[productoNombre] || 0;
    const nuevoStock = stockActual - cantidad;
    
    if (nuevoStock < 0) {
        return false;
    }
    
    inventario[productoNombre] = nuevoStock;
    localStorage.setItem('tito_inventario', JSON.stringify(inventario));
    
    // Registrar movimiento
    const movimientosGuardados = localStorage.getItem('tito_movimientos');
    let movimientos = movimientosGuardados ? JSON.parse(movimientosGuardados) : [];
    
    const nuevoMovimiento = {
        id: 'mov_' + Date.now(),
        producto: productoNombre,
        cantidad: cantidad,
        tipo: 'venta',
        motivo: 'venta',
        observaciones: 'Pedido desde menú digital',
        fecha: new Date().toLocaleString('es-ES', { 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric',
            hour: '2-digit', 
            minute: '2-digit' 
        }),
        timestamp: Date.now()
    };
    
    movimientos.push(nuevoMovimiento);
    localStorage.setItem('tito_movimientos', JSON.stringify(movimientos));
    
    // Registrar en producción
    const produccionGuardada = localStorage.getItem('tito_produccion_data');
    let produccion = produccionGuardada ? JSON.parse(produccionGuardada) : [];
    
    const registro = {
        id: 'prod_' + Date.now(),
        producto: productoNombre,
        cantidad: cantidad,
        estado: 'completado',
        observaciones: 'Venta desde menú digital',
        hora: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
        timestamp: Date.now(),
        tipo: 'consumo'
    };
    produccion.push(registro);
    if (produccion.length > 1000) produccion = produccion.slice(-1000);
    localStorage.setItem('tito_produccion_data', JSON.stringify(produccion));
    
    return true;
}

// ============================================ //
// MODAL DE CONFIRMACIÓN (AGRADECIMIENTO)      //
// ============================================ //
function mostrarConfirmacion(pedido, cliente, mensajeExtra) {
    const modal = document.getElementById('modalConfirmacion');
    if (!modal) return;
    
    const tipoLabels = { mesa: '🪑 En Mesa', llevar: '🛵 Para Llevar', delivery: '🚀 Delivery' };
    document.getElementById('confirmTipo').textContent = tipoLabels[cliente.tipo] || '🪑 En Mesa';
    document.getElementById('confirmCliente').textContent = cliente.nombre || 'Cliente';
    document.getElementById('confirmItems').textContent = pedido.items.length;
    document.getElementById('confirmTotal').textContent = '$' + pedido.total.toFixed(2);
    
    const pElement = modal.querySelector('p');
    if (pElement && mensajeExtra) {
        pElement.textContent = mensajeExtra || 'Tu pedido está siendo preparado con el mejor sabor al carbón.';
    }
    
    modal.classList.add('show');
    document.body.classList.add('no-scroll');
    
    if (navigator.vibrate) navigator.vibrate([50, 50, 100]);
}

function cerrarConfirmacion() {
    const modal = document.getElementById('modalConfirmacion');
    if (modal) {
        modal.classList.remove('show');
    }
    document.body.classList.remove('no-scroll');
    
    showToast('🙏 ¡Gracias por confiar en TITO\'S RESTAURANT!');
    
    setTimeout(() => {
        showWelcome();
    }, 500);
}

// ============================================ //
// TOAST                                        //
// ============================================ //
let toastTimer;

function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
        toast.classList.remove('show');
    }, 3500);
}

// ============================================ //
// INICIALIZACIÓN                                //
// ============================================ //
document.addEventListener('DOMContentLoaded', () => {
    const categoriesContainer = document.getElementById('categoriesContainer');
    if (categoriesContainer) {
        categoriesContainer.innerHTML = categories.map(c => `
            <button class="category-btn ${c.key === activeCategory ? 'active' : ''}" onclick="changeCategory('${c.key}', this)">${c.label}</button>
        `).join('');
    }
    
    const saboresGrid = document.getElementById('saboresGrid');
    if (saboresGrid) {
        saboresGrid.addEventListener('click', (e) => {
            const saborCard = e.target.closest('.sabor-card');
            if (saborCard) {
                const sabor = saborCard.dataset.sabor;
                const id = saborCard.dataset.id;
                const max = maxSaboresPermitidos || 5;
                
                if (saborCard.classList.contains('selected')) {
                    saborCard.classList.remove('selected');
                    saborSeleccionado = saborSeleccionado.filter(s => s.nombre !== sabor);
                } else {
                    if (saborSeleccionado.length >= max) {
                        showToast(`⚠️ Máximo ${max} sabor${max > 1 ? 'es' : ''} permitido${max > 1 ? 's' : ''}`);
                        return;
                    }
                    saborCard.classList.add('selected');
                    saborSeleccionado.push({ id: id, nombre: sabor });
                }
                updateSelectedList();
            }
        });
    }
    
    const modalSabores = document.getElementById('modalSabores');
    if (modalSabores) {
        modalSabores.addEventListener('click', (e) => {
            if (e.target === modalSabores) {
                closeSaborModal();
            }
        });
    }
    
    document.getElementById('closeCart').addEventListener('click', closeCart);
    document.getElementById('cartOverlay').addEventListener('click', (e) => {
        if (e.target === document.getElementById('cartOverlay')) {
            closeCart();
        }
    });
    
    updateCartFloat();
    updateCartCount();
    renderProducts();
});

// ============================================ //
// FUNCIONES PARA INTEGRACIÓN CON CAJA          //
// ============================================ //

// Función para obtener pedidos pendientes de llevar desde el menú digital
function obtenerPedidosLlevarDigital() {
    const pedidosLocal = JSON.parse(localStorage.getItem('marketpos_pedidos_online') || '[]');
    return pedidosLocal.filter(p => 
        p.fuente === 'digital' && 
        p.cliente?.tipoPedido === 'llevar' && 
        (p.estado === 'nuevo' || p.estado === 'preparando' || p.estado === 'listo')
    );
}

// Función para marcar un pedido como listo para cobrar
function marcarPedidoListo(pedidoId) {
    const pedidosLocal = JSON.parse(localStorage.getItem('marketpos_pedidos_online') || '[]');
    const pedido = pedidosLocal.find(p => p.id === pedidoId);
    if (pedido) {
        pedido.estado = 'listo';
        localStorage.setItem('marketpos_pedidos_online', JSON.stringify(pedidosLocal));
        
        window.dispatchEvent(new StorageEvent('storage', {
            key: 'marketpos_pedidos_online',
            newValue: JSON.stringify(pedidosLocal)
        }));
        
        return true;
    }
    return false;
}

// Exponer funciones para la caja
window.obtenerPedidosLlevarDigital = obtenerPedidosLlevarDigital;
window.marcarPedidoListo = marcarPedidoListo;