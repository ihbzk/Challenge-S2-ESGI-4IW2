const { Sequelize, DataTypes, Model } = require('sequelize');
const dotenv = require('dotenv').config({ path: './.env.local' });

const sequelize = new Sequelize(process.env.POSTGRES_URI);

class Widget extends Model {}

Widget.init({
    x: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    y: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    width: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    height: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    dimensionsDatas: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
    },
    measuresDatas: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isIn: [['bar', 'line', 'pie']]
        }
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: true,
    }
}, {
    sequelize,
    modelName: 'Widget',
});

// Synchronisation du modèle avec la base de données
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

module.exports = Widget;
