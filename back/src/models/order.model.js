// order.model.js
const { Sequelize, DataTypes, Model } = require('sequelize');
require('dotenv').config({ path: './.env.local' });

const sequelize = require('./database');

class Order extends Model {}

Order.init({
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'pending',
        validate: {
            isIn: [['pending', 'shipped', 'delivered', 'canceled']]
        }
    },
    totalAmount: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    orderDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    shippingAddress: {
        type: DataTypes.STRING,
        allowNull: false
    },
    shippingCity: {
        type: DataTypes.STRING,
        allowNull: false
    },
    shippingPostalCode: {
        type: DataTypes.STRING,
        allowNull: false
    },
    shippingCountry: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'Order',
});

module.exports = Order;
