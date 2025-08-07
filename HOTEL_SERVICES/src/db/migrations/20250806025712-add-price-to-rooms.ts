import { QueryInterface } from 'sequelize';
module.exports = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.sequelize.query(`Alter Table rooms ADD column price INT NOT NULL DEFAULT 0`);
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.sequelize.query(`Alter Table rooms drop column price`);
  },
};
