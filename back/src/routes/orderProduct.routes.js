// routes/orderProductRoutes.js
const express = require('express');
const router = express.Router();
const orderProductController = require('../controllers/orderProduct.controller');

// Routes pour les OrderProduct
router.get('/', orderProductController.getAllOrderProducts);
router.post('/', orderProductController.createOrderProduct);
router.get('/:id', orderProductController.getOrderProductById);
router.put('/:id', orderProductController.updateOrderProduct);
router.delete('/:id', orderProductController.deleteOrderProduct);

module.exports = router;
