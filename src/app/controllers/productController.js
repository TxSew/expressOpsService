const { Sequelize } = require("sequelize");
const sequelize = require("../../config/db");
const Product = require("../models/products");
const NodeCache = require("node-cache");
const cache = new NodeCache();
class ProductController {
  async index(req, res, next) {
    const products = await Product.findAll();
    try {
      if (products) {
        res.status(200).json(products);
      }
      else {
        res.status(404).json('not found')
      }
    } catch (err) {
      res.status(501).json(err);
    }
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
  async sortPage(req, res, next) {
    console.log("check");
    try {
      const page = req.query.page;
      console.log(page);
      const offset = (page - 1) * 1;
      console.log(offset);
      const products = await Product.findAndCountAll({
        limit: 2,
        offset: offset,
      });
      console.log(products.rows);
      res.json(products);
      next();
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
  // create a new product
  store(req, res, next) {
    const { imageUrl, name, price, description, quality } = req.body;
    console.log(req.body);

    sequelize
    .query(`INSERT INTO products (imageUrl, name, price, quality, description) VALUES (?,?,?,?,?)`, {
            replacements: [imageUrl, name, price, quality, description],
            type: Sequelize.QueryTypes.INSERT,
          })
          .then((result) => {
            res.status(200).json(result)
          })
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
  async update(req, res, next) {
    console.log(req.body);
    const update = await Product.update(
      {
        imageUrl: req.body.imageUrl,
        name: req.body.name,
        price: req.body.price,
        quality: req.body.quality,
        description: req.body.description,
      },
      {
        where: { productId: 14 },
      }
    );
    console.log(update);
  }
  remove(req, res, next) {
    sequelize
      .query(`DELETE FROM products WHERE productID = ?`, {
        replacements: [`${req.params.id}`],
        type: Sequelize.QueryTypes.DELETE,
      })
      .then((data) => {
        res.status(200).json(data);
        next();
      })
      .catch((err) => {
        res.status(401).json("err db", err);
      });
  }
  //search
  search(req, res, next) {
    const searchTerm = req.query.name;
    console.log(searchTerm);
    sequelize
      .query(`SELECT * FROM products WHERE name LIKE '%${searchTerm}%'`)
      .then((response) => {
        if (response) {
          res.status(200).json(response[0]);
        } else {
          res.status(404).json("not found");
        }
      })
      .catch((error) => {
        res.status(500).json({ error: "Error executing query" });
      });
  }
}
module.exports = new ProductController();
