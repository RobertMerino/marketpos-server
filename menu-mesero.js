let cart = [];
let activeCategory = 'hamburguesas';
let mesaActual = '1';
let modoEdicion = false;
let pedidoIdEdicion = null;

// Variables globales para sabores
let saborSeleccionado = [];
let currentProduct = null;
let maxSaboresPermitidos = 0;
let minSaboresPermitidos = 1;

// Variables para stock
let stockData = {};

const urlParams = new URLSearchParams(window.location.search);
mesaActual = urlParams.get('mesa') || '1';
const editarParam = urlParams.get('editar');

if (document.getElementById('mesaBadge')) {
    document.getElementById('mesaBadge').textContent = '🔥 Mesa ' + mesaActual;
}
if (document.getElementById('mesaInfo')) {
    document.getElementById('mesaInfo').textContent = '🔥 MESA ' + mesaActual;
}
if (document.getElementById('cartMesaTitle')) {
    document.getElementById('cartMesaTitle').textContent = mesaActual;
}

const categories = [
    { key: 'hamburguesas', label: '🍔 Burgers' },
    { key: 'cortes', label: '🥩 Cortes' },
    { key: 'alitas', label: '🍗 Alitas' },
    { key: 'parrilla', label: '🔥 Parrilla' },
    { key: 'promociones', label: '⭐ Promos' },
    { key: 'extras', label: '➕ Extras' },
    { key: 'bebidas', label: '🥤 Bebidas' }
];

// ============================================ //
// FUNCIONES DE STOCK                            //
// ============================================ //

function cargarStock() {
    const inventarioGuardado = localStorage.getItem('tito_inventario');
    if (inventarioGuardado) {
        stockData = JSON.parse(inventarioGuardado);
    } else {
        // Si no hay inventario, crear uno básico
        const productos = getMenuData();
        stockData = {};
        productos.forEach(p => {
            stockData[p.nombre] = Math.floor(Math.random() * 20) + 5;
        });
        localStorage.setItem('tito_inventario', JSON.stringify(stockData));
    }
}

function obtenerStock(productoNombre) {
    // Buscar coincidencia exacta o parcial
    for (const [key, value] of Object.entries(stockData)) {
        if (key.toLowerCase() === productoNombre.toLowerCase() || 
            productoNombre.toLowerCase().includes(key.toLowerCase()) ||
            key.toLowerCase().includes(productoNombre.toLowerCase())) {
            return value;
        }
    }
    return 0;
}

function actualizarStockLocal(productoNombre, cantidad) {
    for (const [key, value] of Object.entries(stockData)) {
        if (key.toLowerCase() === productoNombre.toLowerCase() || 
            productoNombre.toLowerCase().includes(key.toLowerCase()) ||
            key.toLowerCase().includes(productoNombre.toLowerCase())) {
            stockData[key] = Math.max(0, value - cantidad);
            break;
        }
    }
    localStorage.setItem('tito_inventario', JSON.stringify(stockData));
}

function verificarStock(productoNombre, cantidadSolicitada) {
    const stock = obtenerStock(productoNombre);
    return {
        disponible: stock >= cantidadSolicitada,
        stock: stock,
        faltante: Math.max(0, cantidadSolicitada - stock)
    };
}

