const sequelize = require('./database');
const User = require('./user.model');
const Order = require('./order.model');
const Product = require('./product.model');
const OrderProduct = require('./orderProduct.model');
const Widget = require('./widget.model');
const Category = require('./category.model');
const Brand = require('./brand.model');

// Define associations
Product.belongsTo(Category, { foreignKey: 'categoryId' });
Product.belongsTo(Brand, { foreignKey: 'brandId' });
User.hasMany(Order, { foreignKey: 'userId', as: 'orders' });
Order.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Product.belongsToMany(Order, { through: OrderProduct, foreignKey: 'productId', as: 'orders' });
Order.belongsToMany(Product, { through: OrderProduct, foreignKey: 'orderId', as: 'products' });

// Function to initialize the database
(async () => {
    try {
        // Authenticate the connection
        await sequelize.authenticate();
        console.log('Connection to PostgreSQL database successful');

        // Synchronize models with the database
        await sequelize.sync({ alter: true });
        console.log('Database synchronized');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
})();

module.exports = { sequelize, Product, User, Order, OrderProduct, Widget, Category, Brand };
