// =========================================================
// DASHBOARD VENTAS PREMIUM - SOLO VENTAS DE CAJA
// =========================================================

let ventasData = [];
let inventarioData = {};
let chartInstance = null;
let diasGrafico = 7;

// =========================================================
// GENERAR DATOS DE EJEMPLO
// =========================================================

function generarDatosEjemplo() {
    const productosIniciales = {
        'TITO BURGER': 25, 'HAWAI': 15, 'THE BIG BOSS': 20,
        'PARRILLERA': 18, 'HULK': 10, 'CLÁSICA': 30,
        '8 ALITAS': 15, 'PICAÑA': 8, 'LIMONADA': 35,
        'PAPAS TITO': 40, 'COSTILLAS BBQ': 9, 'PARRILLADA TITO': 6
    };
    localStorage.setItem('tito_inventario', JSON.stringify(productosIniciales));
    inventarioData = productosIniciales;

    // Ventas de ejemplo - SOLO DE CAJA
    const productos = ['TITO BURGER', 'HAWAI', 'THE BIG BOSS', 'PARRILLERA', '8 ALITAS', 'PICAÑA', 'LIMONADA', 'PAPAS TITO'];
    const ventasEjemplo = [];
    const hoy = new Date();
    const tipos = ['mesa', 'llevar'];

    for (let i = 0; i < 25; i++) {
        const fecha = new Date(hoy);
        fecha.setDate(fecha.getDate() - Math.floor(Math.random() * 7));
        fecha.setHours(10 + Math.floor(Math.random() * 12));
        fecha.setMinutes(Math.floor(Math.random() * 60));

        const numItems = Math.floor(Math.random() * 3) + 1;
        const items = [];
        let total = 0;

        for (let j = 0; j < numItems; j++) {
            const p = productos[Math.floor(Math.random() * productos.length)];
            const precio = (Math.random() * 8 + 2);
            const cantidad = Math.floor(Math.random() * 2) + 1;
            const subtotal = precio * cantidad;
            total += subtotal;
            items.push({
                producto: p,
                cantidad: cantidad,
                precio: Math.round(precio * 100) / 100,
                emoji: '🍽️'
            });
        }

        const tipo = tipos[Math.floor(Math.random() * tipos.length)];
        ventasEjemplo.push({
            id: 'ejemplo_' + i,
            fecha: fecha.toLocaleString('es-ES', {
                day: '2-digit', month: '2-digit', year: 'numeric',
                hour: '2-digit', minute: '2-digit'
            }),
            timestamp: fecha.getTime(),
            tipo: tipo,
            cliente: 'Consumidor Final',
            items: items,
            total: Math.round(total * 100) / 100,
            estado: 'completado',
            fuente: 'caja' // <--- TODAS VIENEN DE CAJA
        });
    }

    localStorage.setItem('tito_ventas', JSON.stringify(ventasEjemplo));
    ventasData = ventasEjemplo;
}

// =========================================================
// CARGAR DATOS - SOLO VENTAS DE CAJA
// =========================================================

function cargarDatos() {
    const inventarioGuardado = localStorage.getItem('tito_inventario');
    const ventasGuardadas = localStorage.getItem('tito_ventas');

    if (!inventarioGuardado || !ventasGuardadas) {
        generarDatosEjemplo();
        return;
    }

    inventarioData = JSON.parse(inventarioGuardado);
    ventasData = JSON.parse(ventasGuardadas);

    // LIMPIAR ventas que NO son de caja (eliminar duplicados)
    ventasData = ventasData.filter(v => v.fuente === 'caja');

    // Ordenar y guardar
    ventasData.sort((a, b) => b.timestamp - a.timestamp);
    if (ventasData.length > 1000) ventasData = ventasData.slice(0, 1000);
    localStorage.setItem('tito_ventas', JSON.stringify(ventasData));
}

// =========================================================
// ACTUALIZAR DASHBOARD
// =========================================================

function actualizarDashboard() {
    cargarDatos();
    actualizarMetricas();
    actualizarTopProductos();
    actualizarGrafico();
    actualizarTabla();
    actualizarResumen();
    actualizarFechaHora();
}

