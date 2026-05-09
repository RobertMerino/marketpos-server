from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from datetime import datetime
import json
import os

app = Flask(__name__)
CORS(app)

# Archivo donde se guardan los pedidos
PEDIDOS_FILE = 'pedidos.json'
MESAS_FILE = 'mesas.json'

def cargar_pedidos():
    if os.path.exists(PEDIDOS_FILE):
        with open(PEDIDOS_FILE, 'r') as f:
            return json.load(f)
    return []

def guardar_pedidos(pedidos):
    with open(PEDIDOS_FILE, 'w') as f:
        json.dump(pedidos, f)

def cargar_mesas():
    if os.path.exists(MESAS_FILE):
        with open(MESAS_FILE, 'r') as f:
            return json.load(f)
    return [
        {"id": 1, "numero": 1, "estado": "libre", "orden": []},
        {"id": 2, "numero": 2, "estado": "libre", "orden": []},
        {"id": 3, "numero": 3, "estado": "libre", "orden": []},
        {"id": 4, "numero": 4, "estado": "libre", "orden": []},
        {"id": 5, "numero": 5, "estado": "libre", "orden": []},
        {"id": 6, "numero": 6, "estado": "libre", "orden": []},
    ]

def guardar_mesas(mesas):
    with open(MESAS_FILE, 'w') as f:
        json.dump(mesas, f)

mesas = cargar_mesas()
pedidos = cargar_pedidos()

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('.', path)

@app.route('/api/mesas')
def get_mesas():
    return jsonify(mesas)

@app.route('/api/mesas/<int:id>', methods=['PATCH'])
def update_mesa(id):
    for m in mesas:
        if m['id'] == id:
            m.update(request.json)
    guardar_mesas(mesas)
    return jsonify({"ok": True})

@app.route('/api/mesas', methods=['POST'])
def add_mesa():
    nuevo = max([m['numero'] for m in mesas]) + 1 if mesas else 1
    mesa = {"id": len(mesas) + 1, "numero": nuevo, "estado": "libre", "orden": []}
    mesas.append(mesa)
    guardar_mesas(mesas)
    return jsonify(mesa)

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
    guardar_pedidos(pedidos)
    if pedido.get('cliente', {}).get('mesa'):
        for m in mesas:
            if m['numero'] == int(pedido['cliente']['mesa']):
                m['estado'] = 'ocupada'
                m['orden'] = pedido.get('items', [])
    guardar_mesas(mesas)
    return jsonify(pedido)

@app.route('/api/pedidos/<id>', methods=['PATCH'])
def update_pedido(id):
    for p in pedidos:
        if p['id'] == id:
            p.update(request.json)
    guardar_pedidos(pedidos)
    return jsonify({"ok": True})

@app.route('/api/pedidos/<id>', methods=['DELETE'])
def delete_pedido(id):
    global pedidos
    for p in pedidos:
        if p['id'] == id and p.get('cliente', {}).get('mesa'):
            for m in mesas:
                if m['numero'] == int(p['cliente']['mesa']):
                    m['estado'] = 'libre'
                    m['orden'] = []
    pedidos = [p for p in pedidos if p['id'] != id]
    guardar_pedidos(pedidos)
    guardar_mesas(mesas)
    return jsonify({"ok": True})

if __name__ == '__main__':
    print("=" * 50)
    print("🚀 TITO BURGER Server")
    print("📍 http://localhost:5000")
    print("=" * 50)
    app.run(host='0.0.0.0', port=5000, debug=False)