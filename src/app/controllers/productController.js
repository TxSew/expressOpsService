
const { Sequelize } = require("sequelize");
const sequelize = require("../../config/db");
const Product = require("../models/products");
class ProductController {
  async index(req, res, next) {
    const products = await Product.findAll();
    res.json(products);
    next()
  }
  async show(req, res, next) {
    const products = await Product.findOne({ where: { slug: req.params.id } });
    res.json(products);
    next()
  }
  store(req, res, next) {
    const { name, price, description, categoryID } = req.body
    Product.create({
      name,
      price,
      categoryID,
      description
    })
      .then((data) => {
        res.status(200).json(data)
      })
      .catch((err) => {
        res.json(401).json(err)
      })
    next()
  }

  getProductCategory(req, res, next) {
    sequelize.query(`SELECT * FROM products WHERE categoryID = ?`,
      {
        replacements: [req.params.id],
        type: Sequelize.QueryTypes.SELECT
      })
      .then((data) => {
        if (!data) {
          res.status(403).json('not found')
        }
        else {
          console.log(data)
          res.status(200).json(data)
        }
        next()
      })
      .catch((err) => {
        res.status(401).json('err db', err)
      })
  }
  remove(req, res, next) {
    sequelize.query(`DELETE FROM products WHERE productID = ?`, {
      replacements: [`${req.params.id}`],
      type: Sequelize.QueryTypes.DELETE
    })
      .then((data) => {
        if (!data) {
          res.status(401).json('delete err')
        }
        else {
          console.log(data)
          next()
        }
      })
  }

}
module.exports = new ProductController();
