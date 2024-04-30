import express from 'express';
const router = express.Router();
import { CartManager } from '../controller/carts.js'; // Importa CartManager como un miembro nombrado

const cartManager = new CartManager('./src/data/Carritos.json');

// Ruta para crear un nuevo carrito
router.post('/', async (req, res) => {
    const newCart = await cartManager.createCart();
    res.json(newCart);
});

// Ruta para obtener los productos de un carrito por su ID
router.get('/:cid', async (req, res) => {
    const cartId = parseInt(req.params.cid);
    const cart = await cartManager.getCartById(cartId);
    if (!cart) {
        res.status(404).json({ message: 'Carrito no encontrado' });
        return;
    }
    res.json(cart);
});

// Ruta para agregar un producto a un carrito
router.post('/:cid/product/:pid', async (req, res) => {
    const cartId = parseInt(req.params.cid);
    const productId = parseInt(req.params.pid);
    const quantity = parseInt(req.body.quantity || 1);

    if (isNaN(cartId) || isNaN(productId) || isNaN(quantity)) {
        res.status(400).json({ message: 'Parámetros inválidos' });
        return;
    }

    const cart = await cartManager.addProductToCart(cartId, productId, quantity);
    if (!cart) {
        res.status(404).json({ message: 'Carrito no encontrado' });
        return;
    }
    res.json(cart);
});

export default router; // Exporta el router por defecto
