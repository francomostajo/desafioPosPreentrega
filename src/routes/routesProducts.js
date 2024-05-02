import express from 'express';
import { ProductManager } from '../controller/products.js'; // Importa ProductManager como un miembro nombrado
import { socketServer } from '../app.js';

const router = express.Router();
const manager = new ProductManager('./src/data/Productos.json');


// Endpoints
router.get('/', async (req, res) => {
    await manager.loadProducts(); 
    const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
    const products = limit ? manager.getProducts().slice(0, limit) : manager.getProducts();
    res.render('home', { products });
});

router.get('/:pid', (req, res) => {
    const { pid } = req.params;
    const product = manager.getProductById(parseInt(pid));
    if (!product) {
        return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.json(product);
});

router.post('/', async (req, res) => {
    const { title, category, description, price, thumbnail, code, stock } = req.body;
    const product = await manager.addProduct(title, category, description, price, thumbnail, code, stock);
    if (!product) {
        return res.status(400).json({ message: 'No se pudo agregar el producto' });
    }
    socketServer.emit('productAdded', product);
    res.redirect('/');
});

router.put('/:pid', async (req, res) => {
    const { pid } = req.params;
    const updatedFields = req.body;

    try {
        await manager.updateProduct(parseInt(pid), updatedFields);
        res.status(200).json({ message: 'Producto actualizado correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el producto' });
    }
});

router.delete('/:pid', async (req, res) => {
    const { pid } = req.params;

    try {
        await manager.deleteProduct(parseInt(pid));
        res.send('Producto eliminado correctamente');
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el producto' });
    }
});

// Endpoint para enviar la lista de productos al cliente cuando se conecte a través de WebSocket
router.get('/realTimeProducts', async (req, res) => {
    await manager.loadProducts();
    const products = manager.getProducts();
    res.json(products);
  });
// Nuevo endpoint para agregar un producto
router.post('/', async (req, res) => {
    const { title, category, description, price, thumbnail, code, stock } = req.body;
    const product = await manager.addProduct(title, category, description, price, thumbnail, code, stock);
    if (!product) {
        return res.status(400).json({ message: 'No se pudo agregar el producto' });
    }
    socketServer.emit('productAdded', product);
    res.redirect('/');
});

// Nuevo endpoint para eliminar un producto
router.delete('/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    await manager.deleteProduct(id);
    res.sendStatus(204);
});

export default router; // Exporta el router por defecto
