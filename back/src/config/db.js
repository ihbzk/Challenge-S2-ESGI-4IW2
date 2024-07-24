const { Sequelize } = require('sequelize');
const dotenv = require('dotenv').config({ path: './.env.local' });

// Vérifiez que la variable d'environnement est définie
if (!process.env.POSTGRES_URI) {
  throw new Error('POSTGRES_URI is not defined in your .env.local file');
}

const sequelize = new Sequelize(process.env.POSTGRES_URI, {
  dialect: 'postgres', // Remplacez par votre dialecte de base de données, e.g., 'mysql', 'sqlite', 'mssql'
  logging: false, // Désactivez le logging; par défaut: console.log
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected');
  } catch (err) {
    console.error('Database connection error:', err);
  }
};

module.exports = connectDB;
