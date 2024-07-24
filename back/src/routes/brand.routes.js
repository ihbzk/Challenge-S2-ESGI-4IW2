const express = require('express');
const router = express.Router();
const brandController = require('../controllers/brand.controller');
const checkAuth = require('../middlewares/checkAuth');
const checkRole = require('../middlewares/checkRole');

router.post('/brands', checkAuth, checkRole({ roles: ['ROLE_ADMIN'] }), brandController.createBrand);
router.get('/brands', brandController.getAllBrands);
router.get('/brands/:id', brandController.getBrandById);
router.put('/brands/:id', checkAuth, checkRole({ roles: ['ROLE_ADMIN'] }), brandController.updateBrandById);
router.delete('/brands/:id', checkAuth, checkRole({ roles: ['ROLE_ADMIN'] }), brandController.deleteBrandById);

module.exports = router;