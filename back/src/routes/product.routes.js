const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const checkAuth = require('../middlewares/checkAuth');
const checkRole = require('../middlewares/checkRole');

router.get('/suggest', productController.suggestProducts);
router.get('/search', productController.searchProducts);
router.post('/products', checkAuth, checkRole({ roles: ['ROLE_ADMIN'] }), productController.createProduct);
router.get('/products', productController.getAllProducts);
router.get('/products/:id', productController.getProductById);
router.put('/products/:id', checkAuth, checkRole({ roles: ['ROLE_ADMIN'] }), productController.updateProductById);
router.delete('/products/:id', checkAuth, checkRole({ roles: ['ROLE_ADMIN'] }), productController.deleteProductById);
router.patch('/products/stock', checkAuth, checkRole({ roles: ['ROLE_ADMIN'] }), productController.updateProductStock);
router.patch('/products/promotion', checkAuth, checkRole({ roles: ['ROLE_ADMIN'] }), productController.updateProductPromotion);

module.exports = router;
