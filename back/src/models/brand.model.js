const { Model, DataTypes } = require('sequelize');
const dotenv = require('dotenv').config({ path: './.env.local' });

const sequelize = require('./database');

class Brand extends Model {}

Brand.init({
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
}, {
    sequelize,
    modelName: 'Brand',
});

module.exports = Brand;
