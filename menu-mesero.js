let cart = [];
let activeCategory = 'hamburguesas';
let mesaActual = '1';
let modoEdicion = false;
let pedidoIdEdicion = null;

const urlParams = new URLSearchParams(window.location.search);
mesaActual = urlParams.get('mesa') || '1';
const editarParam = urlParams.get('editar');

if (document.getElementById('mesaBadge')) document.getElementById('mesaBadge').textContent = '🔥 Mesa ' + mesaActual;
if (document.getElementById('mesaInfo')) document.getElementById('mesaInfo').textContent = '🔥 MESA ' + mesaActual;
if (document.getElementById('cartMesaTitle')) document.getElementById('cartMesaTitle').textContent = mesaActual;

const categories = [
    { key: 'hamburguesas', label: '🍔 Burgers' },
    { key: 'cortes', label: '🥩 Cortes' },
    { key: 'alitas', label: '🍗 Alitas' },
    { key: 'parrilla', label: '🔥 Parrilla' },
    { key: 'promociones', label: '⭐ Promos' },
    { key: 'extras', label: '➕ Extras' },
    { key: 'bebidas', label: '🥤 Bebidas' }
];

function getMenuData() {
    return [
        { id: 1, nombre: "TITO BURGER", precio: 4.99, categoria: "hamburguesas", emoji: "🍔", img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200", desc: "Carne, Queso cheddar, Cebolla caramelizada, Mayonesa Tito, Morrón asado, Mermelada de tocino + Papas Tito" },
        { id: 2, nombre: "HAWAI", precio: 3.75, categoria: "hamburguesas", emoji: "🍍", img: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=200", desc: "Carne, Piña asada, Queso cheddar, Cebolla caramelizada, Mayonesa finas hierbas + Papas Tito" },
        { id: 3, nombre: "THE BIG BOSS", precio: 5.50, categoria: "hamburguesas", emoji: "👑", img: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=200", desc: "Doble carne, Doble queso cheddar + Papas Tito" },
        { id: 4, nombre: "PARRILLERA", precio: 3.95, categoria: "hamburguesas", emoji: "🥓", img: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=200", desc: "Carne, Chorizo paisa, Queso cheddar, Chimichurri + Papas Tito" },
        { id: 5, nombre: "HULK", precio: 6.99, categoria: "hamburguesas", emoji: "💪", img: "https://images.unsplash.com/photo-1586816001966-79b736744398?w=200", desc: "Triple carne, Chorizo paisa, Triple queso cheddar + Papas Tito" },
        { id: 6, nombre: "CLÁSICA", precio: 2.50, categoria: "hamburguesas", emoji: "🍔", img: "https://images.unsplash.com/photo-1561758033-7e924f619b47?w=200", desc: "Carne, Queso cheddar, Cebolla caramelizada, Mayonesa morrón" },
        { id: 7, nombre: "CLÁSICA + PAPAS", precio: 2.99, categoria: "hamburguesas", emoji: "🍟", img: "https://images.unsplash.com/photo-1571091718765-18b5b145add?w=200", desc: "Clásica + Papas Tito" },
        { id: 8, nombre: "PICAÑA", precio: 9.99, categoria: "cortes", emoji: "🥩", img: "https://images.unsplash.com/photo-1544025162-d76694265947?w=200", desc: "+ Chorizo, Ensalada, Chimichurri + Papas Tito" },
        { id: 9, nombre: "BIFE DE CHORIZO", precio: 9.99, categoria: "cortes", emoji: "🥩", img: "https://images.unsplash.com/photo-1600891964092-4316c288032e?w=200", desc: "+ Chorizo, Ensalada, Chimichurri + Papas Tito" },
        { id: 10, nombre: "RYBEYE", precio: 8.99, categoria: "cortes", emoji: "🥩", img: "https://images.unsplash.com/photo-1615937722923-67f6deaf2cc9?w=200", desc: "+ Chorizo, Ensalada, Chimichurri + Papas Tito" },
        { id: 11, nombre: "T-BONE", precio: 9.99, categoria: "cortes", emoji: "🦴", img: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=200", desc: "+ Chorizo, Ensalada, Chimichurri + Papas Tito" },
        { id: 12, nombre: "CORDERO", precio: 6.99, categoria: "cortes", emoji: "🐑", img: "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=200", desc: "+ Chorizo, Ensalada, Chimichurri + Papas Tito" },
        { id: 13, nombre: "LOMITO DE RES", precio: 4.99, categoria: "cortes", emoji: "🥩", img: "https://images.unsplash.com/photo-1558030006-450675393462?w=200", desc: "Jugoso Filete + Chorizo, Ensalada + Papas Tito" },
        { id: 14, nombre: "POLLO A LA PARRILLA", precio: 4.50, categoria: "cortes", emoji: "🍗", img: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=200", desc: "Jugoso Filete + Chorizo, Ensalada + Papas Tito" },
        { id: 15, nombre: "CHULETA DE CERDO", precio: 4.99, categoria: "cortes", emoji: "🐷", img: "https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=200", desc: "Jugoso Filete + Chorizo, Ensalada + Papas Tito" },
        { id: 16, nombre: "4 ALITAS (8)", precio: 6.00, categoria: "alitas", emoji: "🍗", img: "https://images.unsplash.com/photo-1605710379250-f332254b96de?w=200", desc: "Papas Tito, Apio, Zanahoria. Sabores: BBQ, BBQ Picante, Mostaza y Miel, Maracuyá, Parmesano" },
        { id: 17, nombre: "8 ALITAS (16)", precio: 9.99, categoria: "alitas", emoji: "🍗", img: "https://images.unsplash.com/photo-1605710379250-f332254b96de?w=200", desc: "Papas Tito, Apio, Zanahoria. Sabores: BBQ, BBQ Picante, Mostaza y Miel, Maracuyá, Parmesano" },
        { id: 18, nombre: "12 ALITAS (24)", precio: 13.99, categoria: "alitas", emoji: "🍗", img: "https://images.unsplash.com/photo-1605710379250-f332254b96de?w=200", desc: "Papas Tito, Apio, Zanahoria. Sabores: BBQ, BBQ Picante, Mostaza y Miel, Maracuyá, Parmesano" },
        { id: 19, nombre: "15 ALITAS (30)", precio: 15.99, categoria: "alitas", emoji: "🍗", img: "https://images.unsplash.com/photo-1605710379250-f332254b96de?w=200", desc: "Papas Tito, Apio, Zanahoria. Sabores: BBQ, BBQ Picante, Mostaza y Miel, Maracuyá, Parmesano" },
        { id: 20, nombre: "20 ALITAS (40)", precio: 20.99, categoria: "alitas", emoji: "🍗", img: "https://images.unsplash.com/photo-1605710379250-f332254b96de?w=200", desc: "Papas Tito, Apio, Zanahoria. Sabores: BBQ, BBQ Picante, Mostaza y Miel, Maracuyá, Parmesano" },
        { id: 21, nombre: "SUPER PICADITA", precio: 6.99, categoria: "parrilla", emoji: "🎯", img: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=200", desc: "Pollo, Lomo, Doble chorizo, Cuero, Chimichurri + Papas Tito" },
        { id: 22, nombre: "PARRILLADA TITO", precio: 8.99, categoria: "parrilla", emoji: "🔥", img: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=200", desc: "Pollo, Lomo, Chuleta, Triple Chorizo, Cuero, Ensalada, Chimichurri + Papas Tito" },
        { id: 23, nombre: "COSTILLAS BBQ", precio: 6.99, categoria: "parrilla", emoji: "🍖", img: "https://images.unsplash.com/photo-1544025162-d76694265947?w=200", desc: "Costilla especial bañada en salsa BBQ + Papas Tito" },
        { id: 24, nombre: "PAPA CON CHILLY", precio: 4.50, categoria: "parrilla", emoji: "🧀", img: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=200", desc: "Queso mozarella, Frijoles, Carne Molida + Papas Tito" },
        { id: 25, nombre: "CHORY PAPA", precio: 4.00, categoria: "parrilla", emoji: "🌭", img: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=200", desc: "Chorizo paisa, Chimichurri + Papas Tito" },
        { id: 26, nombre: "CHORIPÁN", precio: 3.50, categoria: "parrilla", emoji: "🌭", img: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=200", desc: "Chorizo paisa, Chimichurri, Mayonesa morrón + Papas Tito" },
        { id: 27, nombre: "KIT ESTRELLA", precio: 6.99, categoria: "promociones", emoji: "⭐", img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200", desc: "Tito Burguer + Limonada + Papas Tito extra" },
        { id: 28, nombre: "COMBO PAREJA", precio: 10.99, categoria: "promociones", emoji: "💑", img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200", desc: "2 Hamburguesas + 2 Limonadas + Papas Tito" },
        { id: 29, nombre: "COMBO COMPARTIR", precio: 13.99, categoria: "promociones", emoji: "🎉", img: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=200", desc: "Parrillada real + Jarra de limonada + Papas Tito" },
        { id: 30, nombre: "COMBO FAMILIAR", precio: 15.99, categoria: "promociones", emoji: "👨‍👩‍👧‍👦", img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200", desc: "3 Burguer + 3 Limonadas + Papas Tito" },
        { id: 31, nombre: "PAPAS TITO", precio: 1.50, categoria: "extras", emoji: "🍟", img: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=200", desc: "" },
        { id: 32, nombre: "CHORIZO NORMAL", precio: 1.00, categoria: "extras", emoji: "🌭", img: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=200", desc: "" },
        { id: 33, nombre: "CHORIZO PAISA", precio: 1.50, categoria: "extras", emoji: "🌭", img: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=200", desc: "" },
        { id: 34, nombre: "CARNE HAMBURGUESA", precio: 1.50, categoria: "extras", emoji: "🥩", img: "https://images.unsplash.com/photo-1544025162-d76694265947?w=200", desc: "" },
        { id: 35, nombre: "PIÑA", precio: 0.75, categoria: "extras", emoji: "🍍", img: "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=200", desc: "" },
        { id: 36, nombre: "CUERO", precio: 2.00, categoria: "extras", emoji: "🥓", img: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=200", desc: "" },
        { id: 37, nombre: "ENSALADA", precio: 1.50, categoria: "extras", emoji: "🥗", img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200", desc: "" },
        { id: 38, nombre: "MAYONESA TITO", precio: 2.00, categoria: "extras", emoji: "🫙", img: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=200", desc: "" },
        { id: 39, nombre: "LIMONADA", precio: 2.50, categoria: "bebidas", emoji: "🍋", img: "https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=200", desc: "Natural" },
        { id: 40, nombre: "JARRA LIMONADA", precio: 5.00, categoria: "bebidas", emoji: "🍋", img: "https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=200", desc: "" },
        { id: 41, nombre: "COCA-COLA", precio: 1.50, categoria: "bebidas", emoji: "🥤", img: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=200", desc: "" },
        { id: 42, nombre: "AGUA", precio: 1.00, categoria: "bebidas", emoji: "💧", img: "https://images.unsplash.com/photo-1616118132534-381148898bb4?w=200", desc: "" }
    ];
}

function calculateTotal() { return cart.reduce((s, i) => s + i.precio * i.cantidad, 0); }
function updateCartCount() { const el = document.getElementById('cartCount'); if (el) el.textContent = cart.reduce((s, i) => s + i.cantidad, 0); }

function changeCategory(cat, el) {
    activeCategory = cat;
    document.querySelectorAll('.cat-item, .cat-pill').forEach(c => c.classList.remove('active'));
    if (el) el.classList.add('active');
    renderProducts();
}

function renderProducts() {
    const products = getMenuData().filter(p => p.categoria === activeCategory);
    const grid = document.getElementById('productsGrid');
    if (!grid) return;
    grid.innerHTML = products.map(p => `
        <div class="product-card-premium" onclick="addToCart(${p.id})">
            <img src="${p.img}" alt="${p.nombre}" style="width:60px;height:60px;border-radius:8px;object-fit:cover;margin-right:10px;">
            <div class="product-info">
                <div class="product-name">${p.emoji} ${p.nombre}</div>
                ${p.desc ? `<div class="product-desc">${p.desc}</div>` : ''}
            </div>
            <div class="product-price">$${p.precio.toFixed(2)}</div>
            <button class="btn-add">+</button>
        </div>
    `).join('');
}

function addToCart(id) {
    const p = getMenuData().find(x => x.id === id);
    let sabor = '';
    if (p.categoria === 'alitas') {
        sabor = prompt('🍗 Elige los sabores (separados por coma):\n1. BBQ\n2. BBQ Picante\n3. Mostaza y Miel\n4. Maracuyá\n5. Parmesano\n\nEjemplo: 1,3,5');
        if (sabor) { const sabores = { '1': 'BBQ', '2': 'BBQ Picante', '3': 'Mostaza y Miel', '4': 'Maracuyá', '5': 'Parmesano' }; sabor = sabor.split(',').map(s => sabores[s.trim()] || s.trim()).join(', '); }
    }
    const nombreConSabor = sabor ? p.nombre + ' (' + sabor + ')' : p.nombre;
    const exist = cart.find(i => i.id === id && i.sabor === sabor);
    if (exist) { exist.cantidad++; } else { cart.push({ id: p.id, nombre: nombreConSabor, precio: p.precio, emoji: p.emoji, cantidad: 1, sabor }); }
    updateCartFloat(); updateCartCount();
    if (navigator.vibrate) navigator.vibrate(10);
}

function updateCartFloat() {
    const count = cart.reduce((s, i) => s + i.cantidad, 0);
    const total = calculateTotal();
    const floatEl = document.getElementById('cartFloat');
    if (!floatEl) return;
    if (count > 0) { floatEl.style.display = 'flex'; document.getElementById('cartFloatCount').textContent = count; document.getElementById('cartFloatTotal').textContent = '$' + total.toFixed(2); }
    else { floatEl.style.display = 'none'; }
}

function goToCart() { renderCartItems(); document.getElementById('modalCart').style.display = 'flex'; }
function closeCart() { document.getElementById('modalCart').style.display = 'none'; }

function renderCartItems() {
    const total = calculateTotal();
    document.getElementById('cartTotal').textContent = '$' + total.toFixed(2);
    const itemsEl = document.getElementById('cartItems');
    if (!itemsEl) return;
    if (cart.length === 0) { itemsEl.innerHTML = '<p style="text-align:center;color:#999;">Vacío</p>'; return; }
    itemsEl.innerHTML = cart.map((i, idx) => `
        <div class="cart-item-premium">
            <div><strong>${i.emoji} ${i.nombre}</strong>${i.sabor ? '<br><small style="color:#f59e0b;">🔥 ' + i.sabor + '</small>' : ''}<br><small>$${i.precio.toFixed(2)} c/u</small></div>
            <div style="display:flex;align-items:center;gap:8px;">
                <button class="btn-qty" onclick="cart[${idx}].cantidad--; if(cart[${idx}].cantidad<=0)cart.splice(${idx},1);renderCartItems();updateCartFloat();updateCartCount();">−</button>
                <span>${i.cantidad}</span>
                <button class="btn-qty" onclick="cart[${idx}].cantidad++;renderCartItems();updateCartFloat();updateCartCount();">+</button>
            </div>
        </div>
    `).join('');
}

async function confirmOrder() {
    if (cart.length === 0) { alert('⚠️ Agrega productos'); return; }
    const total = calculateTotal();
    const pedido = { cliente: { nombre: 'Mesero', mesa: mesaActual, tipoPedido: 'mesa' }, items: cart.map(i => ({ id: i.id, nombre: i.nombre, precio: i.precio, emoji: i.emoji, cantidad: i.cantidad, sabor: i.sabor || '' })), total };

    if (modoEdicion && pedidoIdEdicion) {
        // ACTUALIZAR pedido existente
        try { await fetch('/api/pedidos/' + pedidoIdEdicion, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ items: pedido.items, total: pedido.total }) }); } catch(e) {}
        const pedidosLocal = JSON.parse(localStorage.getItem('marketpos_pedidos_online') || '[]');
        const idx = pedidosLocal.findIndex(p => p.id == pedidoIdEdicion);
        if (idx !== -1) { pedidosLocal[idx].items = pedido.items; pedidosLocal[idx].total = pedido.total; localStorage.setItem('marketpos_pedidos_online', JSON.stringify(pedidosLocal)); }
        const mesasLocal = JSON.parse(localStorage.getItem('marketpos_mesas') || '[]');
        const mesa = mesasLocal.find(m => m.numero === parseInt(mesaActual));
        if (mesa) { mesa.orden = pedido.items; localStorage.setItem('marketpos_mesas', JSON.stringify(mesasLocal)); }
        try { const res = await fetch('/api/mesas'); const apiMesas = await res.json(); const mesaAPI = apiMesas.find(m => m.numero === parseInt(mesaActual)); if (mesaAPI) { await fetch('/api/mesas/' + mesaAPI.id, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ orden: pedido.items }) }); } } catch(e) {}
        alert('✅ Pedido actualizado');
    } else {
        // Crear NUEVO pedido
        try { await fetch('/api/pedidos', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(pedido) }); } catch(e) {}
        const pedidosLocal = JSON.parse(localStorage.getItem('marketpos_pedidos_online') || '[]');
        pedido.id = Date.now(); pedido.fecha = new Date().toISOString(); pedido.estado = 'nuevo';
        pedidosLocal.unshift(pedido); localStorage.setItem('marketpos_pedidos_online', JSON.stringify(pedidosLocal));
        const mesasLocal = JSON.parse(localStorage.getItem('marketpos_mesas') || '[]');
        const mesa = mesasLocal.find(m => m.numero === parseInt(mesaActual));
        if (mesa) { mesa.estado = 'ocupada'; mesa.orden = pedido.items; localStorage.setItem('marketpos_mesas', JSON.stringify(mesasLocal)); }
        alert('✅ Pedido enviado a cocina');
    }
    cart = []; updateCartCount(); updateCartFloat(); window.location.href = 'mesero.html';
}

if (editarParam === '1') {
    modoEdicion = true;
    fetch('/api/mesas').then(r => r.json()).then(mesas => {
        const mesa = mesas.find(m => m.numero === parseInt(mesaActual));
        if (mesa?.orden?.length > 0) { cart = mesa.orden.map(i => ({ ...i, cantidad: i.cantidad || 1 })); }
        const pedidosLocal = JSON.parse(localStorage.getItem('marketpos_pedidos_online') || '[]');
        const pedidoOriginal = pedidosLocal.find(p => p.cliente?.mesa == mesaActual && p.estado !== 'entregado');
        if (pedidoOriginal) pedidoIdEdicion = pedidoOriginal.id;
        updateCartFloat(); updateCartCount();
    });
}

document.getElementById('categoriesContainer').innerHTML = categories.map(c => `
    <button class="cat-item ${c.key === activeCategory ? 'active' : ''}" onclick="changeCategory('${c.key}', this)">${c.label}</button>
`).join('');
renderProducts();