function actualizarMetricas() {
    const hoy = new Date();
    const inicioHoy = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());

    // SOLO VENTAS DE CAJA, MESA Y LLEVAR
    const ventasHoy = ventasData.filter(v => {
        const fechaV = new Date(v.timestamp);
        return fechaV >= inicioHoy && 
               (v.tipo === 'mesa' || v.tipo === 'llevar') &&
               v.fuente === 'caja';
    });

    const totalVentas = ventasHoy.reduce((sum, v) => sum + (v.total || 0), 0);
    const ventasMesa = ventasHoy.filter(v => v.tipo === 'mesa').reduce((sum, v) => sum + (v.total || 0), 0);
    const ventasLlevar = ventasHoy.filter(v => v.tipo === 'llevar').reduce((sum, v) => sum + (v.total || 0), 0);

    document.getElementById('ventasHoy').textContent = '$' + totalVentas.toFixed(2);
    document.getElementById('totalPedidos').textContent = ventasHoy.length;
    document.getElementById('ventasMesa').textContent = '$' + ventasMesa.toFixed(2);
    document.getElementById('ventasLlevar').textContent = '$' + ventasLlevar.toFixed(2);
    document.getElementById('totalGeneral').textContent = '$' + totalVentas.toFixed(2);

    // Tendencias
    const ayer = new Date(hoy);
    ayer.setDate(ayer.getDate() - 1);
    const inicioAyer = new Date(ayer.getFullYear(), ayer.getMonth(), ayer.getDate());

    const ventasAyer = ventasData.filter(v => {
        const fechaV = new Date(v.timestamp);
        return fechaV >= inicioAyer && fechaV < inicioHoy && 
               (v.tipo === 'mesa' || v.tipo === 'llevar') &&
               v.fuente === 'caja';
    });
    const totalAyer = ventasAyer.reduce((sum, v) => sum + (v.total || 0), 0);

    const trendVentas = document.getElementById('tendenciaVentas');
    if (totalAyer > 0) {
        const cambio = ((totalVentas - totalAyer) / totalAyer * 100);
        trendVentas.className = `metrica-tendencia ${cambio >= 0 ? 'up' : 'down'}`;
        trendVentas.innerHTML = `<span>${cambio >= 0 ? '↑' : '↓'} ${Math.abs(cambio).toFixed(0)}%</span>`;
    }

    const pedidosAyer = ventasAyer.length;
    const pedidosHoy = ventasHoy.length;
    const trendPedidos = document.getElementById('tendenciaPedidos');
    if (pedidosAyer > 0) {
        const cambio = ((pedidosHoy - pedidosAyer) / pedidosAyer * 100);
        trendPedidos.className = `metrica-tendencia ${cambio >= 0 ? 'up' : 'down'}`;
        trendPedidos.innerHTML = `<span>${cambio >= 0 ? '↑' : '↓'} ${Math.abs(cambio).toFixed(0)}%</span>`;
    }
}

