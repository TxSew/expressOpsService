const { Sequelize } = require("sequelize");
const sequelize = new Sequelize("db_shop", "root", "", {
  host: "localhost",
  dialect: "mysql",
});
module.exports = sequelize;
