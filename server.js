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
// Aumentar el límite de JSON para permitir imágenes base64 grandes
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(session({
    secret: process.env.SESSION_SECRET || 'brandsgarden_secret',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 8 } // 8 horas
}));

// ─── BASE DE DATOS EN MEMORIA (sin DB por ahora) ──────────
let users = [
    { email: 'jeffrc.pe@gmail.com', password: 'BrandsGarden2026', isAdmin: true }
];
let productos = [
    { id: 1, categoria: 'Perfumes', nombre: 'Hugo Boss Bottled 100ml', stock: 12, precio: 250.00, imagen: '' },
    { id: 2, categoria: 'Perfumes', nombre: 'Polo Ralph Lauren Blue 50ml', stock: 5, precio: 180.00, imagen: '' },
    { id: 3, categoria: 'Perfumes', nombre: 'Bleu de Chanel 100ml', stock: 0, precio: 320.00, imagen: '' },
    { id: 4, categoria: 'Perfumes', nombre: 'Dior Sauvage 60ml', stock: 8, precio: 290.00, imagen: '' },
];

let pedidos = [
    { id: 1001, cliente: 'María García', telefono: '987654321', email: 'maria@gmail.com', direccion: 'Av. Arequipa 1200, Lima', productos: [{ nombre: 'Hugo Boss Bottled 100ml', cantidad: 1, precio: 250 }], subtotal: 250, envio: 15, total: 265, estado: 'Entregado', fecha: '2026-03-12' },
    { id: 1002, cliente: 'Carlos Ríos', telefono: '912345678', email: 'carlos@gmail.com', direccion: 'Jr. Miraflores 450, Dpto 3B, Lima', productos: [{ nombre: 'Dior Sauvage 60ml', cantidad: 1, precio: 290 }], subtotal: 290, envio: 15, total: 305, estado: 'En camino', fecha: '2026-03-13' },
];

let nextPedidoId = 1003;
let nextProductoId = 5;

let configuracion = {
    envioBase: 15,
    nombreTienda: 'Brandsgarden'
};

// ─── MIDDLEWARE DE AUTH (protege rutas admin) ─────────────
function requireAdmin(req, res, next) {
    if (req.session && req.session.isAdmin) return next();
    if (req.path.startsWith('/api/')) return res.status(401).json({ error: 'No autorizado' });
    res.redirect('/admin');
}

// ─── API: AUTH ────────────────────────────────────────────
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        req.session.isAdmin = user.isAdmin || false;
        req.session.adminEmail = user.email;
        req.session.user = { email: user.email, isAdmin: user.isAdmin };
        return res.json({ ok: true, redirect: user.isAdmin ? '/admin/dashboard' : '/perfumes/index.html' });
    }
    res.status(401).json({ ok: false, error: 'Correo o contraseña incorrectos' });
});

app.post('/api/register', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Datos incompletos' });
    
    if (users.find(u => u.email === email)) {
        return res.status(400).json({ error: 'El usuario ya existe' });
    }
    
    const nuevo = { email, password, isAdmin: false };
    users.push(nuevo);
    
    // Auto-login after register
    req.session.isAdmin = false;
    req.session.adminEmail = email;
    req.session.user = { email, isAdmin: false };
    
    res.status(201).json({ ok: true, redirect: '/perfumes/index.html' });
});

app.get('/api/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/admin');
});

app.get('/api/me', (req, res) => {
    if (req.session.isAdmin) return res.json({ isAdmin: true, email: req.session.adminEmail });
    res.status(401).json({ isAdmin: false });
});

// ─── API: PRODUCTOS ───────────────────────────────────────
app.get('/api/productos', (req, res) => {
    res.json(productos);
});

app.post('/api/productos', requireAdmin, (req, res) => {
    const { nombre, categoria, stock, precio } = req.body;
    const nuevo = { id: nextProductoId++, nombre, categoria: categoria || 'Perfumes', stock: parseInt(stock) || 0, precio: parseFloat(precio) || 0, imagen: '' };
    productos.push(nuevo);
    res.status(201).json(nuevo);
});

app.put('/api/productos/:id', requireAdmin, (req, res) => {
    const id = parseInt(req.params.id);
    const idx = productos.findIndex(p => p.id === id);
    if (idx === -1) return res.status(404).json({ error: 'Producto no encontrado' });
    productos[idx] = { ...productos[idx], ...req.body, id };
    res.json(productos[idx]);
});

app.delete('/api/productos/:id', requireAdmin, (req, res) => {
    const id = parseInt(req.params.id);
    productos = productos.filter(p => p.id !== id);
    res.json({ ok: true });
});

// ─── API: PEDIDOS ─────────────────────────────────────────
app.get('/api/pedidos', (req, res) => {
    // Si viene ?telefono=xxx → buscar pedidos de ese cliente (portal cliente)
    if (req.query.telefono) {
        const result = pedidos.filter(p => p.telefono === req.query.telefono);
        return res.json(result);
    }
    // Admin: todos los pedidos
    if (req.session.isAdmin) return res.json(pedidos);
    res.status(401).json({ error: 'No autorizado' });
});