function getMenuData() {
    return [
        { id: 1, nombre: "TITO BURGER", precio: 5.00, categoria: "hamburguesas", emoji: "🍔", img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200", desc: "Carne, Queso cheddar, Cebolla caramelizada, Mayonesa Tito, Morrón asado, Mermelada de tocino + Papas Tito" },
        { id: 2, nombre: "HAWAI", precio: 3.75, categoria: "hamburguesas", emoji: "🍍", img: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=200", desc: "Carne, Piña asada, Queso cheddar, Cebolla caramelizada, Mayonesa finas hierbas + Papas Tito" },
        { id: 3, nombre: "THE BIG BOSS", precio: 5.50, categoria: "hamburguesas", emoji: "👑", img: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=200", desc: "Doble carne, Doble queso cheddar + Papas Tito" },
        { id: 4, nombre: "PARRILLERA", precio: 3.95, categoria: "hamburguesas", emoji: "🥓", img: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=200", desc: "Carne, Chorizo paisa, Queso cheddar, Chimichurri + Papas Tito" },
        { id: 5, nombre: "HULK", precio: 7.00, categoria: "hamburguesas", emoji: "💪", img: "https://images.unsplash.com/photo-1586816001966-79b736744398?w=200", desc: "Triple carne, Chorizo paisa, Triple queso cheddar + Papas Tito" },
        { id: 6, nombre: "CLÁSICA", precio: 2.50, categoria: "hamburguesas", emoji: "🍔", img: "https://images.unsplash.com/photo-1561758033-7e924f619b47?w=200", desc: "Carne, Queso cheddar, Cebolla caramelizada, Mayonesa morrón" },
        { id: 7, nombre: "CLÁSICA + PAPAS", precio: 3.00, categoria: "hamburguesas", emoji: "🍟", img: "https://thumbs.dreamstime.com/b/peque%C3%B1a-hamburguesa-de-los-alimentos-preparaci%C3%B3n-r%C3%A1pida-en-el-fondo-blanco-138709673.jpg", desc: "Clásica + Papas Tito" },
        { id: 8, nombre: "PICAÑA", precio: 10.00, categoria: "cortes", emoji: "🥩", img: "https://images.unsplash.com/photo-1544025162-d76694265947?w=200", desc: "+ Chorizo, Ensalada, Chimichurri + Papas Tito" },
        { id: 9, nombre: "BIFE DE CHORIZO", precio: 10.00, categoria: "cortes", emoji: "🥩", img: "https://images.unsplash.com/photo-1600891964092-4316c288032e?w=200", desc: "+ Chorizo, Ensalada, Chimichurri + Papas Tito" },
        { id: 10, nombre: "RYBEYE", precio: 9.00, categoria: "cortes", emoji: "🥩", img: "https://images.unsplash.com/photo-1615937722923-67f6deaf2cc9?w=200", desc: "+ Chorizo, Ensalada, Chimichurri + Papas Tito" },
        { id: 11, nombre: "T-BONE", precio: 10.00, categoria: "cortes", emoji: "🦴", img: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=200", desc: "+ Chorizo, Ensalada, Chimichurri + Papas Tito" },
        { id: 12, nombre: "CORDERO", precio: 7.00, categoria: "cortes", emoji: "🐑", img: "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=200", desc: "+ Chorizo, Ensalada, Chimichurri + Papas Tito" },
        { id: 13, nombre: "LOMITO DE RES", precio: 5.00, categoria: "cortes", emoji: "🥩", img: "https://images.unsplash.com/photo-1558030006-450675393462?w=200", desc: "Jugoso Filete + Chorizo, Ensalada + Papas Tito" },
        { id: 14, nombre: "POLLO A LA PARRILLA", precio: 4.50, categoria: "cortes", emoji: "🍗", img: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=200", desc: "Jugoso Filete + Chorizo, Ensalada + Papas Tito" },
        { id: 15, nombre: "CHULETA DE CERDO", precio: 5.00, categoria: "cortes", emoji: "🐷", img: "https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=200", desc: "Jugoso Filete + Chorizo, Ensalada + Papas Tito" },
        { id: 16, nombre: "4 ALITAS", precio: 6.00, categoria: "alitas", emoji: "🍗", img: "https://images.unsplash.com/photo-1605710379250-f332254b96de?w=200", desc: "8 piezas · Elige 1-2 sabores", piezas: 8, saboresMin: 1, saboresMax: 2 },
        { id: 17, nombre: "8 ALITAS", precio: 10.00, categoria: "alitas", emoji: "🍗", img: "https://images.unsplash.com/photo-1605710379250-f332254b96de?w=200", desc: "16 piezas · Elige 2-3 sabores", piezas: 16, saboresMin: 2, saboresMax: 3 },
        { id: 18, nombre: "12 ALITAS", precio: 14.00, categoria: "alitas", emoji: "🍗", img: "https://images.unsplash.com/photo-1605710379250-f332254b96de?w=200", desc: "24 piezas · Elige 2-4 sabores", piezas: 24, saboresMin: 2, saboresMax: 4 },
        { id: 19, nombre: "15 ALITAS", precio: 16.00, categoria: "alitas", emoji: "🍗", img: "https://images.unsplash.com/photo-1605710379250-f332254b96de?w=200", desc: "30 piezas · Elige 2-4 sabores", piezas: 30, saboresMin: 2, saboresMax: 4 },
        { id: 20, nombre: "20 ALITAS", precio: 21.00, categoria: "alitas", emoji: "🍗", img: "https://images.unsplash.com/photo-1605710379250-f332254b96de?w=200", desc: "40 piezas · Elige 3-5 sabores", piezas: 40, saboresMin: 3, saboresMax: 5 },
        { id: 21, nombre: "SUPER PICADITA", precio: 7.00, categoria: "parrilla", emoji: "🎯", img: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=200", desc: "Pollo, Lomo, Doble chorizo, Cuero, Chimichurri + Papas Tito" },
        { id: 22, nombre: "PARRILLADA TITO", precio: 9.00, categoria: "parrilla", emoji: "🔥", img: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=200", desc: "Pollo, Lomo, Chuleta, Triple Chorizo, Cuero, Ensalada, Chimichurri + Papas Tito" },
        { id: 23, nombre: "COSTILLAS BBQ", precio: 7.00, categoria: "parrilla", emoji: "🍖", img: "https://images.unsplash.com/photo-1544025162-d76694265947?w=200", desc: "Costilla especial bañada en salsa BBQ + Papas Tito" },
        { id: 24, nombre: "PAPA CON CHILLY", precio: 4.50, categoria: "parrilla", emoji: "🧀", img: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=200", desc: "Queso mozarella, Frijoles, Carne Molida + Papas Tito" },
        { id: 25, nombre: "CHORY PAPA", precio: 4.00, categoria: "parrilla", emoji: "🌭", img: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=200", desc: "Chorizo paisa, Chimichurri + Papas Tito" },
        { id: 26, nombre: "CHORIPÁN", precio: 3.50, categoria: "parrilla", emoji: "🌭", img: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=200", desc: "Chorizo paisa, Chimichurri, Mayonesa morrón + Papas Tito" },
        { id: 27, nombre: "KIT ESTRELLA", precio: 7.00, categoria: "promociones", emoji: "⭐", img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200", desc: "Tito Burguer + Limonada + Papas Tito extra" },
        { id: 28, nombre: "COMBO PAREJA", precio: 11.00, categoria: "promociones", emoji: "💑", img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200", desc: "2 Hamburguesas + 2 Limonadas + Papas Tito" },
        { id: 29, nombre: "COMBO COMPARTIR", precio: 14.00, categoria: "promociones", emoji: "🎉", img: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=200", desc: "Parrillada real + Jarra de limonada + Papas Tito" },
        { id: 30, nombre: "COMBO FAMILIAR", precio: 16.00, categoria: "promociones", emoji: "👨‍👩‍👧‍👦", img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200", desc: "3 Burguer + 3 Limonadas + Papas Tito" },
        { id: 31, nombre: "PAPAS TITO", precio: 1.50, categoria: "extras", emoji: "🍟", img: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=200", desc: "Papas fritas crujientes" },
        { id: 32, nombre: "CHORIZO NORMAL", precio: 1.00, categoria: "extras", emoji: "🌭", img: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=200", desc: "" },
        { id: 33, nombre: "CHORIZO PAISA", precio: 1.50, categoria: "extras", emoji: "🌭", img: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=200", desc: "" },
        { id: 34, nombre: "CARNE HAMBURGUESA", precio: 1.50, categoria: "extras", emoji: "🥩", img: "https://images.unsplash.com/photo-1544025162-d76694265947?w=200", desc: "" },
        { id: 35, nombre: "PIÑA", precio: 0.75, categoria: "extras", emoji: "🍍", img: "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=200", desc: "" },
        { id: 36, nombre: "CUERO", precio: 2.00, categoria: "extras", emoji: "🥓", img: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=200", desc: "" },
        { id: 37, nombre: "ENSALADA", precio: 1.50, categoria: "extras", emoji: "🥗", img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200", desc: "" },
        { id: 38, nombre: "MAYONESA TITO", precio: 2.00, categoria: "extras", emoji: "🫙", img: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=200", desc: "" },
        { id: 39, nombre: "LIMONADA", precio: 2.50, categoria: "bebidas", emoji: "🍋", img: "https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=200", desc: "Natural" },
        { id: 40, nombre: "JARRA LIMONADA", precio: 5.00, categoria: "bebidas", emoji: "🍋", img: "https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=200", desc: "Comparte con tus amigos" },
        { id: 41, nombre: "COCA-COLA", precio: 1.50, categoria: "bebidas", emoji: "🥤", img: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=200", desc: "" },
        { id: 42, nombre: "AGUA", precio: 1.00, categoria: "bebidas", emoji: "💧", img: "https://images.unsplash.com/photo-1616118132534-381148898bb4?w=200", desc: "" }
    ];
}

function calculateTotal() {
    return cart.reduce((s, i) => s + i.precio * i.cantidad, 0);
}

function updateCartCount() {
    const el = document.getElementById('cartCount');
    if (el) el.textContent = cart.reduce((s, i) => s + i.cantidad, 0);
}

function changeCategory(cat, el) {
    activeCategory = cat;
    document.querySelectorAll('.cat-item').forEach(c => c.classList.remove('active'));
    if (el) el.classList.add('active');
    renderProducts();
}

function renderProducts() {
    const products = getMenuData().filter(p => p.categoria === activeCategory);
    const grid = document.getElementById('productsGrid');
    if (!grid) return;
    
    // Agrupar por subcategoría
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
            // Obtener stock actual
            const stock = obtenerStock(p.nombre);
            const stockText = stock > 0 ? `📦 ${stock}` : '⚠️ 0';
            const stockColor = stock > 10 ? 'var(--green)' : stock > 5 ? 'var(--orange-light)' : stock > 0 ? 'var(--orange)' : 'var(--red)';
            
            html += `
                <div class="menu-item">
                    <div class="menu-item-header">
                        <span class="menu-item-title">${p.emoji} ${p.nombre}</span>
                        <span class="menu-item-price">$${p.precio.toFixed(2)}</span>
                    </div>
                    <hr class="menu-item-divider">
                    <p class="menu-item-desc">${p.desc || 'Deliciosa opción'}</p>
                    <div class="menu-item-actions">
                        <span class="menu-item-badge" style="color:${stockColor};border-color:${stockColor}30;font-weight:700;">
                            ${stockText}
                        </span>
                        ${p.categoria === 'alitas' ? `<span class="menu-item-badge">🍗 ${p.piezas || ''} piezas</span>` : ''}
                        <button class="btn-add-item" onclick="addToCart(${p.id})">+</button>
                    </div>
                </div>
            `;
        });
    });
    
    grid.innerHTML = html;
}

function addToCart(id) {
    const p = getMenuData().find(x => x.id === id);
    if (!p) return;

    // Verificar stock antes de agregar
    const stockInfo = verificarStock(p.nombre, 1);
    if (!stockInfo.disponible) {
        showToast(`⚠️ Stock insuficiente. Disponibles: ${stockInfo.stock} unidades`);
        return;
    }

    if (p.categoria === 'alitas') {
        currentProduct = p;
        maxSaboresPermitidos = p.saboresMax || 5;
        minSaboresPermitidos = p.saboresMin || 1;
        saborSeleccionado = [];
        openSaborModal();
        return;
    }

    // Agregar al carrito
    const exist = cart.find(i => i.id === p.id && !i.sabor);
    if (exist) {
        // Verificar stock para la nueva cantidad
        const newStockInfo = verificarStock(p.nombre, exist.cantidad + 1);
        if (!newStockInfo.disponible) {
            showToast(`⚠️ Stock insuficiente. Disponibles: ${newStockInfo.stock} unidades`);
            return;
        }
        exist.cantidad++;
    } else {
        cart.push({ id: p.id, nombre: p.nombre, precio: p.precio, emoji: p.emoji, cantidad: 1, productoBase: p.nombre });
    }
    
    // Actualizar stock visualmente (restar del stock local)
    actualizarStockLocal(p.nombre, 1);
    
    updateCartFloat();
    updateCartCount();
    renderProducts(); // Actualizar vista con nuevo stock
    showToast(`✅ ${p.nombre} agregado (quedan ${obtenerStock(p.nombre)} unidades)`);
    if (navigator.vibrate) navigator.vibrate(10);
}

function agregarAlCarritoConSabor(p, saboresStr) {
    const nombreConSabor = saboresStr ? p.nombre + ' (' + saboresStr + ')' : p.nombre;
    
    // Verificar stock
    const stockInfo = verificarStock(p.nombre, 1);
    if (!stockInfo.disponible) {
        showToast(`⚠️ Stock insuficiente. Disponibles: ${stockInfo.stock} unidades`);
        return;
    }
    
    const exist = cart.find(i => i.id === p.id && i.sabor === saboresStr);
    if (exist) {
        const newStockInfo = verificarStock(p.nombre, exist.cantidad + 1);
        if (!newStockInfo.disponible) {
            showToast(`⚠️ Stock insuficiente. Disponibles: ${newStockInfo.stock} unidades`);
            return;
        }
        exist.cantidad++;
    } else {
        cart.push({
            id: p.id,
            nombre: nombreConSabor,
            precio: p.precio,
            emoji: p.emoji,
            cantidad: 1,
            sabor: saboresStr,
            piezas: p.piezas || 0,
            productoBase: p.nombre
        });
    }
    
    // Actualizar stock
    actualizarStockLocal(p.nombre, 1);
    
    updateCartFloat();
    updateCartCount();
    renderProducts();
    showToast(`✅ ${p.nombre} agregado (quedan ${obtenerStock(p.nombre)} unidades)`);
}

// Funciones del modal de sabores
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
    agregarAlCarritoConSabor(currentProduct, saboresStr);
    closeSaborModal();
}

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
    document.getElementById('modalCart').style.display = 'flex';
}

function closeCart() {
    document.getElementById('modalCart').style.display = 'none';
}

function renderCartItems() {
    const total = calculateTotal();
    document.getElementById('cartTotal').textContent = '$' + total.toFixed(2);
    const itemsEl = document.getElementById('cartItems');
    if (!itemsEl) return;
    if (cart.length === 0) {
        itemsEl.innerHTML = '<p style="text-align:center;color:var(--text-light);padding:20px 0;">🛒 El carrito está vacío</p>';
        return;
    }
    itemsEl.innerHTML = cart.map((i, idx) => {
        // Verificar stock restante para mostrar advertencia
        const stockRestante = obtenerStock(i.productoBase || i.nombre);
        const warning = stockRestante < i.cantidad ? ' ⚠️' : '';
        
        return `
            <div class="cart-item-line">
                <div>
                    <strong>${i.emoji} ${i.nombre}${warning}</strong>
                    ${i.sabor ? `<br><small style="color:var(--orange-light);">🔥 ${i.sabor}</small>` : ''}
                    <br><small style="color:var(--text-light);">$${i.precio.toFixed(2)} c/u</small>
                    ${stockRestante < 5 ? `<br><small style="color:var(--red);">⚠️ Stock restante: ${stockRestante} uds</small>` : ''}
                </div>
                <div style="display:flex;align-items:center;gap:8px;">
                    <button class="btn-qty" onclick="cambiarCantidad(${idx}, -1)">−</button>
                    <span>${i.cantidad}</span>
                    <button class="btn-qty" onclick="cambiarCantidad(${idx}, 1)">+</button>
                </div>
            </div>
        `;
    }).join('');
}

function cambiarCantidad(idx, delta) {
    const item = cart[idx];
    const nuevaCantidad = item.cantidad + delta;
    
    if (nuevaCantidad <= 0) {
        // Devolver stock al eliminar
        actualizarStockLocal(item.productoBase || item.nombre, -item.cantidad);
        cart.splice(idx, 1);
        renderCartItems();
        updateCartFloat();
        updateCartCount();
        renderProducts();
        return;
    }
    
    const productoBase = item.productoBase || item.nombre;
    const stockInfo = verificarStock(productoBase, nuevaCantidad);
    
    if (!stockInfo.disponible && delta > 0) {
        showToast(`⚠️ Stock insuficiente. Disponibles: ${stockInfo.stock} unidades`);
        return;
    }
    
    // Actualizar stock
    if (delta > 0) {
        actualizarStockLocal(productoBase, 1);
    } else {
        actualizarStockLocal(productoBase, -1);
    }
    
    item.cantidad = nuevaCantidad;
    renderCartItems();
    updateCartFloat();
    updateCartCount();
    renderProducts();
}

function confirmOrder() {
    if (cart.length === 0) {
        showToast('⚠️ Agrega productos al carrito');
        return;
    }
    
    // Verificar stock para todos los items
    let stockInsuficiente = false;
    let mensajeError = '⚠️ Stock insuficiente para:\n\n';
    
    for (const item of cart) {
        const productoBase = item.productoBase || item.nombre;
        const stockInfo = verificarStock(productoBase, item.cantidad);
        if (!stockInfo.disponible) {
            stockInsuficiente = true;
            mensajeError += `• ${productoBase}: Disponibles ${stockInfo.stock} unidades (Solicitados ${item.cantidad})\n`;
        }
    }
    
    if (stockInsuficiente) {
        alert(mensajeError + '\nPor favor, ajusta las cantidades.');
        return;
    }
    
    const total = calculateTotal();
    const pedido = {
        cliente: { nombre: 'Mesero', mesa: mesaActual, tipoPedido: 'mesa' },
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
        total
    };

    try {
        const pedidosLocal = JSON.parse(localStorage.getItem('marketpos_pedidos_online') || '[]');
        pedido.id = Date.now();
        pedido.fecha = new Date().toISOString();
        pedido.estado = 'nuevo';
        pedidosLocal.unshift(pedido);
        localStorage.setItem('marketpos_pedidos_online', JSON.stringify(pedidosLocal));

        const mesasLocal = JSON.parse(localStorage.getItem('marketpos_mesas') || '[]');
        const mesa = mesasLocal.find(m => m.numero === parseInt(mesaActual));
        if (mesa) {
            mesa.estado = 'ocupada';
            mesa.orden = pedido.items;
            localStorage.setItem('marketpos_mesas', JSON.stringify(mesasLocal));
        }
        
        // Actualizar stock en localStorage (ya se fue restando en tiempo real)
        // Solo guardar el stock final
        localStorage.setItem('tito_inventario', JSON.stringify(stockData));
        
        showToast('✅ Pedido enviado a cocina');
    } catch(e) {
        showToast('⚠️ Error al enviar pedido');
    }

    cart = [];
    updateCartCount();
    updateCartFloat();
    closeCart();
    renderProducts();
}

function showToast(message) {
    const toast = document.getElementById('toast');
    if (!toast) {
        const t = document.createElement('div');
        t.id = 'toast';
        t.className = 'toast';
        document.body.appendChild(t);
    }
    const t = document.getElementById('toast');
    t.textContent = message;
    t.classList.add('show');
    clearTimeout(window.toastTimer);
    window.toastTimer = setTimeout(() => {
        t.classList.remove('show');
    }, 3000);
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    // Cargar stock
    cargarStock();
    
    // Categorías
    document.getElementById('categoriesContainer').innerHTML = categories.map(c => `
        <button class="cat-item ${c.key === activeCategory ? 'active' : ''}" onclick="changeCategory('${c.key}', this)">${c.label}</button>
    `).join('');
    
    // Eventos del modal de sabores
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

    renderProducts();
    updateCartFloat();
    updateCartCount();
});