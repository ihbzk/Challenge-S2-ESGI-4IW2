'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Products', [
      {
        productName: 'Laptop',
        description: 'High-performance laptop with 16GB RAM and 512GB SSD.',
        price: 1200.00,
        promotion: false,
        stock: 30,
        dateAdded: new Date(),
        illustration: 'laptop.png',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        productName: 'Smartphone',
        description: 'Latest model smartphone with advanced features.',
        price: 800.00,
        promotion: true,
        stock: 50,
        dateAdded: new Date(),
        illustration: 'smartphone.png',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        productName: 'Headphones',
        description: 'Noise-cancelling headphones with Bluetooth connectivity.',
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
