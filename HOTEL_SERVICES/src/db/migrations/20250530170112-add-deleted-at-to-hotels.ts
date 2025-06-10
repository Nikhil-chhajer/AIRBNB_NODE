

import { DataTypes,QueryInterface } from "sequelize";


// module.exports = {
//   async up (queryInterface:QueryInterface) {
//     await queryInterface.sequelize.query(`ALTER TABLE hotel ADD COLUMN deleted_at DATE NULL DEFAULT NULL;`);
     
//   },

//   async down (queryInterface:QueryInterface) {
//     await queryInterface.sequelize.query(`ALTER TABLE hotel DROP COLUMN deleted_at;`);
   
//   }
// };
module.exports = {
  async up (queryInterface:QueryInterface) {
    await queryInterface.addColumn('hotels', 'deleted_at', {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    })
     
  },

  async down (queryInterface:QueryInterface) {
    await queryInterface.removeColumn('hotels', 'deleted_at');
   
  }
};
