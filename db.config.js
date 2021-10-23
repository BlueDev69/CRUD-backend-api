const env = require("./env");

module.exports = {
  HOST: env.host,
  USER: env.username,
  PASSWORD: env.password,
  DB: env.database,
  PORT: env.port,
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
