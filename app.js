let cartPOS = [];
let activeCategoryPOS = 'hamburguesas';
let tipoPedidoActual = 'mesa';
let pedidoActual = null;

// ============================================
// SABORES DE ALITAS
// ============================================
const saboresAlitas = {
    16: ['BBQ Clásica', 'BBQ Picante', 'BBQ Miel', 'Lemon Pepper'],  // 4 ALITAS (8) - Solo 1 sabor
    17: ['BBQ Clásica', 'BBQ Picante', 'BBQ Miel', 'Buffalo Suave', 'Buffalo Medio', 'Buffalo Extremo'],  // 8 ALITAS (16)
    18: ['BBQ Clásica', 'BBQ Picante', 'BBQ Miel', 'Buffalo Suave', 'Buffalo Medio', 'Buffalo Extremo', 'Mango Habanero'],  // 12 ALITAS (24)
    19: ['BBQ Clásica', 'BBQ Picante', 'BBQ Miel', 'Buffalo Suave', 'Buffalo Medio', 'Lemon Pepper', 'Mango Habanero'],  // 15 ALITAS (30)
    20: ['BBQ Clásica', 'BBQ Picante', 'BBQ Miel', 'Buffalo Suave', 'Buffalo Medio', 'Buffalo Extremo', 'Lemon Pepper', 'Mango Habanero', 'Korean BBQ']  // 20 ALITAS (40)
};

// Función para mostrar el modal de sabores
function mostrarSelectorSabor(producto) {
    const sabores = saboresAlitas[producto.id];
    if (!sabores) return;
    
    // Eliminar modal anterior si existe
    const oldOverlay = document.getElementById('saborOverlay');
    if (oldOverlay) oldOverlay.remove();
    
    // Crear overlay
    const overlay = document.createElement('div');
    overlay.id = 'saborOverlay';
    overlay.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0,0,0,0.8); backdrop-filter: blur(5px);
        z-index: 9999; display: flex; justify-content: center; align-items: center;
    `;
    overlay.onclick = function(e) {
        if (e.target === overlay) overlay.remove();
    };
    
    // Crear modal
    const modal = document.createElement('div');
    modal.style.cssText = `
        background: #1a1a25; border: 2px solid #ff6b35; border-radius: 20px;
        padding: 30px; max-width: 400px; width: 90%; max-height: 80vh; overflow-y: auto;
    `;
    
    // Buscar si ya existe el producto en el carrito para mostrar sabores seleccionados
    const existente = cartPOS.find(i => i.id === producto.id);
    const saboresSeleccionados = existente ? (existente.sabores || [existente.sabor]) : [];
    
    // Título diferente para la promo de 4 alitas
    const titulo = producto.id === 16 ? '🍗 ¡Elige 1 sabor!' : '🍗 ¡Elige tus sabores!';
    const subtitulo = producto.id === 16 ? 'Esta promoción incluye 1 solo sabor' : 'Selecciona los sabores que quieras';
    
    let saboresHTML = sabores.map(sabor => {
        let icono = '🍗';
        if (sabor.includes('Picante') || sabor.includes('Extremo')) icono = '🌶️';
        else if (sabor.includes('Miel') || sabor.includes('Dulce')) icono = '🍯';
        else if (sabor.includes('Limón') || sabor.includes('Lemon')) icono = '🍋';
        else if (sabor.includes('BBQ')) icono = '🔥';
        else if (sabor.includes('Korean')) icono = '🇰🇷';
        else if (sabor.includes('Mango')) icono = '🥭';
        else if (sabor.includes('Buffalo')) icono = '🐃';
        
        // Verificar si este sabor ya está seleccionado
        const seleccionado = saboresSeleccionados.includes(sabor);
        
        return `
            <button onclick="seleccionarSabor(${producto.id}, '${sabor.replace(/'/g, "\\'")}')" 
                style="width:100%; padding:14px; margin:5px 0; 
                background:${seleccionado ? '#ff6b35' : '#222230'}; 
                border:2px solid ${seleccionado ? '#ff6b35' : 'rgba(255,255,255,0.1)'}; 
                color:white; border-radius:12px; cursor:pointer; font-size:15px; font-weight:600; 
                text-align:left; transition:all 0.3s; font-family:Montserrat,sans-serif;
                display:flex; align-items:center; gap:10px;"
                onmouseover="if(!this.style.background.includes('ff6b35')){this.style.background='#ff6b35';this.style.borderColor='#ff6b35';this.style.transform='translateX(5px)'}"
                onmouseout="if(!this.querySelector('.check-sabor')){this.style.background='#222230';this.style.borderColor='rgba(255,255,255,0.1)';this.style.transform='translateX(0)'}else{this.style.background='#ff6b35'}"
            >
                <span>${icono}</span>
                <span style="flex:1;">${sabor}</span>
                ${seleccionado ? '<span class="check-sabor" style="font-size:18px;">✅</span>' : ''}
            </button>
        `;
    }).join('');
    
    // Botón para terminar de elegir (solo para promos que no son 4 alitas)
    const botonListo = producto.id !== 16 ? `
        <button onclick="document.getElementById('saborOverlay').remove()" 
            style="width:100%; padding:14px; margin-top:15px; 
            background:linear-gradient(135deg,#10b981,#059669); 
            border:none; color:white; border-radius:12px; cursor:pointer; 
            font-size:16px; font-weight:700; font-family:Montserrat,sans-serif;
            transition:all 0.3s;"
            onmouseover="this.style.transform='translateY(-2px)';this.style.boxShadow='0 8px 25px rgba(16,185,129,0.3)'"
            onmouseout="this.style.transform='translateY(0)';this.style.boxShadow='none'"
        >
            ✅ Listo - Cerrar
        </button>
    ` : '';
    
    modal.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;border-bottom:1px solid rgba(255,255,255,0.1);padding-bottom:15px;">
            <h3 style="color:#ff6b35;font-size:22px;font-weight:800;margin:0;">${titulo}</h3>
            <button onclick="document.getElementById('saborOverlay').remove()" 
                style="background:none;border:2px solid rgba(255,255,255,0.2);color:white;width:36px;height:36px;
                border-radius:50%;cursor:pointer;font-size:18px;">✕</button>
        </div>
        <div style="text-align:center;margin-bottom:20px;background:rgba(255,107,53,0.05);padding:16px;border-radius:12px;">
            <span style="font-size:48px;display:block;">${producto.emoji}</span>
            <div style="font-size:18px;font-weight:700;color:white;">${producto.nombre}</div>
            <div style="font-size:16px;color:#ff8c42;font-weight:600;">$${producto.precio}</div>
            <div style="font-size:12px;color:#a0a0b0;margin-top:8px;">${subtitulo}</div>
            ${saboresSeleccionados.length > 0 && producto.id !== 16 ? `
                <div style="margin-top:10px;padding:8px;background:rgba(16,185,129,0.1);border-radius:8px;border:1px solid rgba(16,185,129,0.2);">
                    <span style="font-size:11px;color:#10b981;font-weight:600;">Sabores seleccionados: ${saboresSeleccionados.join(', ')}</span>
                </div>
            ` : ''}
        </div>
        <div style="display:flex;flex-direction:column;">
            ${saboresHTML}
        </div>
        ${botonListo}
    `;
    
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
}

