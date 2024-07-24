'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Brands', [
      { name: 'Apple', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Microsoft', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Google', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Samsung', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Dell', createdAt: new Date(), updatedAt: new Date() },
      { name: 'HP', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Lenovo', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Asus', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Acer', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Sony', createdAt: new Date(), updatedAt: new Date() },
      { name: 'LG', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Huawei', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Xiaomi', createdAt: new Date(), updatedAt: new Date() },
      { name: 'OnePlus', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Nokia', createdAt: new Date(), updatedAt: new Date() },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Brands', null, {});
  }
};