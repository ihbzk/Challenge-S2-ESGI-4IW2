// routes/orderProductRoutes.js
const express = require('express');
const router = express.Router();
const orderProductController = require('../controllers/orderProduct.controller');
const checkAuth = require('../middlewares/checkAuth');
const checkRole = require('../middlewares/checkRole');

// Routes pour les OrderProduct
router.get('/', orderProductController.getAllOrderProducts);
router.post('/', checkAuth, orderProductController.createOrderProduct);
router.get('/:id', checkAuth, orderProductController.getOrderProductById);
router.put('/:id', checkAuth, checkRole({ roles: ['ROLE_ADMIN'] }), orderProductController.updateOrderProduct);
router.delete('/:id', checkAuth, checkRole({ roles: ['ROLE_ADMIN'] }), orderProductController.deleteOrderProduct);

module.exports = router;

