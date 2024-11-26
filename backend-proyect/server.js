const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

//Render listening function
app.get('/', (req, res) => {
    res.send('¡Backend activo!');
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});

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

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
