const express = require('express');
const session = require('express-session');
const path = require('path');
const fs = require('fs');
const pool = require('./db');

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

// ─── UTILIDADES SQL ───────────────────────────────────────
async function addLog(req, action, details) {
    try {
        const usuario = req.session.adminEmail || 'Sistema';
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        await pool.query(
            'INSERT INTO logs (usuario, ip, accion, detalles) VALUES (?, ?, ?, ?)',
            [usuario, ip, action, JSON.stringify(details)]
        );
    } catch (e) {
        console.error("Error en addLog SQL:", e);
    }
}

async function getConfig() {
    try {
        const [rows] = await pool.query('SELECT * FROM configuracion');
        const config = {};
        rows.forEach(r => config[r.clave] = r.valor);
        // Valores por defecto si no existen
        return {
            envioBase: parseFloat(config.envioBase) || 15,
            nombreTienda: config.nombreTienda || 'Brandsgarden'
        };
    } catch (e) {
        return { envioBase: 15, nombreTienda: 'Brandsgarden' };
    }
}

function requireAdmin(req, res, next) {
    if (req.session && req.session.isAdmin) return next();
    if (req.path.startsWith('/api/')) return res.status(401).json({ error: 'No autorizado' });
    res.redirect('/admin');
}

// ─── API: AUTH ───────────────────────────────────────────
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        console.log(`Intentando login para: ${email}`);
        const [rows] = await pool.query('SELECT * FROM usuarios WHERE email = ? AND password = ?', [email, password]);
        if (rows.length > 0) {
            const user = rows[0];
            req.session.isAdmin = !!user.is_admin;
            req.session.adminEmail = user.email;
            req.session.user = { email: user.email, isAdmin: !!user.is_admin };
            console.log("Login exitoso");
            return res.json({ ok: true, redirect: '/perfumes/' });
        }
        console.log("Credenciales inválidas");
        res.status(401).json({ ok: false, error: 'Credenciales inválidas' });
    } catch (e) {
        console.error("CRITICAL LOGIN ERROR:", e.message);
        res.status(500).json({ error: `Error en el servidor: ${e.message}` });
    }
});

app.post('/api/register', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Datos incompletos' });
    try {
        const [exists] = await pool.query('SELECT email FROM usuarios WHERE email = ?', [email]);
        if (exists.length > 0) return res.status(400).json({ error: 'El usuario ya existe' });
        
        await pool.query('INSERT INTO usuarios (email, password, is_admin) VALUES (?, ?, ?)', [email, password, false]);
        
        req.session.isAdmin = false;
        req.session.adminEmail = email;
        req.session.user = { email, isAdmin: false };
        res.status(201).json({ ok: true, redirect: '/perfumes/' });
    } catch (e) {
        res.status(500).json({ error: 'Error en registro' });
    }
});

app.get('/api/me', (req, res) => {
    if (req.session.user) return res.json(req.session.user);
    res.status(401).json({ error: 'No logueado' });
});

app.get('/api/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/admin');
});

app.get('/api/debug-env', (req, res) => {
    res.json({
        libreria_utilizada: 'mysql2',
        variables_principales: {
            DB_HOST: process.env.DB_HOST ? 'Configurado' : 'FALTA',
            DB_USER: process.env.DB_USER ? 'Configurado' : 'FALTA',
            DB_PASSWORD: process.env.DB_PASSWORD ? 'Configurado' : 'FALTA',
            DB_NAME: process.env.DB_NAME ? 'Configurado' : 'FALTA',
            DB_PORT: process.env.DB_PORT ? 'Configurado' : 'FALTA'
        },
        variantes_solicitadas: {
            DATABASE_URL: process.env.DATABASE_URL ? 'Configurado' : 'FALTA',
            MYSQL_HOST: process.env.MYSQL_HOST ? 'Configurado' : 'FALTA',
            MYSQL_USER: process.env.MYSQL_USER ? 'Configurado' : 'FALTA',
            MYSQL_PASSWORD: process.env.MYSQL_PASSWORD ? 'Configurado' : 'FALTA',
            MYSQL_DATABASE: process.env.MYSQL_DATABASE ? 'Configurado' : 'FALTA'
        },
        NODE_ENV: process.env.NODE_ENV || 'no definido'
    });
});

