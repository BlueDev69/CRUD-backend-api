const dbConfig = require("../db.config");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  port: dbConfig.PORT,
  dialect: dbConfig.dialect,
  operatorsAliases: 0,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.products = require("./product.model")(sequelize, Sequelize);
db.stocks = require("./stock.model")(sequelize, Sequelize);
db.cryptoOrders = require("./crypto_order.model")(sequelize, Sequelize);
db.customers = require("./customer.model")(sequelize, Sequelize);

module.exports = db;
