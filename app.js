let cartPOS = [];
let activeCategoryPOS = 'todo';
let tipoPedidoActual = 'mesa';
let pedidoActual = null;

// Inicializar EmailJS al cargar
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
        { id: 1, nombre: "Regular Noodles", precio: 10, categoria: "platos", emoji: "🍜" },
        { id: 2, nombre: "Ebi Spaghetti", precio: 35, categoria: "platos", emoji: "🍝" },
        { id: 3, nombre: "Javanes Noodles", precio: 20, categoria: "platos", emoji: "🍜" },
        { id: 4, nombre: "Chicken Noodles", precio: 15, categoria: "platos", emoji: "🍗" },
        { id: 5, nombre: "Chicken Curry", precio: 18, categoria: "platos", emoji: "🍛" },
        { id: 6, nombre: "Ebi Curry", precio: 22, categoria: "platos", emoji: "🍤" },
        { id: 7, nombre: "Coca-Cola", precio: 3, categoria: "bebidas", emoji: "🥤" },
        { id: 8, nombre: "Orange Juice", precio: 4, categoria: "bebidas", emoji: "🍊" },
        { id: 9, nombre: "French Fries", precio: 5, categoria: "snacks", emoji: "🍟" },
        { id: 10, nombre: "Chicken Wings", precio: 8, categoria: "snacks", emoji: "🍗" },
        { id: 11, nombre: "Brownie", precio: 6, categoria: "postres", emoji: "🍫" },
        { id: 12, nombre: "Ice Cream", precio: 4, categoria: "postres", emoji: "🍦" }
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
            <span class="emoji">${p.emoji}</span>
            <div class="nombre">${p.nombre}</div>
            <div class="precio">$${p.precio}</div>
        </div>
    `).join('');
}

function buscarProductoLive() {
    const t = document.getElementById('searchInput').value.toLowerCase();
    const products = t ? getMenuData().filter(p => p.nombre.toLowerCase().includes(t)) : getMenuData().filter(p => activeCategoryPOS === 'todo' || p.categoria === activeCategoryPOS);
    document.getElementById('productsGrid').innerHTML = products.map(p => `
        <div class="product-card-pos" onclick="addToCartPOS(${p.id})">
            <span class="emoji">${p.emoji}</span>
            <div class="nombre">${p.nombre}</div>
            <div class="precio">$${p.precio}</div>
        </div>
    `).join('');
}

function addToCartPOS(id) {
    const p = getMenuData().find(x => x.id === id);
    const exist = cartPOS.find(i => i.id === id);
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
            <div class="info"><strong>${i.nombre}</strong><span>${i.cantidad} pcs</span></div>
            <div class="qty">
                <button class="btn-qty-pos" onclick="cartPOS[${idx}].cantidad--; if(cartPOS[${idx}].cantidad<=0)cartPOS.splice(${idx},1);renderCartPOS();">−</button>
                <span>${i.cantidad}</span>
                <button class="btn-qty-pos" onclick="cartPOS[${idx}].cantidad++;renderCartPOS();">+</button>
            </div>
            <span>$${(i.precio*i.cantidad).toFixed(2)}</span>
        </div>
    `).join('');
}

function mostrarFactura() {
    if (cartPOS.length === 0) { alert('Agregue productos'); return; }
    
    const facturaDiv = document.getElementById('clienteFactura');
    
    if (facturaDiv.style.display === 'block') {
        const mesa = document.getElementById('mesaInputPOS').value || '1';
        const total = cartPOS.reduce((s, i) => s + i.precio * i.cantidad, 0);
        
        const clienteFactura = {
            nombre: document.getElementById('facturaNombre').value || 'Consumidor Final',
            ruc: document.getElementById('facturaRUC').value || '9999999999999',
            email: document.getElementById('facturaEmail').value || '',
            direccion: document.getElementById('facturaDireccion').value || 'Av. Principal 123'
        };
        
        pedidoActual = {
            cliente: { 
                nombre: clienteFactura.nombre, mesa, tipoPedido: tipoPedidoActual,
                ruc: clienteFactura.ruc, email: clienteFactura.email, direccion: clienteFactura.direccion
            },
            items: cartPOS.map(i => ({ id: i.id, nombre: i.nombre, precio: i.precio, emoji: i.emoji, cantidad: i.cantidad })),
            total,
            factura: clienteFactura
        };
        
        window.open('ticket.html?data=' + encodeURIComponent(JSON.stringify(pedidoActual)), '_blank', 'width=400,height=750');
        
        if (clienteFactura.email && window.emailjs) {
            enviarFacturaEmail(clienteFactura.email, pedidoActual);
        }
        
        document.getElementById('btnCocina').style.display = 'block';
        alert('✅ Factura generada');
    } else {
        facturaDiv.style.display = 'block';
        document.getElementById('btnCocina').style.display = 'none';
    }
}

function enviarFacturaEmail(email, pedido) {
    const facturaNum = '001-001-' + String(Math.floor(Math.random()*99999999)).padStart(8,'0');
    
    emailjs.send('service_nj7glup', 'template_szgtsns', {
        to_email: email,
        cliente_nombre: pedido.factura.nombre,
        cliente_ruc: pedido.factura.ruc,
        total: '$' + pedido.total.toFixed(2),
        factura_numero: facturaNum,
        items: pedido.items.map(i => `${i.nombre} x${i.cantidad} - $${(i.precio*i.cantidad).toFixed(2)}`).join('\n'),
        fecha: new Date().toLocaleString()
    }).then(() => {
        alert('📧 Factura enviada a ' + email);
    }).catch((err) => {
        console.log('Error EmailJS:', err);
    });
}

async function enviarACocina() {
    if (!pedidoActual) { alert('Primero genere la factura'); return; }
    
    await fetch('/api/pedidos', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(pedidoActual) 
    }).catch(()=>{});
    
    const mesaNum = pedidoActual.cliente.mesa;
    const mesas = JSON.parse(localStorage.getItem('marketpos_mesas') || '[]');
    const m = mesas.find(x => x.numero === parseInt(mesaNum));
    if (m) { m.estado = 'ocupada'; localStorage.setItem('marketpos_mesas', JSON.stringify(mesas)); }
    
    alert('✅ Pedido enviado a cocina');
    
    cartPOS = [];
    pedidoActual = null;
    renderCartPOS();
    document.getElementById('clienteFactura').style.display = 'none';
    document.getElementById('btnCocina').style.display = 'none';
    document.getElementById('facturaNombre').value = '';
    document.getElementById('facturaRUC').value = '';
    document.getElementById('facturaEmail').value = '';
    document.getElementById('facturaDireccion').value = '';
    renderizarMesasPOS();
}

async function renderizarMesasPOS() {
    const grid = document.getElementById('mesasGrid');
    if (!grid) return;
    try {
        const res = await fetch('/api/mesas');
        const mesas = await res.json();
        grid.innerHTML = mesas.map(m => `
            <div class="mesa-card-pos ${m.estado}">
                <span class="numero">${m.numero}</span>
                <span class="estado">${m.estado === 'libre' ? 'Libre' : 'Ocupada'}</span>
            </div>
        `).join('');
    } catch(e) {}
}

function agregarMesa() {
    fetch('/api/mesas', { method: 'POST' }).then(() => renderizarMesasPOS());
}

function toggleDashboard() {
    alert('📊 Dashboard Premium\n\nPróximamente...');
}

function logout() { localStorage.clear(); location.reload(); }

document.getElementById('tipoPedidoPOS').addEventListener('change', function() {
    tipoPedidoActual = this.value;
});

setInterval(renderizarMesasPOS, 3000);
renderProductsPOS();