// ─── API: USUARIOS (Admin User Management) ───────────────
app.get('/api/usuarios', requireAdmin, async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT id, email, is_admin FROM usuarios ORDER BY id DESC');
        res.json(rows);
    } catch (e) {
        res.status(500).json([]);
    }
});

app.post('/api/usuarios', requireAdmin, async (req, res) => {
    const { email, password, rol } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Datos incompletos' });
    try {
        const [exists] = await pool.query('SELECT email FROM usuarios WHERE email = ?', [email]);
        if (exists.length > 0) return res.status(400).json({ error: 'El usuario ya existe' });
        
        const is_admin = rol === 'administrador';
        const [result] = await pool.query('INSERT INTO usuarios (email, password, is_admin) VALUES (?, ?, ?)', [email, password, is_admin ? 1 : 0]);
        await addLog(req, 'CREAR_USUARIO', { id: result.insertId, email, is_admin });
        res.status(201).json({ id: result.insertId, email, is_admin: is_admin ? 1 : 0 });
    } catch (e) {
        res.status(500).json({ error: 'Error al crear usuario' });
    }
});

app.delete('/api/usuarios/:id', requireAdmin, async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        await addLog(req, 'ELIMINAR_USUARIO', { id });
        await pool.query('DELETE FROM usuarios WHERE id = ?', [id]);
        res.json({ ok: true });
    } catch (e) {
        res.status(500).json({ error: 'Error al eliminar usuario' });
    }
});

// ─── API: PRODUCTOS (WooCommerce Compat & Admin) ──────────
app.get('/wp-json/wc/store/products', async (req, res) => {
    try {
        const [productos] = await pool.query('SELECT * FROM productos');
        const mapped = productos.map(p => ({
            id: p.id,
            name: p.nombre,
            prices: { price: (p.precio * 100).toString(), currency_code: 'PEN' },
            description: p.descripcion,
            short_description: p.desc_corta,
            images: p.imagen ? [{ src: p.imagen, thumbnail: p.imagen }] : [],
            is_purchasable: true,
            is_in_stock: p.stock > 0,
            stock_quantity: p.stock,
            categories: [{ name: p.categoria }]
        }));
        res.set('X-WP-Total', productos.length.toString());
        res.json(mapped);
    } catch (e) {
        res.status(500).json([]);
    }
});

app.get('/api/productos', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM productos');
        res.json(rows);
    } catch (e) {
        res.status(500).json([]);
    }
});

app.post('/api/productos', requireAdmin, async (req, res) => {
    const { nombre, categoria, stock, precio, imagen, descCorta, descripcion, sku } = req.body;
    try {
        const [result] = await pool.query(
            'INSERT INTO productos (nombre, categoria, stock, precio, imagen, desc_corta, descripcion, sku) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [nombre, categoria || 'Perfumes', parseInt(stock) || 0, parseFloat(precio) || 0, imagen || '', descCorta || '', descripcion || '', sku || '']
        );
        const nuevo = { id: result.insertId, ...req.body };
        await addLog(req, 'CREAR_PRODUCTO', { id: result.insertId, nombre, sku });
        res.status(201).json(nuevo);
    } catch (e) {
        res.status(500).json({ error: 'Error al crear producto' });
    }
});

app.put('/api/productos/:id', requireAdmin, async (req, res) => {
    const id = parseInt(req.params.id);
    const { nombre, categoria, stock, precio, imagen, descCorta, descripcion, sku } = req.body;
    try {
        await pool.query(
            'UPDATE productos SET nombre=?, categoria=?, stock=?, precio=?, imagen=?, desc_corta=?, descripcion=?, sku=? WHERE id=?',
            [nombre, categoria, parseInt(stock), parseFloat(precio), imagen, descCorta, descripcion, sku || '', id]
        );
        await addLog(req, 'EDITAR_PRODUCTO', { id, nombre, sku });
        res.json({ id, ...req.body });
    } catch (e) {
        res.status(500).json({ error: 'Error al editar producto' });
    }
});

