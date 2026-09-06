// ============================================ //
// DATOS DE INVENTARIO                          //
// ============================================ //
let inventarioData = {};
let movimientosData = [];
let chartInstance = null;
let editandoId = null;

// Productos disponibles con stock inicial
const productosDisponibles = [
    'TITO BURGER',
    'HAWAI',
    'THE BIG BOSS',
    'PARRILLERA',
    'HULK',
    'CLÁSICA',
    'CLÁSICA + PAPAS',
    'PICAÑA',
    'BIFE DE CHORIZO',
    'RYBEYE',
    'T-BONE',
    'CORDERO',
    'LOMITO DE RES',
    'POLLO A LA PARRILLA',
    'CHULETA DE CERDO',
    '4 ALITAS',
    '8 ALITAS',
    '12 ALITAS',
    '15 ALITAS',
    '20 ALITAS',
    'SUPER PICADITA',
    'PARRILLADA TITO',
    'COSTILLAS BBQ',
    'PAPA CON CHILLY',
    'CHORY PAPA',
    'CHORIPÁN',
    'KIT ESTRELLA',
    'COMBO PAREJA',
    'COMBO COMPARTIR',
    'COMBO FAMILIAR',
    'PAPAS TITO',
    'CHORIZO NORMAL',
    'CHORIZO PAISA',
    'CARNE HAMBURGUESA',
    'PIÑA',
    'CUERO',
    'ENSALADA',
    'MAYONESA TITO',
    'LIMONADA',
    'JARRA LIMONADA',
    'COCA-COLA',
    'AGUA'
];

// ============================================ //
// INICIALIZACIÓN                                //
// ============================================ //
document.addEventListener('DOMContentLoaded', () => {
    cargarDatosLocal();
    actualizarDashboard();
    actualizarReloj();
    setInterval(actualizarReloj, 1000);
    setInterval(actualizarDashboard, 30000);
    cargarProductosEnSelects();
});

function cargarDatosLocal() {
    // Cargar inventario
    const inventarioGuardado = localStorage.getItem('tito_inventario');
    if (inventarioGuardado) {
        inventarioData = JSON.parse(inventarioGuardado);
    } else {
        // Inicializar inventario con 0 para todos los productos
        productosDisponibles.forEach(p => {
            inventarioData[p] = 0;
        });
        // Datos de ejemplo
        inventarioData['TITO BURGER'] = 15;
        inventarioData['8 ALITAS'] = 20;
        inventarioData['PICAÑA'] = 8;
        inventarioData['PARRILLADA TITO'] = 5;
        inventarioData['COSTILLAS BBQ'] = 12;
        inventarioData['LIMONADA'] = 30;
        localStorage.setItem('tito_inventario', JSON.stringify(inventarioData));
    }
    
    // Cargar movimientos
    const movimientosGuardados = localStorage.getItem('tito_movimientos');
    if (movimientosGuardados) {
        movimientosData = JSON.parse(movimientosGuardados);
    } else {
        movimientosData = generarMovimientosEjemplo();
        localStorage.setItem('tito_movimientos', JSON.stringify(movimientosData));
    }
}

function generarMovimientosEjemplo() {
    const productos = ['TITO BURGER', '8 ALITAS', 'PICAÑA', 'PARRILLADA TITO', 'COSTILLAS BBQ', 'LIMONADA'];
    const tipos = ['produccion', 'compra', 'venta', 'venta', 'produccion'];
    const data = [];
    
    for (let i = 0; i < 15; i++) {
        const fecha = new Date();
        fecha.setHours(10 + Math.floor(i / 3));
        fecha.setMinutes((i * 7) % 60);
        fecha.setDate(fecha.getDate() - Math.floor(i / 5));
        
        const tipo = tipos[i % tipos.length];
        const cantidad = tipo === 'venta' ? Math.floor(Math.random() * 3) + 1 : Math.floor(Math.random() * 10) + 2;
        
        data.push({
            id: Date.now() + i,
            producto: productos[i % productos.length],
            cantidad: cantidad,
            tipo: tipo,
            motivo: tipo === 'venta' ? 'venta' : tipo === 'produccion' ? 'produccion' : 'compra',
            observaciones: i % 3 === 0 ? 'Sin observaciones' : '',
            fecha: fecha.toLocaleString('es-ES', { 
                day: '2-digit', 
                month: '2-digit', 
                year: 'numeric',
                hour: '2-digit', 
                minute: '2-digit' 
            }),
            timestamp: fecha.getTime()
        });
    }
    return data;
}

