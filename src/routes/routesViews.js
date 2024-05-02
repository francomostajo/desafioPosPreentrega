import express from 'express';
import { ProductManager } from '../controller/products.js';

const router = express.Router();
const manager = new ProductManager('./src/data/Productos.json');


router.get('/', async (req, res) => {
    await manager.loadProducts();
    const products = manager.getProducts();
    res.render('home', { products });
})
router.get('/realtimeproducts',async (req, res) => {
    await manager.loadProducts(); 
    const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
    const products = limit ? manager.getProducts().slice(0, limit) : manager.getProducts();
    res.render('realTimeProducts', { products });
  });
  
export default router;