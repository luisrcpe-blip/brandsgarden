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

// ─── BASE DE DATOS PERSISTENTE (JSON) ──────────────────────
const PRODUCTS_FILE = path.join(__dirname, 'products.json');
const ORDERS_FILE = path.join(__dirname, 'orders.json');
const CONFIG_FILE = path.join(__dirname, 'config.json');
const USERS_FILE = path.join(__dirname, 'users.json');

function loadJSON(file, defaultValue) {
    try {
        if (!fs.existsSync(file)) {
            fs.writeFileSync(file, JSON.stringify(defaultValue, null, 2));
            return defaultValue;
        }
        return JSON.parse(fs.readFileSync(file, 'utf8'));
    } catch (e) {
        console.error(`Error cargando ${file}:`, e);
        return defaultValue;
    }
}

function saveJSON(file, data) {
    try {
        fs.writeFileSync(file, JSON.stringify(data, null, 2));
    } catch (e) {
        console.error(`Error guardando ${file}:`, e);
    }
}

// Cargar datos iniciales
let users = loadJSON(USERS_FILE, [{ email: 'jeffrc.pe@gmail.com', password: 'BrandsGarden2026', isAdmin: true }]);
let productos = loadJSON(PRODUCTS_FILE, []);
let pedidos = loadJSON(ORDERS_FILE, []);
let configuracion = loadJSON(CONFIG_FILE, { envioBase: 15, nombreTienda: 'Brandsgarden' });

// IDs auto-incrementales
let nextProductoId = productos.length > 0 ? Math.max(...productos.map(p => p.id)) + 1 : 1;
let nextPedidoId = pedidos.length > 0 ? Math.max(...pedidos.map(p => p.id)) + 1 : 1001;

function requireAdmin(req, res, next) {
    if (req.session && req.session.isAdmin) return next();
    if (req.path.startsWith('/api/')) return res.status(401).json({ error: 'No autorizado' });
    res.redirect('/admin');
}

// ─── API: AUTH ───────────────────────────────────────────
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
        req.session.isAdmin = user.isAdmin;
        req.session.adminEmail = user.email;
        req.session.user = { email: user.email, isAdmin: user.isAdmin };
        // Si es admin, llevar a la web (landing) con el botón especial
        return res.json({ ok: true, redirect: '/perfumes/' });
    }
    res.status(401).json({ ok: false, error: 'Credenciales inválidas' });
});

app.post('/api/register', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Datos incompletos' });
    if (users.find(u => u.email === email)) return res.status(400).json({ error: 'El usuario ya existe' });
    const nuevo = { email, password, isAdmin: false };
    users.push(nuevo);
    saveJSON(USERS_FILE, users);
    req.session.isAdmin = false;
    req.session.adminEmail = email;
    req.session.user = { email, isAdmin: false };
    res.status(201).json({ ok: true, redirect: '/perfumes/' });
});

app.get('/api/me', (req, res) => {
    if (req.session.user) return res.json(req.session.user);
    res.status(401).json({ error: 'No logueado' });
});

app.get('/api/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/admin');
});

// ─── API: PRODUCTOS (WooCommerce Compat & Admin) ──────────
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

app.get('/api/productos', (req, res) => res.json(productos));

app.post('/api/productos', requireAdmin, (req, res) => {
    const { nombre, categoria, stock, precio, imagen, descCorta, descripcion } = req.body;
    const nuevo = { 
        id: nextProductoId++, 
        nombre, 
        categoria: categoria || 'Perfumes', 
        stock: parseInt(stock) || 0, 
        precio: parseFloat(precio) || 0, 
        imagen: imagen || '',
        descCorta: descCorta || '',
        descripcion: descripcion || ''
    };
    productos.push(nuevo);
    saveJSON(PRODUCTS_FILE, productos);
    res.status(201).json(nuevo);
});

app.put('/api/productos/:id', requireAdmin, (req, res) => {
    const id = parseInt(req.params.id);
    const idx = productos.findIndex(p => p.id === id);
    if (idx === -1) return res.status(404).json({ error: 'No encontrado' });
    productos[idx] = { ...productos[idx], ...req.body, id };
    saveJSON(PRODUCTS_FILE, productos);
    res.json(productos[idx]);
});

app.delete('/api/productos/:id', requireAdmin, (req, res) => {
    productos = productos.filter(p => p.id !== parseInt(req.params.id));
    saveJSON(PRODUCTS_FILE, productos);
    res.json({ ok: true });
});

// ─── API: PEDIDOS ─────────────────────────────────────────
app.get('/api/pedidos', (req, res) => {
    if (req.query.telefono) return res.json(pedidos.filter(p => p.telefono === req.query.telefono));
    if (req.session.isAdmin) return res.json(pedidos);
    res.status(401).json({ error: 'No autorizado' });
});

app.put('/api/pedidos/:id/estado', requireAdmin, (req, res) => {
    const pedido = pedidos.find(p => p.id === parseInt(req.params.id));
    if (pedido) {
        pedido.estado = req.body.estado;
        saveJSON(ORDERS_FILE, pedidos);
    }
    res.json(pedido);
});

