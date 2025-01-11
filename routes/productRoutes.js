import express from 'express';
import { addProduct, deleteProduct, editProduct, getAllProduct, searchProducts } from '../controllers/productController.js';

const router = express.Router();

router.get('/products', getAllProduct);
router.post('/products', addProduct);
router.put('/products/:id', editProduct);
router.delete('/products/:id', deleteProduct);   
router.get('/products/search', searchProducts);   



export default router;