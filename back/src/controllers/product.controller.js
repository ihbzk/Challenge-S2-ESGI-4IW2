const Product = require('../models/product.model');
const Category = require('../models/category.model');
const Brand = require('../models/brand.model');
const { Op } = require('sequelize');
const moment = require('moment');
require('moment/locale/fr');
moment.locale('fr');

exports.createProduct = async (req, res) => {
    try {
        const product = await Product.create({
            ...req.body,
            dateAdded: moment().format('YYYY-MM-DD HH:mm:ss')
        });
        res.status(201).json(product);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.findAll({
            include: [
                { model: Category, attributes: ['name'] },
                { model: Brand, attributes: ['name'] }
            ]
        });

        res.status(200).json(products);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id, {
            include: [
                { model: Category, attributes: ['name'] },
                { model: Brand, attributes: ['name'] }
            ]
        });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.updateProductById = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        await product.update(req.body);
        res.status(200).json(product);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deleteProductById = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        await product.destroy();
        res.status(204).end();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.updateProductStock = async (req, res) => {
    try {
        const { id, stock } = req.body;
        if (typeof id !== 'number' || typeof stock !== 'number') {
            return res.status(400).json({ error: 'Invalid input' });
        }
        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        product.stock = stock;
        await product.save();
        res.status(200).json(product);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.updateProductPromotion = async (req, res) => {
    try {
        const { id, promotion } = req.body;
        if (typeof id !== 'number' || typeof promotion !== 'number') {
            return res.status(400).json({ error: 'Invalid input' });
        }
        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        product.promotion = promotion;
        await product.save();
        res.status(200).json(product);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.searchProducts = async (req, res) => {
    const { q } = req.query;

    // Validation simple des paramètres de requête
    if (typeof q !== 'string' || q.trim() === '') {
        return res.status(400).json({ error: 'Invalid query parameter' });
    }

    try {
        const query = {
            [Op.or]: [
                { productName: { [Op.iLike]: `%${q}%` } },
                { '$Brand.name$': { [Op.iLike]: `%${q}%` } },
                { '$Category.name$': { [Op.iLike]: `%${q}%` } }
            ]
        };

        const products = await Product.findAll({
            where: query,
            include: [
                { model: Category, attributes: ['name'] },
                { model: Brand, attributes: ['name'] }
            ]
        });

        res.status(200).json(products);
    } catch (error) {
        console.error('Error in searchProducts:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.suggestProducts = async (req, res) => {
    const { q } = req.query;

    if (typeof q !== 'string' || q.trim() === '') {
        return res.status(400).json({ error: 'Invalid query parameter' });
    }

    try {
        const suggestions = await Product.findAll({
            where: {
                productName: {
                    [Op.iLike]: `%${q}%`
                }
            },
            attributes: [
                'id', 
                'productName', 
                'description', 
                'price', 
                'promotion', 
                'stock', 
                'dateAdded', 
                'illustration'
            ],
            include: [
                { model: Brand, attributes: ['name'] },
                { model: Category, attributes: ['name'] }
            ],
            limit: 10
        });

        res.status(200).json(suggestions);
    } catch (error) {
        console.error('Error in suggestProducts:', error);
        res.status(500).json({ error: error.message });
    }
};