import { QueryInterface } from 'sequelize';
module.exports = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.sequelize.query(`Alter Table rooms drop column room_no `);
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.sequelize.query(`Alter Table rooms add column room_no int not null`);
  },
};
