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
    {
        "id": 1,
        "categoria": "Perfumes",
        "nombre": "Full-House-Game-Of-Spades-Jo-Milano",
        "stock": 10,
        "precio": 100,
        "descCorta": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed facilisis, nulla nec aliquet ultricies, arcu lacus commodo sapien, at fringilla justo augue vel lacus",
        "descripcion": "",
        "imagen": "/uploads/productos/full_house_game_of_spades_jo_milano.png"
    },
    {
        "id": 2,
        "categoria": "Perfumes",
        "nombre": "Khamrah Lattafa",
        "stock": 10,
        "precio": 159,
        "descCorta": "Inspirado en  Creación Original",
        "descripcion": "Una fragancia irresistible con notas de canela, dátiles, praliné y vainilla. Es más denso y dulce que otros de su clase gracias al dátil, ideal para climas fríos, noches y citas donde quieras destacar. 1",
        "imagen": ""
    },
    {
        "id": 3,
        "categoria": "Perfumes",
        "nombre": "Kismet Magic Maison Alhambra",
        "stock": 10,
        "precio": 119,
        "descCorta": "Inspirado en  Angels' Share",
        "descripcion": "La copia más fiel y licorosa de Kilian, con notas de coñac, melón, canela y sándalo. Especial para noches de gala y frío. 32",
        "imagen": "/uploads/productos/kismet_magic_maison_alhambra.jpg"
    },
    {
        "id": 4,
        "categoria": "Perfumes",
        "nombre": "Jorge Di Profumo Aqua Maison Alhambra",
        "stock": 10,
        "precio": 119,
        "descCorta": "Inspirado en Acqua di Gio Profumo",
        "descripcion": "El ADN marino clásico reforzado con un toque de incienso árabe, notas oceánicas y romero. Elegante para la oficina en días calurosos. 34",
        "imagen": "/uploads/productos/jorge_di_profumo_aqua_maison_alhambra.png"
    },
    {
        "id": 5,
        "categoria": "Perfumes",
        "nombre": "Qaed Untamed Lattafa",
        "stock": 10,
        "precio": 119,
        "descCorta": "Inspirado en Creación Original",
        "descripcion": "Una mezcla exótica para amantes del cuero y las especias fuertes, con azafrán, clavo, cuero, oud y ámbar. Ideal para noches intensas. 40",
        "imagen": "/uploads/productos/qaed_untamed_lattafa.png"
    },
    {
        "id": 6,
        "categoria": "Perfumes",
        "nombre": "Confidential Private Gold",
        "stock": 10,
        "precio": 119,
        "descCorta": "Inspirado en Kirke (Tiziana Terenzi)",
        "descripcion": "Gran proyección de frutas exóticas como maracuyá, durazno y frambuesa con un fondo de vainilla. Ideal para el calor tropical. 46",
        "imagen": "/uploads/productos/confidential_private_gold.png"
    },
    {
        "id": 7,
        "categoria": "Perfumes",
        "nombre": "Lattafa Bade'e Al Oud Sublime",
        "stock": 10,
        "precio": 149,
        "descCorta": "Inspirado en  Eden Sparkling Lychee",
        "descripcion": "Una explosión frutal roja con notas de manzana, lichi, rosa y musgo. Destaca por su duración superior y frescura, siendo el aliado perfecto para un uso diario y casual. 3",
        "imagen": ""
    },
    {
        "id": 8,
        "categoria": "Perfumes",
        "nombre": "Lattafa Bade'e Al Oud Honor & Glory",
        "stock": 10,
        "precio": 149,
        "descCorta": "Inspirado en  Creación (Crème Brûlée)",
        "descripcion": "Elegante y \"comestible\", recuerda a un postre fino con piña, crème brûlée, canela y benjuí. Un lujo gourmet para ocasiones especiales. 31",
        "imagen": "/uploads/productos/lattafa_bade_e_al_oud_honor___glory.jpg"
    },
    {
        "id": 9,
        "categoria": "Perfumes",
        "nombre": "Asad Lattafa",
        "stock": 10,
        "precio": 149,
        "descCorta": "Inspirado en  Sauvage Elixir (Dior)",
        "descripcion": "Transmite poder y autoridad con un especiado caliente de pimienta, cardamomo, regaliz y lavanda. Ideal para un perfil maduro en la noche. 39",
        "imagen": ""
    },
    {
        "id": 10,
        "categoria": "Perfumes",
        "nombre": "Lattafa Bade'e Al Oud Oud for glory",
        "stock": 10,
        "precio": 149,
        "descCorta": "Inspirado en  Oud for Greatness",
        "descripcion": "Misterio y lujo absoluto. Una fragancia muy amaderada y oscura con azafrán, lavanda, nuez moscada y oud. Perfecta para noches de gala. 41",
        "imagen": ""
    },
    {
        "id": 11,
        "categoria": "Perfumes",
        "nombre": "Lattafa Bade'e Al Oud Amethyst",
        "stock": 10,
        "precio": 149,
        "descCorta": "Inspirado en  Atomic Rose (Initio)",
        "descripcion": "Una rosa oscura y lujosa con pimienta rosa, bergamota y jazmín. Fragancia unisex con una proyección increíble para el frío. 42",
        "imagen": ""
    },
    {
        "id": 12,
        "categoria": "Perfumes",
        "nombre": "Qahwa Lattafa",
        "stock": 10,
        "precio": 159,
        "descCorta": "Inspirado en  Creación Original",
        "descripcion": "Elegancia pura en una mezcla de jengibre, cardamomo, café y benjuí. Su toque de café tostado lo hace más maduro y sofisticado. Perfecto para noches de gala y climas fríos. 2",
        "imagen": ""
    },
    {
        "id": 13,
        "categoria": "Perfumes",
        "nombre": "Mandarin Sky Armaf",
        "stock": 10,
        "precio": 159,
        "descCorta": "Inspirado en  Scandal Pour Homme",
        "descripcion": "Un festín de mandarina, caramelo, haba tonka y vetiver. Ofrece un caramelo mucho más intenso y proyectado que las versiones de diseñador. Ideal para noches de fiesta en invierno. 4",
        "imagen": ""
    },
    {
        "id": 14,
        "categoria": "Perfumes",
        "nombre": "Asad Bourbon Lattafa",
        "stock": 10,
        "precio": 159,
        "descCorta": "Inspirado en Azzaro The Most Wanted Parfum",
        "descripcion": "Sofisticación oscura con vainilla bourbon, ámbar y pachuli. Logra un equilibrio cálido y menos \"metálico\" que otros, ideal para noches de gala y climas fríos. 5",
        "imagen": ""
    },
    {
        "id": 15,
        "categoria": "Perfumes",
        "nombre": "Armaf Odyssey Aqua",
        "stock": 10,
        "precio": 159,
        "descCorta": "Inspirado en  Invictus Platinum",
        "descripcion": "Máxima frescura con toronja, absenta, menta y lavanda. Es la opción más refrescante del catálogo, diseñada específicamente para calor extremo, deporte u oficina. 6",
        "imagen": ""
    },
    {
        "id": 16,
        "categoria": "Perfumes",
        "nombre": "9am Dive Armaf",
        "stock": 10,
        "precio": 159,
        "descCorta": "Inspirado en  Bleu de Chanel + YSL Y",
        "descripcion": "El equilibrio perfecto entre lo cítrico y lo dulce con menta, manzana, cedro y pachulí. Un perfume todo terreno ideal para el uso diario. 7",
        "imagen": ""
    },
    {
        "id": 17,
        "categoria": "Perfumes",
        "nombre": "Jean Lowe Vibe Maison Alhambra",
        "stock": 10,
        "precio": 159,
        "descCorta": "Inspirado en  Pacific Chill (LV)",
        "descripcion": "La esencia del éxito con notas de toronja, jengibre, romero y ámbar. Proyecta limpieza y elegancia pura, ideal para el mundo de los negocios y entornos de lujo. 8",
        "imagen": ""
    },
    {
        "id": 18,
        "categoria": "Perfumes",
        "nombre": "Hawas For Him Rasasi",
        "stock": 10,
        "precio": 159,
        "descCorta": "Inspirado en  Invictus Aqua (Vintage)",
        "descripcion": "Conocido como el \"rey de los elogios\", combina manzana, bergamota, canela y notas acuáticas. Posee una proyección bestial en calor, verano y fiestas. 9",
        "imagen": ""
    },
    {
        "id": 19,
        "categoria": "Perfumes",
        "nombre": "Lattafa Yara",
        "stock": 10,
        "precio": 159,
        "descCorta": "Inspirado en  Creación Original",
        "descripcion": "Adictivo y suave como un \"batido de fresa\", con orquídea, heliotropo, notas tropicales y vainilla. Es una fragancia femenina versátil para el día a día. 11",
        "imagen": ""
    },
    {
        "id": 20,
        "categoria": "Perfumes",
        "nombre": "Bharara Rome Pour Homme",
        "stock": 10,
        "precio": 159,
        "descCorta": "Inspirado en Creación Original",
        "descripcion": "Fragancia de tipo \"signature\" con cítricos brillantes, salvia y bergamota. Ideal como perfume de diario para oficinas y reuniones de negocios. 12",
        "imagen": "/uploads/productos/bharara_rome_pour_homme.png"
    },
    {
        "id": 21,
        "categoria": "Perfumes",
        "nombre": "9pm man Armaf",
        "stock": 10,
        "precio": 159,
        "descCorta": "Inspirado en  Ultra Male (JPG)",
        "descripcion": "La mejor relación costo-beneficio para los amantes de lo dulce. Mezcla manzana, lavanda, vainilla y pachulí en una fragancia ideal para fiestas y noches frías. 14",
        "imagen": ""
    },
    {
        "id": 22,
        "categoria": "Perfumes",
        "nombre": "Fakhar Black Lattafa",
        "stock": 10,
        "precio": 159,
        "descCorta": "Inspirado en  YSL Y EDP",
        "descripcion": "Una alternativa fresca al Y de Dior con notas de manzana, jengibre, lavanda y cedro. Excelente fragancia de firma para el trabajo. 15",
        "imagen": ""
    },
    {
        "id": 23,
        "categoria": "Perfumes",
        "nombre": "Yara Candy Lattafa",
        "stock": 10,
        "precio": 159,
        "descCorta": "Inspirado en  Creación Original",
        "descripcion": "Una versión azucarada y divertida con caramelo, frutas rojas y vainilla. Ideal para un público juvenil y uso diario en climas cálidos. 16",
        "imagen": ""
    },
    {
        "id": 24,
        "categoria": "Perfumes",
        "nombre": "Maison Alhambra Sceptre Malachite",
        "stock": 10,
        "precio": 159,
        "descCorta": "Inspirado en  God of Fire de Stéphane Humbert Lucas",
        "descripcion": "Sofisticación absoluta con aroma verde y seco de mango jugoso y maracuyá. Una propuesta de nicho elegante para quienes buscan exclusividad. 17",
        "imagen": ""
    },
    {
        "id": 25,
        "categoria": "Perfumes",
        "nombre": "The Kingdom Men Lattafa",
        "stock": 10,
        "precio": 159,
        "descCorta": "Inspirado en Le Male Elixir JPG",
        "descripcion": "Moderno y viril, se enfoca en la nota de higo acompañada de vainilla, ámbar y sándalo. Una fragancia versátil ideal para la oficina. 19",
        "imagen": ""
    },
    {
        "id": 26,
        "categoria": "Perfumes",
        "nombre": "Dumont Paris Nitro Pour Homme Red",
        "stock": 10,
        "precio": 159,
        "descCorta": "Inspirado en  Invictus + BR540",
        "descripcion": "Potencia extrema con duración de más de 12 horas. Combina sandía, manzana, cedro y ámbar en un aroma dulce acuático para uso diario. 20",
        "imagen": ""
    },
    {
        "id": 27,
        "categoria": "Perfumes",
        "nombre": "Ansaam Silver Lataffa",
        "stock": 10,
        "precio": 159,
        "descCorta": "Inspirado en  The Most Wanted (Azzaro)",
        "descripcion": "Sexy y seductor, combina cardamomo, davana, haba tonka y pachulí. La elección ganadora para citas en climas frescos. 22",
        "imagen": ""
    },
    {
        "id": 28,
        "categoria": "Perfumes",
        "nombre": "Odyssey Homme White Armaf",
        "stock": 10,
        "precio": 159,
        "descCorta": "Inspirado en Stronger With You",
        "descripcion": "Un aroma acogedor y masculino con cardamomo, pimienta rosa, salvia y vainilla. Dulce especiado ideal para momentos románticos. 23",
        "imagen": "/uploads/productos/odyssey_homme_white_armaf.png"
    },
    {
        "id": 29,
        "categoria": "Perfumes",
        "nombre": "Club de Nuit Man Armaf",
        "stock": 10,
        "precio": 159,
        "descCorta": "Inspirado en 1 Million",
        "descripcion": "Un clásico con la potencia superior de Armaf, con notas de toronja, menta, canela y cuero. Versátil para noche o uso casual diario. 25",
        "imagen": "/uploads/productos/club_de_nuit_man_armaf.png"
    },
    {
        "id": 30,
        "categoria": "Perfumes",
        "nombre": "Club de Nuit Intense EDT Armaf",
        "stock": 10,
        "precio": 159,
        "descCorta": "Inspirado en  Aventus (Creed)",
        "descripcion": "El rey de los clones, famoso por su toque ahumado y muy masculino de limón, piña, abedul y almizcle. Una excelente firma personal. 26",
        "imagen": ""
    },
    {
        "id": 31,
        "categoria": "Perfumes",
        "nombre": "VIntage Radio Lattafa",
        "stock": 10,
        "precio": 159,
        "descCorta": "Inspirado en  Paragon (Initio)",
        "descripcion": "Aroma espiritual y amaderado de alta gama con ciruela, salvia, palo santo y sándalo. Una joya de nicho para momentos de relajación. 28",
        "imagen": ""
    },
    {
        "id": 32,
        "categoria": "Perfumes",
        "nombre": "Odyssey Mega Armaf",
        "stock": 10,
        "precio": 159,
        "descCorta": "Inspirado en  Y Le Parfum (YSL)",
        "descripcion": "Una opción más densa, oscura y sobria, con bergamota, jengibre, salvia y haba tonka. Elegancia pura para la oficina. 29",
        "imagen": ""
    },
    {
        "id": 33,
        "categoria": "Perfumes",
        "nombre": "Bharara Mast Perfume Rome Imagine",
        "stock": 10,
        "precio": 159,
        "descCorta": "Inspirado en  Imagination (LV)",
        "descripcion": "Un cítrico-terroso muy refinado y exclusivo con té negro, cidra, neroli y madera gaiac. Ideal para quien busca lujo difícil de conseguir. 35",
        "imagen": ""
    },
    {
        "id": 34,
        "categoria": "Perfumes",
        "nombre": "Tag Him Uomo Rosso Armaf",
        "stock": 10,
        "precio": 159,
        "descCorta": "Inspirado en  Invictus Victory",
        "descripcion": "Modernidad en equilibrio entre lo dulce y lo fresco, con pimienta rosa, limón, lavanda y vainilla. Perfecto para fiestas de invierno. 36",
        "imagen": ""
    },
    {
        "id": 35,
        "categoria": "Perfumes",
        "nombre": "Immortel Maison Alhambra",
        "stock": 10,
        "precio": 159,
        "descCorta": "Inspirado en  L’Immensité (LV)",
        "descripcion": "Extremadamente natural y chispeante, con jengibre, toronja, notas acuáticas y ámbar. Una fragancia de élite para usar como firma. 37",
        "imagen": ""
    },
    {
        "id": 36,
        "categoria": "Perfumes",
        "nombre": "Bharara Mast Perfume Rome Extradose",
        "stock": 10,
        "precio": 159,
        "descCorta": "Inspirado en  Creación Original",
        "descripcion": "",
        "imagen": ""
    },
    {
        "id": 37,
        "categoria": "Perfumes",
        "nombre": "Ishq Al Shuyukh Silver de Lattafa",
        "stock": 10,
        "precio": 159,
        "descCorta": "Inspirado en  1 Million Lucky",
        "descripcion": "Sumamente adictiva y almendrada, con avellana, miel, ciruela, cedro y pachulí. La opción perfecta para citas nocturnas. 44",
        "imagen": ""
    },
    {
        "id": 41,
        "categoria": "Perfumes",
        "nombre": "Hawas Kobra Rasasi",
        "stock": 10,
        "precio": 179,
        "descCorta": "Inspirado en  Hawas (Más Cítrico)",
        "descripcion": "Una versión más helada y refrescante del Hawas tradicional, con limón, menta, manzana y musgo. Ideal para el calor del día a día. 24",
        "imagen": ""
    },
    {
        "id": 42,
        "categoria": "Perfumes",
        "nombre": "Odyssey Go Mango Armaf",
        "stock": 10,
        "precio": 179,
        "descCorta": "Inspirado en Creación Original",
        "descripcion": "Vibrante y alegre, huele a jugo de mango helado con notas de maracuyá, almizcle y vainilla. Ideal para el calor tropical. 30",
        "imagen": ""
    },
    {
        "id": 43,
        "categoria": "Perfumes",
        "nombre": "Club De Nuit Blue Iconic Armaf",
        "stock": 10,
        "precio": 179,
        "descCorta": "Inspirado en  Bleu de Chanel EDP",
        "descripcion": "La mejor alternativa con mayor duración para el día a día, con toronja, limón, menta e incienso. Ideal para la oficina. 47",
        "imagen": ""
    },
    {
        "id": 44,
        "categoria": "Perfumes",
        "nombre": "9am Rebel Armaf",
        "stock": 10,
        "precio": 179,
        "descCorta": "Inspirado en  Híbrido: 9PM + Aventus",
        "descripcion": "Una versión \"todo terreno\" y menos dulce que el original, con piña, lavanda, cedro y musgo. Ideal para un uso casual nocturno. 49",
        "imagen": ""
    },
    {
        "id": 45,
        "categoria": "Perfumes",
        "nombre": "Hawas Tropical Rasasi",
        "stock": 10,
        "precio": 189,
        "descCorta": "Inspirado en  Jean Paul Gaultier Le Beau Paradise Garden",
        "descripcion": "Una versión más solar y vibrante que el Hawas original, con piña, notas oceánicas y almizcle. Perfecto para un estilo casual en verano. 13",
        "imagen": ""
    },
    {
        "id": 46,
        "categoria": "Perfumes",
        "nombre": "9PM Elixir Afnan",
        "stock": 10,
        "precio": 189,
        "descCorta": "Inspirado en  Ultra Male (Más Fuerte)",
        "descripcion": "Una versión más concentrada y madura que el original, con vainilla, pachulí, cuero y lavanda. Diseñada para impactar en noches de fiesta. 18",
        "imagen": ""
    },
    {
        "id": 47,
        "categoria": "Perfumes",
        "nombre": "Al Haramain Amber Oud Gold Edition",
        "stock": 10,
        "precio": 239,
        "descCorta": "Inspirado en  Erba Pura (Xerjoff)",
        "descripcion": "Una bomba de frutas dulces con melón, piña, notas verdes, ámbar y vainilla. Posee una fijación increíble que se pega a la ropa, ideal para fiestas. 27",
        "imagen": ""
    },
    {
        "id": 48,
        "categoria": "Perfumes",
        "nombre": "Amber Oud Aqua Dubai Al Haramain",
        "stock": 10,
        "precio": 239,
        "descCorta": "Inspirado en Imagination (LV)",
        "descripcion": "Frescura de nicho, limpia y potente, con lavanda, cítricos, notas marinas y vetiver. Ideal para el lujo diario bajo el sol. 33",
        "imagen": ""
    },
    {
        "id": 49,
        "categoria": "Perfumes",
        "nombre": "Armaf Yum Yum",
        "stock": 10,
        "precio": 239,
        "descCorta": "Inspirado en Pistachio Gelato (Kayali)",
        "descripcion": "Tierno y gourmet, con aroma a helado de pistacho gracias al pistacho, chantilly, avellana y malvavisco. Una fragancia femenina y dulce. 48",
        "imagen": "/uploads/productos/armaf_yum_yum.png"
    },
    {
        "id": 50,
        "categoria": "Perfumes",
        "nombre": "Lattafa Bade'e Al Oud Honor &amp; Glory",
        "stock": 10,
        "precio": 159,
        "descCorta": "",
        "descripcion": "",
        "imagen": ""
    },
    {
        "id": 51,
        "categoria": "Perfumes",
        "nombre": "Diamond Of Spades Jo Milano",
        "stock": 10,
        "precio": 159,
        "descCorta": "Inspirado en Creación Original",
        "descripcion": "",
        "imagen": "/uploads/productos/diamond_of_spades_jo_milano.png"
    },
    {
        "id": 52,
        "categoria": "Perfumes",
        "nombre": "Full House Game Of Spades Jo Milano",
        "stock": 10,
        "precio": 159,
        "descCorta": "",
        "descripcion": "",
        "imagen": "/uploads/productos/full_house_game_of_spades_jo_milano.png"
    }
];