app.post('/api/pedidos', (req, res) => {
    const { cliente, telefono, email, direccion, productos: items, subtotal, envio, total } = req.body;
    if (!cliente || !telefono) return res.status(400).json({ error: 'Datos incompletos' });

    const nuevo = {
        id: nextPedidoId++,
        cliente,
        telefono,
        email: email || '',
        direccion: direccion || '',
        productos: items || [],
        subtotal: parseFloat(subtotal) || 0,
        envio: parseFloat(envio) || 15,
        total: parseFloat(total) || 0,
        estado: 'Preparando',
        fecha: new Date().toISOString().split('T')[0]
    };
    pedidos.push(nuevo);
    res.status(201).json({ ok: true, pedido: nuevo });
});

app.put('/api/pedidos/:id/estado', requireAdmin, (req, res) => {
    const id = parseInt(req.params.id);
    const pedido = pedidos.find(p => p.id === id);
    if (!pedido) return res.status(404).json({ error: 'Pedido no encontrado' });
    pedido.estado = req.body.estado;
    res.json(pedido);
});

// ─── API: UPLOADS & MEDIA (Galería) ───────────────────────
app.post('/api/upload', requireAdmin, (req, res) => {
    const { filename, base64 } = req.body;
    if (!filename || !base64) return res.status(400).json({ error: 'Datos incompletos' });
    
    try {
        const ext = path.extname(filename) || '.png';
        const safeName = `img_${Date.now()}${ext}`;
        const filePath = path.join(uploadDir, safeName);
        
        const base64Data = base64.replace(/^data:image\/\w+;base64,/, "");
        const buffer = Buffer.from(base64Data, 'base64');
        
        fs.writeFileSync(filePath, buffer);
        
        res.json({ ok: true, url: `/uploads/productos/${safeName}` });
    } catch (err) {
        console.error('Upload Error:', err);
        res.status(500).json({ error: 'Error al subir la imagen' });
    }
});

app.get('/api/media', requireAdmin, (req, res) => {
    try {
        const files = fs.readdirSync(uploadDir);
        const images = files.filter(f => f.match(/\.(jpg|jpeg|png|gif|webp)$/i))
                            .map(f => `/uploads/productos/${f}`);
        res.json(images);
    } catch (err) {
        res.status(500).json({ error: 'Error leyendo galería' });
    }
});

// ─── API: CLIENTES (CRM) ──────────────────────────────────
app.get('/api/clientes', requireAdmin, (req, res) => {
    const clientesMap = {};
    pedidos.forEach(p => {
        const key = p.telefono; // usamos teléfono como ID único de cliente
        if (!clientesMap[key]) {
            clientesMap[key] = {
                nombre: p.cliente,
                telefono: p.telefono,
                email: p.email,
                totalGastado: 0,
                numeroPedidos: 0,
                ultimoPedido: p.fecha
            };
        }
        clientesMap[key].totalGastado += p.total;
        clientesMap[key].numeroPedidos += 1;
        if (p.fecha > clientesMap[key].ultimoPedido) {
            clientesMap[key].ultimoPedido = p.fecha;
        }
    });
    res.json(Object.values(clientesMap));
});

// ─── API: CONFIGURACIÓN ───────────────────────────────────
app.get('/api/config', (req, res) => {
    res.json(configuracion);
});

app.put('/api/config', requireAdmin, (req, res) => {
    configuracion = { ...configuracion, ...req.body };
    res.json(configuracion);
});

// ─── RUTAS FRONTEND ───────────────────────────────────────
// Admin (protegidas)
app.get('/admin', (req, res) => {
    if (req.session.isAdmin) return res.redirect('/admin/dashboard');
    res.sendFile(path.join(__dirname, 'public/admin/login.html'));
});
app.get('/admin/dashboard', requireAdmin, (req, res) => {
    res.sendFile(path.join(__dirname, 'public/admin/dashboard.html'));
});
app.get('/admin/productos', requireAdmin, (req, res) => {
    res.sendFile(path.join(__dirname, 'public/admin/productos.html'));
});
app.get('/admin/clientes', requireAdmin, (req, res) => {
    res.sendFile(path.join(__dirname, 'public/admin/clientes.html'));
});
app.get('/admin/configuracion', requireAdmin, (req, res) => {
    res.sendFile(path.join(__dirname, 'public/admin/configuracion.html'));
});
app.get('/admin/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/admin');
});

// Cliente
app.get('/perfil', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/perfil.html'));
});

// Archivos estáticos (landing de perfumes, imágenes, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// ─── INICIO ───────────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`✅ Brandsgarden corriendo en http://localhost:${PORT}`);
    console.log(`📦 Admin: http://localhost:${PORT}/admin`);
    console.log(`🛍️  Landing: http://localhost:${PORT}/perfumes/index.html`);
});
