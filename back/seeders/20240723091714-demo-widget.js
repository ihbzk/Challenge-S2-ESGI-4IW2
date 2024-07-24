'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Widgets', [
      {
        x: 10,
        y: 20,
        width: 300,
        height: 200,
        dimensionsDatas: ['2024', '2025'],
        measuresDatas: ['100', '150'],
        title: 'Sales Dashboard',
        type: 'bar',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        x: 50,
        y: 80,
        width: 400,
        height: 300,
        dimensionsDatas: ['2024', '2025', '2026'],
        measuresDatas: ['200', '250', '300'],
        title: 'Annual Revenue',
        type: 'line',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        x: 100,
        y: 150,
        width: 250,
        height: 150,
        dimensionsDatas: ['Q1', 'Q2', 'Q3', 'Q4'],
        measuresDatas: ['50', '75', '100', '125'],
        title: 'Quarterly Performance',
        type: 'pie',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Widgets', null, {});
  }
};