// Función para seleccionar sabor y agregar al carrito
function seleccionarSabor(productoId, sabor) {
    const producto = getMenuData().find(x => x.id === productoId);
    if (!producto) return;
    
    // Buscar si ya existe el producto en el carrito
    const exist = cartPOS.find(i => i.id === productoId);
    
    if (exist) {
        // Para la promo de 4 alitas (ID 16), solo permitir 1 sabor
        if (productoId === 16) {
            const overlay = document.getElementById('saborOverlay');
            if (overlay) overlay.remove();
            mostrarNotificacion('⚠️ La promoción 4 ALITAS solo permite 1 sabor');
            return;
        }
        
        // Si ya existe, manejar los sabores
        if (!exist.sabores) {
            exist.sabores = [exist.sabor];
        }
        
        // Si el sabor ya está seleccionado, quitarlo
        const index = exist.sabores.indexOf(sabor);
        if (index > -1) {
            exist.sabores.splice(index, 1);
            if (exist.sabores.length === 0) {
                // Si no quedan sabores, eliminar el producto
                cartPOS = cartPOS.filter(i => i.id !== productoId);
                const overlay = document.getElementById('saborOverlay');
                if (overlay) overlay.remove();
                renderCartPOS();
                mostrarNotificacion(`🍗 ${producto.nombre} eliminado del pedido`);
                return;
            }
        } else {
            // Agregar el sabor
            exist.sabores.push(sabor);
        }
        
        exist.cantidad = 1;
        exist.sabor = exist.sabores.join(', ');
        
        // Actualizar el modal para mostrar cambios visuales
        const overlay = document.getElementById('saborOverlay');
        if (overlay && productoId !== 16) {
            mostrarSelectorSabor(producto);
            renderCartPOS();
            return;
        }
    } else {
        // Si no existe, crear nuevo producto
        cartPOS.push({ 
            id: producto.id, 
            nombre: producto.nombre, 
            precio: producto.precio, 
            emoji: producto.emoji, 
            cantidad: 1,
            sabor: sabor,
            sabores: [sabor]
        });
    }
    
    // Para 4 alitas, cerrar modal después de seleccionar
    if (productoId === 16) {
        const overlay = document.getElementById('saborOverlay');
        if (overlay) overlay.remove();
    }
    
    renderCartPOS();
    
    // Mostrar notificación
    if (productoId !== 16) {
        mostrarNotificacion(`🍗 ${producto.nombre} - ${sabor} ${exist && exist.sabores && exist.sabores.includes(sabor) ? 'agregado' : 'quitado'}`);
    } else {
        mostrarNotificacion(`🍗 ${producto.nombre} - ${sabor} agregado`);
    }
}

// Función para mostrar notificación
function mostrarNotificacion(mensaje) {
    const oldToast = document.querySelector('.toast-sabor');
    if (oldToast) oldToast.remove();
    
    const toast = document.createElement('div');
    toast.className = 'toast-sabor';
    toast.textContent = mensaje;
    toast.style.cssText = `
        position: fixed; bottom: 24px; right: 24px; background: #1a1a25;
        border: 1px solid #10b981; color: white; padding: 14px 24px;
        border-radius: 12px; font-weight: 600; font-size: 14px;
        z-index: 9999; transform: translateY(120px);
        transition: transform 0.3s ease; box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        font-family: 'Montserrat', sans-serif;
    `;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.transform = 'translateY(0)';
    }, 10);
    
    setTimeout(() => {
        toast.style.transform = 'translateY(120px)';
        setTimeout(() => toast.remove(), 300);
    }, 2500);
}

