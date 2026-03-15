const express = require('express');
const session = require('express-session');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Crear carpeta de uploads si no existe
const uploadDir = path.join(__dirname, 'public', 'uploads', 'productos');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// ─── MIDDLEWARE ───────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(session({
    secret: process.env.SESSION_SECRET || 'brandsgarden_secret',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 8 } // 8 horas
}));

// ─── BASE DE DATOS EN MEMORIA ─────────────────────────────
let users = [
    { email: 'jeffrc.pe@gmail.com', password: 'BrandsGarden2026', isAdmin: true }
];
let productos = [
    { id: 1, categoria: "Perfumes", nombre: "9am Dive Armaf", stock: 10, precio: 159, descCorta: "Inspirado en Bleu de Chanel + YSL Y", descripcion: "El equilibrio perfecto entre lo cítrico y lo dulce...", imagen: "" },
    { id: 2, categoria: "Perfumes", nombre: "Khamrah Lattafa", stock: 10, precio: 159, descCorta: "Inspirado en Creación Original", descripcion: "Una fragancia irresistible con notas de canela...", imagen: "" },
    { id: 3, categoria: "Perfumes", nombre: "Club de Nuit Intense", stock: 10, precio: 159, descCorta: "Inspirado en Aventus", descripcion: "El aroma masculino por excelencia...", imagen: "" }
];
// (Se asume que el usuario importará el resto o se poblará dinámicamente)

let pedidos = [
    { id: 1001, cliente: 'María García', telefono: '987654321', email: 'maria@gmail.com', direccion: 'Av. Arequipa 1200, Lima', productos: [{ nombre: '9am Dive Armaf', cantidad: 1, precio: 159 }], subtotal: 159, envio: 15, total: 174, estado: 'Entregado', fecha: '2026-03-12' },
];

let nextPedidoId = 1002;
let nextProductoId = 4;
let configuracion = { envioBase: 15, nombreTienda: 'Brandsgarden' };

function requireAdmin(req, res, next) {
    if (req.session && req.session.isAdmin) return next();
    if (req.path.startsWith('/api/')) return res.status(401).json({ error: 'No autorizado' });
    res.redirect('/admin');
}

// ─── API: PRODUCTOS (WooCommerce Compat) ──────────────────
app.get('/wp-json/wc/store/products', (req, res) => {
    const mapped = productos.map(p => ({
        id: p.id,
        name: p.nombre,
        prices: { price: (p.precio * 100).toString(), currency_code: 'PEN' },
        description: p.descripcion,
        short_description: p.descCorta,
        images: p.imagen ? [{ src: p.imagen, thumbnail: p.imagen }] : [],
        is_purchasable: true,
        is_in_stock: p.stock > 0,
        stock_quantity: p.stock,
        categories: [{ name: p.categoria }]
    }));
    res.set('X-WP-Total', productos.length.toString());
    res.json(mapped);
});

// ─── API: AUTH ───────────────────────────────────────────
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
        req.session.isAdmin = user.isAdmin;
        req.session.adminEmail = user.email;
        return res.json({ ok: true, redirect: '/admin/dashboard' });
    }
    res.status(401).json({ ok: false, error: 'Credenciales inválidas' });
});

// ─── API: ADMIN DATA ──────────────────────────────────────
app.get('/api/productos', (req, res) => res.json(productos));
app.post('/api/productos', requireAdmin, (req, res) => {
    const nuevo = { ...req.body, id: nextProductoId++ };
    productos.push(nuevo);
    res.json(nuevo);
});
app.put('/api/productos/:id', requireAdmin, (req, res) => {
    const id = parseInt(req.params.id);
    const idx = productos.findIndex(p => p.id === id);
    if(idx !== -1) productos[idx] = { ...productos[idx], ...req.body, id };
    res.json(productos[idx]);
});
app.delete('/api/productos/:id', requireAdmin, (req, res) => {
    productos = productos.filter(p => p.id !== parseInt(req.params.id));
    res.json({ ok: true });
});

app.get('/api/pedidos', requireAdmin, (req, res) => res.json(pedidos));
app.put('/api/pedidos/:id/estado', requireAdmin, (req, res) => {
    const pedido = pedidos.find(p => p.id === parseInt(req.params.id));
    if(pedido) pedido.estado = req.body.estado;
    res.json(pedido);
});

// ─── AJAX COMPATIBILITY ──────────────────────────────────
app.all('/wp-admin/admin-ajax.php', (req, res) => {
    const action = req.query.action || req.body.action;
    if (action === 'sll_create_order') {
        const { first_name, phone, items, shipping_total } = req.body;
        const nuevo = {
            id: nextPedidoId++, cliente: first_name, telefono: phone,
            total: (parseFloat(shipping_total)||15) + (items||[]).reduce((a,b)=>a+(b.price||0),0),
            estado: 'Preparando', fecha: new Date().toISOString().split('T')[0],
            productos: items
        };
        pedidos.push(nuevo);
        return res.json({ success: true, data: { redirect_url: '/perfumes/gracias.html' } });
    }
    res.status(404).send('Not Found');
});

// ─── RUTAS ADMIN ──────────────────────────────────────────
app.get('/admin', (req, res) => {
    if (req.session.isAdmin) return res.redirect('/admin/dashboard');
    res.sendFile(path.join(__dirname, 'public/admin/login.html'));
});
app.get('/admin/dashboard', requireAdmin, (req, res) => res.sendFile(path.join(__dirname, 'public/admin/dashboard.html')));
app.get('/admin/pedidos', requireAdmin, (req, res) => res.sendFile(path.join(__dirname, 'public/admin/pedidos.html')));
app.get('/admin/productos', requireAdmin, (req, res) => res.sendFile(path.join(__dirname, 'public/admin/productos.html')));
app.get('/admin/clientes', requireAdmin, (req, res) => res.sendFile(path.join(__dirname, 'public/admin/clientes.html')));
app.get('/admin/configuracion', requireAdmin, (req, res) => res.sendFile(path.join(__dirname, 'public/admin/configuracion.html')));
app.get('/admin/logout', (req, res) => { req.session.destroy(); res.redirect('/admin'); });

app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => console.log(`🚀 Servidor en puerto ${PORT}`));