let pedidos = [
    { id: 1001, cliente: 'María García', telefono: '987654321', email: 'maria@gmail.com', direccion: 'Av. Arequipa 1200, Lima', productos: [{ nombre: 'Hugo Boss Bottled 100ml', cantidad: 1, precio: 250 }], subtotal: 250, envio: 15, total: 265, estado: 'Entregado', fecha: '2026-03-12' },
    { id: 1002, cliente: 'Carlos Ríos', telefono: '912345678', email: 'carlos@gmail.com', direccion: 'Jr. Miraflores 450, Dpto 3B, Lima', productos: [{ nombre: 'Dior Sauvage 60ml', cantidad: 1, precio: 290 }], subtotal: 290, envio: 15, total: 305, estado: 'En camino', fecha: '2026-03-13' },
];

let nextPedidoId = 1003;
let nextProductoId = 53;

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

// ─── API: PRODUCTOS (WooCommerce Compatibility for Landing) ──
app.get('/wp-json/wc/store/products', (req, res) => {
    // Map our local products to the format expected by wcf-carousel.js
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
    
    // WooCommerce API usually includes total in headers
    // Set response headers only if they haven't been sent yet
    if (!res.headersSent) {
        res.set('X-WP-Total', productos.length.toString());
        res.set('X-WP-TotalPages', '1');
    }
    res.json(mapped);
});