app.delete('/api/productos/:id', requireAdmin, async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const [rows] = await pool.query('SELECT * FROM productos WHERE id = ?', [id]);
        if (rows.length > 0) {
            await addLog(req, 'ELIMINAR_PRODUCTO', { id, datosCompletos: rows[0] });
            await pool.query('DELETE FROM productos WHERE id = ?', [id]);
        }
        res.json({ ok: true });
    } catch (e) {
        res.status(500).json({ error: 'Error al eliminar producto' });
    }
});

app.post('/api/productos/import', requireAdmin, async (req, res) => {
    const productos = req.body;
    if (!Array.isArray(productos)) return res.status(400).json({ error: 'Se esperaba un array de productos' });
    
    try {
        let count = 0;
        for (const p of productos) {
            await pool.query(
                'INSERT INTO productos (id, sku, nombre, categoria, stock, precio, imagen, desc_corta, descripcion) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE nombre=VALUES(nombre), categoria=VALUES(categoria), stock=VALUES(stock), precio=VALUES(precio), imagen=VALUES(imagen), desc_corta=VALUES(desc_corta), descripcion=VALUES(descripcion)',
                [p.id, p.sku || '', p.nombre, p.categoria || 'Perfumes', p.stock || 0, p.precio || 0, p.imagen || '', p.descCorta || '', p.descripcion || '']
            );
            count++;
        }
        await addLog(req, 'IMPORTACION_MASIVA', { cantidad: count });
        res.json({ ok: true, count });
    } catch (e) {
        console.error("Error importando:", e);
        res.status(500).json({ error: 'Error durante la importación' });
    }
});

// ─── API: PEDIDOS ─────────────────────────────────────────
app.get('/api/pedidos', async (req, res) => {
    try {
        if (req.query.telefono) {
            const [rows] = await pool.query('SELECT * FROM pedidos WHERE telefono = ? ORDER BY id DESC', [req.query.telefono]);
            return res.json(rows);
        }
        if (req.session.isAdmin) {
            const [rows] = await pool.query('SELECT * FROM pedidos ORDER BY id DESC');
            for (let p of rows) {
                const [items] = await pool.query('SELECT * FROM pedido_items WHERE pedido_id = ?', [p.id]);
                p.productos = items;
            }
            return res.json(rows);
        }
        res.status(401).json({ error: 'No autorizado' });
    } catch (e) {
        res.status(500).json([]);
    }
});

app.put('/api/pedidos/:id/estado', requireAdmin, async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const [rows] = await pool.query('SELECT estado FROM pedidos WHERE id = ?', [id]);
        if (rows.length > 0) {
            const estadoAnterior = rows[0].estado;
            await pool.query('UPDATE pedidos SET estado = ? WHERE id = ?', [req.body.estado, id]);
            await addLog(req, 'CAMBIO_ESTADO_PEDIDO', { id, de: estadoAnterior, a: req.body.estado });
            res.json({ id, estado: req.body.estado });
        } else {
            res.status(404).json({ error: 'No encontrado' });
        }
    } catch (e) {
        res.status(500).json({ error: 'Error' });
    }
});

