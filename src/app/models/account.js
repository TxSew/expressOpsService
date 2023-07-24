const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../../config/db");

const Account = sequelize.define("accounts", {
  AccountID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  fistName: { type: DataTypes.STRING },
  lastName: { type: DataTypes.STRING },
  Email: { type: DataTypes.STRING  , unique: true},
  Phone: { type: DataTypes.NUMBER },
  Password: { type: DataTypes.TEXT },
  role: { type: DataTypes.TEXT , allowNull: false, defaultValue: Sequelize.literal("1")},
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
  },
});

module.exports = Account;
