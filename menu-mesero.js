let cart = [];
let activeCategory = 'promociones';
let mesaActual = '1';

const urlParams = new URLSearchParams(window.location.search);
mesaActual = urlParams.get('mesa') || '1';
const editarParam = urlParams.get('editar');

document.getElementById('mesaInfo').textContent = '🪑 MESA ' + mesaActual;
document.getElementById('cartMesaTitle').textContent = mesaActual;

const categories = [
    { key: 'promociones', label: 'Promos' },
    { key: 'parrilla', label: 'Parrilla' },
    { key: 'hamburguesas', label: 'Burgers' },
    { key: 'alitas', label: 'Alitas' },
    { key: 'combos', label: 'Combos' },
    { key: 'bebidas', label: 'Bebidas' },
    { key: 'postres', label: 'Postres' }
];

function getMenuData() {
    return [
        { id: 1, nombre: "COMBO FAMILIAR #1", precio: 11.99, categoria: "promociones", emoji: "🔥", desc: "2 Hamburguesas, 6 alitas, papa, ensalada, 2 gaseosas" },
        { id: 2, nombre: "COMBO FAMILIAR #2", precio: 13.99, categoria: "promociones", emoji: "🎯", desc: "Full pack, 12 alitas, 2 gaseosas" },
        { id: 3, nombre: "COMBO PAREJA", precio: 9.99, categoria: "promociones", emoji: "💑", desc: "2 Hamburguesas, 1 papa, 2 gaseosas" },
        { id: 4, nombre: "Parrillada Mixta", precio: 15.99, categoria: "parrilla", emoji: "🥩", desc: "Carne, pollo, chorizo, morcilla, papas" },
        { id: 5, nombre: "Churrasco Argentino", precio: 12.50, categoria: "parrilla", emoji: "🥓", desc: "400g con chimichurri" },
        { id: 6, nombre: "Costillas BBQ", precio: 13.99, categoria: "parrilla", emoji: "🍖", desc: "Ahumadas con salsa casera" },
        { id: 7, nombre: "Hamburguesa Clásica", precio: 7.99, categoria: "hamburguesas", emoji: "🍔", desc: "Carne 150g, queso, lechuga, tomate" },
        { id: 8, nombre: "Hamburguesa BBQ", precio: 8.99, categoria: "hamburguesas", emoji: "🍔", desc: "Doble carne, bacon, cebolla caramelizada" },
        { id: 9, nombre: "Alitas BBQ (6)", precio: 6.99, categoria: "alitas", emoji: "🍗", desc: "6 alitas con salsa BBQ" },
        { id: 10, nombre: "Alitas Picantes (12)", precio: 11.99, categoria: "alitas", emoji: "🌶️", desc: "12 alitas picantes" },
        { id: 11, nombre: "Combo Snack", precio: 5.99, categoria: "combos", emoji: "🍿", desc: "Papas + gaseosa + salsa" },
        { id: 12, nombre: "Full Pack", precio: 19.99, categoria: "combos", emoji: "🎯", desc: "Parrillada + 4 gaseosas + postre" },
        { id: 13, nombre: "Coca-Cola 500ml", precio: 2.50, categoria: "bebidas", emoji: "🥤", desc: "" },
        { id: 14, nombre: "Cerveza Artesanal", precio: 4.50, categoria: "bebidas", emoji: "🍺", desc: "330ml" },
        { id: 15, nombre: "Brownie con Helado", precio: 4.50, categoria: "postres", emoji: "🍫", desc: "Brownie caliente + helado" },
        { id: 16, nombre: "Flan Casero", precio: 3.50, categoria: "postres", emoji: "🍮", desc: "Flan de caramelo artesanal" }
    ];
}

// Renderizar categorías
document.getElementById('categoriesContainer').innerHTML = categories.map(c => `
    <button class="cat-item ${c.key === activeCategory ? 'active' : ''}" 
            onclick="changeCategory('${c.key}', this)">${c.label}</button>
`).join('');

