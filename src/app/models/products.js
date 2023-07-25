const sequelize = require("../../config/db");
const slugify = require('slugify');
const { Sequelize, Model, DataTypes } = require('sequelize');
class Product extends Model {}
Product.init({
      productID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      slug: { type: DataTypes.STRING ,
      unique: true},
      name: { type: DataTypes.STRING },
      imageUrl: { type: DataTypes.STRING },
      price: { type: DataTypes.FLOAT },
      quality: { type: DataTypes.INTEGER },
      description: { type: DataTypes.TEXT },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      }
}, { sequelize, modelName: 'products' });
Product.beforeCreate((product, options) => {
  product.slug = slugify(product.name, { lower: true, strict: true });
});
module.exports = Product
