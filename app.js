// ==========================================
// TITO BURGER · POS · app.js CORREGIDO
// ==========================================

let cartPOS = [];
let activeCategoryPOS = 'hamburguesas';
let tipoPedidoActual = 'mesa';
let pedidoActual = null;

// ==================== INICIALIZACIÓN ====================
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

// ==================== NAVEGACIÓN ====================
function switchView(view) {
    document.querySelectorAll('.sb-btn').forEach(b => b.classList.remove('active'));
    if (event && event.target) {
        const btn = event.target.closest('.sb-btn');
        if (btn) btn.classList.add('active');
    }
    document.getElementById('viewMenu').style.display = view === 'menu' ? 'flex' : 'none';
    document.getElementById('viewMesas').style.display = view === 'mesas' ? 'block' : 'none';
    if (view === 'mesas') renderizarMesasPOS();
    if (view === 'cocina') window.open('cocina.html', '_blank');
}

// ==================== DATOS DEL MENÚ ====================
function getMenuData() {
    return [
        { id: 1, nombre: "TITO BURGER", precio: 5.00, categoria: "hamburguesas", emoji: "🍔", img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200" },
        { id: 2, nombre: "HAWAI", precio: 3.75, categoria: "hamburguesas", emoji: "🍍", img: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=200" },
        { id: 3, nombre: "THE BIG BOSS", precio: 5.50, categoria: "hamburguesas", emoji: "👑", img: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=200" },
        { id: 4, nombre: "PARRILLERA", precio: 4.00, categoria: "hamburguesas", emoji: "🥓", img: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=200" },
        { id: 5, nombre: "HULK", precio: 7.00, categoria: "hamburguesas", emoji: "💪", img: "https://images.unsplash.com/photo-1586816001966-79b736744398?w=200" },
        { id: 6, nombre: "CLÁSICA", precio: 3.00, categoria: "hamburguesas", emoji: "🍔", img: "https://images.unsplash.com/photo-1561758033-7e924f619b47?w=200" },
        { id: 7, nombre: "CLÁSICA + PAPAS", precio: 3.00, categoria: "hamburguesas", emoji: "🍟", img: "https://images.unsplash.com/photo-1571091718765-18b5b145add?w=200" },
        { id: 8, nombre: "PICAÑA", precio: 10.00, categoria: "cortes", emoji: "🥩", img: "https://images.unsplash.com/photo-1544025162-d76694265947?w=200" },
        { id: 9, nombre: "BIFE DE CHORIZO", precio: 10.00, categoria: "cortes", emoji: "🥩", img: "https://images.unsplash.com/photo-1600891964092-4316c288032e?w=200" },
        { id: 10, nombre: "RIBEYE", precio: 9.00, categoria: "cortes", emoji: "🥩", img: "https://images.unsplash.com/photo-1615937722923-67f6deaf2cc9?w=200" },
        { id: 11, nombre: "T-BONE", precio: 10.00, categoria: "cortes", emoji: "🦴", img: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=200" },
        { id: 12, nombre: "CORDERO", precio: 7.00, categoria: "cortes", emoji: "🐑", img: "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=200" },
        { id: 13, nombre: "LOMITO DE RES", precio: 5.00, categoria: "cortes", emoji: "🥩", img: "https://images.unsplash.com/photo-1558030006-450675393462?w=200" },
        { id: 14, nombre: "POLLO A LA PARRILLA", precio: 4.50, categoria: "cortes", emoji: "🍗", img: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=200" },
        { id: 15, nombre: "CHULETA DE CERDO", precio: 5.00, categoria: "cortes", emoji: "🐷", img: "https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=200" },
        { id: 16, nombre: "4 ALITAS (8)", precio: 6.00, categoria: "alitas", emoji: "🍗", img: "https://images.unsplash.com/photo-1605710379250-f332254b96de?w=200" },
        { id: 17, nombre: "8 ALITAS (16)", precio: 10.00, categoria: "alitas", emoji: "🍗", img: "https://images.unsplash.com/photo-1605710379250-f332254b96de?w=200" },
        { id: 18, nombre: "12 ALITAS (24)", precio: 14.00, categoria: "alitas", emoji: "🍗", img: "https://images.unsplash.com/photo-1605710379250-f332254b96de?w=200" },
        { id: 19, nombre: "15 ALITAS (30)", precio: 16.00, categoria: "alitas", emoji: "🍗", img: "https://images.unsplash.com/photo-1605710379250-f332254b96de?w=200" },
        { id: 20, nombre: "20 ALITAS (40)", precio: 21.00, categoria: "alitas", emoji: "🍗", img: "https://images.unsplash.com/photo-1605710379250-f332254b96de?w=200" },
        { id: 21, nombre: "SUPER PICADITA", precio: 7.00, categoria: "parrilla", emoji: "🎯", img: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=200" },
        { id: 22, nombre: "PARRILLADA TITO", precio: 9.00, categoria: "parrilla", emoji: "🔥", img: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=200" },
        { id: 23, nombre: "COSTILLAS BBQ", precio: 7.00, categoria: "parrilla", emoji: "🍖", img: "https://images.unsplash.com/photo-1544025162-d76694265947?w=200" },
        { id: 24, nombre: "PAPA CON CHILLY", precio: 4.50, categoria: "parrilla", emoji: "🧀", img: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=200" },
        { id: 25, nombre: "CHORY PAPA", precio: 4.00, categoria: "parrilla", emoji: "🌭", img: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=200" },
        { id: 26, nombre: "CHORIPÁN", precio: 3.50, categoria: "parrilla", emoji: "🌭", img: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=200" },
        { id: 27, nombre: "KIT ESTRELLA", precio: 7.00, categoria: "promociones", emoji: "⭐", img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200" },
        { id: 28, nombre: "COMBO PAREJA", precio: 11.00, categoria: "promociones", emoji: "💑", img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200" },
        { id: 29, nombre: "COMBO COMPARTIR", precio: 14.00, categoria: "promociones", emoji: "🎉", img: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=200" },
        { id: 30, nombre: "COMBO FAMILIAR", precio: 16.00, categoria: "promociones", emoji: "👨‍👩‍👧‍👦", img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200" },
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

// ==================== CAMBIO DE CATEGORÍA ====================
function changeCategory(cat, el) {
    activeCategoryPOS = cat;
    document.querySelectorAll('.categories-row-premium .cat-btn').forEach(c => c.classList.remove('active'));
    if (el) el.classList.add('active');
    renderProductsPOS();
}

// ==================== RENDERIZAR PRODUCTOS ====================
function renderProductsPOS() {
    const menu = getMenuData();
    const products = activeCategoryPOS === 'todo' ? menu : menu.filter(p => p.categoria === activeCategoryPOS);
    const grid = document.getElementById('productsGrid');
    if (!grid) return;
    
    grid.innerHTML = products.map(p => `
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
                <div class="precio">$${p.precio.toFixed(2)}</div>
            </div>
        </div>
    `).join('');
}

// ==================== BÚSQUEDA EN VIVO ====================
function buscarProductoLive() {
    const t = document.getElementById('searchInput')?.value.toLowerCase() || '';
    const products = t 
        ? getMenuData().filter(p => p.nombre.toLowerCase().includes(t)) 
        : getMenuData().filter(p => activeCategoryPOS === 'todo' || p.categoria === activeCategoryPOS);
    
    const grid = document.getElementById('productsGrid');
    if (!grid) return;
    
    grid.innerHTML = products.map(p => `
        <div class="product-card-pos" onclick="addToCartPOS(${p.id})">
            <img src="${p.img}" alt="${p.nombre}" style="width:50px;height:50px;border-radius:6px;object-fit:cover;">
            <span class="emoji">${p.emoji}</span>
            <div class="nombre">${p.nombre}</div>
            <div class="precio">$${p.precio.toFixed(2)}</div>
        </div>
    `).join('');
}

// ==================== CARRITO ====================
function addToCartPOS(id) {
    const p = getMenuData().find(x => x.id === id);
    if (!p) return;
    const exist = cartPOS.find(i => i.id === id);
    exist ? exist.cantidad++ : cartPOS.push({ id: p.id, nombre: p.nombre, precio: p.precio, emoji: p.emoji, cantidad: 1 });
    renderCartPOS();
}

function renderCartPOS() {
    const subtotal = cartPOS.reduce((s, i) => s + i.precio * i.cantidad, 0);
    const descuento = subtotal > 15 ? subtotal * 0.10 : 0;
    const total = subtotal - descuento;
    
    const subtotalEl = document.getElementById('subtotalPOS');
    const descuentoEl = document.getElementById('descuentoPOS');
    const totalEl = document.getElementById('totalPOS');
    
    if (subtotalEl) subtotalEl.textContent = '$' + subtotal.toFixed(2);
    if (descuentoEl) descuentoEl.textContent = '-$' + descuento.toFixed(2);
    if (totalEl) totalEl.textContent = '$' + total.toFixed(2);
    
    // Habilitar/deshabilitar botón enviar
    const btnEnviar = document.getElementById('btnEnviarCocina');
    if (btnEnviar) btnEnviar.disabled = cartPOS.length === 0;
    
    // Badge del carrito
    const cartBadge = document.getElementById('cartCountBadge');
    if (cartBadge) {
        const totalItems = cartPOS.reduce((s, i) => s + i.cantidad, 0);
        cartBadge.textContent = totalItems;
    }
    
    const container = document.getElementById('cartItems');
    if (!container) return;
    
    if (cartPOS.length === 0) { 
        container.innerHTML = '<p class="cart-empty">No hay productos</p>'; 
        return; 
    }
    
    container.innerHTML = cartPOS.map((i, idx) => `
        <div class="cart-item-pos">
            <div class="info"><strong>${i.emoji} ${i.nombre}</strong><span>${i.cantidad} pcs</span></div>
            <div class="qty">
                <button class="btn-qty-pos" onclick="updateCartQty(${idx}, -1)">−</button>
                <span>${i.cantidad}</span>
                <button class="btn-qty-pos" onclick="updateCartQty(${idx}, 1)">+</button>
            </div>
            <span>$${(i.precio*i.cantidad).toFixed(2)}</span>
        </div>
    `).join('');
}

function updateCartQty(idx, change) {
    if (idx < 0 || idx >= cartPOS.length) return;
    cartPOS[idx].cantidad += change;
    if (cartPOS[idx].cantidad <= 0) cartPOS.splice(idx, 1);
    renderCartPOS();
}

// ==================== TIPO PEDIDO ====================
document.getElementById('tipoPedidoPOS')?.addEventListener('change', function() {
    tipoPedidoActual = this.value;
    const facturaDiv = document.getElementById('clienteFactura');
    const mesaContainer = document.getElementById('mesaInputContainer');
    const mesaInput = document.getElementById('mesaInputPOS');
    
    if (this.value === 'mesa') {
        if (facturaDiv) facturaDiv.style.display = 'none';
        if (mesaContainer) mesaContainer.style.display = 'block';
        if (mesaInput) mesaInput.style.display = 'block';
    } else {
        if (facturaDiv) facturaDiv.style.display = 'block';
        if (mesaContainer) mesaContainer.style.display = 'none';
        if (mesaInput) mesaInput.style.display = 'none';
        if (mesaInput) mesaInput.value = '';
    }
});

// ==================== MESAS ====================
async function renderizarMesasPOS() {
    const grid = document.getElementById('mesasGrid');
    if (!grid) return;
    try {
        const res = await fetch('/api/mesas');
        const mesasData = await res.json();
        renderMesasGrid(grid, mesasData);
    } catch(e) {
        const mesasLocal = JSON.parse(localStorage.getItem('marketpos_mesas') || '[]');
        if (mesasLocal.length > 0) {
            renderMesasGrid(grid, mesasLocal);
        } else {
            // Mesas demo
            const mesasDemo = [];
            for (let i = 1; i <= 8; i++) {
                mesasDemo.push({ numero: i, estado: i % 2 === 0 ? 'libre' : 'ocupada' });
            }
            renderMesasGrid(grid, mesasDemo);
        }
    }
}

function renderMesasGrid(grid, mesas) {
    grid.innerHTML = mesas.map(m => `
        <div class="mesa-card-pos ${m.estado}" onclick="${m.estado === 'ocupada' ? "cobrarMesa('" + m.numero + "')" : "seleccionarMesa(" + m.numero + ")"}">
            <span class="numero">🪑 ${m.numero}</span>
            <span class="estado">${m.estado === 'libre' ? '🟢 Libre' : '🔴 Ocupada'}</span>
            ${m.estado === 'ocupada' ? '<span style="font-size:0.6rem;color:#c0392b;">💵 Cobrar</span>' : ''}
        </div>
    `).join('');
}

function seleccionarMesa(numero) {
    const mesaInput = document.getElementById('mesaInputPOS');
    if (mesaInput) mesaInput.value = numero;
    switchView('menu');
    alert('🪑 Mesa ' + numero + ' seleccionada');
}

async function cobrarMesa(numero) {
    let pedido = null;
    try { 
        const res = await fetch('/api/pedidos'); 
        const pedidos = await res.json(); 
        pedido = pedidos.find(p => p.cliente?.mesa == numero && p.estado !== 'entregado'); 
    } catch(e) {}
    
    if (!pedido) { 
        const pedidosLocal = JSON.parse(localStorage.getItem('marketpos_pedidos_online') || '[]'); 
        pedido = pedidosLocal.find(p => p.cliente?.mesa == numero && p.estado !== 'entregado'); 
    }
    if (!pedido) { 
        const mesasLocal = JSON.parse(localStorage.getItem('marketpos_mesas') || '[]'); 
        const mesa = mesasLocal.find(m => m.numero === parseInt(numero)); 
        if (mesa && mesa.orden && mesa.orden.length > 0) { 
            pedido = { 
                items: mesa.orden, 
                total: mesa.orden.reduce((s, i) => s + (i.precio || 0) * (i.cantidad || 1), 0), 
                cliente: { mesa: numero } 
            }; 
        } 
    }
    if (!pedido) { 
        alert('No se encontró pedido para Mesa ' + numero); 
        return; 
    }
    
    cartPOS = (pedido.items || []).map(i => ({ 
        id: i.id, 
        nombre: i.nombre, 
        precio: i.precio || 0, 
        emoji: i.emoji || '🍽️', 
        cantidad: i.cantidad || 1 
    }));
    document.getElementById('mesaInputPOS').value = numero;
    document.getElementById('tipoPedidoPOS').value = 'mesa';
    document.getElementById('viewMenu').style.display = 'flex';
    document.getElementById('viewMesas').style.display = 'none';
    document.querySelectorAll('.sb-btn').forEach(b => b.classList.remove('active'));
    const firstSbBtn = document.querySelector('.sb-btn');
    if (firstSbBtn) firstSbBtn.classList.add('active');
    renderCartPOS();
    document.getElementById('clienteFactura').style.display = 'block';
    
    if (!document.getElementById('metodoPago')) {
        document.getElementById('clienteFactura').insertAdjacentHTML('afterbegin', 
            `<select id="metodoPago" class="input-premium" style="margin-bottom:6px;" onchange="mostrarEfectivo()">
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
            </div>`);
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
        if (cambio >= 0) { 
            valor.textContent = '$' + cambio.toFixed(2); 
            valor.style.color = '#27ae60'; 
        } else { 
            valor.textContent = 'Falta $' + Math.abs(cambio).toFixed(2); 
            valor.style.color = '#c0392b'; 
        }
    } else { 
        display.style.display = 'none'; 
    }
}

function agregarMesa() { 
    fetch('/api/mesas', { method: 'POST' }).then(() => renderizarMesasPOS()).catch(() => {
        const mesasLocal = JSON.parse(localStorage.getItem('marketpos_mesas') || '[]');
        const nuevoNum = mesasLocal.length > 0 ? Math.max(...mesasLocal.map(m => m.numero)) + 1 : 1;
        mesasLocal.push({ numero: nuevoNum, estado: 'libre', orden: [] });
        localStorage.setItem('marketpos_mesas', JSON.stringify(mesasLocal));
        renderizarMesasPOS();
    });
}

// ==================== DASHBOARD ====================
async function toggleDashboard() {
    let pedidos = [];
    try { 
        const res = await fetch('/api/pedidos'); 
        pedidos = await res.json(); 
    } catch(e) { 
        pedidos = JSON.parse(localStorage.getItem('marketpos_pedidos_online') || '[]'); 
    }
    const hoy = new Date().toDateString();
    const pedidosHoy = pedidos.filter(p => new Date(p.fecha).toDateString() === hoy);
    const totalVendido = pedidosHoy.reduce((s, p) => s + (p.total || 0), 0);
    const ticketPromedio = pedidosHoy.length > 0 ? totalVendido / pedidosHoy.length : 0;
    const conteo = {}; 
    pedidosHoy.forEach(p => { 
        (p.items || []).forEach(i => { 
            conteo[i.nombre] = (conteo[i.nombre] || 0) + (i.cantidad || 1); 
        }); 
    });
    const masVendido = Object.entries(conteo).sort((a,b) => b[1]-a[1]).slice(0, 5);
    const metodos = {}; 
    pedidosHoy.forEach(p => { 
        const m = p.cliente?.tipoPedido || 'mesa'; 
        metodos[m] = (metodos[m] || 0) + 1; 
    });
    
    const win = window.open('', 'Dashboard', 'width=600,height=700');
    if (!win) { alert('Permite ventanas emergentes'); return; }
    
    win.document.write(`<!DOCTYPE html><html><head><title>TITO BURGER</title>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
    <style>
        *{margin:0;padding:0;font-family:'Montserrat',sans-serif}
        body{background:#0a0a0c;padding:20px;color:#eee}
        .header{text-align:center;margin-bottom:25px}
        .header h1{color:#f5a623;font-size:1.8rem;font-weight:900}
        .stats{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:20px}
        .stat-card{background:#16161c;padding:18px;border-radius:10px;text-align:center;border:1px solid #222}
        .stat-card .num{font-size:1.8rem;font-weight:800;color:#ffc955}
        .section-title{font-weight:700;margin:15px 0 10px;color:#f5a623}
        .top-list{background:#16161c;border-radius:10px;padding:15px;border:1px solid #222}
        .top-item{display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #222}
        .badge{background:#c0392b;color:white;padding:4px 10px;border-radius:12px;font-size:0.7rem;font-weight:700}
        .btn{display:block;width:100%;padding:12px;background:#c0392b;color:white;border:none;border-radius:8px;font-weight:700;cursor:pointer;margin-top:15px}
    </style></head><body>
    <div class="header"><h1>🔥 TITO BURGER</h1><p>${new Date().toLocaleDateString()}</p></div>
    <div class="stats">
        <div class="stat-card"><div class="num">$${totalVendido.toFixed(2)}</div><div class="label">Ventas Hoy</div></div>
        <div class="stat-card"><div class="num">${pedidosHoy.length}</div><div class="label">Pedidos Hoy</div></div>
        <div class="stat-card"><div class="num">$${ticketPromedio.toFixed(2)}</div><div class="label">Ticket Promedio</div></div>
        <div class="stat-card"><div class="num">${pedidos.length}</div><div class="label">Total Pedidos</div></div>
    </div>
    <div class="section-title">🏆 Más Vendidos</div>
    <div class="top-list">${masVendido.length > 0 ? masVendido.map(([n,c],i) => `<div class="top-item"><span>${i+1}. ${n}</span><span class="badge">x${c}</span></div>`).join('') : '<p>Sin datos</p>'}</div>
    <div class="section-title">📋 Tipos</div>
    <div class="top-list">${Object.entries(metodos).map(([t,c]) => `<div class="top-item"><span>${t==='mesa'?'🪑 Mesa':t==='llevar'?'🛵 Recoger':'🚀 Delivery'}</span><span class="badge">${c}</span></div>`).join('')}</div>
    <button class="btn" onclick="window.print()">🖨️ Imprimir</button></body></html>`);
    win.document.close();
}

// ==================== ENVIAR A COCINA ====================
async function enviarACocinaPOS() {
    if (cartPOS.length === 0) { 
        alert('⚠️ Agregue productos al pedido'); 
        return; 
    }
    
    const mesa = document.getElementById('mesaInputPOS')?.value || '1';
    const subtotal = cartPOS.reduce((s, i) => s + i.precio * i.cantidad, 0);
    const descuento = subtotal > 15 ? subtotal * 0.10 : 0;
    const total = subtotal - descuento;
    
    const pedido = {
        id: Date.now(),
        cliente: { nombre: 'Mesero', mesa, tipoPedido: tipoPedidoActual },
        items: cartPOS.map(i => ({ id: i.id, nombre: i.nombre, precio: i.precio, emoji: i.emoji, cantidad: i.cantidad })),
        total,
        fecha: new Date().toISOString(),
        estado: 'nuevo'
    };
    
    // Guardar en API
    try { 
        await fetch('/api/pedidos', { 
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify(pedido) 
        }); 
    } catch(e) {
        console.log('API no disponible, usando localStorage');
    }
    
    // Guardar en localStorage
    const pedidosLocal = JSON.parse(localStorage.getItem('marketpos_pedidos_online') || '[]');
    pedidosLocal.unshift(pedido);
    localStorage.setItem('marketpos_pedidos_online', JSON.stringify(pedidosLocal));
    
    // Marcar mesa ocupada
    if (tipoPedidoActual === 'mesa') {
        const mesasLocal = JSON.parse(localStorage.getItem('marketpos_mesas') || '[]');
        const mesaObj = mesasLocal.find(m => m.numero === parseInt(mesa));
        if (mesaObj) { 
            mesaObj.estado = 'ocupada'; 
            mesaObj.orden = pedido.items; 
        } else {
            mesasLocal.push({ numero: parseInt(mesa), estado: 'ocupada', orden: pedido.items });
        }
        localStorage.setItem('marketpos_mesas', JSON.stringify(mesasLocal));
    }
    
    // Animación en botón
    const btnEnviar = document.getElementById('btnEnviarCocina');
    if (btnEnviar) {
        const originalHTML = btnEnviar.innerHTML;
        btnEnviar.innerHTML = '✅ ENVIADO!';
        btnEnviar.disabled = true;
        btnEnviar.style.background = '#27ae60';
        setTimeout(() => {
            btnEnviar.innerHTML = originalHTML;
            btnEnviar.style.background = '';
            btnEnviar.disabled = false;
        }, 2000);
    }
    
    alert('✅ Pedido #' + pedido.id + ' enviado a cocina - Mesa ' + mesa);
    cartPOS = []; 
    renderCartPOS();
}

// ==================== COBRAR ====================
async function cobrarPOS() {
    if (cartPOS.length === 0) { 
        alert('⚠️ Agregue productos al pedido'); 
        return; 
    }
    
    const facturaDiv = document.getElementById('clienteFactura');
    
    if (!facturaDiv || facturaDiv.style.display === 'none') {
        if (facturaDiv) facturaDiv.style.display = 'block';
        if (!document.getElementById('metodoPago')) {
            facturaDiv.insertAdjacentHTML('afterbegin', 
                `<select id="metodoPago" class="input-premium" style="margin-bottom:6px;" onchange="mostrarEfectivo()">
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
                </div>`);
        }
        alert('📄 Complete los datos y método de pago');
        return;
    }
    
    const mesa = document.getElementById('mesaInputPOS')?.value || '1';
    const subtotal = cartPOS.reduce((s, i) => s + i.precio * i.cantidad, 0);
    const descuento = subtotal > 15 ? subtotal * 0.10 : 0;
    const total = subtotal - descuento;
    const metodoPago = document.getElementById('metodoPago')?.value || 'No especificado';
    const recibido = parseFloat(document.getElementById('montoRecibido')?.value) || 0;
    const cambio = recibido - total;
    
    if (!document.getElementById('metodoPago')?.value) { 
        alert('⚠️ Seleccione método de pago'); 
        return; 
    }
    if (metodoPago === 'efectivo' && recibido < total) { 
        alert('⚠️ Monto insuficiente. Faltan $' + Math.abs(cambio).toFixed(2)); 
        return; 
    }
    
    const clienteFactura = {
        nombre: document.getElementById('facturaNombre')?.value || 'Consumidor Final',
        ruc: document.getElementById('facturaRUC')?.value || '9999999999999',
        email: document.getElementById('facturaEmail')?.value || '',
        direccion: document.getElementById('facturaDireccion')?.value || 'Av. Principal 123',
        metodoPago, recibido, cambio
    };
    
    const facturaNum = '001-001-' + String(Math.floor(Math.random()*99999999)).padStart(8,'0');
    const pedidoCompleto = { 
        id: Date.now(),
        cliente: { ...clienteFactura, mesa, tipoPedido: tipoPedidoActual }, 
        items: cartPOS.map(i => ({ id: i.id, nombre: i.nombre, precio: i.precio, emoji: i.emoji, cantidad: i.cantidad })), 
        total, 
        factura: clienteFactura,
        facturaNum,
        fecha: new Date().toISOString(),
        estado: 'entregado'
    };
    
    // Generar y descargar factura
    const facturaHTML = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Factura</title>
    <style>body{font-family:Arial;padding:20px;max-width:300px;margin:0 auto}
    h2{text-align:center;color:#c0392b}table{width:100%}
    td,th{padding:6px;border-bottom:1px solid #ddd;font-size:12px}
    .total{font-size:18px;font-weight:bold;color:#c0392b}</style></head>
    <body><h2>🔥 TITO BURGER</h2>
    <p><strong>Factura:</strong> ${facturaNum}</p>
    <p><strong>Fecha:</strong> ${new Date().toLocaleString()}</p>
    <p><strong>Cliente:</strong> ${clienteFactura.nombre}</p>
    <p><strong>RUC:</strong> ${clienteFactura.ruc}</p>
    <p><strong>Método:</strong> ${clienteFactura.metodoPago}</p>
    ${metodoPago === 'efectivo' ? `<p><strong>Recibido:</strong> $${recibido.toFixed(2)}</p><p><strong>Cambio:</strong> $${cambio.toFixed(2)}</p>` : ''}
    <table><tr><th>Producto</th><th>Cant</th><th>Total</th></tr>
    ${pedidoCompleto.items.map(i => `<tr><td>${i.emoji} ${i.nombre}</td><td>x${i.cantidad}</td><td>$${(i.precio*i.cantidad).toFixed(2)}</td></tr>`).join('')}
    </table><p class="total">TOTAL: $${total.toFixed(2)}</p>
    <p style="text-align:center">Gracias por su visita ❤️</p></body></html>`;
    
    const blob = new Blob([facturaHTML], {type:'text/html'}); 
    const url = URL.createObjectURL(blob); 
    const a = document.createElement('a'); 
    a.href = url; 
    a.download = `Factura_TITO_${facturaNum}.html`; 
    a.click();
    URL.revokeObjectURL(url);
    
    // Enviar email
    if (clienteFactura.email && window.emailjs) { 
        emailjs.send('service_nj7glup', 'template_szgtsns', { 
            to_email: clienteFactura.email, 
            cliente_nombre: clienteFactura.nombre, 
            cliente_ruc: clienteFactura.ruc, 
            total: '$' + total.toFixed(2), 
            factura_numero: facturaNum, 
            items: pedidoCompleto.items.map(i => `${i.nombre} x${i.cantidad} - $${(i.precio*i.cantidad).toFixed(2)}`).join('\n'), 
            fecha: new Date().toLocaleString() 
        }).catch(() => {}); 
    }
    
    // Liberar mesa
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
    
    // Guardar pedido completado
    const pedidosLocal = JSON.parse(localStorage.getItem('marketpos_pedidos_online') || '[]');
    pedidosLocal.unshift(pedidoCompleto);
    localStorage.setItem('marketpos_pedidos_online', JSON.stringify(pedidosLocal));
    
    let mensaje = '✅ Cobro realizado - Factura: ' + facturaNum + ' - Método: ' + metodoPago;
    if (metodoPago === 'efectivo') mensaje += ' - Cambio: $' + cambio.toFixed(2);
    alert(mensaje);
    
    // Limpiar
    cartPOS = []; 
    renderCartPOS();
    if (facturaDiv) facturaDiv.style.display = 'none';
    ['facturaNombre', 'facturaRUC', 'facturaEmail', 'facturaDireccion'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });
    const montoEl = document.getElementById('montoRecibido');
    if (montoEl) montoEl.value = '';
    const cambioEl = document.getElementById('cambioDisplay');
    if (cambioEl) cambioEl.style.display = 'none';
    const metodoEl = document.getElementById('metodoPago');
    if (metodoEl) metodoEl.remove();
    const efectivoEl = document.getElementById('efectivoSection');
    if (efectivoEl) efectivoEl.remove();
}

// ==================== LOGOUT ====================
function logout() { 
    localStorage.clear(); 
    location.reload(); 
}

// ==================== INICIALIZACIÓN ====================
setInterval(renderizarMesasPOS, 3000);
renderProductsPOS();

console.log('🔥 TITO BURGER · POS inicializado');
console.log('📦 Productos cargados:', getMenuData().length);
console.log('💾 localStorage:', {
    pedidos: JSON.parse(localStorage.getItem('marketpos_pedidos_online') || '[]').length,
    mesas: JSON.parse(localStorage.getItem('marketpos_mesas') || '[]').length
});