import express from 'express';
import handlebars from 'express-handlebars';
import path from 'path';
import __dirname from './utils.js';
import routesProduct from './routes/routesProducts.js';
const routesCart = require('./routes/routesCarts');

const app = express();
const PORT = 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/api/products', routesProduct);
app.use('/api/carts', routesCart);

app.engine('handlebars', handlebars.engine());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

app.listen(PORT, () => {
    console.log(`Servidor Express escuchando en el puerto ${PORT}`);
});