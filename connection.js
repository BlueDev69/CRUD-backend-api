const { Sequelize } = require("sequelize");

// Option 1: Passing a connection URI
const sequelize = new Sequelize("sqlite::memory:"); // Example for sqlite
const sequelize = new Sequelize(
  "mysql://root:root@localhost:8889/crypto_shopping_api"
); // Example for postgres

// Option 2: Passing parameters separately (sqlite)
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "path/to/database.sqlite",
});

// Option 2: Passing parameters separately (other dialects)
const sequelize = new Sequelize("database", "username", "password", {
  host: "localhost",
  dialect: mysql,
});