function guardarDatosLocal() {
    localStorage.setItem('tito_inventario', JSON.stringify(inventarioData));
    localStorage.setItem('tito_movimientos', JSON.stringify(movimientosData));
}

function cargarProductosEnSelects() {
    const selects = ['productoSelect', 'productoConsumoSelect', 'editarProducto'];
    selects.forEach(id => {
        const select = document.getElementById(id);
        if (select) {
            select.innerHTML = '<option value="">Selecciona un producto</option>';
            productosDisponibles.forEach(p => {
                const stock = inventarioData[p] || 0;
                select.innerHTML += `<option value="${p}">${p} (${stock} uds)</option>`;
            });
        }
    });
}

// ============================================ //
// ACTUALIZAR DASHBOARD                         //
// ============================================ //
function actualizarDashboard() {
    actualizarEstadisticas();
    actualizarStockProductos();
    actualizarTablaMovimientos();
    actualizarGrafico();
    cargarProductosEnSelects();
}

function actualizarEstadisticas() {
    const totalProductos = Object.keys(inventarioData).filter(p => inventarioData[p] > 0).length;
    const totalUnidades = Object.values(inventarioData).reduce((a, b) => a + b, 0);
    
    // Producción de hoy
    const hoy = new Date().toDateString();
    const produccionHoy = movimientosData
        .filter(m => new Date(m.timestamp).toDateString() === hoy && m.tipo === 'produccion')
        .reduce((sum, m) => sum + m.cantidad, 0);
    
    // Última actualización
    const ultimoMov = movimientosData.length > 0 ? 
        movimientosData.reduce((a, b) => a.timestamp > b.timestamp ? a : b) : null;
    
    document.getElementById('totalProductos').textContent = totalProductos;
    document.getElementById('totalUnidades').textContent = totalUnidades;
    document.getElementById('totalProduccionHoy').textContent = produccionHoy;
    document.getElementById('ultimaActualizacion').textContent = ultimoMov ? 
        new Date(ultimoMov.timestamp).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : '--';
    
    // Calcular tendencias
    const ayer = new Date();
    ayer.setDate(ayer.getDate() - 1);
    const produccionAyer = movimientosData
        .filter(m => new Date(m.timestamp).toDateString() === ayer.toDateString() && m.tipo === 'produccion')
        .reduce((sum, m) => sum + m.cantidad, 0);
    
    if (produccionAyer > 0) {
        const cambio = ((produccionHoy - produccionAyer) / produccionAyer * 100);
        const trend = document.getElementById('trendHoy');
        trend.className = `stat-trend ${cambio >= 0 ? 'up' : 'down'}`;
        trend.innerHTML = `<span>${cambio >= 0 ? '↑' : '↓'} ${Math.abs(cambio).toFixed(0)}%</span>`;
    }
}

function actualizarStockProductos() {
    const container = document.getElementById('stockProducts');
    if (!container) return;
    
    // Ordenar por stock (mayor a menor)
    const sorted = Object.entries(inventarioData)
        .filter(([_, stock]) => stock > 0)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8);
    
    if (sorted.length === 0) {
        container.innerHTML = '<p style="color:var(--text-light);text-align:center;padding:20px;">Sin productos en stock</p>';
        return;
    }
    
    const maxStock = sorted[0][1];
    
    container.innerHTML = sorted.map(([nombre, stock], index) => {
        const porcentaje = maxStock > 0 ? (stock / maxStock) * 100 : 0;
        const emojis = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣'];
        return `
            <div class="top-product-item">
                <span class="top-product-rank">${emojis[index] || '#' + (index + 1)}</span>
                <span class="top-product-name">${nombre}</span>
                <span class="top-product-count">${stock} uds</span>
                <div class="top-product-bar">
                    <div class="fill" style="width: ${porcentaje}%"></div>
                </div>
            </div>
        `;
    }).join('');
}

