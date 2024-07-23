const Order = require('../models/order.model');
const Product = require('../models/product.model');
const User = require('../models/user.model');
const OrderProduct = require('../models/orderProduct.model');

exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.findAll({
            include: [
                { model: User },
                { model: Product, through: { model: OrderProduct, attributes: ['quantity'] } }
            ]
        });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createOrder = async (req, res) => {
    const { userId, products, deliveryAddress, email } = req.body;

    try {
        // on récup les détails des produits depuis la base de données
        const productIds = products.map(product => product.id);
        const dbProducts = await Product.findAll({
            where: {
                id: productIds
            }
        });

        if (dbProducts.length !== products.length) {
            return res.status(400);
        }

        // on calcule le total de la commande en utilisant les prix actuels
        let totalAmount = 0;
        products.forEach(product => {
            const dbProduct = dbProducts.find(p => p.id === product.id);
            if (!dbProduct) {
                throw new Error(`Le produit avec l'ID ${product.id} est introuvable.`);
            }
            totalAmount += dbProduct.price * product.quantity;
        });

        const order = await Order.create({
            userId,
            totalAmount,
            email,
            shippingAddress: deliveryAddress.rue,
            shippingCity: deliveryAddress.ville,
            shippingPostalCode: deliveryAddress.code_postal,
            shippingCountry: deliveryAddress.pays,
        });

        // on crée les entrées dans la table de jointure
        await Promise.all(products.map(async (product) => {
            await OrderProduct.create({
                orderId: order.id,
                productId: product.id,
                quantity: product.quantity
            });
        }));

        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findByPk(req.params.id, {
            include: [
                { model: User },
                { model: Product, through: { model: OrderProduct, attributes: ['quantity'] } }
            ]
        });

        if (!order) return res.status(404);

        res.json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateOrder = async (req, res) => {
    try {
        const order = await Order.findByPk(req.params.id);

        if (!order) return res.status(404);

        await order.update(req.body);

        res.json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteOrder = async (req, res) => {
    try {
        const order = await Order.findByPk(req.params.id);

        if (!order) return res.status(404);

        await order.destroy();

        res.status(204).end();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getOrdersByUserId = async (req, res) => {
    try {
        const userId = req.params.userId;
        const orders = await Order.findAll({
            where: { userId: userId },
            include: [
                { model: User, as: 'user' },
                { model: Product, as: 'products' ,through: { model: OrderProduct, attributes: ['quantity'] } }
            ]
        });

        if (orders.length === 0) return res.status(404);

        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};