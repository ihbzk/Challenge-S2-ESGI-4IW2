const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const checkAuth = require('../middlewares/checkAuth');
const checkRole = require('../middlewares/checkRole');

router.get('/orders', checkAuth, orderController.getAllOrders);
router.post('/orders', checkAuth, orderController.createOrder);
router.get('/orders/:id', checkAuth, orderController.getOrderById);
router.get('/orders/user/:userId', orderController.getOrdersByUserId);
router.put('/orders/:id', checkAuth, orderController.updateOrder);
router.delete('/orders/:id', checkAuth, orderController.deleteOrder);

module.exports = router;
