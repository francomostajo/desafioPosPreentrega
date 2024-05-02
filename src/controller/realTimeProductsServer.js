import { socketServer } from '../app.js'; // Importa tu socketServer desde donde lo hayas exportado

socketServer.on('connection', (socket) => {
    console.log('Cliente conectado');

    socket.on('addProduct', (product) => {
        // Aquí deberías agregar el producto a tu base de datos o a la lista de productos
        // Luego, emitir un evento para informar a todos los clientes sobre el nuevo producto
        socketServer.emit('productAdded', product); // Usa socketServer en lugar de io para emitir a todos los clientes
    });

    socket.on('deleteProduct', (productId) => {
        // Aquí deberías eliminar el producto de tu base de datos o de la lista de productos
        // Luego, emitir un evento para informar a todos los clientes sobre la eliminación del producto
        socketServer.emit('productDeleted', productId); // Usa socketServer en lugar de io para emitir a todos los clientes
    });

    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
});