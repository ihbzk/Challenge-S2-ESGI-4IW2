const express = require('express');
const router = express.Router();
const paypalController = require('../controllers/paypal.controller');

router.post('/create-order', paypalController.createOrder);
router.post('/capture-order/:orderID', paypalController.captureOrder);

module.exports = router;
