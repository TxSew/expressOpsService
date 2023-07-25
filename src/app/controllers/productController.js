const { Sequelize } = require("sequelize");
const sequelize = require("../../config/db");
const Product = require("../models/products");
const NodeCache = require("node-cache");
const cache = new NodeCache();
class ProductController {
  async index(req, res, next) {
    const products = await Product.findAll();
    res.json(products);
    next();
  }
  async show(req, res, next) {
    try {
      const productId = req.params.id;
      console.log(productId);
      // Check if the product details are already cached
      const cachedProduct = cache.get(productId);
      if (cachedProduct) {
        console.log("Data from cache");
        return res.json(cachedProduct);
      } else {
        const product = await Product.findOne({
          where: { slug: req.params.id },
        });
        if (!product) {
          return res.status(404).json({ error: "Product not found" });
        }
        cache.set(productId, product, 20000);
        console.log("Data from database");
        return res.json(product);
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
  //phan trang
   async sortPage (req,res,next) {
        try {
            const page = req.query.page;
            const limit = req.query.limit;
            const offset = (page - 1) * limit;
            const products = await Product.findAndCountAll({
                limit: limit,
                offset: offset,
            });
            res.json(products);
            next();
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Internal server error" });
        }
   }
   // create a new product
  store(req, res, next) {
    const { name, price, description, categoryID } = req.body;
    Product.create({
      name,
      price,
      categoryID,
      description,
    })
      .then((data) => {
        res.status(200).json(data);
      })
      .catch((err) => {
        res.json(401).json(err);
      });
    next();
  }

  getProductCategory(req, res, next) {
    sequelize
      .query(`SELECT * FROM products WHERE categoryID = ?`, {
        replacements: [req.params.id],
        type: Sequelize.QueryTypes.SELECT,
      })
      .then((data) => {
        if (!data) {
          res.status(403).json("not found");
        } else {
          console.log(data);
          res.status(200).json(data);
        }
        next();
      })
      .catch((err) => {
        res.status(401).json("err db", err);
      });
  }
  remove(req, res, next) {
    sequelize
      .query(`DELETE FROM products WHERE productID = ?`, {
        replacements: [`${req.params.id}`],
        type: Sequelize.QueryTypes.DELETE,
      })
      .then((data) => {
        if (!data) {
          res.status(401).json("delete err");
        } else {
          console.log(data);
          next();
        }
      });
  }
}
module.exports = new ProductController();
