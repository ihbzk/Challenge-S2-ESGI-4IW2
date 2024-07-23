const Brand = require('../models/brand.model');
const Product = require('../models/product.model');

exports.createBrand = async (req, res) => {
    try {
        const brand = await Brand.create(req.body);
        res.status(201).json(brand);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getAllBrands = async (req, res) => {
    try {
        const brands = await Brand.findAll();
        res.status(200).json(brands);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getBrandById = async (req, res) => {
    try {
        const brand = await Brand.findByPk(req.params.id);
        if (!brand) {
            return res.status(404);
        }
        res.status(200).json(brand);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.updateBrandById = async (req, res) => {
    try {
        const brand = await Brand.findByPk(req.params.id);
        if (!brand) {
            return res.status(404);
        }
        await brand.update(req.body);
        res.status(200).json(brand);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deleteBrandById = async (req, res) => {
    try {
        const brand = await Brand.findByPk(req.params.id);
        if (!brand) {
            return res.status(404);
        }

        const products = await Product.findAll({ where: { brandId: req.params.id } });
        if (products.length > 0) {
            const defaultBrand = await Brand.findOne({ where: { name: 'Sans marque' } });
            if (!defaultBrand) {
                return res.status(400).json({ error: 'Default brand not found. Cannot reassign products.' });
            }

            await Product.update({ brandId: defaultBrand.id }, { where: { brandId: req.params.id } });
        }

        await brand.destroy();
        res.status(204).end();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};