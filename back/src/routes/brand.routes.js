const express = require('express');
const router = express.Router();
const brandController = require('../controllers/brand.controller');
const checkAuth = require('../middlewares/checkAuth');

router.post('/brands', checkAuth, brandController.createBrand);
router.get('/brands', brandController.getAllBrands);
router.get('/brands/:id', brandController.getBrandById);
router.put('/brands/:id', checkAuth, brandController.updateBrandById);
router.delete('/brands/:id', checkAuth, brandController.deleteBrandById);

module.exports = router;