'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Orders', [
      {
        id: 1,
        status: 'pending',
        totalAmount: 100.00,
        orderDate: new Date(),
        shippingAddress: '123 Main St',
        shippingCity: 'Paris',
        shippingPostalCode: '75001',
        shippingCountry: 'France',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        status: 'shipped',
        totalAmount: 200.00,
        orderDate: new Date(),
        shippingAddress: '456 Elm St',
        shippingCity: 'Lyon',
        shippingPostalCode: '69001',
        shippingCountry: 'France',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        status: 'delivered',
        totalAmount: 300.00,
        orderDate: new Date(),
        shippingAddress: '789 Oak St',
        shippingCity: 'Marseille',
        shippingPostalCode: '13001',
        shippingCountry: 'France',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Orders', null, {});
  }
};
