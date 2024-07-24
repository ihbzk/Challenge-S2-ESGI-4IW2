const express = require('express');
const router = express.Router();
const widgetController = require('../controllers/widget.controller');
const checkAuth = require('../middlewares/checkAuth');
const checkRole = require('../middlewares/checkRole');

router.get('/widgets', checkAuth, widgetController.getWidgets);
router.post('/widgets', checkAuth, checkRole({ roles: ['ROLE_ADMIN'] }), widgetController.createWidget);
router.put('/widgets/:id', checkAuth, checkRole({ roles: ['ROLE_ADMIN'] }), widgetController.updateWidget);
router.delete('/widgets/:id', checkAuth, checkRole({ roles: ['ROLE_ADMIN'] }), widgetController.deleteWidget);

module.exports = router;