// ─── AJAX COMPATIBILITY (Landing Page Orders) ─────────────
app.all('/wp-admin/admin-ajax.php', async (req, res) => {
    const action = req.query.action || req.body.action;
    if (action === 'sll_create_order') {
        const { first_name, email, phone, address, items, shipping_total, district, department, dni } = req.body;
        
        try {
            let subtotal = 0;
            for (const item of (items || [])) {
                const [pRows] = await pool.query('SELECT precio FROM productos WHERE id = ?', [parseInt(item.id)]);
                if (pRows.length > 0) subtotal += pRows[0].precio * item.quantity;
            }
            const envio = parseFloat(shipping_total) || 15;

            const [result] = await pool.query(
                'INSERT INTO pedidos (cliente, dni, telefono, email, direccion, distrito, departmento, subtotal, envio, total, estado) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [first_name, dni || '', phone, email || '', address || '', district || '', department || '', subtotal, envio, subtotal + envio, 'Preparando']
            );

            const pedidoId = result.insertId;

            for (const item of (items || [])) {
                const [pRows] = await pool.query('SELECT nombre, precio FROM productos WHERE id = ?', [parseInt(item.id)]);
                const nombre = pRows.length > 0 ? pRows[0].nombre : `Prod #${item.id}`;
                const precio = pRows.length > 0 ? pRows[0].precio : 0;
                await pool.query(
                    'INSERT INTO pedido_items (pedido_id, nombre, cantidad, precio) VALUES (?, ?, ?, ?)',
                    [pedidoId, nombre, item.quantity, precio]
                );
            }

            return res.json({ success: true, data: { redirect_url: '/perfumes/gracias.html', order_id: pedidoId } });
        } catch (e) {
            console.error("Error creando pedido SQL:", e);
            return res.status(500).json({ success: false, data: { message: 'Error interno' } });
        }
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
app.get('/api/clientes', requireAdmin, async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT 
                cliente as nombre, 
                telefono, 
                dni,
                email,
                SUM(total) as totalGastado, 
                COUNT(*) as numeroPedidos, 
                MAX(fecha_creacion) as ultimoPedido 
            FROM pedidos 
            GROUP BY telefono, dni, cliente, email
        `);
        res.json(rows);
    } catch (e) {
        res.status(500).json([]);
    }
});

// ─── API: LOGS (AUDITORIA) ───────────────────────────────
app.get('/api/logs', requireAdmin, async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM logs ORDER BY id DESC LIMIT 500');
        res.json(rows);
    } catch (e) {
        res.status(500).json([]);
    }
});

// ─── API: CONFIG ──────────────────────────────────────────
app.get('/api/config', async (req, res) => {
    const config = await getConfig();
    res.json(config);
});

app.put('/api/config', requireAdmin, async (req, res) => {
    try {
        for (const [clave, valor] of Object.entries(req.body)) {
            await pool.query('REPLACE INTO configuracion (clave, valor) VALUES (?, ?)', [clave, valor.toString()]);
        }
        await addLog(req, 'EDITAR_CONFIG', req.body);
        res.json({ ok: true });
    } catch (e) {
        res.status(500).json({ error: 'Error' });
    }
});

// ─── RUTAS FRONTEND ───────────────────────────────────────
app.get('/login', (req, res) => res.sendFile(path.join(__dirname, 'public/admin/login.html')));
app.get('/perfumes/index.html', (req, res) => res.redirect(301, '/perfumes/'));
app.get('/admin', (req, res) => req.session.isAdmin ? res.redirect('/admin/dashboard') : res.sendFile(path.join(__dirname, 'public/admin/login.html')));
app.get('/admin/dashboard', requireAdmin, (req, res) => res.sendFile(path.join(__dirname, 'public/admin/dashboard.html')));
app.get('/admin/productos', requireAdmin, (req, res) => res.sendFile(path.join(__dirname, 'public/admin/productos.html')));
app.get('/admin/pedidos', requireAdmin, (req, res) => res.sendFile(path.join(__dirname, 'public/admin/pedidos.html')));
app.get('/admin/clientes', requireAdmin, (req, res) => res.sendFile(path.join(__dirname, 'public/admin/clientes.html')));
app.get('/admin/logs', requireAdmin, (req, res) => res.sendFile(path.join(__dirname, 'public/admin/logs.html')));
app.get('/admin/configuracion', requireAdmin, (req, res) => res.sendFile(path.join(__dirname, 'public/admin/configuracion.html')));
app.get('/admin/importador', requireAdmin, (req, res) => res.sendFile(path.join(__dirname, 'public/admin/importador.html')));

app.get('/perfil', (req, res) => res.sendFile(path.join(__dirname, 'public/perfil.html')));
app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
    console.log(`✅ Server MySQL: http://localhost:${PORT}`);
    console.log(`📦 Admin: http://localhost:${PORT}/admin`);
});
