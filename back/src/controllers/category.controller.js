const Category = require('../models/category.model');
const Product = require('../models/product.model');

exports.createCategory = async (req, res) => {
    try {
        const category = await Category.create(req.body);
        res.status(201).json(category);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.findAll();
        res.status(200).json(categories);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getCategoryById = async (req, res) => {
    try {
        const category = await Category.findByPk(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.status(200).json(category);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.updateCategoryById = async (req, res) => {
    try {
        const category = await Category.findByPk(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        await category.update(req.body);
        res.status(200).json(category);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deleteCategoryById = async (req, res) => {
    try {
        const category = await Category.findByPk(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        await category.destroy();
        res.status(204).end();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getCategoryProducts = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const products = await Product.findAll({ where: { categoryId } });
        res.status(200).json(products);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};