app.post('/api/pedidos', (req, res) => {
    const { cliente, telefono, email, direccion, productos: items, subtotal, envio, total } = req.body;
    const nuevo = {
        id: nextPedidoId++,
        cliente,
        telefono,
        email: email || '',
        direccion,
        productos: items || [],
        subtotal: subtotal || 0,
        envio: envio || 0,
        total: total || 0,
        estado: 'Preparando',
        fecha: new Date().toISOString().split('T')[0]
    };
    pedidos.push(nuevo);
    saveJSON(ORDERS_FILE, pedidos);
    res.status(201).json(nuevo);
});

// ─── AJAX COMPATIBILITY (Landing Page Orders) ─────────────
app.all('/wp-admin/admin-ajax.php', (req, res) => {
    const action = req.query.action || req.body.action;
    if (action === 'sll_create_order') {
        const { first_name, email, phone, address, items, shipping_total, district, department } = req.body;
        
        const subtotal = (items || []).reduce((sum, item) => {
            const prod = productos.find(p => p.id === parseInt(item.id));
            return sum + (prod ? prod.precio * item.quantity : 0);
        }, 0);
        const envio = parseFloat(shipping_total) || 15;

        const nuevo = {
            id: nextPedidoId++,
            cliente: first_name,
            telefono: phone,
            email: email || '',
            direccion: `${address || ''} (${district || ''}, ${department || ''})`,
            productos: (items || []).map(it => {
                const p = productos.find(x => x.id === parseInt(it.id));
                return { nombre: p ? p.nombre : `Prod #${it.id}`, cantidad: it.quantity, precio: p ? p.precio : 0 };
            }),
            subtotal,
            envio,
            total: subtotal + envio,
            estado: 'Preparando',
            fecha: new Date().toISOString().split('T')[0]
        };
        pedidos.push(nuevo);
        saveJSON(ORDERS_FILE, pedidos);
        return res.json({ success: true, data: { redirect_url: '/perfumes/gracias.html', order_id: nuevo.id } });
    }
    res.status(404).json({ success: false, data: { message: 'Acción no reconocida' } });
});

// ─── API: UPLOADS & MEDIA ─────────────────────────────────
app.post('/api/upload', requireAdmin, (req, res) => {
    const { filename, base64 } = req.body;
    if (!filename || !base64) return res.status(400).json({ error: 'Incompleto' });
    try {
        const ext = path.extname(filename) || '.png';
        const safeName = `img_${Date.now()}${ext}`;
        const filePath = path.join(uploadDir, safeName);
        const buffer = Buffer.from(base64.replace(/^data:image\/\w+;base64,/, ""), 'base64');
        fs.writeFileSync(filePath, buffer);
        res.json({ ok: true, url: `/uploads/productos/${safeName}` });
    } catch (e) { res.status(500).json({ error: 'Error upload' }); }
});

app.get('/api/media', requireAdmin, (req, res) => {
    try {
        const files = fs.readdirSync(uploadDir).filter(f => f.match(/\.(jpg|jpeg|png|gif|webp)$/i)).map(f => `/uploads/productos/${f}`);
        res.json(files);
    } catch(e) { res.status(500).json({ error: 'Error media' }); }
});

// ─── API: CLIENTES (CRM) ──────────────────────────────────
app.get('/api/clientes', requireAdmin, (req, res) => {
    const cMap = {};
    pedidos.forEach(p => {
        if (!cMap[p.telefono]) cMap[p.telefono] = { nombre: p.cliente, telefono: p.telefono, totalGastado: 0, numeroPedidos: 0, ultimoPedido: p.fecha };
        cMap[p.telefono].totalGastado += p.total;
        cMap[p.telefono].numeroPedidos++;
        if (p.fecha > cMap[p.telefono].ultimoPedido) cMap[p.telefono].ultimoPedido = p.fecha;
    });
    res.json(Object.values(cMap));
});

// ─── API: CONFIG ──────────────────────────────────────────
app.get('/api/config', (req, res) => res.json(configuracion));
app.put('/api/config', requireAdmin, (req, res) => {
    configuracion = { ...configuracion, ...req.body };
    saveJSON(CONFIG_FILE, configuracion);
    res.json(configuracion);
});

// ─── RUTAS FRONTEND ───────────────────────────────────────
app.get('/login', (req, res) => res.sendFile(path.join(__dirname, 'public/admin/login.html')));

app.get('/perfumes/index.html', (req, res) => res.redirect(301, '/perfumes/'));

app.get('/admin', (req, res) => req.session.isAdmin ? res.redirect('/admin/dashboard') : res.sendFile(path.join(__dirname, 'public/admin/login.html')));
app.get('/admin/dashboard', requireAdmin, (req, res) => res.sendFile(path.join(__dirname, 'public/admin/dashboard.html')));
app.get('/admin/productos', requireAdmin, (req, res) => res.sendFile(path.join(__dirname, 'public/admin/productos.html')));
app.get('/admin/pedidos', requireAdmin, (req, res) => res.sendFile(path.join(__dirname, 'public/admin/pedidos.html')));
app.get('/admin/clientes', requireAdmin, (req, res) => res.sendFile(path.join(__dirname, 'public/admin/clientes.html')));
app.get('/admin/configuracion', requireAdmin, (req, res) => res.sendFile(path.join(__dirname, 'public/admin/configuracion.html')));

app.get('/perfil', (req, res) => res.sendFile(path.join(__dirname, 'public/perfil.html')));
app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
    console.log(`✅ Server: http://localhost:${PORT}`);
    console.log(`📦 Admin: http://localhost:${PORT}/admin`);
});
