import express from 'express';
import handlebars from 'express-handlebars';
import path from 'path';
import routesProduct from './routes/routesProducts.js';
import routesCart from './routes/routesCarts.js';
import __dirname from './utils.js';

const app = express();
const PORT = 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/api/products', routesProduct);
app.use('/api/carts', routesCart);

app.engine('handlebars', handlebars.engine());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');
app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
    console.log(`Servidor Express escuchando en el puerto ${PORT}`);
});