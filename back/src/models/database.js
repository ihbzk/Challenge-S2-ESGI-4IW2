const { Sequelize } = require('sequelize');
require('dotenv').config({ path: './.env.local' });

const sequelize = new Sequelize(process.env.POSTGRES_URI, {
    dialect: 'postgres',
});

module.exports = sequelize;
