const { Sequelize, DataTypes, Model } = require('sequelize');
const dotenv = require('dotenv').config({ path: './.env.local' });

const sequelize = require('./database');

class Category extends Model {}

Category.init({
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
}, {
    sequelize,
    modelName: 'Category',
});

module.exports = Category;