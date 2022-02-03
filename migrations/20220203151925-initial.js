'use strict';

module.exports = {
  up: async ({ sequelize }) => {
    await sequelize.query(`
      SET NAMES utf8mb4;
      SET FOREIGN_KEY_CHECKS = 0;
      
      CREATE TABLE \`products\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`productName\` varchar(255) NOT NULL,
        \`cost\` int NOT NULL,
        \`amountAvailable\` int NOT NULL DEFAULT '10',
        \`sellerId\` int NOT NULL,
        PRIMARY KEY (\`id\`),
        KEY \`sellerId\` (\`sellerId\`),
        CONSTRAINT \`products_ibfk_1\` FOREIGN KEY (\`sellerId\`) REFERENCES \`users\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
      
      CREATE TABLE \`users\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`username\` varchar(255) NOT NULL,
        \`passwordHash\` varchar(255) NOT NULL,
        \`deposit\` int NOT NULL DEFAULT '0',
        \`role\` enum('buyer','seller') DEFAULT 'buyer',
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`username\` (\`username\`)
      ) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb3;
      
      CREATE TABLE \`userSessions\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`token\` varchar(255) NOT NULL,
        \`userId\` int NOT NULL,
        PRIMARY KEY (\`id\`),
        KEY \`userId\` (\`userId\`),
        CONSTRAINT \`usersessions_ibfk_1\` FOREIGN KEY (\`userId\`) REFERENCES \`users\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
      ) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb3;
      
      SET FOREIGN_KEY_CHECKS = 1;
    `);
  },
};
