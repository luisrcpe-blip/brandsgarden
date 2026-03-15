const pool = require('./db');
const fs = require('fs');
const path = require('path');

async function migrate() {
    console.log('🚀 Iniciando proceso de migración a MySQL...');

    try {
        // 1. Crear Tablas
        console.log('📋 Creando tablas si no existen...');
        await pool.query(`
            CREATE TABLE IF NOT EXISTS usuarios (
                id INT AUTO_INCREMENT PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                is_admin BOOLEAN DEFAULT FALSE
            )
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS productos (
                id INT AUTO_INCREMENT PRIMARY KEY,
                sku VARCHAR(50),
                nombre VARCHAR(255) NOT NULL,
                categoria VARCHAR(100),
                stock INT DEFAULT 0,
                precio DECIMAL(10, 2) DEFAULT 0.00,
                imagen TEXT,
                desc_corta TEXT,
                descripcion TEXT
            )
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS pedidos (
                id INT AUTO_INCREMENT PRIMARY KEY,
                cliente VARCHAR(255) NOT NULL,
                dni VARCHAR(20),
                telefono VARCHAR(20),
                email VARCHAR(255),
                direccion TEXT,
                distrito VARCHAR(100),
                departamento VARCHAR(100),
                subtotal DECIMAL(10, 2),
                envio DECIMAL(10, 2),
                total DECIMAL(10, 2),
                estado VARCHAR(50) DEFAULT 'Preparando',
                fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS pedido_items (
                id INT AUTO_INCREMENT PRIMARY KEY,
                pedido_id INT,
                nombre VARCHAR(255),
                cantidad INT,
                precio DECIMAL(10, 2),
                FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE
            )
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS configuracion (
                clave VARCHAR(100) PRIMARY KEY,
                valor TEXT
            )
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS logs (
                id INT AUTO_INCREMENT PRIMARY KEY,
                usuario VARCHAR(255),
                ip VARCHAR(45),
                accion VARCHAR(100),
                detalles JSON,
                fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // 2. Migrar Datos de JSON (si existen)
        const DB_DIR = path.join(__dirname, 'database');
        if (fs.existsSync(DB_DIR)) {
            console.log('📦 Detectada carpeta /database. Migrando archivos...');

            // Productos
            const prodPath = path.join(DB_DIR, 'products.json');
            if (fs.existsSync(prodPath)) {
                const prods = JSON.parse(fs.readFileSync(prodPath, 'utf8'));
                for (const p of prods) {
                    await pool.query(
                        'INSERT IGNORE INTO productos (id, sku, nombre, categoria, stock, precio, imagen, desc_corta, descripcion) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                        [p.id, p.sku, p.nombre, p.categoria, p.stock, p.precio, p.imagen, p.descCorta, p.descripcion]
                    );
                }
                console.log(`✅ ${prods.length} productos migrados.`);
            }

            // Usuarios (Admin por defecto)
            const userPath = path.join(DB_DIR, 'users.json');
            if (fs.existsSync(userPath)) {
                const users = JSON.parse(fs.readFileSync(userPath, 'utf8'));
                for (const u of users) {
                    await pool.query(
                        'INSERT IGNORE INTO usuarios (email, password, is_admin) VALUES (?, ?, ?)',
                        [u.email, u.password, u.isAdmin || false]
                    );
                }
                console.log(`✅ ${users.length} usuarios migrados.`);
            }

            // Pedidos
            const orderPath = path.join(DB_DIR, 'orders.json');
            if (fs.existsSync(orderPath)) {
                const orders = JSON.parse(fs.readFileSync(orderPath, 'utf8'));
                for (const o of orders) {
                    const [res] = await pool.query(
                        'INSERT IGNORE INTO pedidos (id, cliente, dni, telefono, email, direccion, distrito, departamento, subtotal, envio, total, estado) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                        [o.id, o.cliente, o.dni || '', o.telefono, o.email, o.direccion, o.distrito || '', o.departamento || '', o.subtotal, o.envio, o.total, o.estado]
                    );
                    
                    if (o.productos && o.productos.length > 0) {
                        for (const item of o.productos) {
                            await pool.query(
                                'INSERT INTO pedido_items (pedido_id, nombre, cantidad, precio) VALUES (?, ?, ?, ?)',
                                [o.id, item.nombre, item.cantidad, item.precio]
                            );
                        }
                    }
                }
                console.log(`✅ ${orders.length} pedidos migrados.`);
            }

            // Config
            const configPath = path.join(DB_DIR, 'config.json');
            if (fs.existsSync(configPath)) {
                const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
                for (const [key, val] of Object.entries(config)) {
                    await pool.query('REPLACE INTO configuracion (clave, valor) VALUES (?, ?)', [key, val.toString()]);
                }
                console.log('✅ Configuración migrada.');
            }
        }

        console.log('✨ Migración completada con éxito.');
        process.exit(0);
    } catch (err) {
        console.error('❌ Error durante la migración:', err);
        process.exit(1);
    }
}

migrate();
