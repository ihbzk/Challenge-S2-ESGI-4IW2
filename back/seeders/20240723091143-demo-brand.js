'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Brands', [
      {
        name: 'Apple',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Microsoft',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Google',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Brands', null, {});
  }
};
