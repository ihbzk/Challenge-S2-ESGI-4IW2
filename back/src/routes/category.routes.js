const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');
const checkAuth = require('../middlewares/checkAuth');
const checkRole = require('../middlewares/checkRole');

router.post('/categories', checkAuth, checkRole({ roles: ['ROLE_ADMIN'] }), categoryController.createCategory);
router.get('/categories', categoryController.getAllCategories);
router.get('/categories/:id', categoryController.getCategoryById);
router.put('/categories/:id', checkAuth, checkRole({ roles: ['ROLE_ADMIN'] }), categoryController.updateCategoryById);
router.delete('/categories/:id', checkAuth, checkRole({ roles: ['ROLE_ADMIN'] }), categoryController.deleteCategoryById);
router.get('/categories/:id/products', categoryController.getCategoryProducts);

module.exports = router;
