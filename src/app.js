import express from 'express';
import handlebars from 'express-handlebars';
import { Server } from 'socket.io';
import path from 'path';
import routesProduct from './routes/routesProducts.js';
import routesCart from './routes/routesCarts.js';
import __dirname from './utils.js';
import routesView from './routes/routesViews.js';
import { ProductManager } from './controller/products.js'; // Asegúrate de ajustar esta importación
import { initializeSockets } from './controller/socketManager.js';

const app = express();
const PORT = 8080;
const httpServer = app.listen(PORT, console.log(`Server running on port ${PORT}`));
const socketServer = new Server(httpServer);

// Crea una instancia de ProductManager
const productMngr = new ProductManager('./src/data/Productos.json');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/api/products', routesProduct);
app.use('/api/carts', routesCart);

app.use(express.static(__dirname + "/public"));

// Handlebars
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

app.use('/', routesView);
initializeSockets(socketServer);
export { socketServer };

