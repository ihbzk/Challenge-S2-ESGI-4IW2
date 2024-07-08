const { Sequelize, DataTypes, Model } = require('sequelize');
const dotenv = require('dotenv').config({ path: './.env.local' });

const sequelize = new Sequelize(process.env.POSTGRES_URI);

// Define the Product model
class Product extends Model {}

Product.init({
    productName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false
    },
    brand: {
        type: DataTypes.STRING,
        allowNull: false
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    promotion: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    dateAdded: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
    },
    illustration: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'Product',
});

(async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection to PostgreSQL database successful');

        await sequelize.sync();
        console.log('Database synchronized');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
})();

module.exports = Product;
