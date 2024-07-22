// controllers/orderProductController.js
const { Order } = require('../models/order.model');
const { Product } = require('../models/product.model');
const { OrderProduct } = require('../models/orderProduct.model');

exports.getAllOrderProducts = async (req, res) => {
    try {
        const orderProducts = await OrderProduct.findAll({
            include: [Order, Product]
        });
        res.json(orderProducts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createOrderProduct = async (req, res) => {
    const { orderId, productId, quantity } = req.body;

    try {
        const orderProduct = await OrderProduct.create({ orderId, productId, quantity });
        res.status(201).json(orderProduct);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getOrderProductById = async (req, res) => {
    try {
        const orderProduct = await OrderProduct.findByPk(req.params.id, {
            include: [Order, Product]
        });
        if (!orderProduct) return res.status(404).json({ message: 'OrderProduct not found' });
        res.json(orderProduct);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateOrderProduct = async (req, res) => {
    try {
        const orderProduct = await OrderProduct.findByPk(req.params.id);
        if (!orderProduct) return res.status(404).json({ message: 'OrderProduct not found' });

        await orderProduct.update(req.body);
        res.json(orderProduct);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteOrderProduct = async (req, res) => {
    try {
        const orderProduct = await OrderProduct.findByPk(req.params.id);
        if (!orderProduct) return res.status(404).json({ message: 'OrderProduct not found' });

        await orderProduct.destroy();
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
