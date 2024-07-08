const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const checkAuth = require('../middlewares/checkAuth');

router.post('/products', checkAuth, productController.createProduct);
router.get('/products', checkAuth, productController.getAllProducts);
router.get('/products/:id', checkAuth, productController.getProductById);
router.put('/products/:id', checkAuth, productController.updateProductById);
router.delete('/products/:id', checkAuth, productController.deleteProductById);
router.patch('/products/stock', checkAuth, productController.updateProductStock);
router.patch('/products/promotion', checkAuth, productController.updateProductPromotion);

module.exports = router;
