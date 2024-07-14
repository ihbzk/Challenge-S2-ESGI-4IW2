const express = require('express');
const router = express.Router();
const widgetController = require('../controllers/widget.controller');
const checkAuth = require('../middlewares/checkAuth');

router.get('/widgets', checkAuth, widgetController.getWidgets);
router.post('/widgets', checkAuth, widgetController.createWidget);
router.put('/widgets/:id', checkAuth, widgetController.updateWidget);
router.delete('/widgets/:id', checkAuth, widgetController.deleteWidget);

module.exports = router;