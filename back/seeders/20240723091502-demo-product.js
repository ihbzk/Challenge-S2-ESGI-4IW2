'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Products', [
      {
        id: 1,
        productName: 'MacBook Pro',
        description: 'Ordinateur Apple de dernière génération.',
        price: 1200.00,
        promotion: false,
        stock: 30,
        dateAdded: new Date(),
        illustration: 'laptop.png',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        productName: 'iPhone 13',
        description: 'Smartphone Apple de dernière génération.',
        price: 800.00,
        promotion: true,
        stock: 50,
        dateAdded: new Date(),
        illustration: 'smartphone.png',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        productName: 'Airpods',
        description: 'Écouteurs Apple de dernière génération.',
        price: 150.00,
        promotion: false,
        stock: 100,
        dateAdded: new Date(),
        illustration: 'headphones.png',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Products', null, {});
  }
};