// Inicializar mesas de prueba si no existen
function inicializarMesas() {
    const mesasExistentes = localStorage.getItem('marketpos_mesas');
    if (!mesasExistentes || JSON.parse(mesasExistentes).length === 0) {
        const mesasIniciales = [
            { numero: 1, estado: 'libre', orden: [] },
            { numero: 2, estado: 'libre', orden: [] },
            { numero: 3, estado: 'libre', orden: [] },
            { numero: 4, estado: 'libre', orden: [] },
            { numero: 5, estado: 'libre', orden: [] },
            { numero: 6, estado: 'libre', orden: [] },
            { numero: 7, estado: 'libre', orden: [] },
            { numero: 8, estado: 'libre', orden: [] },
            { numero: 9, estado: 'libre', orden: [] },
            { numero: 10, estado: 'libre', orden: [] }
        ];
        localStorage.setItem('marketpos_mesas', JSON.stringify(mesasIniciales));
    }
}

// Llamar a la función de inicialización
inicializarMesas();

setTimeout(function() {
    const facturaDiv = document.getElementById('clienteFactura');
    if (facturaDiv) facturaDiv.style.display = 'none';
}, 300);

(function() {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
    script.onload = () => emailjs.init('WopHgNwctZJCExy_g');
    document.head.appendChild(script);
})();

function switchView(view) {
    document.querySelectorAll('.sb-btn').forEach(b => b.classList.remove('active'));
    event.target.closest('.sb-btn').classList.add('active');
    document.getElementById('viewMenu').style.display = view === 'menu' ? 'flex' : 'none';
    document.getElementById('viewMesas').style.display = view === 'mesas' ? 'block' : 'none';
    if (view === 'mesas') renderizarMesasPOS();
    if (view === 'cocina') window.open('cocina.html', '_blank');
}

