const express = require('express');
const router = express.Router();
import ProductManager from '../controller/products.js'; 

const manager = new ProductManager('./src/data/Productos.json');

// Endpoints
router.get('/', async (req, res) => {
    await manager.loadProducts(); 
    const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
    const products = limit ? manager.getProducts().slice(0, limit) : manager.getProducts();
    res.render('index', products );
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
    res.status(201).json(product);
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
        res.status(200).json({ message: 'Producto eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el producto' });
    }
});

module.exports = router;