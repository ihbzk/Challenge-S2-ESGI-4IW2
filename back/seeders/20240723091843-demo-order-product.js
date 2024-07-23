'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('OrderProducts', [
      {
        quantity: 3,
        orderId: 1, // Ensure this matches an existing order ID
        productId: 1, // Ensure this matches an existing product ID
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        quantity: 2,
        orderId: 1,
        productId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        quantity: 1,
        orderId: 2,
        productId: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('OrderProducts', null, {});
  }
};
