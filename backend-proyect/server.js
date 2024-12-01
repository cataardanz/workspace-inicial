const express = require('express');
const path = require('path');
const cors = require('cors');
const mysql = require('mysql'); // Conexión a la base de datos
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.use('/api/static', express.static(path.join(__dirname, 'data')));

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'equipo5297',
    database: 'ecommerce'
});
connection.connect(err => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err);
        return;
    }
    console.log('Conexión exitosa a la base de datos.');
});

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

app.delete('/cart', async (req, res) => {
    const { Producto, email } = req.body;
    if (!Producto || !email ) {
        return res.status(400).json({ error: 'Faltan datos necesarios (Producto, email, Cantidad)' });
    }

    let carritoId;
    let usuarioId;

    //temporal, se deberia obtener del token o otro metodo de auth
    const sql0 = 'SELECT Id FROM usuario WHERE CorreoElectronico = ?';
    connection.query(sql0, [email], (err, results) => {
        if (err) {
            console.error('Error al obtener carrito:', err);
            res.status(500).send('Error al obtener carrito');
        } else {
            usuarioId = results[0].Id;

            const sql = 'SELECT Id FROM carrito WHERE UsuarioID = ?';
            connection.query(sql, [usuarioId], (err, results) => {
                if (err) {
                    console.error('Error al obtener carrito:', err);
                    res.status(500).send('Error al obtener carrito');
                } else {
                    carritoId = results[0].Id;

                    const sql2 = 'DELETE FROM productoscarrito WHERE CarritoId = ? AND ProductoId = ?';
                    connection.query(sql2, [carritoId, Producto.id], (err, results) => {
                        if (err) {
                            console.error('Error al obtener productos del carrito:', err);
                            res.status(500).send('Error al obtener productos del carrito');
                        } else {
                            res.sendStatus(200)
                        }
                    });
                }
            });
        }
    });
});
app.post('/cart', async (req, res) => {
    const { Producto, email, Cantidad } = req.body;
    if (!Producto || !email || !Cantidad) {
        return res.status(400).json({ error: 'Faltan datos necesarios (Producto, email, Cantidad)' });
    }

    let carritoId;
    let usuarioId;
    let itemEnCarrito;

    //temporal, se deberia obtener del token o otro metodo de auth
    const sql0 = 'SELECT Id FROM usuario WHERE CorreoElectronico = ?';
    connection.query(sql0, [email], (err, results) => {
        if (err) {
            console.error('Error al obtener carrito:', err);
            res.status(500).send('Error al obtener carrito');
        } else {
            usuarioId = results[0].Id;

            const sql = 'SELECT Id FROM carrito WHERE UsuarioID = ?';
            connection.query(sql, [usuarioId], (err, results) => {
                if (err) {
                    console.error('Error al obtener carrito:', err);
                    res.status(500).send('Error al obtener carrito');
                } else {
                    carritoId = results[0].Id;

                    const sql2 = 'SELECT * FROM productoscarrito WHERE CarritoId = ? AND ProductoId = ?';
                    connection.query(sql2, [carritoId, Producto.id], (err, results) => {
                        if (err) {
                            console.error('Error al obtener productos del carrito:', err);
                            res.status(500).send('Error al obtener productos del carrito');
                        } else {
                            itemEnCarrito = results[0];
                            console.log(itemEnCarrito);

                            if (itemEnCarrito) {
                                const cantidad = Cantidad;
                                const sql3 = 'UPDATE productoscarrito SET cantidad = ? WHERE CarritoId = ? AND ProductoId = ?';
                                connection.query(sql3, [cantidad, carritoId, Producto.id], (err, results) => {
                                    if (err) {
                                        console.error('Error al actualizar cantidad del producto en el carrito:', err);
                                        res.status(500).send('Error al actualizar cantidad del producto en el carrito');
                                    } else {
                                        res.json(results);
                                    }
                                });
                            } else {
                                const sql3 = 'INSERT INTO productoscarrito (CarritoId, ProductoId, Cantidad) VALUES (?, ?, ?)';
                                connection.query(sql3, [carritoId, Producto.id, 1], (err, results) => {
                                    if (err) {
                                        console.error('Error al agregar producto al carrito:', err);
                                        res.status(500).send('Error al agregar producto al carrito');
                                    } else {
                                        res.sendStatus(201);
                                    }
                                });
                            }
                        }
                    });
                }
            });
        }
    });
});


// Iniciar el servidor
app.listen(port, () => {
    const baseUrl = `http://localhost:${port}`;
    console.log(`Servidor escuchando en ${baseUrl}`);
});