function actualizarTabla() {
    const tbody = document.getElementById('tablaVentas');
    if (!tbody) return;

    const hoy = new Date();
    const inicioHoy = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());

    // SOLO VENTAS DE CAJA, MESA Y LLEVAR
    const ventasHoy = ventasData
        .filter(v => {
            const fechaV = new Date(v.timestamp);
            return fechaV >= inicioHoy && 
                   (v.tipo === 'mesa' || v.tipo === 'llevar') &&
                   v.fuente === 'caja';
        })
        .slice(0, 15);

    if (ventasHoy.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align:center;padding:30px;color:var(--text-light);">
                    📊 No hay ventas de Caja (Mesa o Para Llevar) hoy
                </td>
            </tr>
        `;
        return;
    }

    const tipoIconos = { 'mesa': '🪑', 'llevar': '🛵' };
    const tipoNombres = { 'mesa': 'Mesa', 'llevar': 'Para Llevar' };

    tbody.innerHTML = ventasHoy.map((v, index) => {
        let hora = '';
        if (v.fecha) {
            if (v.fecha.includes('T')) {
                const fecha = new Date(v.fecha);
                hora = fecha.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
            } else {
                const partes = v.fecha.split(',');
                hora = partes.length > 1 ? partes[1].trim() : v.fecha;
            }
        }
        
        return `
            <tr>
                <td>${index + 1}</td>
                <td>${hora || '--:--'}</td>
                <td>${tipoIconos[v.tipo] || '📋'} ${tipoNombres[v.tipo] || v.tipo}</td>
                <td>${v.cliente || 'Consumidor Final'}</td>
                <td>${v.items.map(i => `${i.producto} x${i.cantidad}`).join(', ')}</td>
                <td><strong style="color:var(--orange-light);">$${v.total.toFixed(2)}</strong></td>
            </tr>
        `;
    }).join('');
}

function actualizarTopProductos() {
    const container = document.getElementById('topProductos');
    if (!container) return;

    const hoy = new Date();
    const inicioHoy = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());

    const ventasHoy = ventasData.filter(v => {
        const fechaV = new Date(v.timestamp);
        return fechaV >= inicioHoy && 
               (v.tipo === 'mesa' || v.tipo === 'llevar') &&
               v.fuente === 'caja';
    });

    const conteo = {};
    ventasHoy.forEach(v => {
        v.items.forEach(item => {
            conteo[item.producto] = (conteo[item.producto] || 0) + item.cantidad;
        });
    });

    const top = Object.entries(conteo).sort((a, b) => b[1] - a[1]).slice(0, 5);
    const maxCount = top.length > 0 ? top[0][1] : 1;

    if (top.length === 0) {
        container.innerHTML = '<p style="color:var(--text-light);text-align:center;padding:20px;">Sin ventas hoy</p>';
        return;
    }

    const emojis = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣'];

    container.innerHTML = top.map(([nombre, count], index) => {
        const porcentaje = (count / maxCount) * 100;
        return `
            <div class="top-item">
                <span class="top-rank">${emojis[index]}</span>
                <span class="top-name">${nombre}</span>
                <span class="top-count">${count}</span>
                <div class="top-bar">
                    <div class="fill" style="width: ${porcentaje}%"></div>
                </div>
            </div>
        `;
    }).join('');
}

function actualizarGrafico() {
    const ctx = document.getElementById('ventasChart');
    if (!ctx) return;

    const hoy = new Date();
    const dias = {};
    const limite = diasGrafico;

    for (let i = limite - 1; i >= 0; i--) {
        const fecha = new Date(hoy);
        fecha.setDate(fecha.getDate() - i);
        const key = fecha.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' });
        dias[key] = 0;
    }

    ventasData.forEach(v => {
        const fechaV = new Date(v.timestamp);
        const diffDias = Math.floor((hoy - fechaV) / (1000 * 60 * 60 * 24));
        if (diffDias < limite && (v.tipo === 'mesa' || v.tipo === 'llevar') && v.fuente === 'caja') {
            const key = fechaV.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' });
            if (dias[key] !== undefined) {
                dias[key] += v.total || 0;
            }
        }
    });

    const labels = Object.keys(dias);
    const values = Object.values(dias);

    if (chartInstance) {
        chartInstance.destroy();
    }

    const gradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, 200);
    gradient.addColorStop(0, 'rgba(230,126,34,0.5)');
    gradient.addColorStop(1, 'rgba(230,126,34,0.02)');

    chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Ventas Caja ($)',
                data: values,
                backgroundColor: gradient,
                borderColor: 'rgba(230,126,34,1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: 'rgba(230,126,34,1)',
                pointBorderColor: 'rgba(230,126,34,0.5)',
                pointRadius: 4,
                pointHoverRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return '$' + context.parsed.y.toFixed(2);
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: '#8a7a6e',
                        font: { size: 9 },
                        callback: function(value) {
                            return '$' + value.toFixed(0);
                        }
                    },
                    grid: { color: 'rgba(255,255,255,0.03)' }
                },
                x: {
                    ticks: {
                        color: '#8a7a6e',
                        font: { size: 9 },
                        maxRotation: 45,
                        minRotation: 45
                    },
                    grid: { display: false }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            }
        }
    });
}

function actualizarResumen() {
    const hoy = new Date();
    const inicioHoy = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());

    const ventasHoy = ventasData.filter(v => {
        const fechaV = new Date(v.timestamp);
        return fechaV >= inicioHoy && 
               (v.tipo === 'mesa' || v.tipo === 'llevar') &&
               v.fuente === 'caja';
    });

    const horas = {};
    ventasHoy.forEach(v => {
        const hora = new Date(v.timestamp).getHours();
        horas[hora] = (horas[hora] || 0) + 1;
    });
    const horaPico = Object.entries(horas).sort((a, b) => b[1] - a[1])[0];
    document.getElementById('horaPico').textContent = horaPico ? `${horaPico[0]}:00 (${horaPico[1]} pedidos)` : '--:--';

    const total = ventasHoy.reduce((sum, v) => sum + (v.total || 0), 0);
    const promedio = ventasHoy.length > 0 ? total / ventasHoy.length : 0;
    document.getElementById('ticketPromedio').textContent = '$' + promedio.toFixed(2);

    const conteo = {};
    ventasHoy.forEach(v => {
        v.items.forEach(item => {
            conteo[item.producto] = (conteo[item.producto] || 0) + item.cantidad;
        });
    });
    const top = Object.entries(conteo).sort((a, b) => b[1] - a[1])[0];
    document.getElementById('productoTop').textContent = top ? `${top[0]} (${top[1]} uds)` : '--';
}

function actualizarFechaHora() {
    const ahora = new Date();
    document.getElementById('fechaActual').textContent = '📅 ' + ahora.toLocaleDateString('es-ES', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    });
    document.getElementById('horaActual').textContent = '🕐 ' + ahora.toLocaleTimeString('es-ES', {
        hour: '2-digit', minute: '2-digit', second: '2-digit'
    });
}

function cambiarGrafico(dias) {
    diasGrafico = dias;
    document.querySelectorAll('.btn-chart').forEach(b => b.classList.remove('active'));
    if (event && event.target) {
        event.target.classList.add('active');
    }
    actualizarGrafico();
}

function exportarVentas() {
    const hoy = new Date();
    const inicioHoy = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());

    const ventasHoy = ventasData.filter(v => {
        const fechaV = new Date(v.timestamp);
        return fechaV >= inicioHoy && 
               (v.tipo === 'mesa' || v.tipo === 'llevar') &&
               v.fuente === 'caja';
    });

    if (ventasHoy.length === 0) {
        mostrarToast('⚠️ No hay ventas para exportar');
        return;
    }

    let csv = 'Fecha,Hora,Tipo,Cliente,Productos,Total\n';
    ventasHoy.forEach(v => {
        let hora = '';
        if (v.fecha) {
            if (v.fecha.includes('T')) {
                const fecha = new Date(v.fecha);
                hora = fecha.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
            } else {
                const partes = v.fecha.split(',');
                hora = partes.length > 1 ? partes[1].trim() : v.fecha;
            }
        }
        const productos = v.items.map(i => `${i.producto} x${i.cantidad}`).join('; ');
        csv += `${v.fecha.split(',')[0]},${hora},${v.tipo},${v.cliente || 'Consumidor Final'},"${productos}",${v.total.toFixed(2)}\n`;
    });

    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `ventas_caja_${new Date().toISOString().slice(0,10)}.csv`;
    link.click();
    mostrarToast('✅ Ventas exportadas correctamente');
}

let toastTimer;

function mostrarToast(mensaje) {
    const toast = document.querySelector('.toast') || (() => {
        const t = document.createElement('div');
        t.className = 'toast';
        document.body.appendChild(t);
        return t;
    })();

    toast.textContent = mensaje;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
}

document.addEventListener('DOMContentLoaded', () => {
    const inventarioGuardado = localStorage.getItem('tito_inventario');
    if (!inventarioGuardado) generarDatosEjemplo();

    actualizarDashboard();
    setInterval(actualizarDashboard, 30000);

    window.addEventListener('storage', (e) => {
        if (['tito_inventario', 'tito_ventas', 'marketpos_pedidos_online'].includes(e.key)) {
            actualizarDashboard();
        }
    });
});

window.actualizarDashboard = actualizarDashboard;
window.cambiarGrafico = cambiarGrafico;
window.exportarVentas = exportarVentas;