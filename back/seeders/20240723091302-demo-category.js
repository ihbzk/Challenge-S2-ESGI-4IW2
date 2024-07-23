'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Categories', [
      {
        name: 'Ordinateur',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Téléphone',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Tablette',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Categories', null, {});
  }
};
