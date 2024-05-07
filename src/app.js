import express from 'express';
import handlebars from 'express-handlebars';
import { Server } from 'socket.io';
import path from 'path';
import routesProduct from './routes/routesProducts.js';
import routesCart from './routes/routesCarts.js';
import __dirname from './utils.js';
import routesView from './routes/routesViews.js';
import { ProductManager } from './controller/products.js'; // Asegúrate de ajustar esta importación

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

socketServer.on('connection', socket => {
    console.log("Nuevo cliente conectado");

    // Emitir la lista de productos al cliente al conectar
    productMngr.getProducts()
        .then((productos) => {
            socket.emit('productos', productos);
        });

    // Escuchar eventos del cliente para agregar un producto
    socket.on('nuevoProducto', producto => {
        productMngr.addProduct( producto.title, producto.category, producto.description, producto.price, producto.thumbnail, producto.code, producto.stock)
            .then(() => {
                productMngr.getProducts()
                    .then((productos) => {
                        socket.emit('productos', productos);
                        socket.emit('respuestaAdd', "Producto agregado");
                    });
            })
            .catch((error) => socket.emit('respuestaAdd', "Error al agregar el producto: " + error.message));
    });

    // Escuchar eventos del cliente para eliminar un producto
    socket.on('eliminarProducto', pid => {
        productMngr.deleteProduct(pid)
            .then(() => {
                productMngr.getProducts()
                    .then((productos) => {
                        socket.emit('productos', productos);
                        socket.emit('respuestaDelete', "Producto eliminado");
                    });
            })
            .catch((error) => socket.emit('respuestaDelete', "Error al eliminar el producto: " + error.message));
    });
});

export { socketServer };