function actualizarTablaMovimientos() {
    const tbody = document.getElementById('movimientosTableBody');
    if (!tbody) return;
    
    if (movimientosData.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align:center;padding:40px;color:var(--text-light);">
                    📦 No hay movimientos registrados
                </td>
            </tr>
        `;
        return;
    }
    
    // Ordenar por fecha (más reciente primero)
    const sorted = [...movimientosData].sort((a, b) => b.timestamp - a.timestamp);
    
    const tipoLabels = {
        'produccion': '🏭 Producción',
        'compra': '🛒 Compra',
        'devolucion': '🔄 Devolución',
        'venta': '🛍️ Venta',
        'merma': '🗑️ Merma',
        'traslado': '🚚 Traslado',
        'ajuste': '📝 Ajuste'
    };
    
    const tipoColor = {
        'produccion': 'completado',
        'compra': 'completado',
        'devolucion': 'en_proceso',
        'venta': 'retrasado',
        'merma': 'retrasado',
        'traslado': 'en_proceso',
        'ajuste': 'en_proceso'
    };
    
    tbody.innerHTML = sorted.map((m, index) => {
        const esSuma = ['produccion', 'compra', 'devolucion'].includes(m.tipo);
        const signo = esSuma ? '+' : '-';
        return `
            <tr>
                <td>${index + 1}</td>
                <td><strong>${m.producto}</strong></td>
                <td style="color:${esSuma ? 'var(--green)' : 'var(--red)'};font-weight:700;">
                    ${signo}${m.cantidad}
                </td>
                <td><span class="status-badge ${tipoColor[m.tipo] || 'en_proceso'}">${tipoLabels[m.tipo] || m.tipo}</span></td>
                <td>${m.fecha || '--:--'}</td>
                <td>
                    <button class="btn-action btn-edit" onclick="editarMovimiento('${m.id}')">✏️</button>
                    <button class="btn-action btn-delete" onclick="eliminarMovimiento('${m.id}')">🗑️</button>
                </td>
            </tr>
        `;
    }).join('');
}

// ============================================ //
// GRÁFICO DE PRODUCCIÓN                        //
// ============================================ //
function actualizarGrafico() {
    const ctx = document.getElementById('produccionChart');
    if (!ctx) return;
    
    // Agrupar por producto (top 8)
    const conteo = {};
    movimientosData.forEach(m => {
        if (m.tipo === 'produccion' || m.tipo === 'compra') {
            conteo[m.producto] = (conteo[m.producto] || 0) + m.cantidad;
        }
    });
    
    const sorted = Object.entries(conteo)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8);
    
    const labels = sorted.map(([nombre]) => nombre);
    const values = sorted.map(([_, cantidad]) => cantidad);
    
    const colores = [
        'rgba(230, 126, 34, 0.7)',
        'rgba(243, 156, 18, 0.7)',
        'rgba(39, 174, 96, 0.7)',
        'rgba(52, 152, 219, 0.7)',
        'rgba(155, 89, 182, 0.7)',
        'rgba(231, 76, 60, 0.7)',
        'rgba(26, 188, 156, 0.7)',
        'rgba(241, 196, 15, 0.7)'
    ];
    
    if (chartInstance) {
        chartInstance.destroy();
    }
    
    chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Unidades Producidas',
                data: values,
                backgroundColor: colores.slice(0, values.length),
                borderColor: 'rgba(230, 126, 34, 1)',
                borderWidth: 0,
                borderRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: '#8a7a6e',
                        font: { size: 10 }
                    },
                    grid: {
                        color: 'rgba(255,255,255,0.03)'
                    }
                },
                x: {
                    ticks: {
                        color: '#8a7a6e',
                        font: { size: 9 },
                        maxRotation: 45,
                        minRotation: 45
                    },
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// ============================================ //
// AGREGAR STOCK (PRODUCCIÓN)                   //
// ============================================ //
function abrirModalProduccion() {
    cargarProductosEnSelects();
    document.getElementById('modalProduccion').style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function cerrarModalProduccion() {
    document.getElementById('modalProduccion').style.display = 'none';
    document.body.style.overflow = '';
    document.getElementById('formProduccion').reset();
}

function guardarProduccion(e) {
    e.preventDefault();
    
    const producto = document.getElementById('productoSelect').value;
    const cantidad = parseInt(document.getElementById('cantidadInput').value);
    const motivo = document.getElementById('motivoSelect').value;
    const observaciones = document.getElementById('observacionesInput').value;
    
    if (!producto || !cantidad || cantidad <= 0) {
        mostrarToast('⚠️ Por favor selecciona un producto y una cantidad válida');
        return;
    }
    
    // Sumar al inventario
    inventarioData[producto] = (inventarioData[producto] || 0) + cantidad;
    
    // Registrar movimiento
    const nuevoMovimiento = {
        id: Date.now().toString(),
        producto,
        cantidad: cantidad,
        tipo: motivo,
        motivo: motivo,
        observaciones: observaciones || '',
        fecha: new Date().toLocaleString('es-ES', { 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric',
            hour: '2-digit', 
            minute: '2-digit' 
        }),
        timestamp: Date.now()
    };
    
    movimientosData.push(nuevoMovimiento);
    guardarDatosLocal();
    actualizarDashboard();
    cerrarModalProduccion();
    mostrarToast(`✅ ${cantidad} unidades de ${producto} agregadas al stock`);
}

// ============================================ //
// CONSUMIR STOCK                               //
// ============================================ //
function abrirModalConsumo() {
    cargarProductosEnSelects();
    document.getElementById('modalConsumo').style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function cerrarModalConsumo() {
    document.getElementById('modalConsumo').style.display = 'none';
    document.body.style.overflow = '';
    document.getElementById('formConsumo').reset();
}

function guardarConsumo(e) {
    e.preventDefault();
    
    const producto = document.getElementById('productoConsumoSelect').value;
    const cantidad = parseInt(document.getElementById('cantidadConsumoInput').value);
    const motivo = document.getElementById('motivoConsumoSelect').value;
    const observaciones = document.getElementById('observacionesConsumoInput').value;
    
    if (!producto || !cantidad || cantidad <= 0) {
        mostrarToast('⚠️ Por favor selecciona un producto y una cantidad válida');
        return;
    }
    
    // Verificar stock disponible
    const stockActual = inventarioData[producto] || 0;
    if (cantidad > stockActual) {
        mostrarToast(`⚠️ Stock insuficiente. Solo hay ${stockActual} unidades de ${producto}`);
        return;
    }
    
    // Restar del inventario
    inventarioData[producto] = stockActual - cantidad;
    
    // Registrar movimiento
    const nuevoMovimiento = {
        id: Date.now().toString(),
        producto,
        cantidad: cantidad,
        tipo: motivo,
        motivo: motivo,
        observaciones: observaciones || '',
        fecha: new Date().toLocaleString('es-ES', { 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric',
            hour: '2-digit', 
            minute: '2-digit' 
        }),
        timestamp: Date.now()
    };
    
    movimientosData.push(nuevoMovimiento);
    guardarDatosLocal();
    actualizarDashboard();
    cerrarModalConsumo();
    mostrarToast(`✅ ${cantidad} unidades de ${producto} consumidas`);
}

// ============================================ //
// EDITAR MOVIMIENTO                            //
// ============================================ //
function editarMovimiento(id) {
    const movimiento = movimientosData.find(m => m.id === id);
    if (!movimiento) return;
    
    editandoId = id;
    document.getElementById('editarId').value = id;
    document.getElementById('editarProducto').value = movimiento.producto;
    document.getElementById('editarCantidad').value = movimiento.cantidad;
    document.getElementById('editarMotivo').value = movimiento.motivo || movimiento.tipo;
    document.getElementById('editarObservaciones').value = movimiento.observaciones || '';
    
    document.getElementById('modalEditarMovimiento').style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function cerrarModalEditar() {
    document.getElementById('modalEditarMovimiento').style.display = 'none';
    document.body.style.overflow = '';
    editandoId = null;
}

function actualizarMovimiento(e) {
    e.preventDefault();
    
    const id = document.getElementById('editarId').value;
    const producto = document.getElementById('editarProducto').value;
    const cantidad = parseInt(document.getElementById('editarCantidad').value);
    const motivo = document.getElementById('editarMotivo').value;
    const observaciones = document.getElementById('editarObservaciones').value;
    
    if (!producto || !cantidad || cantidad <= 0) {
        mostrarToast('⚠️ Por favor completa todos los campos');
        return;
    }
    
    const index = movimientosData.findIndex(m => m.id === id);
    if (index === -1) return;
    
    const movimientoOriginal = movimientosData[index];
    
    // Revertir el cambio en el inventario
    const esSumaOriginal = ['produccion', 'compra', 'devolucion'].includes(movimientoOriginal.tipo);
    if (esSumaOriginal) {
        inventarioData[movimientoOriginal.producto] = (inventarioData[movimientoOriginal.producto] || 0) - movimientoOriginal.cantidad;
    } else {
        inventarioData[movimientoOriginal.producto] = (inventarioData[movimientoOriginal.producto] || 0) + movimientoOriginal.cantidad;
    }
    
    // Aplicar nuevo cambio
    const esSumaNueva = ['produccion', 'compra', 'devolucion'].includes(motivo);
    if (esSumaNueva) {
        inventarioData[producto] = (inventarioData[producto] || 0) + cantidad;
    } else {
        // Verificar stock para consumo
        if (cantidad > (inventarioData[producto] || 0)) {
            mostrarToast(`⚠️ Stock insuficiente para ${producto}`);
            return;
        }
        inventarioData[producto] = (inventarioData[producto] || 0) - cantidad;
    }
    
    // Actualizar movimiento
    movimientosData[index] = {
        ...movimientoOriginal,
        producto,
        cantidad,
        tipo: motivo,
        motivo: motivo,
        observaciones: observaciones || '',
        fecha: new Date().toLocaleString('es-ES', { 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric',
            hour: '2-digit', 
            minute: '2-digit' 
        }),
        timestamp: Date.now()
    };
    
    guardarDatosLocal();
    actualizarDashboard();
    cerrarModalEditar();
    mostrarToast('✅ Movimiento actualizado correctamente');
}

// ============================================ //
// ELIMINAR MOVIMIENTO                          //
// ============================================ //
function eliminarMovimiento(id) {
    if (!confirm('⚠️ ¿Estás seguro de eliminar este movimiento?')) return;
    
    const movimiento = movimientosData.find(m => m.id === id);
    if (!movimiento) return;
    
    // Revertir el cambio en el inventario
    const esSuma = ['produccion', 'compra', 'devolucion'].includes(movimiento.tipo);
    if (esSuma) {
        inventarioData[movimiento.producto] = (inventarioData[movimiento.producto] || 0) - movimiento.cantidad;
    } else {
        inventarioData[movimiento.producto] = (inventarioData[movimiento.producto] || 0) + movimiento.cantidad;
    }
    
    movimientosData = movimientosData.filter(m => m.id !== id);
    guardarDatosLocal();
    actualizarDashboard();
    mostrarToast('🗑️ Movimiento eliminado');
}

// ============================================ //
// TOAST                                        //
// ============================================ //
let toastTimer;

function mostrarToast(mensaje) {
    const toastAnterior = document.querySelector('.toast');
    if (toastAnterior) toastAnterior.remove();
    
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = mensaje;
    document.body.appendChild(toast);
    
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
        if (toast.parentNode) toast.remove();
    }, 3500);
}

// ============================================ //
// RELOJ                                        //
// ============================================ //
function actualizarReloj() {
    const ahora = new Date();
    document.getElementById('currentDate').textContent = ahora.toLocaleDateString('es-ES', {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
    });
    document.getElementById('currentTime').textContent = ahora.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
}

// ============================================ //
// BOTONES DE GRÁFICO                           //
// ============================================ //
document.querySelectorAll('.btn-chart').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.btn-chart').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        actualizarGrafico();
    });
});

// ============================================ //
// CERRAR MODALES AL HACER CLICK FUERA          //
// ============================================ //
document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.addEventListener('click', function(e) {
        if (e.target === this) {
            this.style.display = 'none';
            document.body.style.overflow = '';
        }
    });
});