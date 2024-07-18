const express = require('express');
const router = express.Router();

// Cette route serait appelée après la transaction PayPal pour capturer les détails du paiement
router.post('/capture', async (req, res) => {
  try {
    const { orderID } = req.body;
    
    // Capture de la commande PayPal via leur API
    const capture = await captureOrder(orderID);
    res.json(capture);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
