const express = require('express');
const router = express.Router();

// Simuler l'obtention des options de livraison
router.get('/options', (req, res) => {
    const deliveryOptions = [
        { id: 1, name: 'Standard Delivery', price: 5.00, estimatedDays: 5 },
        { id: 2, name: 'Express Delivery', price: 10.00, estimatedDays: 2 },
        { id: 3, name: 'Next Day Delivery', price: 15.00, estimatedDays: 1 }
    ];
    res.json(deliveryOptions);
});

// Simuler la création d'une commande de livraison
router.post('/create', (req, res) => {
    const { address, optionId } = req.body;
    const trackingNumber = 'TRK' + Math.floor(Math.random() * 1000000);

    const deliveryResponse = {
        trackingNumber: trackingNumber,
        status: 'Order created',
        estimatedDeliveryDate: new Date(Date.now() + (optionId === 1 ? 5 : optionId === 2 ? 2 : 1) * 24 * 60 * 60 * 1000)
    };
    res.json(deliveryResponse);
});

// Simuler l'obtention du statut de livraison
router.get('/status/:trackingNumber', (req, res) => {
    const { trackingNumber } = req.params;
    const deliveryStatus = {
        trackingNumber: trackingNumber,
        status: 'In transit',
        estimatedDeliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
    };
    res.json(deliveryStatus);
});

module.exports = router;
