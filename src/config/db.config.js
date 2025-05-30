const { dbConfig } = require("./server");

const config = {
  development: {
    username: dbConfig.DB_USER,
    password: dbConfig.DB_PASSWORD,
    database: dbConfig.DB_NAME,
    host: '127.0.0.1',
    dialect: 'mysql'
  }
};

module.exports = config;
