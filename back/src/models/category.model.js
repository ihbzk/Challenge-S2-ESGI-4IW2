const { Sequelize, DataTypes, Model } = require('sequelize');
const dotenv = require('dotenv').config({ path: './.env.local' });

const sequelize = new Sequelize(process.env.POSTGRES_URI);

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

(async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
})();

module.exports = Category;