function getMenuData() {
    return [
        { id: 1, nombre: "TITO BURGER", precio: 4.99, categoria: "hamburguesas", emoji: "🍔", img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200" },
        { id: 2, nombre: "HAWAI", precio: 3.75, categoria: "hamburguesas", emoji: "🍍", img: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=200" },
        { id: 3, nombre: "THE BIG BOSS", precio: 5.50, categoria: "hamburguesas", emoji: "👑", img: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=200" },
        { id: 4, nombre: "PARRILLERA", precio: 3.95, categoria: "hamburguesas", emoji: "🥓", img: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=200" },
        { id: 5, nombre: "HULK", precio: 6.99, categoria: "hamburguesas", emoji: "💪", img: "https://images.unsplash.com/photo-1586816001966-79b736744398?w=200" },
        { id: 6, nombre: "CLÁSICA", precio: 2.50, categoria: "hamburguesas", emoji: "🍔", img: "https://images.unsplash.com/photo-1561758033-7e924f619b47?w=200" },
        { id: 7, nombre: "CLÁSICA + PAPAS", precio: 2.99, categoria: "hamburguesas", emoji: "🍟", img: "https://images.unsplash.com/photo-1571091718765-18b5b145add?w=200" },
        { id: 8, nombre: "PICAÑA", precio: 9.99, categoria: "cortes", emoji: "🥩", img: "https://images.unsplash.com/photo-1544025162-d76694265947?w=200" },
        { id: 9, nombre: "BIFE DE CHORIZO", precio: 9.99, categoria: "cortes", emoji: "🥩", img: "https://images.unsplash.com/photo-1600891964092-4316c288032e?w=200" },
        { id: 10, nombre: "RYBEYE", precio: 8.99, categoria: "cortes", emoji: "🥩", img: "https://images.unsplash.com/photo-1615937722923-67f6deaf2cc9?w=200" },
        { id: 11, nombre: "T-BONE", precio: 9.99, categoria: "cortes", emoji: "🦴", img: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=200" },
        { id: 12, nombre: "CORDERO", precio: 6.99, categoria: "cortes", emoji: "🐑", img: "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=200" },
        { id: 13, nombre: "LOMITO DE RES", precio: 4.99, categoria: "cortes", emoji: "🥩", img: "https://images.unsplash.com/photo-1558030006-450675393462?w=200" },
        { id: 14, nombre: "POLLO A LA PARRILLA", precio: 4.50, categoria: "cortes", emoji: "🍗", img: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=200" },
        { id: 15, nombre: "CHULETA DE CERDO", precio: 4.99, categoria: "cortes", emoji: "🐷", img: "https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=200" },
        { id: 16, nombre: "4 ALITAS (8)", precio: 6.00, categoria: "alitas", emoji: "🍗", img: "https://images.unsplash.com/photo-1605710379250-f332254b96de?w=200" },
        { id: 17, nombre: "8 ALITAS (16)", precio: 9.99, categoria: "alitas", emoji: "🍗", img: "https://images.unsplash.com/photo-1605710379250-f332254b96de?w=200" },
        { id: 18, nombre: "12 ALITAS (24)", precio: 13.99, categoria: "alitas", emoji: "🍗", img: "https://images.unsplash.com/photo-1605710379250-f332254b96de?w=200" },
        { id: 19, nombre: "15 ALITAS (30)", precio: 15.99, categoria: "alitas", emoji: "🍗", img: "https://images.unsplash.com/photo-1605710379250-f332254b96de?w=200" },
        { id: 20, nombre: "20 ALITAS (40)", precio: 20.99, categoria: "alitas", emoji: "🍗", img: "https://images.unsplash.com/photo-1605710379250-f332254b96de?w=200" },
        { id: 21, nombre: "SUPER PICADITA", precio: 6.99, categoria: "parrilla", emoji: "🎯", img: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=200" },
        { id: 22, nombre: "PARRILLADA TITO", precio: 8.99, categoria: "parrilla", emoji: "🔥", img: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=200" },
        { id: 23, nombre: "COSTILLAS BBQ", precio: 6.99, categoria: "parrilla", emoji: "🍖", img: "https://images.unsplash.com/photo-1544025162-d76694265947?w=200" },
        { id: 24, nombre: "PAPA CON CHILLY", precio: 4.50, categoria: "parrilla", emoji: "🧀", img: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=200" },
        { id: 25, nombre: "CHORY PAPA", precio: 4.00, categoria: "parrilla", emoji: "🌭", img: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=200" },
        { id: 26, nombre: "CHORIPÁN", precio: 3.50, categoria: "parrilla", emoji: "🌭", img: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=200" },
        { id: 27, nombre: "KIT ESTRELLA", precio: 6.99, categoria: "promociones", emoji: "⭐", img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200" },
        { id: 28, nombre: "COMBO PAREJA", precio: 10.99, categoria: "promociones", emoji: "💑", img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200" },
        { id: 29, nombre: "COMBO COMPARTIR", precio: 13.99, categoria: "promociones", emoji: "🎉", img: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=200" },
        { id: 30, nombre: "COMBO FAMILIAR", precio: 15.99, categoria: "promociones", emoji: "👨‍👩‍👧‍👦", img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200" },
        { id: 31, nombre: "PAPAS TITO", precio: 1.50, categoria: "extras", emoji: "🍟", img: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=200" },
        { id: 32, nombre: "CHORIZO NORMAL", precio: 1.00, categoria: "extras", emoji: "🌭", img: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=200" },
        { id: 33, nombre: "CHORIZO PAISA", precio: 1.50, categoria: "extras", emoji: "🌭", img: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=200" },
        { id: 34, nombre: "CARNE HAMBURGUESA", precio: 1.50, categoria: "extras", emoji: "🥩", img: "https://images.unsplash.com/photo-1544025162-d76694265947?w=200" },
        { id: 35, nombre: "PIÑA", precio: 0.75, categoria: "extras", emoji: "🍍", img: "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=200" },
        { id: 36, nombre: "CUERO", precio: 2.00, categoria: "extras", emoji: "🥓", img: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=200" },
        { id: 37, nombre: "ENSALADA", precio: 1.50, categoria: "extras", emoji: "🥗", img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200" },
        { id: 38, nombre: "MAYONESA TITO", precio: 2.00, categoria: "extras", emoji: "🫙", img: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=200" },
        { id: 39, nombre: "LIMONADA", precio: 2.50, categoria: "bebidas", emoji: "🍋", img: "https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=200" },
        { id: 40, nombre: "JARRA LIMONADA", precio: 5.00, categoria: "bebidas", emoji: "🍋", img: "https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=200" },
        { id: 41, nombre: "COCA-COLA", precio: 1.50, categoria: "bebidas", emoji: "🥤", img: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=200" },
        { id: 42, nombre: "AGUA", precio: 1.00, categoria: "bebidas", emoji: "💧", img: "https://images.unsplash.com/photo-1616118132534-381148898bb4?w=200" }
    ];
}

function changeCategory(cat, el) {
    activeCategoryPOS = cat;
    document.querySelectorAll('.categories-row-premium .cat-btn').forEach(c => c.classList.remove('active'));
    el.classList.add('active');
    renderProductsPOS();
}

function renderProductsPOS() {
    const menu = getMenuData();
    const products = activeCategoryPOS === 'todo' ? menu : menu.filter(p => p.categoria === activeCategoryPOS);
    document.getElementById('productsGrid').innerHTML = products.map(p => `
        <div class="product-card-pos" onclick="addToCartPOS(${p.id})">
            <div class="product-img-container">
                <img src="${p.img}" alt="${p.nombre}" class="product-img">
                <div class="product-img-overlay">
                    <span>+</span>
                </div>
            </div>
            <div class="product-info-pos">
                <span class="emoji">${p.emoji}</span>
                <div class="nombre">${p.nombre}</div>
                <div class="precio">$${p.precio}</div>
            </div>
        </div>
    `).join('');
}

function buscarProductoLive() {
    const t = document.getElementById('searchInput').value.toLowerCase();
    const products = t ? getMenuData().filter(p => p.nombre.toLowerCase().includes(t)) : getMenuData().filter(p => activeCategoryPOS === 'todo' || p.categoria === activeCategoryPOS);
    document.getElementById('productsGrid').innerHTML = products.map(p => `
        <div class="product-card-pos" onclick="addToCartPOS(${p.id})">
            <div class="product-img-container">
                <img src="${p.img}" alt="${p.nombre}" class="product-img">
                <div class="product-img-overlay">
                    <span>+</span>
                </div>
            </div>
            <div class="product-info-pos">
                <span class="emoji">${p.emoji}</span>
                <div class="nombre">${p.nombre}</div>
                <div class="precio">$${p.precio}</div>
            </div>
        </div>
    `).join('');
}

function addToCartPOS(id) {
    const p = getMenuData().find(x => x.id === id);
    
    // Si es alita, mostrar selector de sabor
    if (p.categoria === 'alitas' && saboresAlitas[id]) {
        mostrarSelectorSabor(p);
        return;
    }
    
    // Si no es alita, agregar normalmente
    const exist = cartPOS.find(i => i.id === id && !i.sabor);
    exist ? exist.cantidad++ : cartPOS.push({ id: p.id, nombre: p.nombre, precio: p.precio, emoji: p.emoji, cantidad: 1 });
    renderCartPOS();
}

function renderCartPOS() {
    const subtotal = cartPOS.reduce((s, i) => s + i.precio * i.cantidad, 0);
    document.getElementById('subtotalPOS').textContent = '$' + subtotal.toFixed(2);
    document.getElementById('totalPOS').textContent = '$' + subtotal.toFixed(2);
    const container = document.getElementById('cartItems');
    if (cartPOS.length === 0) { container.innerHTML = '<p class="cart-empty">No hay productos</p>'; return; }
    container.innerHTML = cartPOS.map((i, idx) => `
        <div class="cart-item-pos">
            <div class="info">
                <strong>${i.nombre}</strong>
                ${i.sabor ? `<span style="background:rgba(255,107,53,0.2);color:#ff8c42;padding:2px 8px;border-radius:10px;font-size:10px;margin-left:6px;">🍗 ${i.sabor}</span>` : ''}
                <span>${i.cantidad} pcs</span>
            </div>
            <div class="qty">
                <button class="btn-qty-pos" onclick="cartPOS[${idx}].cantidad--; if(cartPOS[${idx}].cantidad<=0)cartPOS.splice(${idx},1);renderCartPOS();">−</button>
                <span>${i.cantidad}</span>
                <button class="btn-qty-pos" onclick="cartPOS[${idx}].cantidad++;renderCartPOS();">+</button>
            </div>
            <span>$${(i.precio*i.cantidad).toFixed(2)}</span>
        </div>
    `).join('');
}

function renderizarMesasPOS() {
    const grid = document.getElementById('mesasGrid');
    if (!grid) return;
    
    const mesasLocal = JSON.parse(localStorage.getItem('marketpos_mesas') || '[]');
    
    if (mesasLocal.length > 0) {
        grid.innerHTML = mesasLocal.map(m => `
            <div class="mesa-card-pos ${m.estado}" onclick="${m.estado === 'ocupada' ? `cobrarMesa(${m.numero})` : ''}">
                <span class="numero">${m.numero}</span>
                <span class="estado">${m.estado === 'libre' ? 'Libre' : 'Ocupada'}</span>
                ${m.estado === 'ocupada' ? '<span style="font-size:0.6rem;color:#c0392b;">💵 Cobrar</span>' : ''}
            </div>
        `).join('');
        return;
    }
    
    const mesasIniciales = [
        { numero: 1, estado: 'libre', orden: [] },
        { numero: 2, estado: 'libre', orden: [] },
        { numero: 3, estado: 'libre', orden: [] },
        { numero: 4, estado: 'libre', orden: [] },
        { numero: 5, estado: 'libre', orden: [] },
        { numero: 6, estado: 'libre', orden: [] },
        { numero: 7, estado: 'libre', orden: [] },
        { numero: 8, estado: 'libre', orden: [] },
        { numero: 9, estado: 'libre', orden: [] },
        { numero: 10, estado: 'libre', orden: [] }
    ];
    localStorage.setItem('marketpos_mesas', JSON.stringify(mesasIniciales));
    
    grid.innerHTML = mesasIniciales.map(m => `
        <div class="mesa-card-pos ${m.estado}" onclick="${m.estado === 'ocupada' ? `cobrarMesa(${m.numero})` : ''}">
            <span class="numero">${m.numero}</span>
            <span class="estado">${m.estado === 'libre' ? 'Libre' : 'Ocupada'}</span>
            ${m.estado === 'ocupada' ? '<span style="font-size:0.6rem;color:#c0392b;">💵 Cobrar</span>' : ''}
        </div>
    `).join('');
}

async function cobrarMesa(numero) {
    let pedido = null;
    try { const res = await fetch('/api/pedidos'); const pedidos = await res.json(); pedido = pedidos.find(p => p.cliente?.mesa == numero && p.estado !== 'entregado'); } catch(e) {}
    if (!pedido) { const pedidosLocal = JSON.parse(localStorage.getItem('marketpos_pedidos_online') || '[]'); pedido = pedidosLocal.find(p => p.cliente?.mesa == numero && p.estado !== 'entregado'); }
    if (!pedido) { const mesasLocal = JSON.parse(localStorage.getItem('marketpos_mesas') || '[]'); const mesa = mesasLocal.find(m => m.numero === parseInt(numero)); if (mesa && mesa.orden && mesa.orden.length > 0) { pedido = { items: mesa.orden, total: mesa.orden.reduce((s, i) => s + (i.precio || 0) * (i.cantidad || 1), 0), cliente: { mesa: numero } }; } }
    if (!pedido) { alert('No se encontró pedido para Mesa ' + numero); return; }
    
    cartPOS = (pedido.items || []).map(i => ({ id: i.id, nombre: i.nombre, precio: i.precio || 0, emoji: i.emoji || '🍽️', cantidad: i.cantidad || 1 }));
    document.getElementById('mesaInputPOS').value = numero;
    document.getElementById('tipoPedidoPOS').value = 'mesa';
    document.getElementById('viewMenu').style.display = 'flex';
    document.getElementById('viewMesas').style.display = 'none';
    document.querySelectorAll('.sb-btn').forEach(b => b.classList.remove('active'));
    document.querySelector('.sb-btn').classList.add('active');
    renderCartPOS();
    document.getElementById('clienteFactura').style.display = 'block';
    
    if (!document.getElementById('metodoPago')) {
        document.getElementById('clienteFactura').insertAdjacentHTML('afterbegin', `<select id="metodoPago" class="input-premium" style="margin-bottom:6px;" onchange="mostrarEfectivo()"><option value="">💳 Método de pago</option><option value="efectivo">💵 Efectivo</option><option value="tarjeta">💳 Tarjeta</option><option value="transferencia">🏦 Transferencia</option></select><div id="efectivoSection" style="display:none;"><input type="number" id="montoRecibido" placeholder="💵 Monto recibido" class="input-premium" oninput="calcularCambioPOS()"><div id="cambioDisplay" style="text-align:center;font-size:1.2rem;font-weight:700;margin:8px 0;display:none;">Cambio: <span id="cambioValor" style="color:#27ae60;">$0.00</span></div></div>`);
    }
    
    document.getElementById('facturaNombre').value = '';
    document.getElementById('facturaRUC').value = '';
    document.getElementById('facturaEmail').value = '';
    document.getElementById('facturaDireccion').value = '';
    
    let resumen = '🍽️ CONSUMO MESA ' + numero + '\n\n';
    (pedido.items || []).forEach(i => resumen += `${i.emoji || '🍽️'} ${i.nombre} x${i.cantidad || 1} = $${((i.precio || 0) * (i.cantidad || 1)).toFixed(2)}\n`);
    resumen += `\n💰 TOTAL: $${(pedido.total || 0).toFixed(2)}\n\n📝 Ingrese datos para factura.`;
    alert(resumen);
}

function mostrarEfectivo() {
    const metodo = document.getElementById('metodoPago')?.value;
    const efectivoSection = document.getElementById('efectivoSection');
    if (efectivoSection) efectivoSection.style.display = metodo === 'efectivo' ? 'block' : 'none';
}

function calcularCambioPOS() {
    const total = cartPOS.reduce((s, i) => s + i.precio * i.cantidad, 0);
    const recibido = parseFloat(document.getElementById('montoRecibido')?.value) || 0;
    const cambio = recibido - total;
    const display = document.getElementById('cambioDisplay');
    const valor = document.getElementById('cambioValor');
    if (recibido > 0) {
        display.style.display = 'block';
        if (cambio >= 0) { valor.textContent = '$' + cambio.toFixed(2); valor.style.color = '#27ae60'; }
        else { valor.textContent = 'Falta $' + Math.abs(cambio).toFixed(2); valor.style.color = '#c0392b'; }
    } else { display.style.display = 'none'; }
}

function agregarMesa() {
    const mesasLocal = JSON.parse(localStorage.getItem('marketpos_mesas') || '[]');
    const ultimoNumero = mesasLocal.length > 0 ? Math.max(...mesasLocal.map(m => m.numero)) : 0;
    const nuevaMesa = { numero: ultimoNumero + 1, estado: 'libre', orden: [] };
    mesasLocal.push(nuevaMesa);
    localStorage.setItem('marketpos_mesas', JSON.stringify(mesasLocal));
    renderizarMesasPOS();
}

async function toggleDashboard() {
    let pedidos = [];
    try { const res = await fetch('/api/pedidos'); pedidos = await res.json(); } catch(e) { pedidos = JSON.parse(localStorage.getItem('marketpos_pedidos_online') || '[]'); }
    const hoy = new Date().toDateString();
    const pedidosHoy = pedidos.filter(p => new Date(p.fecha).toDateString() === hoy);
    const totalVendido = pedidosHoy.reduce((s, p) => s + (p.total || 0), 0);
    const ticketPromedio = pedidosHoy.length > 0 ? totalVendido / pedidosHoy.length : 0;
    const conteo = {}; pedidosHoy.forEach(p => { (p.items || []).forEach(i => { conteo[i.nombre] = (conteo[i.nombre] || 0) + (i.cantidad || 1); }); });
    const masVendido = Object.entries(conteo).sort((a,b) => b[1]-a[1]).slice(0, 5);
    const metodos = {}; pedidosHoy.forEach(p => { const m = p.cliente?.tipoPedido || 'mesa'; metodos[m] = (metodos[m] || 0) + 1; });
    const win = window.open('', 'Dashboard', 'width=600,height=700');
    win.document.write(`<!DOCTYPE html><html><head><title>TITO BURGER</title><link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet"><style>*{margin:0;padding:0;font-family:'Montserrat',sans-serif}body{background:#f5ebe0;padding:20px;color:#3d2b1f}.header{text-align:center;margin-bottom:25px}.header h1{color:#c0392b;font-size:1.8rem;font-weight:900}.stats{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:20px}.stat-card{background:white;padding:18px;border-radius:10px;text-align:center}.stat-card .num{font-size:1.8rem;font-weight:800}.section-title{font-weight:700;margin:15px 0 10px}.top-list{background:white;border-radius:10px;padding:15px}.top-item{display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #f0e8dc}.badge{background:#c0392b;color:white;padding:4px 10px;border-radius:12px;font-size:0.7rem;font-weight:700}.btn{display:block;width:100%;padding:12px;background:#c0392b;color:white;border:none;border-radius:8px;font-weight:700;cursor:pointer;margin-top:15px}</style></head><body><div class="header"><h1>🔥 TITO BURGER</h1><p>${new Date().toLocaleDateString()}</p></div><div class="stats"><div class="stat-card"><div class="num">$${totalVendido.toFixed(2)}</div><div class="label">Ventas Hoy</div></div><div class="stat-card"><div class="num">${pedidosHoy.length}</div><div class="label">Pedidos Hoy</div></div><div class="stat-card"><div class="num">$${ticketPromedio.toFixed(2)}</div><div class="label">Ticket Promedio</div></div><div class="stat-card"><div class="num">${pedidos.length}</div><div class="label">Total Pedidos</div></div></div><div class="section-title">🏆 Más Vendidos</div><div class="top-list">${masVendido.length > 0 ? masVendido.map(([n,c],i) => `<div class="top-item"><span>${i+1}. ${n}</span><span class="badge">x${c}</span></div>`).join('') : '<p>Sin datos</p>'}</div><div class="section-title">📋 Tipos</div><div class="top-list">${Object.entries(metodos).map(([t,c]) => `<div class="top-item"><span>${t==='mesa'?'🪑 Mesa':t==='llevar'?'🛵 Recoger':'🚀 Delivery'}</span><span class="badge">${c}</span></div>`).join('')}</div><button class="btn" onclick="window.print()">🖨️ Imprimir</button></body></html>`);
    win.document.close();
}

async function enviarACocinaPOS() {
    if (cartPOS.length === 0) { alert('Agregue productos'); return; }
    const mesa = document.getElementById('mesaInputPOS').value || '1';
    const total = cartPOS.reduce((s, i) => s + i.precio * i.cantidad, 0);
    const pedido = { cliente: { nombre: 'Mesero', mesa, tipoPedido: tipoPedidoActual }, items: cartPOS.map(i => ({ id: i.id, nombre: i.nombre, precio: i.precio, emoji: i.emoji, cantidad: i.cantidad, sabor: i.sabor || null })), total };
    try { await fetch('/api/pedidos', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(pedido) }); } catch(e) {}
    const pedidosLocal = JSON.parse(localStorage.getItem('marketpos_pedidos_online') || '[]');
    pedido.id = Date.now(); pedido.fecha = new Date().toISOString(); pedido.estado = 'nuevo';
    pedidosLocal.unshift(pedido);
    localStorage.setItem('marketpos_pedidos_online', JSON.stringify(pedidosLocal));
    const mesasLocal = JSON.parse(localStorage.getItem('marketpos_mesas') || '[]');
    const mesaObj = mesasLocal.find(m => m.numero === parseInt(mesa));
    if (mesaObj) { mesaObj.estado = 'ocupada'; mesaObj.orden = pedido.items; }
    localStorage.setItem('marketpos_mesas', JSON.stringify(mesasLocal));
    try { const res = await fetch('/api/mesas'); const apiMesas = await res.json(); const mesaAPI = apiMesas.find(m => m.numero === parseInt(mesa)); if (mesaAPI) { await fetch('/api/mesas/' + mesaAPI.id, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ estado: 'ocupada', orden: pedido.items }) }); } } catch(e) {}
    alert('✅ Pedido enviado a cocina - Mesa ' + mesa + ' ocupada');
    cartPOS = []; renderCartPOS();
}

async function cobrarPOS() {
    if (cartPOS.length === 0) { alert('Agregue productos'); return; }
    const facturaDiv = document.getElementById('clienteFactura');
    if (!facturaDiv || facturaDiv.style.display === 'none') {
        if (facturaDiv) facturaDiv.style.display = 'block';
        if (!document.getElementById('metodoPago')) {
            facturaDiv.insertAdjacentHTML('afterbegin', `<select id="metodoPago" class="input-premium" style="margin-bottom:6px;" onchange="mostrarEfectivo()"><option value="">💳 Método de pago</option><option value="efectivo">💵 Efectivo</option><option value="tarjeta">💳 Tarjeta</option><option value="transferencia">🏦 Transferencia</option></select><div id="efectivoSection" style="display:none;"><input type="number" id="montoRecibido" placeholder="💵 Monto recibido" class="input-premium" oninput="calcularCambioPOS()"><div id="cambioDisplay" style="text-align:center;font-size:1.2rem;font-weight:700;margin:8px 0;display:none;">Cambio: <span id="cambioValor" style="color:#27ae60;">$0.00</span></div></div>`);
        }
        alert('📄 Complete los datos y método de pago');
        return;
    }
    
    const mesa = document.getElementById('mesaInputPOS').value || '1';
    const total = cartPOS.reduce((s, i) => s + i.precio * i.cantidad, 0);
    const metodoPago = document.getElementById('metodoPago')?.value || 'No especificado';
    const recibido = parseFloat(document.getElementById('montoRecibido')?.value) || 0;
    const cambio = recibido - total;
    
    if (!document.getElementById('metodoPago')?.value) { alert('⚠️ Seleccione método de pago'); return; }
    if (metodoPago === 'efectivo' && recibido < total) { alert('⚠️ Monto insuficiente. Faltan $' + Math.abs(cambio).toFixed(2)); return; }
    
    const clienteFactura = {
        nombre: document.getElementById('facturaNombre').value || 'Consumidor Final',
        ruc: document.getElementById('facturaRUC').value || '9999999999999',
        email: document.getElementById('facturaEmail').value || '',
        direccion: document.getElementById('facturaDireccion').value || 'Av. Principal 123',
        metodoPago, recibido, cambio
    };
    
    const facturaNum = '001-001-' + String(Math.floor(Math.random()*99999999)).padStart(8,'0');
    const pedidoActual = { cliente: { ...clienteFactura, mesa, tipoPedido: tipoPedidoActual }, items: cartPOS.map(i => ({ id: i.id, nombre: i.nombre, precio: i.precio, emoji: i.emoji, cantidad: i.cantidad, sabor: i.sabor || null })), total, factura: clienteFactura };
    
    const facturaHTML = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Factura</title><style>body{font-family:Arial;padding:20px;max-width:300px;margin:0 auto}h2{text-align:center;color:#c0392b}table{width:100%}td,th{padding:6px;border-bottom:1px solid #ddd;font-size:12px}.total{font-size:18px;font-weight:bold;color:#c0392b}</style></head><body><h2>🔥 TITO BURGER</h2><p><strong>Factura:</strong> ${facturaNum}</p><p><strong>Fecha:</strong> ${new Date().toLocaleString()}</p><p><strong>Cliente:</strong> ${clienteFactura.nombre}</p><p><strong>RUC:</strong> ${clienteFactura.ruc}</p><p><strong>Método:</strong> ${clienteFactura.metodoPago}</p>${metodoPago === 'efectivo' ? `<p><strong>Recibido:</strong> $${recibido.toFixed(2)}</p><p><strong>Cambio:</strong> $${cambio.toFixed(2)}</p>` : ''}<table><tr><th>Producto</th><th>Cant</th><th>Total</th></tr>${pedidoActual.items.map(i => `<tr><td>${i.emoji} ${i.nombre}${i.sabor ? ' (' + i.sabor + ')' : ''}</td><td>x${i.cantidad}</td><td>$${(i.precio*i.cantidad).toFixed(2)}</td></tr>`).join('')}</table><p class="total">TOTAL: $${total.toFixed(2)}</p><p style="text-align:center">Gracias por su visita</p></body></html>`;
    const blob = new Blob([facturaHTML], {type:'text/html'}); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `Factura_TITO_${facturaNum}.html`; a.click();
    
    if (clienteFactura.email && window.emailjs) { emailjs.send('service_nj7glup', 'template_szgtsns', { to_email: clienteFactura.email, cliente_nombre: clienteFactura.nombre, cliente_ruc: clienteFactura.ruc, total: '$' + total.toFixed(2), factura_numero: facturaNum, items: pedidoActual.items.map(i => `${i.nombre}${i.sabor ? ' (' + i.sabor + ')' : ''} x${i.cantidad} - $${(i.precio*i.cantidad).toFixed(2)}`).join('\n'), fecha: new Date().toLocaleString() }).catch(()=>{}); }
    
    if (tipoPedidoActual === 'mesa') {
        const mesasLocal = JSON.parse(localStorage.getItem('marketpos_mesas') || '[]');
        const mesaLocal = mesasLocal.find(x => x.numero === parseInt(mesa));
        if (mesaLocal) { mesaLocal.estado = 'libre'; mesaLocal.orden = []; localStorage.setItem('marketpos_mesas', JSON.stringify(mesasLocal)); }
        try { const res = await fetch('/api/mesas'); const apiMesas = await res.json(); const mesaAPI = apiMesas.find(x => x.numero === parseInt(mesa)); if (mesaAPI) { await fetch('/api/mesas/' + mesaAPI.id, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ estado: 'libre', orden: [] }) }); } } catch(e) {}
    }
    
    let mensaje = '✅ Cobro realizado - Factura: ' + facturaNum + ' - Método: ' + metodoPago;
    if (metodoPago === 'efectivo') mensaje += ' - Cambio: $' + cambio.toFixed(2);
    alert(mensaje);
    
    cartPOS = []; renderCartPOS();
    document.getElementById('clienteFactura').style.display = 'none';
    document.getElementById('facturaNombre').value = '';
    document.getElementById('facturaRUC').value = '';
    document.getElementById('facturaEmail').value = '';
    document.getElementById('facturaDireccion').value = '';
    document.getElementById('montoRecibido') && (document.getElementById('montoRecibido').value = '');
    document.getElementById('cambioDisplay') && (document.getElementById('cambioDisplay').style.display = 'none');
    document.getElementById('metodoPago')?.remove();
    document.getElementById('efectivoSection')?.remove();
}

function logout() { localStorage.clear(); location.reload(); }

document.getElementById('tipoPedidoPOS').addEventListener('change', function() {
    tipoPedidoActual = this.value;
    const facturaDiv = document.getElementById('clienteFactura');
    const mesaInput = document.getElementById('mesaInputPOS');
    if (this.value === 'mesa') { facturaDiv.style.display = 'none'; mesaInput.style.display = 'block'; }
    else { facturaDiv.style.display = 'block'; mesaInput.style.display = 'none'; }
});

setInterval(renderizarMesasPOS, 5000);
renderProductsPOS();