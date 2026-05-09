from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Memoria compartida para TODOS
pedidos = []
mesas = [
    {"id": 1, "numero": 1, "estado": "libre", "orden": []},
    {"id": 2, "numero": 2, "estado": "libre", "orden": []},
    {"id": 3, "numero": 3, "estado": "libre", "orden": []},
    {"id": 4, "numero": 4, "estado": "libre", "orden": []},
    {"id": 5, "numero": 5, "estado": "libre", "orden": []},
    {"id": 6, "numero": 6, "estado": "libre", "orden": []},
]

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('.', path)

# API MESAS
@app.route('/api/mesas')
def get_mesas():
    return jsonify(mesas)

@app.route('/api/mesas/<int:id>', methods=['PATCH'])
def update_mesa(id):
    for m in mesas:
        if m['id'] == id:
            m.update(request.json)
    return jsonify({"ok": True})

# API PEDIDOS
@app.route('/api/pedidos')
def get_pedidos():
    return jsonify(pedidos)

@app.route('/api/pedidos', methods=['POST'])
def add_pedido():
    pedido = request.json
    pedido['id'] = str(datetime.now().timestamp())
    pedido['fecha'] = datetime.now().isoformat()
    pedido['estado'] = 'nuevo'
    pedidos.insert(0, pedido)
    
    # Marcar mesa como ocupada
    if pedido.get('cliente', {}).get('mesa'):
        for m in mesas:
            if m['numero'] == int(pedido['cliente']['mesa']):
                m['estado'] = 'ocupada'
                m['orden'] = pedido.get('items', [])
    
    return jsonify(pedido)

@app.route('/api/pedidos/<id>', methods=['PATCH'])
def update_pedido(id):
    for p in pedidos:
        if p['id'] == id:
            p.update(request.json)
    return jsonify({"ok": True})

@app.route('/api/pedidos/<id>', methods=['DELETE'])
def delete_pedido(id):
    global pedidos
    # Liberar mesa
    for p in pedidos:
        if p['id'] == id and p.get('cliente', {}).get('mesa'):
            for m in mesas:
                if m['numero'] == int(p['cliente']['mesa']):
                    m['estado'] = 'libre'
                    m['orden'] = []
    
    pedidos = [p for p in pedidos if p['id'] != id]
    return jsonify({"ok": True})

if __name__ == '__main__':
    print("=" * 50)
    print("🚀 MarketPOS Server - TODOS COMPARTEN DATOS")
    print("📍 http://localhost:5000")
    print("=" * 50)
    app.run(host='0.0.0.0', port=5000, debug=False)