function changeCategory(cat, el) {
    activeCategory = cat;
    document.querySelectorAll('.cat-item').forEach(c => c.classList.remove('active'));
    el.classList.add('active');
    renderProducts();
}

function renderProducts() {
    const products = getMenuData().filter(p => p.categoria === activeCategory);
    document.getElementById('productsGrid').innerHTML = products.map(p => `
        <div class="product-card-premium" onclick="addToCart(${p.id})">
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
    const exist = cart.find(i => i.id === id);
    exist ? exist.cantidad++ : cart.push({ id: p.id, nombre: p.nombre, precio: p.precio, emoji: p.emoji, cantidad: 1 });
    updateCartFloat();
    if (navigator.vibrate) navigator.vibrate(10);
}

function updateCartFloat() {
    const count = cart.reduce((s, i) => s + i.cantidad, 0);
    const total = cart.reduce((s, i) => s + i.precio * i.cantidad, 0);
    const f = document.getElementById('cartFloat');
    if (count > 0) {
        f.style.display = 'flex';
        document.getElementById('cartFloatCount').textContent = count;
        document.getElementById('cartFloatTotal').textContent = '$' + total.toFixed(2);
    } else { f.style.display = 'none'; }
    document.getElementById('cartCount').textContent = count;
}

function goToCart() { renderCartItems(); document.getElementById('modalCart').style.display = 'flex'; }
function closeCart() { document.getElementById('modalCart').style.display = 'none'; }

function renderCartItems() {
    const total = cart.reduce((s, i) => s + i.precio * i.cantidad, 0);
    document.getElementById('cartTotal').textContent = '$' + total.toFixed(2);
    document.getElementById('cartItems').innerHTML = cart.map((i, idx) => `
        <div class="cart-item-premium">
            <div><strong>${i.emoji} ${i.nombre}</strong><br><small>$${i.precio.toFixed(2)} c/u</small></div>
            <div style="display:flex;align-items:center;gap:8px;">
                <button class="btn-qty" onclick="cart[${idx}].cantidad--; if(cart[${idx}].cantidad<=0)cart.splice(${idx},1);renderCartItems();updateCartFloat();">−</button>
                <span>${i.cantidad}</span>
                <button class="btn-qty" onclick="cart[${idx}].cantidad++;renderCartItems();updateCartFloat();">+</button>
            </div>
        </div>
    `).join('');
}

async function confirmOrder() {
    if (cart.length === 0) return;
    const total = cart.reduce((s, i) => s + i.precio * i.cantidad, 0);
    const pedido = {
        cliente: { nombre: 'Mesero', mesa: mesaActual, tipoPedido: 'mesa' },
        items: cart.map(i => ({ id: i.id, nombre: i.nombre, precio: i.precio, emoji: i.emoji, cantidad: i.cantidad })),
        total
    };
    
    await fetch('/api/pedidos', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(pedido) }).catch(()=>{});
    
    const mesas = await (await fetch('/api/mesas')).json();
    const mesa = mesas.find(m => m.numero === parseInt(mesaActual));
    if (mesa) await fetch('/api/mesas/' + mesa.id, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ estado: 'ocupada', orden: pedido.items }) });
    
    alert('✅ Pedido enviado a cocina');
    cart = []; updateCartFloat(); closeCart();
    window.location.href = 'mesero.html';
}

// Cargar pedido si es edición
if (editarParam === '1') {
    fetch('/api/mesas').then(r => r.json()).then(mesas => {
        const mesa = mesas.find(m => m.numero === parseInt(mesaActual));
        if (mesa?.orden?.length > 0) {
            cart = mesa.orden.map(i => ({ id: i.id, nombre: i.nombre, precio: i.precio, emoji: i.emoji || '🍽️', cantidad: i.cantidad || 1 }));
            updateCartFloat();
        }
    });
}

renderProducts();