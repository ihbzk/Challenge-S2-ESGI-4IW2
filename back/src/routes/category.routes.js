const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');
const checkAuth = require('../middlewares/checkAuth');

router.post('/categories', checkAuth, categoryController.createCategory);
router.get('/categories', categoryController.getAllCategories);
router.get('/categories/:id', categoryController.getCategoryById);
router.put('/categories/:id', checkAuth, categoryController.updateCategoryById);
router.delete('/categories/:id', checkAuth, categoryController.deleteCategoryById);
router.get('/categories/:id/products', categoryController.getCategoryProducts);

module.exports = router;
