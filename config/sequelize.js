const { config } = require('node-config-ts');


module.exports = {
  development: {
    username: config.database.username,
    password: config.database.password,
    database: config.database.database,
    host: config.database.host,
    dialect: 'mysql',
    dialectOptions: {
      multipleStatements: true,
    },
  },
  test: {
    username: config.database.username,
    password: config.database.password,
    database: config.database.database,
    host: config.database.host,
    dialect: 'mysql',
    dialectOptions: {
      multipleStatements: true,
    },
  },
  production: {
    username: config.database.username,
    password: config.database.password,
    database: config.database.database,
    host: config.database.host,
    dialect: 'mysql',
    dialectOptions: {
      multipleStatements: true,
    },
  },
};
