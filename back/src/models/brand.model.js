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

(async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
})();

module.exports = Brand;
