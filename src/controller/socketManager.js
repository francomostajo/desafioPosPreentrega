import { ProductManager } from './products.js';

const productMngr = new ProductManager('./src/data/Productos.json');

const initializeSockets = (socketServer) => {
    socketServer.on('connection', socket => {
        console.log("Nuevo cliente conectado");

        // Emitir la lista de productos al cliente al conectar
        productMngr.getProducts()
            .then((productos) => {
                socket.emit('productos', productos);
            });

        // Escuchar eventos del cliente para agregar un producto
        socket.on('nuevoProducto', producto => {
            productMngr.addProduct(producto.title, producto.category, producto.description, producto.price, producto.thumbnail, producto.code, producto.stock)
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
};

export { initializeSockets };