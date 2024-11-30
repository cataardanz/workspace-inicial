const express = require('express');
const path = require('path');
const cors = require('cors');
const mysql = require('mysql'); // Conexión a la base de datos
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.use('/api/static', express.static(path.join(__dirname, 'data')));

// Ruta estática a JSON de msg carrito
app.get('/api/cart_buy', (req, res) => {
    res.redirect('/api/static/cart/buy.json'); 
});

// Ruta estática a JSON de las categorías
app.get('/api/categories', (req, res) => {
    res.redirect('/api/static/cats/cat.json'); 
});

// Ruta dinámica a JSON del listado de productos dentro de una categoría
app.get('/api/cats_products/:tipo', (req, res) => {
    const tipo = req.params.tipo; // El tipo es el nombre de la categoría sin ".json"
    const filePath = path.join(__dirname, 'data', 'cats_products', `${tipo}.json`);
  
    // Verificar si el archivo existe antes de enviarlo
    res.sendFile(filePath, (err) => {
      if (err) {
        res.status(404).json({ error: `El archivo ${tipo}.json no existe en cats_products.` });
      }
    });
  });

// Ruta dinámica a JSON de productos
app.get('/api/products/:tipo', (req, res) => {
    const tipo = req.params.tipo; 
    const filePath = path.join(__dirname, 'data', 'products', `${tipo}.json`);

    res.sendFile(filePath, (err) => {
        if (err) res.status(404).json({ error: `El archivo ${tipo}.json no existe en products.` });
    });
});

// Ruta dinámica a JSON de reviews de productos
app.get('/api/products_comments/:tipo', (req, res) => {
    const tipo = req.params.tipo; 
    const filePath = path.join(__dirname, 'data', 'products_comments', `${tipo}.json`);

    res.sendFile(filePath, (err) => {
        if (err) res.status(404).json({ error: `El archivo ${tipo}.json no existe en products_comments.` });
    });
});

// Ruta estática a JSON de publicación de producto
app.get('/api/publish_product', (req, res) => {
    res.redirect('/api/static/sell/publish.json'); // Redirige al archivo estático
});

// Ruta estática a JSON de usuario del carrito
app.get('/api/cart_info', (req, res) => {    
    res.redirect('/api/static/user_cart/25801.json'); // Redirige al archivo estático
});


// *** Conexión a base de datos ***

// Configuración de la base de datos
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'ecommerce'
});

// Conexión a la base de datos
connection.connect(err => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err);
        return;
    }
    console.log('Conexión exitosa a la base de datos.');
});

// Rutas dinámicas para base de datos
app.get('/productos', (req, res) => {
    const sql = 'SELECT * FROM Producto';
    connection.query(sql, (err, results) => {
        if (err) {
            console.error('Error al obtener productos:', err);
            res.status(500).send('Error al obtener productos');
        } else {
            res.json(results);
        }
    });
});

app.get('/carrito', (req, res) => {
    const sql = 'SELECT * FROM Carrito';
    connection.query(sql, (err, results) => {
        if (err) {
            console.error('Error al obtener carrito:', err);
            res.status(500).send('Error al obtener carrito');
        } else {
            res.json(results);
        }
    });
});

// Ruta para obtener usuarios
app.get('/usuarios', (req, res) => {
    const sql = 'SELECT * FROM Usuario';
    connection.query(sql, (err, results) => {
        if (err) {
            console.error('Error al obtener usuarios:', err);
            res.status(500).send('Error al obtener usuarios');
        } else {
            res.json(results);
        }
    });
});

// Ruta para agregar un usuario (ejemplo de POST)
app.post('/usuarios', (req, res) => {
    const { nombre, correo, contrasena } = req.body;
    const sql = 'INSERT INTO Usuario (nombre, correo, contrasena) VALUES (?, ?, ?)';
    connection.query(sql, [nombre, correo, contrasena], (err, results) => {
        if (err) {
            console.error('Error al agregar usuario:', err);
            res.status(500).send('Error al agregar usuario');
        } else {
            res.status(201).json({ id: results.insertId, nombre, correo });
        }
    });
});

// Endpoint POST para agregar items al carrito
app.post('/cart', (req, res) => {
    const { Producto, Subtotal, Total, Cantidad } = req.body;

    // Verificar si todos los datos necesarios están presentes
    if (!Producto || !Subtotal || !Total || !Cantidad) {
        return res.status(400).json({ error: 'Faltan datos necesarios (Producto, Subtotal, Total, Cantidad)' });
    }

    // SQL para insertar un item en el carrito
    const sql = 'INSERT INTO carrito (Producto, Subtotal, Total, Cantidad) VALUES (?, ?, ?, ?)';
    connection.query(sql, [Producto, Subtotal, Total, Cantidad], (err, results) => {
        if (err) {
            console.error('Error al agregar item al carrito:', err);
            return res.status(500).json({ error: 'Error al agregar item al carrito' });
        } else {
            // Respuesta exitosa
            res.status(201).json({
                message: 'Item agregado al carrito',
                itemId: results.insertId,
                Producto,
                Subtotal,
                Total,
                Cantidad
            });
        }
    });
});

app.delete('/productos', async (req, res) => {
    const { Producto } = req.body; // Asegúrate de enviar el nombre en el body
    try {
        const resultado = await db.collection('productos').deleteOne({ Producto });
        if (resultado.deletedCount > 0) {
            res.status(200).json({ mensaje: 'Producto eliminado correctamente' });
        } else {
            res.status(404).json({ mensaje: 'Producto no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar el producto', error });
    }
});


// Iniciar el servidor
app.listen(port, () => {
    const baseUrl = `http://localhost:${port}`;
    console.log(`Servidor escuchando en ${baseUrl}`);
});