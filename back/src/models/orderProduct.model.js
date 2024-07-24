const { DataTypes, Sequelize, Model } = require('sequelize');
require('dotenv').config({ path: './.env.local' });

const sequelize = require('./database');

class OrderProduct extends Model {}

OrderProduct.init({
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 1
    },
}, {
    sequelize,
    modelName: 'OrderProduct'
});

module.exports = OrderProduct;
