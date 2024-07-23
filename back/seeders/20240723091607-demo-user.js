'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users', [
      {
        role: 'ROLE_ADMIN',
        firstname: 'John',
        lastname: 'Doe',
        email: 'john.doe@example.com',
        password: 'Password123!',
        lastPasswordModificationDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        isConfirmed: true,
        loginAttempts: 0,
        lockUntil: null,
        resetPasswordToken: null,
        resetPasswordExpires: null,
        confirmationToken: null
      },
      {
        role: 'ROLE_STORE_KEEPER',
        firstname: 'Jane',
        lastname: 'Smith',
        email: 'jane.smith@example.com',
        password: 'SecurePassword456!',
        lastPasswordModificationDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        isConfirmed: true,
        loginAttempts: 0,
        lockUntil: null,
        resetPasswordToken: null,
        resetPasswordExpires: null,
        confirmationToken: null
      },
      {
        role: 'ROLE_USER',
        firstname: 'Alice',
        lastname: 'Johnson',
        email: 'alice.johnson@example.com',
        password: 'AlicePassword789!',
        lastPasswordModificationDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        isConfirmed: false,
        loginAttempts: 0,
        lockUntil: null,
        resetPasswordToken: null,
        resetPasswordExpires: null,
        confirmationToken: 'sample-token'
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
