let cartPOS = [];
let activeCategoryPOS = 'hamburguesas';
let tipoPedidoActual = 'mesa';
let pedidoActual = null;
let pedidoLlevarId = null;

// ============================================
// SABORES DE ALITAS
// ============================================
const saboresAlitas = {
    16: ['BBQ Clásica', 'BBQ Picante', 'BBQ Miel', 'Lemon Pepper'],
    17: ['BBQ Clásica', 'BBQ Picante', 'BBQ Miel', 'Buffalo Suave', 'Buffalo Medio', 'Buffalo Extremo'],
    18: ['BBQ Clásica', 'BBQ Picante', 'BBQ Miel', 'Buffalo Suave', 'Buffalo Medio', 'Buffalo Extremo', 'Mango Habanero'],
    19: ['BBQ Clásica', 'BBQ Picante', 'BBQ Miel', 'Buffalo Suave', 'Buffalo Medio', 'Lemon Pepper', 'Mango Habanero'],
    20: ['BBQ Clásica', 'BBQ Picante', 'BBQ Miel', 'Buffalo Suave', 'Buffalo Medio', 'Buffalo Extremo', 'Lemon Pepper', 'Mango Habanero', 'Korean BBQ']
};

// ============================================
// SELECCIONAR SABOR
// ============================================
function mostrarSelectorSabor(producto) {
    const sabores = saboresAlitas[producto.id];
    if (!sabores) return;
    
    const oldOverlay = document.getElementById('saborOverlay');
    if (oldOverlay) oldOverlay.remove();
    
    const overlay = document.createElement('div');
    overlay.id = 'saborOverlay';
    overlay.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0,0,0,0.85); backdrop-filter: blur(8px);
        z-index: 9999; display: flex; justify-content: center; align-items: center;
        padding: 20px;
    `;
    
    const modal = document.createElement('div');
    modal.style.cssText = `
        background: #1a1a25; border: 2px solid #ff6b35; border-radius: 20px;
        padding: 30px; max-width: 420px; width: 100%; max-height: 80vh; overflow-y: auto;
        box-shadow: 0 20px 60px rgba(0,0,0,0.5);
    `;
    
    const existente = cartPOS.find(i => i.id === producto.id);
    const saboresSeleccionados = existente ? (existente.sabores || [existente.sabor]) : [];
    
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
        
        const seleccionado = saboresSeleccionados.includes(sabor);
        
        return `
            <button onclick="seleccionarSabor(${producto.id}, '${sabor.replace(/'/g, "\\'")}')" 
                style="width:100%; padding:14px; margin:5px 0; 
                background:${seleccionado ? '#ff6b35' : '#222230'}; 
                border:2px solid ${seleccionado ? '#ff6b35' : 'rgba(255,255,255,0.1)'}; 
                color:white; border-radius:12px; cursor:pointer; font-size:14px; font-weight:600; 
                text-align:left; transition:all 0.3s; font-family:Montserrat,sans-serif;
                display:flex; align-items:center; gap:10px;"
            >
                <span>${icono}</span>
                <span style="flex:1;">${sabor}</span>
                ${seleccionado ? '<span style="font-size:18px;">✅</span>' : ''}
            </button>
        `;
    }).join('');
    
    const botonListo = producto.id !== 16 ? `
        <button onclick="document.getElementById('saborOverlay').remove()" 
            style="width:100%; padding:14px; margin-top:15px; 
            background:linear-gradient(135deg,#10b981,#059669); 
            border:none; color:white; border-radius:12px; cursor:pointer; 
            font-size:16px; font-weight:700; font-family:Montserrat,sans-serif;"
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

function seleccionarSabor(productoId, sabor) {
    const producto = getMenuData().find(x => x.id === productoId);
    if (!producto) return;
    
    const exist = cartPOS.find(i => i.id === productoId);
    
    if (exist) {
        if (productoId === 16) {
            const overlay = document.getElementById('saborOverlay');
            if (overlay) overlay.remove();
            mostrarNotificacion('⚠️ La promoción 4 ALITAS solo permite 1 sabor');
            return;
        }
        
        if (!exist.sabores) {
            exist.sabores = [exist.sabor];
        }
        
        const index = exist.sabores.indexOf(sabor);
        if (index > -1) {
            exist.sabores.splice(index, 1);
            if (exist.sabores.length === 0) {
                cartPOS = cartPOS.filter(i => i.id !== productoId);
                const overlay = document.getElementById('saborOverlay');
                if (overlay) overlay.remove();
                renderCartPOS();
                mostrarNotificacion(`🍗 ${producto.nombre} eliminado del pedido`);
                return;
            }
        } else {
            exist.sabores.push(sabor);
        }
        
        exist.cantidad = 1;
        exist.sabor = exist.sabores.join(', ');
        
        const overlay = document.getElementById('saborOverlay');
        if (overlay && productoId !== 16) {
            mostrarSelectorSabor(producto);
            renderCartPOS();
            return;
        }
    } else {
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
    
    if (productoId === 16) {
        const overlay = document.getElementById('saborOverlay');
        if (overlay) overlay.remove();
    }
    
    renderCartPOS();
    
    if (productoId !== 16) {
        mostrarNotificacion(`🍗 ${producto.nombre} - ${sabor} ${exist && exist.sabores && exist.sabores.includes(sabor) ? 'agregado' : 'quitado'}`);
    } else {
        mostrarNotificacion(`🍗 ${producto.nombre} - ${sabor} agregado`);
    }
}

// ============================================
// NOTIFICACIONES
// ============================================
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

setTimeout(function() {
    const facturaDiv = document.getElementById('clienteFactura');
    if (facturaDiv) facturaDiv.style.display = 'none';
}, 300);

// EmailJS init (con manejo de errores)
try {
    (function() {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
        script.onload = () => {
            try {
                if (typeof emailjs !== 'undefined') {
                    emailjs.init('WopHgNwctZJCExy_g');
                }
            } catch(e) {
                console.log('EmailJS no disponible');
            }
        };
        script.onerror = () => console.log('EmailJS no se pudo cargar');
        document.head.appendChild(script);
    })();
} catch(e) {
    console.log('Error al cargar EmailJS');
}

function switchView(view) {
    document.querySelectorAll('.sb-btn').forEach(b => b.classList.remove('active'));
    const btn = event?.target?.closest('.sb-btn');
    if (btn) btn.classList.add('active');
    document.getElementById('viewMenu').style.display = view === 'menu' ? 'flex' : 'none';
    document.getElementById('viewMesas').style.display = view === 'mesas' ? 'block' : 'none';
    if (view === 'mesas') renderizarMesasPOS();
    if (view === 'cocina') window.open('cocina.html', '_blank');
}

function getMenuData() {
    return [
        { id: 1, nombre: "TITO BURGER", precio: 4.99, categoria: "hamburguesas", emoji: "🍔", img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200", desc: "¡Hola, amigos! ¡Vamos a comer un tito burrito!" },
        { id: 2, nombre: "HAWAI", precio: 3.75, categoria: "hamburguesas", emoji: "🍍", img: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=200", desc: "¡Qué delicioso! ¡Nos encanta el hawaii!" },
        { id: 3, nombre: "THE BIG BOSS", precio: 5.50, categoria: "hamburguesas", emoji: "👑", img: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=200", desc: "¡Es el mejor taco de la historia!" },
        { id: 4, nombre: "PARRILLERA", precio: 3.95, categoria: "hamburguesas", emoji: "🥓", img: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=200", desc: "¡Es el mejor parrillera!" },
        { id: 5, nombre: "HULK", precio: 6.99, categoria: "hamburguesas", emoji: "💪", img: "https://images.unsplash.com/photo-1586816001966-79b736744398?w=200", desc: "¡Es el mejor hulk!" },
        { id: 6, nombre: "CLÁSICA", precio: 2.50, categoria: "hamburguesas", emoji: "🍔", img: "https://images.unsplash.com/photo-1561758033-7e924f619b47?w=200", desc: "La clásica de siempre" },
        { id: 7, nombre: "CLÁSICA + PAPAS", precio: 2.99, categoria: "hamburguesas", emoji: "🍟", img: "https://images.unsplash.com/photo-1571091718765-18b5b145add?w=200", desc: "Clásica con papas" },
        { id: 8, nombre: "PICAÑA", precio: 9.99, categoria: "cortes", emoji: "🥩", img: "https://images.unsplash.com/photo-1544025162-d76694265947?w=200", desc: "Corte especial" },
        { id: 9, nombre: "BIFE DE CHORIZO", precio: 9.99, categoria: "cortes", emoji: "🥩", img: "https://images.unsplash.com/photo-1600891964092-4316c288032e?w=200", desc: "Bife de chorizo" },
        { id: 10, nombre: "RYBEYE", precio: 8.99, categoria: "cortes", emoji: "🥩", img: "https://images.unsplash.com/photo-1615937722923-67f6deaf2cc9?w=200", desc: "Ribeye" },
        { id: 11, nombre: "T-BONE", precio: 9.99, categoria: "cortes", emoji: "🦴", img: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=200", desc: "T-Bone" },
        { id: 12, nombre: "CORDERO", precio: 6.99, categoria: "cortes", emoji: "🐑", img: "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=200", desc: "Cordero" },
        { id: 13, nombre: "LOMITO DE RES", precio: 4.99, categoria: "cortes", emoji: "🥩", img: "https://images.unsplash.com/photo-1558030006-450675393462?w=200", desc: "Lomito de res" },
        { id: 14, nombre: "POLLO A LA PARRILLA", precio: 4.50, categoria: "cortes", emoji: "🍗", img: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=200", desc: "Pollo a la parrilla" },
        { id: 15, nombre: "CHULETA DE CERDO", precio: 4.99, categoria: "cortes", emoji: "🐷", img: "https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=200", desc: "Chuleta de cerdo" },
        { id: 16, nombre: "4 ALITAS (8)", precio: 6.00, categoria: "alitas", emoji: "🍗", img: "https://images.unsplash.com/photo-1605710379250-f332254b96de?w=200", desc: "8 piezas · Elige 1 sabor" },
        { id: 17, nombre: "8 ALITAS (16)", precio: 9.99, categoria: "alitas", emoji: "🍗", img: "https://images.unsplash.com/photo-1605710379250-f332254b96de?w=200", desc: "16 piezas · Elige 2-3 sabores" },
        { id: 18, nombre: "12 ALITAS (24)", precio: 13.99, categoria: "alitas", emoji: "🍗", img: "https://images.unsplash.com/photo-1605710379250-f332254b96de?w=200", desc: "24 piezas · Elige 2-4 sabores" },
        { id: 19, nombre: "15 ALITAS (30)", precio: 15.99, categoria: "alitas", emoji: "🍗", img: "https://images.unsplash.com/photo-1605710379250-f332254b96de?w=200", desc: "30 piezas · Elige 2-4 sabores" },
        { id: 20, nombre: "20 ALITAS (40)", precio: 20.99, categoria: "alitas", emoji: "🍗", img: "https://images.unsplash.com/photo-1605710379250-f332254b96de?w=200", desc: "40 piezas · Elige 3-5 sabores" },
        { id: 21, nombre: "SUPER PICADITA", precio: 6.99, categoria: "parrilla", emoji: "🎯", img: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=200", desc: "Super picadita" },
        { id: 22, nombre: "PARRILLADA TITO", precio: 8.99, categoria: "parrilla", emoji: "🔥", img: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=200", desc: "Parrillada Tito" },
        { id: 23, nombre: "COSTILLAS BBQ", precio: 6.99, categoria: "parrilla", emoji: "🍖", img: "https://images.unsplash.com/photo-1544025162-d76694265947?w=200", desc: "Costillas BBQ" },
        { id: 24, nombre: "PAPA CON CHILLY", precio: 4.50, categoria: "parrilla", emoji: "🧀", img: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=200", desc: "Papa con chilly" },
        { id: 25, nombre: "CHORY PAPA", precio: 4.00, categoria: "parrilla", emoji: "🌭", img: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=200", desc: "Chory papa" },
        { id: 26, nombre: "CHORIPÁN", precio: 3.50, categoria: "parrilla", emoji: "🌭", img: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=200", desc: "Choripán" },
        { id: 27, nombre: "KIT ESTRELLA", precio: 6.99, categoria: "promociones", emoji: "⭐", img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200", desc: "Kit estrella" },
        { id: 28, nombre: "COMBO PAREJA", precio: 10.99, categoria: "promociones", emoji: "💑", img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200", desc: "Combo pareja" },
        { id: 29, nombre: "COMBO COMPARTIR", precio: 13.99, categoria: "promociones", emoji: "🎉", img: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=200", desc: "Combo compartir" },
        { id: 30, nombre: "COMBO FAMILIAR", precio: 15.99, categoria: "promociones", emoji: "👨‍👩‍👧‍👦", img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200", desc: "Combo familiar" },
        { id: 31, nombre: "PAPAS TITO", precio: 1.50, categoria: "extras", emoji: "🍟", img: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=200", desc: "Papas Tito" },
        { id: 32, nombre: "CHORIZO NORMAL", precio: 1.00, categoria: "extras", emoji: "🌭", img: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=200", desc: "Chorizo normal" },
        { id: 33, nombre: "CHORIZO PAISA", precio: 1.50, categoria: "extras", emoji: "🌭", img: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=200", desc: "Chorizo paisa" },
        { id: 34, nombre: "CARNE HAMBURGUESA", precio: 1.50, categoria: "extras", emoji: "🥩", img: "https://images.unsplash.com/photo-1544025162-d76694265947?w=200", desc: "Carne hamburguesa" },
        { id: 35, nombre: "PIÑA", precio: 0.75, categoria: "extras", emoji: "🍍", img: "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=200", desc: "Piña" },
        { id: 36, nombre: "CUERO", precio: 2.00, categoria: "extras", emoji: "🥓", img: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=200", desc: "Cuero" },
        { id: 37, nombre: "ENSALADA", precio: 1.50, categoria: "extras", emoji: "🥗", img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200", desc: "Ensalada" },
        { id: 38, nombre: "MAYONESA TITO", precio: 2.00, categoria: "extras", emoji: "🫙", img: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=200", desc: "Mayonesa Tito" },
        { id: 39, nombre: "LIMONADA", precio: 2.50, categoria: "bebidas", emoji: "🍋", img: "https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=200", desc: "Limonada natural" },
        { id: 40, nombre: "JARRA LIMONADA", precio: 5.00, categoria: "bebidas", emoji: "🍋", img: "https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=200", desc: "Jarra de limonada" },
        { id: 41, nombre: "COCA-COLA", precio: 1.50, categoria: "bebidas", emoji: "🥤", img: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=200", desc: "Coca-Cola" },
        { id: 42, nombre: "AGUA", precio: 1.00, categoria: "bebidas", emoji: "💧", img: "https://images.unsplash.com/photo-1616118132534-381148898bb4?w=200", desc: "Agua" }
    ];
}

// ============================================
// CATEGORÍAS Y PRODUCTOS
// ============================================
function changeCategory(cat, el) {
    activeCategoryPOS = cat;
    document.querySelectorAll('.categories-row-premium .cat-btn').forEach(c => c.classList.remove('active'));
    if (el) el.classList.add('active');
    renderProductsPOS();
}

function renderProductsPOS() {
    const menu = getMenuData();
    const products = activeCategoryPOS === 'todo' ? menu : menu.filter(p => p.categoria === activeCategoryPOS);
    const grid = document.getElementById('productsGrid');
    if (!grid) return;
    
    grid.innerHTML = products.map(p => `
        <div class="product-card-pos" onclick="addToCartPOS(${p.id})">
            <div class="product-img-container">
                <img src="${p.img}" alt="${p.nombre}" class="product-img" loading="lazy">
                <div class="product-img-overlay">
                    <span>+</span>
                </div>
            </div>
            <div class="product-info-pos">
                <span class="emoji">${p.emoji}</span>
                <div class="nombre">${p.nombre}</div>
                <div class="precio">$${p.precio.toFixed(2)}</div>
            </div>
        </div>
    `).join('');
}

function buscarProductoLive() {
    const t = document.getElementById('searchInput').value.toLowerCase();
    const products = t ? getMenuData().filter(p => p.nombre.toLowerCase().includes(t)) : getMenuData().filter(p => activeCategoryPOS === 'todo' || p.categoria === activeCategoryPOS);
    const grid = document.getElementById('productsGrid');
    if (!grid) return;
    
    grid.innerHTML = products.map(p => `
        <div class="product-card-pos" onclick="addToCartPOS(${p.id})">
            <div class="product-img-container">
                <img src="${p.img}" alt="${p.nombre}" class="product-img" loading="lazy">
                <div class="product-img-overlay">
                    <span>+</span>
                </div>
            </div>
            <div class="product-info-pos">
                <span class="emoji">${p.emoji}</span>
                <div class="nombre">${p.nombre}</div>
                <div class="precio">$${p.precio.toFixed(2)}</div>
            </div>
        </div>
    `).join('');
}

function addToCartPOS(id) {
    const p = getMenuData().find(x => x.id === id);
    if (!p) return;
    
    if (p.categoria === 'alitas' && saboresAlitas[id]) {
        mostrarSelectorSabor(p);
        return;
    }
    
    const exist = cartPOS.find(i => i.id === id && !i.sabor);
    if (exist) {
        exist.cantidad++;
    } else {
        cartPOS.push({ id: p.id, nombre: p.nombre, precio: p.precio, emoji: p.emoji, cantidad: 1 });
    }
    renderCartPOS();
}

function renderCartPOS() {
    const subtotal = cartPOS.reduce((s, i) => s + i.precio * i.cantidad, 0);
    document.getElementById('subtotalPOS').textContent = '$' + subtotal.toFixed(2);
    document.getElementById('totalPOS').textContent = '$' + subtotal.toFixed(2);
    const container = document.getElementById('cartItems');
    if (!container) return;
    
    if (cartPOS.length === 0) {
        container.innerHTML = '<p class="cart-empty">No hay productos</p>';
        return;
    }
    
    container.innerHTML = cartPOS.map((i, idx) => `
        <div class="cart-item-pos">
            <div class="info">
                <strong>${i.emoji} ${i.nombre}</strong>
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

// ============================================
// RECARGAR PEDIDOS - Función para sincronizar
// ============================================
function recargarPedidos() {
    console.log('🔄 Recargando pedidos manualmente...');
    const pedidos = JSON.parse(localStorage.getItem('marketpos_pedidos_online') || '[]');
    console.log('📋 Pedidos encontrados:', pedidos.length);
    
    const llevar = pedidos.filter(p => p.cliente?.tipoPedido === 'llevar');
    console.log('🛵 Pedidos para llevar:', llevar.length, llevar);
    
    renderizarMesasPOS();
    
    mostrarNotificacion(`🔄 ${pedidos.length} pedidos cargados (${llevar.length} para llevar)`);
}

// ============================================
// MESAS Y PEDIDOS PARA LLEVAR
// ============================================
function renderizarMesasPOS() {
    const grid = document.getElementById('mesasGrid');
    if (!grid) return;
    
    const mesasLocal = JSON.parse(localStorage.getItem('marketpos_mesas') || '[]');
    const pedidosLocal = JSON.parse(localStorage.getItem('marketpos_pedidos_online') || '[]');
    
    console.log('📋 Total pedidos en caja:', pedidosLocal.length);
    
    // Mostrar pedidos para debug
    if (pedidosLocal.length > 0) {
        console.log('📋 Pedidos:', pedidosLocal);
    }
    
    // FILTRAR: SOLO pedidos "llevar" que NO estén pagados
    const pedidosLlevar = pedidosLocal.filter(p => {
        const esLlevar = p.cliente?.tipoPedido === 'llevar';
        const noEntregado = p.estado !== 'entregado' && p.estado !== 'completado';
        const esNuevo = p.estado === 'nuevo' || p.estado === 'listo' || p.estado === 'preparando';
        return esLlevar && noEntregado && esNuevo;
    });
    
    console.log('🛵 Pedidos para llevar encontrados:', pedidosLlevar.length);
    
    let html = '';
    
    // SECCIÓN MESAS
    if (mesasLocal.length > 0) {
        html += '<div style="grid-column:1/-1;margin:10px 0 5px;font-size:0.7rem;color:var(--text-light);text-transform:uppercase;letter-spacing:2px;">🪑 Mesas</div>';
        html += mesasLocal.map(m => `
            <div class="mesa-card-pos ${m.estado}" onclick="${m.estado === 'ocupada' ? `cobrarMesa(${m.numero})` : ''}">
                <span class="numero">${m.numero}</span>
                <span class="estado">${m.estado === 'libre' ? 'Libre' : 'Ocupada'}</span>
                ${m.estado === 'ocupada' ? '<span style="font-size:0.6rem;color:#c0392b;">💵 Cobrar</span>' : ''}
            </div>
        `).join('');
    } else {
        const mesasIniciales = [];
        for (let i = 1; i <= 10; i++) {
            mesasIniciales.push({ numero: i, estado: 'libre', orden: [] });
        }
        localStorage.setItem('marketpos_mesas', JSON.stringify(mesasIniciales));
        
        html += '<div style="grid-column:1/-1;margin:10px 0 5px;font-size:0.7rem;color:var(--text-light);text-transform:uppercase;letter-spacing:2px;">🪑 Mesas</div>';
        html += mesasIniciales.map(m => `
            <div class="mesa-card-pos ${m.estado}" onclick="${m.estado === 'ocupada' ? `cobrarMesa(${m.numero})` : ''}">
                <span class="numero">${m.numero}</span>
                <span class="estado">${m.estado === 'libre' ? 'Libre' : 'Ocupada'}</span>
                ${m.estado === 'ocupada' ? '<span style="font-size:0.6rem;color:#c0392b;">💵 Cobrar</span>' : ''}
            </div>
        `).join('');
    }
    
    // SECCIÓN PARA LLEVAR
    if (pedidosLlevar.length > 0) {
        html += '<div style="grid-column:1/-1;margin:20px 0 5px;font-size:0.7rem;color:var(--text-light);text-transform:uppercase;letter-spacing:2px;">🛵 Para Llevar</div>';
        
        // Filtrar duplicados por ID
        const idsVistos = new Set();
        const pedidosUnicos = pedidosLlevar.filter(p => {
            if (idsVistos.has(p.id)) return false;
            idsVistos.add(p.id);
            return true;
        });
        
        html += pedidosUnicos.map((p, idx) => {
            const total = p.items?.reduce((s, i) => s + (i.precio || 0) * (i.cantidad || 1), 0) || 0;
            const itemsText = p.items?.map(i => `${i.nombre} x${i.cantidad}`).join(', ') || 'Sin items';
            
            let estadoText = '';
            let estadoColor = '';
            let clickAction = '';
            
            if (p.estado === 'listo') {
                estadoText = '✅ Listo para cobrar';
                estadoColor = '#27ae60';
                clickAction = `onclick="cobrarPedidoLlevar('${p.id}')"`;
            } else if (p.estado === 'completado') {
                estadoText = '💰 Cobrado';
                estadoColor = '#f39c12';
                clickAction = '';
            } else {
                estadoText = '🔄 En preparación';
                estadoColor = '#e67e22';
                clickAction = '';
            }
            
            return `
                <div class="mesa-card-pos llevarcard" ${clickAction} style="border-left:4px solid ${estadoColor};cursor:${p.estado === 'listo' ? 'pointer' : 'default'};opacity:${p.estado === 'completado' ? '0.6' : '1'};">
                    <span style="font-size:1.2rem;font-weight:900;color:#f39c12;">🛵 Pedido #${idx + 1}</span>
                    <span style="font-size:0.6rem;color:var(--text-light);">${itemsText}</span>
                    <span style="font-size:1rem;font-weight:800;color:#f39c12;">$${total.toFixed(2)}</span>
                    <span style="font-size:0.6rem;color:${estadoColor};">${estadoText}</span>
                </div>
            `;
        }).join('');
    } else {
        // Mostrar mensaje si no hay pedidos para llevar
        html += `
            <div style="grid-column:1/-1;margin:10px 0;padding:20px;text-align:center;color:var(--text-light);font-size:0.8rem;background:var(--bg-card);border-radius:12px;border:1px dashed var(--border);">
                🛵 No hay pedidos para llevar en este momento
            </div>
        `;
    }
    
    grid.innerHTML = html;
}

// ============================================
// COBRAR PEDIDO PARA LLEVAR
// ============================================
function cobrarPedidoLlevar(pedidoId) {
    const pedidosLocal = JSON.parse(localStorage.getItem('marketpos_pedidos_online') || '[]');
    const pedido = pedidosLocal.find(p => p.id == pedidoId);
    
    if (!pedido) {
        alert('⚠️ No se encontró el pedido');
        return;
    }
    
    if (pedido.estado !== 'listo') {
        alert('⚠️ Este pedido aún no está listo para cobrar');
        return;
    }
    
    cartPOS = (pedido.items || []).map(i => ({ 
        id: i.id, 
        nombre: i.nombre, 
        precio: i.precio || 0, 
        emoji: i.emoji || '🍽️', 
        cantidad: i.cantidad || 1,
        sabor: i.sabor || null
    }));
    
    document.getElementById('mesaInputPOS').value = 'Llevar';
    document.getElementById('tipoPedidoPOS').value = 'llevar';
    document.getElementById('viewMenu').style.display = 'flex';
    document.getElementById('viewMesas').style.display = 'none';
    document.querySelectorAll('.sb-btn').forEach(b => b.classList.remove('active'));
    document.querySelector('.sb-btn').classList.add('active');
    renderCartPOS();
    
    document.getElementById('clienteFactura').style.display = 'block';
    if (!document.getElementById('metodoPago')) {
        document.getElementById('clienteFactura').insertAdjacentHTML('afterbegin', `
            <select id="metodoPago" class="input-premium" style="margin-bottom:6px;" onchange="mostrarEfectivo()">
                <option value="">💳 Método de pago</option>
                <option value="efectivo">💵 Efectivo</option>
                <option value="tarjeta">💳 Tarjeta</option>
                <option value="transferencia">🏦 Transferencia</option>
            </select>
            <div id="efectivoSection" style="display:none;">
                <input type="number" id="montoRecibido" placeholder="💵 Monto recibido" class="input-premium" oninput="calcularCambioPOS()">
                <div id="cambioDisplay" style="text-align:center;font-size:1.2rem;font-weight:700;margin:8px 0;display:none;">
                    Cambio: <span id="cambioValor" style="color:#27ae60;">$0.00</span>
                </div>
            </div>
        `);
    }
    
    document.getElementById('facturaNombre').value = pedido.cliente?.nombre || 'Consumidor Final';
    document.getElementById('facturaRUC').value = '';
    document.getElementById('facturaEmail').value = '';
    document.getElementById('facturaDireccion').value = '';
    
    let resumen = '🛵 PEDIDO PARA LLEVAR\n\n';
    (pedido.items || []).forEach(i => {
        const saborText = i.sabor ? ` (${i.sabor})` : '';
        resumen += `${i.emoji || '🍽️'} ${i.nombre}${saborText} x${i.cantidad || 1} = $${((i.precio || 0) * (i.cantidad || 1)).toFixed(2)}\n`;
    });
    const total = pedido.total || cartPOS.reduce((s, i) => s + i.precio * i.cantidad, 0);
    resumen += `\n💰 TOTAL: $${total.toFixed(2)}\n\n📝 Complete datos para factura.`;
    alert(resumen);
    
    pedidoLlevarId = pedidoId;
}

// ============================================
// COBRAR MESA
// ============================================
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
        document.getElementById('clienteFactura').insertAdjacentHTML('afterbegin', `
            <select id="metodoPago" class="input-premium" style="margin-bottom:6px;" onchange="mostrarEfectivo()">
                <option value="">💳 Método de pago</option>
                <option value="efectivo">💵 Efectivo</option>
                <option value="tarjeta">💳 Tarjeta</option>
                <option value="transferencia">🏦 Transferencia</option>
            </select>
            <div id="efectivoSection" style="display:none;">
                <input type="number" id="montoRecibido" placeholder="💵 Monto recibido" class="input-premium" oninput="calcularCambioPOS()">
                <div id="cambioDisplay" style="text-align:center;font-size:1.2rem;font-weight:700;margin:8px 0;display:none;">
                    Cambio: <span id="cambioValor" style="color:#27ae60;">$0.00</span>
                </div>
            </div>
        `);
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
    const pedido = { 
        cliente: { 
            nombre: 'Mesero', 
            mesa: tipoPedidoActual === 'mesa' ? mesa : 'Llevar', 
            tipoPedido: tipoPedidoActual 
        }, 
        items: cartPOS.map(i => ({ 
            id: i.id, 
            nombre: i.nombre, 
            precio: i.precio, 
            emoji: i.emoji, 
            cantidad: i.cantidad, 
            sabor: i.sabor || null 
        })), 
        total,
        estado: 'nuevo',
        fecha: new Date().toISOString(),
        timestamp: Date.now(),
        fuente: 'caja'
    };
    
    try { await fetch('/api/pedidos', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(pedido) }); } catch(e) {}
    
    const pedidosLocal = JSON.parse(localStorage.getItem('marketpos_pedidos_online') || '[]');
    pedido.id = Date.now();
    pedidosLocal.unshift(pedido);
    localStorage.setItem('marketpos_pedidos_online', JSON.stringify(pedidosLocal));
    
    // SOLO actualizar mesa si el tipo es "mesa"
    if (tipoPedidoActual === 'mesa') {
        const mesasLocal = JSON.parse(localStorage.getItem('marketpos_mesas') || '[]');
        const mesaObj = mesasLocal.find(m => m.numero === parseInt(mesa));
        if (mesaObj) { 
            mesaObj.estado = 'ocupada'; 
            mesaObj.orden = pedido.items; 
        }
        localStorage.setItem('marketpos_mesas', JSON.stringify(mesasLocal));
        try { 
            const res = await fetch('/api/mesas'); 
            const apiMesas = await res.json(); 
            const mesaAPI = apiMesas.find(m => m.numero === parseInt(mesa)); 
            if (mesaAPI) { 
                await fetch('/api/mesas/' + mesaAPI.id, { 
                    method: 'PATCH', 
                    headers: { 'Content-Type': 'application/json' }, 
                    body: JSON.stringify({ estado: 'ocupada', orden: pedido.items }) 
                }); 
            } 
        } catch(e) {}
    }
    
    alert('✅ Pedido enviado a cocina - ' + (tipoPedidoActual === 'mesa' ? 'Mesa ' + mesa : 'Para Llevar'));
    cartPOS = []; 
    renderCartPOS();
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

// ============================================ //
// REGISTRAR VENTA EN DASHBOARD                 //
// ============================================ //
function registrarVentaEnDashboard(pedido, factura) {
    try {
        const ventasGuardadas = localStorage.getItem('tito_ventas');
        let ventas = ventasGuardadas ? JSON.parse(ventasGuardadas) : [];
        
        if (pedido.fuente !== 'caja') {
            console.log('📊 Venta de ' + pedido.fuente + ' no registrada (solo Caja)');
            return true;
        }
        
        const tipo = pedido.cliente?.tipoPedido || 'mesa';
        if (tipo !== 'mesa' && tipo !== 'llevar') {
            console.log('📊 Venta de ' + tipo + ' no registrada en dashboard (solo Mesa y Llevar)');
            return true;
        }
        
        const nuevaVenta = {
            id: pedido.id || 'venta_' + Date.now(),
            fecha: new Date().toLocaleString('es-ES', { 
                day: '2-digit', 
                month: '2-digit', 
                year: 'numeric',
                hour: '2-digit', 
                minute: '2-digit' 
            }),
            timestamp: Date.now(),
            tipo: tipo,
            cliente: 'Consumidor Final',
            items: pedido.items.map(i => ({
                producto: i.nombre,
                cantidad: i.cantidad,
                precio: i.precio,
                emoji: i.emoji || '🍽️'
            })),
            total: pedido.total || 0,
            estado: 'completado',
            metodoPago: factura?.metodoPago || 'efectivo',
            factura: factura || null,
            fuente: 'caja'
        };
        
        // Verificar si ya existe para evitar duplicados
        const existe = ventas.some(v => v.id === nuevaVenta.id);
        if (!existe) {
            ventas.unshift(nuevaVenta);
        }
        
        if (ventas.length > 1000) ventas = ventas.slice(0, 1000);
        localStorage.setItem('tito_ventas', JSON.stringify(ventas));
        window.dispatchEvent(new StorageEvent('storage', { key: 'tito_ventas', newValue: JSON.stringify(ventas) }));
        return true;
    } catch(e) {
        console.error('Error registrando venta:', e);
        return false;
    }
}

// ============================================ //
// DESCONTAR STOCK DESDE CAJA                   //
// ============================================ //
function descontarStockDesdeCaja(items) {
    try {
        const inventarioGuardado = localStorage.getItem('tito_inventario');
        if (!inventarioGuardado) return false;
        
        const inventario = JSON.parse(inventarioGuardado);
        let errores = [];
        
        items.forEach(item => {
            const nombreProducto = item.nombre;
            const cantidad = item.cantidad || 1;
            
            let encontrado = false;
            for (const [key, stock] of Object.entries(inventario)) {
                if (key.toLowerCase().includes(nombreProducto.toLowerCase()) || 
                    nombreProducto.toLowerCase().includes(key.toLowerCase())) {
                    if (stock >= cantidad) {
                        inventario[key] = stock - cantidad;
                        encontrado = true;
                        break;
                    } else {
                        errores.push(`${key}: stock insuficiente (${stock} disponibles, ${cantidad} solicitados)`);
                        encontrado = true;
                        break;
                    }
                }
            }
            if (!encontrado) {
                inventario[nombreProducto] = Math.max(0, (inventario[nombreProducto] || 0) - cantidad);
            }
        });
        
        localStorage.setItem('tito_inventario', JSON.stringify(inventario));
        registrarMovimientoInventario(items, 'venta');
        return errores.length === 0;
    } catch(e) {
        console.error('Error descontando stock:', e);
        return false;
    }
}

function registrarMovimientoInventario(items, tipo) {
    try {
        const movimientosGuardados = localStorage.getItem('tito_movimientos');
        let movimientos = movimientosGuardados ? JSON.parse(movimientosGuardados) : [];
        
        items.forEach(item => {
            movimientos.push({
                id: 'mov_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
                producto: item.nombre,
                cantidad: item.cantidad || 1,
                tipo: tipo,
                motivo: tipo === 'venta' ? 'venta' : 'ajuste',
                observaciones: `Venta desde caja - ${new Date().toLocaleString()}`,
                fecha: new Date().toLocaleString('es-ES', { 
                    day: '2-digit', month: '2-digit', year: 'numeric',
                    hour: '2-digit', minute: '2-digit' 
                }),
                timestamp: Date.now()
            });
        });
        
        if (movimientos.length > 5000) movimientos = movimientos.slice(-5000);
        localStorage.setItem('tito_movimientos', JSON.stringify(movimientos));
        window.dispatchEvent(new StorageEvent('storage', { key: 'tito_movimientos', newValue: JSON.stringify(movimientos) }));
        return true;
    } catch(e) {
        console.error('Error registrando movimiento:', e);
        return false;
    }
}

function notificarProduccionVenta(items) {
    try {
        const produccionGuardada = localStorage.getItem('tito_produccion_data');
        let produccion = produccionGuardada ? JSON.parse(produccionGuardada) : [];
        
        items.forEach(item => {
            produccion.push({
                id: 'prod_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
                producto: item.nombre,
                cantidad: item.cantidad || 1,
                estado: 'completado',
                observaciones: `Venta registrada - ${new Date().toLocaleString()}`,
                hora: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
                timestamp: Date.now(),
                tipo: 'consumo'
            });
        });
        
        if (produccion.length > 1000) produccion = produccion.slice(-1000);
        localStorage.setItem('tito_produccion_data', JSON.stringify(produccion));
        window.dispatchEvent(new StorageEvent('storage', { key: 'tito_produccion_data', newValue: JSON.stringify(produccion) }));
        return true;
    } catch(e) {
        console.error('Error notificando producción:', e);
        return false;
    }
}

function generarFacturaHTML(pedido, cliente, facturaNum) {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Factura TITO BURGER</title>
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body { 
                    font-family: 'Montserrat', Arial, sans-serif; 
                    padding: 20px; 
                    max-width: 350px; 
                    margin: 0 auto;
                    background: #f5efe5;
                    color: #2a1c10;
                }
                .header { text-align: center; border-bottom: 3px solid #c0392b; padding-bottom: 15px; margin-bottom: 15px; }
                .header h1 { font-size: 1.8rem; color: #c0392b; font-weight: 900; }
                .header p { color: #6b5540; font-size: 0.7rem; letter-spacing: 2px; }
                .info { background: white; padding: 12px; border-radius: 8px; margin-bottom: 15px; font-size: 0.8rem; border: 1px solid #d4c0a4; }
                .info-row { display: flex; justify-content: space-between; padding: 4px 0; }
                .info-row .label { color: #6b5540; font-weight: 600; }
                table { width: 100%; border-collapse: collapse; margin: 12px 0; background: white; border-radius: 8px; overflow: hidden; }
                th { background: #c0392b; color: white; padding: 8px; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.5px; }
                td { padding: 8px; border-bottom: 1px solid #f0e8dc; font-size: 0.75rem; }
                .total { text-align: right; font-size: 1.2rem; font-weight: 900; color: #c0392b; padding: 12px; border-top: 2px solid #c0392b; margin-top: 8px; }
                .footer { text-align: center; font-size: 0.65rem; color: #6b5540; margin-top: 15px; padding-top: 12px; border-top: 1px solid #d4c0a4; }
                .sabor-tag { background: #f39c12; color: white; padding: 1px 8px; border-radius: 10px; font-size: 0.55rem; margin-left: 4px; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>🔥 TITO BURGER</h1>
                <p>HAMBURGUESAS AL CARBÓN</p>
            </div>
            <div class="info">
                <div class="info-row"><span class="label">📄 Factura</span><span><strong>${facturaNum}</strong></span></div>
                <div class="info-row"><span class="label">📅 Fecha</span><span>${new Date().toLocaleString()}</span></div>
                <div class="info-row"><span class="label">👤 Cliente</span><span><strong>${cliente.nombre}</strong></span></div>
                <div class="info-row"><span class="label">🆔 RUC/CI</span><span>${cliente.ruc}</span></div>
                <div class="info-row"><span class="label">📍 Tipo</span><span>${pedido.cliente.tipoPedido === 'mesa' ? '🪑 Mesa ' + pedido.cliente.mesa : '🛵 ' + pedido.cliente.tipoPedido}</span></div>
                <div class="info-row"><span class="label">💳 Método</span><span>${cliente.metodoPago}</span></div>
                ${cliente.metodoPago === 'efectivo' ? `
                    <div class="info-row"><span class="label">💵 Recibido</span><span>$${cliente.recibido.toFixed(2)}</span></div>
                    <div class="info-row"><span class="label">🔄 Cambio</span><span>$${cliente.cambio.toFixed(2)}</span></div>
                ` : ''}
            </div>
            <table>
                <thead><tr><th>Producto</th><th>Cant</th><th>Total</th></tr></thead>
                <tbody>
                    ${pedido.items.map(i => `
                        <tr>
                            <td>${i.emoji} ${i.nombre}${i.sabor ? `<span class="sabor-tag">🍗 ${i.sabor}</span>` : ''}</td>
                            <td>x${i.cantidad}</td>
                            <td>$${(i.precio * i.cantidad).toFixed(2)}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            <div class="total">TOTAL: $${pedido.total.toFixed(2)}</div>
            <div class="footer"><p>🎯 ¡Gracias por su visita!</p><p style="font-size:0.6rem;margin-top:4px;">Av. Principal 123 · Tel: 099 999 9999</p></div>
        </body>
        </html>
    `;
}

// ============================================ //
// COBRAR POS - FUNCIÓN PRINCIPAL              //
// ============================================ //
async function cobrarPOS() {
    if (cartPOS.length === 0) { 
        mostrarNotificacion('⚠️ Agregue productos al carrito');
        return; 
    }
    
    const facturaDiv = document.getElementById('clienteFactura');
    if (!facturaDiv || facturaDiv.style.display === 'none') {
        if (facturaDiv) facturaDiv.style.display = 'block';
        if (!document.getElementById('metodoPago')) {
            facturaDiv.insertAdjacentHTML('afterbegin', `
                <select id="metodoPago" class="input-premium" style="margin-bottom:6px;" onchange="mostrarEfectivo()">
                    <option value="">💳 Método de pago</option>
                    <option value="efectivo">💵 Efectivo</option>
                    <option value="tarjeta">💳 Tarjeta</option>
                    <option value="transferencia">🏦 Transferencia</option>
                </select>
                <div id="efectivoSection" style="display:none;">
                    <input type="number" id="montoRecibido" placeholder="💵 Monto recibido" class="input-premium" oninput="calcularCambioPOS()">
                    <div id="cambioDisplay" style="text-align:center;font-size:1.2rem;font-weight:700;margin:8px 0;display:none;">
                        Cambio: <span id="cambioValor" style="color:#27ae60;">$0.00</span>
                    </div>
                </div>
            `);
        }
        mostrarNotificacion('📄 Complete los datos y método de pago');
        return;
    }
    
    const mesa = document.getElementById('mesaInputPOS').value || '1';
    const total = cartPOS.reduce((s, i) => s + i.precio * i.cantidad, 0);
    const metodoPago = document.getElementById('metodoPago')?.value || 'No especificado';
    const recibido = parseFloat(document.getElementById('montoRecibido')?.value) || 0;
    const cambio = recibido - total;
    
    if (!document.getElementById('metodoPago')?.value) { 
        mostrarNotificacion('⚠️ Seleccione método de pago'); 
        return; 
    }
    
    if (metodoPago === 'efectivo' && recibido < total) { 
        mostrarNotificacion('⚠️ Monto insuficiente. Faltan $' + Math.abs(cambio).toFixed(2)); 
        return; 
    }
    
    const clienteFactura = {
        nombre: document.getElementById('facturaNombre').value || 'Consumidor Final',
        ruc: document.getElementById('facturaRUC').value || '9999999999999',
        email: document.getElementById('facturaEmail').value || '',
        direccion: document.getElementById('facturaDireccion').value || 'Av. Principal 123',
        metodoPago, 
        recibido, 
        cambio
    };
    
    const facturaNum = '001-001-' + String(Math.floor(Math.random()*99999999)).padStart(8,'0');
    const pedidoActual = { 
        id: 'caja_' + Date.now(),
        cliente: { ...clienteFactura, mesa, tipoPedido: tipoPedidoActual }, 
        items: cartPOS.map(i => ({ 
            id: i.id, 
            nombre: i.nombre, 
            precio: i.precio, 
            emoji: i.emoji, 
            cantidad: i.cantidad, 
            sabor: i.sabor || null 
        })), 
        total, 
        factura: clienteFactura,
        estado: 'completado',
        fecha: new Date().toISOString(),
        fuente: 'caja'
    };
    
    // 1. DESCONTAR STOCK
    const stockDescontado = descontarStockDesdeCaja(pedidoActual.items);
    if (!stockDescontado) {
        mostrarNotificacion('⚠️ Error al descontar stock. Verifique disponibilidad.');
        return;
    }
    
    // 2. REGISTRAR VENTA (solo si no existe)
    const ventaRegistrada = registrarVentaEnDashboard(pedidoActual, clienteFactura);
    if (!ventaRegistrada) {
        mostrarNotificacion('⚠️ Error al registrar la venta');
        return;
    }
    
    // 3. NOTIFICAR A PRODUCCIÓN
    notificarProduccionVenta(pedidoActual.items);
    
    // 4. GENERAR FACTURA
    const facturaHTML = generarFacturaHTML(pedidoActual, clienteFactura, facturaNum);
    const blob = new Blob([facturaHTML], {type:'text/html'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Factura_TITO_${facturaNum}.html`;
    a.click();
    
    // 5. ENVIAR EMAIL
    if (clienteFactura.email && window.emailjs) {
        try {
            await emailjs.send('service_nj7glup', 'template_szgtsns', {
                to_email: clienteFactura.email,
                cliente_nombre: clienteFactura.nombre,
                cliente_ruc: clienteFactura.ruc,
                total: '$' + total.toFixed(2),
                factura_numero: facturaNum,
                items: pedidoActual.items.map(i => 
                    `${i.nombre}${i.sabor ? ' (' + i.sabor + ')' : ''} x${i.cantidad} - $${(i.precio*i.cantidad).toFixed(2)}`
                ).join('\n'),
                fecha: new Date().toLocaleString()
            });
        } catch(e) {}
    }
    
    // 6. ACTUALIZAR PEDIDO PARA LLEVAR (si existe)
    if (pedidoLlevarId && tipoPedidoActual === 'llevar') {
        const pedidosLocal = JSON.parse(localStorage.getItem('marketpos_pedidos_online') || '[]');
        const idx = pedidosLocal.findIndex(p => p.id == pedidoLlevarId);
        if (idx !== -1) {
            pedidosLocal[idx].estado = 'entregado';
            pedidosLocal[idx].pagado = true;
            localStorage.setItem('marketpos_pedidos_online', JSON.stringify(pedidosLocal));
        }
        pedidoLlevarId = null;
    }
    
    // 7. LIBERAR MESA (solo si es mesa)
    if (tipoPedidoActual === 'mesa') {
        const mesasLocal = JSON.parse(localStorage.getItem('marketpos_mesas') || '[]');
        const mesaLocal = mesasLocal.find(x => x.numero === parseInt(mesa));
        if (mesaLocal) {
            mesaLocal.estado = 'libre';
            mesaLocal.orden = [];
            localStorage.setItem('marketpos_mesas', JSON.stringify(mesasLocal));
        }
        try {
            const res = await fetch('/api/mesas');
            const apiMesas = await res.json();
            const mesaAPI = apiMesas.find(x => x.numero === parseInt(mesa));
            if (mesaAPI) {
                await fetch('/api/mesas/' + mesaAPI.id, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ estado: 'libre', orden: [] })
                });
            }
        } catch(e) {}
    }
    
    // 8. NOTIFICACIÓN
    let mensaje = '✅ Cobro realizado exitosamente\n\n';
    mensaje += '📄 Factura: ' + facturaNum + '\n';
    mensaje += '💳 Método: ' + metodoPago + '\n';
    if (metodoPago === 'efectivo') {
        mensaje += '💵 Recibido: $' + recibido.toFixed(2) + '\n';
        mensaje += '🔄 Cambio: $' + cambio.toFixed(2) + '\n';
    }
    mensaje += '\n📊 Total: $' + total.toFixed(2);
    alert(mensaje);
    
    // 9. LIMPIAR
    cartPOS = [];
    renderCartPOS();
    document.getElementById('clienteFactura').style.display = 'none';
    document.getElementById('facturaNombre').value = '';
    document.getElementById('facturaRUC').value = '';
    document.getElementById('facturaEmail').value = '';
    document.getElementById('facturaDireccion').value = '';
    document.getElementById('montoRecibido') && (document.getElementById('montoRecibido').value = '');
    document.getElementById('cambioDisplay') && (document.getElementById('cambioDisplay').style.display = 'none');
    
    const metodoPagoSelect = document.getElementById('metodoPago');
    if (metodoPagoSelect) metodoPagoSelect.remove();
    const efectivoSection = document.getElementById('efectivoSection');
    if (efectivoSection) efectivoSection.remove();
    
    mostrarNotificacion('🎉 ¡Venta registrada exitosamente!');
    setTimeout(() => renderizarMesasPOS(), 500);
}

function logout() { 
    localStorage.clear(); 
    location.reload(); 
}

// ============================================ //
// EVENTOS E INICIALIZACIÓN
// ============================================
document.getElementById('tipoPedidoPOS').addEventListener('change', function() {
    tipoPedidoActual = this.value;
    const facturaDiv = document.getElementById('clienteFactura');
    const mesaInput = document.getElementById('mesaInputPOS');
    if (this.value === 'mesa') { 
        facturaDiv.style.display = 'none'; 
        mesaInput.style.display = 'block'; 
    } else { 
        facturaDiv.style.display = 'block'; 
        mesaInput.style.display = 'none'; 
    }
});

// Estilos para tarjetas de llevar
const styleLlevar = document.createElement('style');
styleLlevar.textContent = `
    .mesa-card-pos.llevarcard {
        background: var(--bg-card, #1a1614);
        border: 1px solid rgba(243, 156, 18, 0.3);
        padding: 16px 14px;
        text-align: center;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        border-radius: 12px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.4);
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
    }
    .mesa-card-pos.llevarcard:hover {
        transform: translateY(-4px);
        box-shadow: 0 4px 20px rgba(0,0,0,0.5);
        border-color: #f39c12;
    }
    .mesa-card-pos.llevarcard .numero {
        font-size: 1.2rem;
        font-weight: 900;
        color: #f39c12;
    }
    .mesa-card-pos.llevarcard .estado {
        font-size: 0.6rem;
        color: var(--text-light, #8a7a6e);
        text-transform: uppercase;
        letter-spacing: 1px;
    }
    .mesa-card-pos.llevarcard .total {
        font-size: 1.1rem;
        font-weight: 800;
        color: var(--orange-light, #f39c12);
    }
`;
document.head.appendChild(styleLlevar);

setInterval(renderizarMesasPOS, 5000);

// ============================================ //
// ESCUCHAR CAMBIOS EN PEDIDOS                  //
// ============================================ //
window.addEventListener('storage', function(e) {
    if (e.key === 'marketpos_pedidos_online') {
        console.log('🔄 Cambio detectado en pedidos');
        renderizarMesasPOS();
    }
});

// ============================================ //
// INICIALIZACIÓN FINAL
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔥 TITO BURGER - Sistema de Caja Integrado');
    console.log('✅ Integrado con: Dashboard de Ventas, Inventario, Producción');
    console.log('✅ Pedidos Para Llevar disponibles en vista de Mesas');
    
    const categoryTabs = document.getElementById('categoryTabs');
    if (categoryTabs) {
        const categories = [
            { key: 'hamburguesas', label: '🍔 Burgers' },
            { key: 'cortes', label: '🥩 Cortes' },
            { key: 'alitas', label: '🍗 Alitas' },
            { key: 'parrilla', label: '🔥 Parrilla' },
            { key: 'promociones', label: '⭐ Promos' },
            { key: 'extras', label: '➕ Extras' },
            { key: 'bebidas', label: '🥤 Bebidas' }
        ];
        categoryTabs.innerHTML = categories.map(c => `
            <button class="cat-btn ${c.key === activeCategoryPOS ? 'active' : ''}" onclick="changeCategory('${c.key}', this)">${c.label}</button>
        `).join('');
    }
    
    renderProductsPOS();
    renderizarMesasPOS();
    
    // Agregar botón de recarga manual
    const headerMesas = document.querySelector('.mesas-view-header');
    if (headerMesas) {
        const btn = document.createElement('button');
        btn.className = 'btn-add-premium';
        btn.innerHTML = '🔄 Recargar Pedidos';
        btn.style.cssText = 'background:#e67e22; margin-left:10px;';
        btn.onclick = recargarPedidos;
        headerMesas.appendChild(btn);
    }
});

// Exponer funciones globalmente
window.addToCartPOS = addToCartPOS;
window.cobrarPOS = cobrarPOS;
window.enviarACocinaPOS = enviarACocinaPOS;
window.agregarMesa = agregarMesa;
window.mostrarEfectivo = mostrarEfectivo;
window.calcularCambioPOS = calcularCambioPOS;
window.recargarPedidos = recargarPedidos;