// ─── API: LOGIN/REGISTER ─────────────────────────────────────
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

// ─── API: AJAX COMPATIBILITY (Landing Page Orders) ──────────
app.all('/wp-admin/admin-ajax.php', (req, res) => {
    const action = req.query.action || req.body.action;
    
    if (action === 'sll_create_order') {
        const { first_name, email, phone, address, items, shipping_total, district, department, dni } = req.body;
        
        if (!first_name || !phone) {
            return res.json({ success: false, data: { message: 'Faltan datos obligatorios (nombre o teléfono)' } });
        }

        const nuevoPedido = {
            id: nextPedidoId++,
            cliente: first_name,
            telefono: phone,
            email: email || '',
            direccion: `${address || ''} (${district || ''}, ${department || ''})`,
            dni: dni || '',
            productos: (items || []).map(item => {
                const prod = productos.find(p => p.id === parseInt(item.id));
                return {
                    nombre: prod ? prod.nombre : `Producto #${item.id}`,
                    cantidad: item.quantity,
                    precio: prod ? prod.precio : 0
                };
            }),
            subtotal: (items || []).reduce((sum, item) => {
                const prod = productos.find(p => p.id === parseInt(item.id));
                return sum + (prod ? prod.precio * item.quantity : 0);
            }, 0),
            envio: parseFloat(shipping_total) || 15,
            estado: 'Pendiente',
            fecha: new Date().toISOString().split('T')[0]
        };
        
        nuevoPedido.total = nuevoPedido.subtotal + nuevoPedido.envio;
        pedidos.push(nuevoPedido);
        
        console.log(`✅ Nuevo pedido AJAX creado: #${nuevoPedido.id} - ${nuevoPedido.cliente}`);
        
        return res.json({
            success: true,
            data: {
                redirect_url: '/perfumes/gracias.html',
                order_id: nuevoPedido.id
            }
        });
    }

    res.status(404).json({ success: false, data: { message: 'Acción AJAX no reconocida' } });
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
                totalPedidos: 0,
                totalGastado: 0,
                ultimosPedidos: []
            };
        }
        clientesMap[key].totalPedidos++;
        clientesMap[key].totalGastado += p.total;
        clientesMap[key].ultimosPedidos.push({ id: p.id, fecha: p.fecha, total: p.total });
    });
    res.json(Object.values(clientesMap));
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

// Archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// ─── INICIO ───────────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`🚀 Servidor Brandsgarden corriendo en http://localhost:${PORT}`);
});
