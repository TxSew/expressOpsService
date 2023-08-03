const { Op } = require("sequelize");
const { Sequelize } = require("sequelize");
const sequelize = require("../../config/db");
const Product = require("../models/products");
const NodeCache = require("node-cache");
const { default: slugify } = require("slugify");
const cache = new NodeCache();
class ProductController {
  async index(req, res, next) {
    sequelize
      .query(`SELECT * FROM products ORDER by createdAt DESC LIMIT 10`, {
        replacements: [req.params.id],
        type: Sequelize.QueryTypes.SELECT,
      })
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
  
      // Get the search term from the query parameters
      const searchQuery = req.query.q || ""; // If 'q' parameter is not provided, default to an empty string
  
      // Define the search condition using 'Op.like'
      const searchCondition = {
        // Assuming 'name' is the column you want to search on
        name: {
          [Op.like]: `%${searchQuery}%`, // This will match any product name containing the search query
        },
      };
  
      const products = await Product.findAndCountAll({
        limit: 3,
        offset: offset,
        where: searchCondition, // Apply the search condition to filter products
        order: [['createdAt', 'DESC']],
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
    const { imageUrl, name, price, description, quality, categoryID } = req.body;
    console.log(req.body);
    // Create a new product using the Product model and the provided attributes
    Product.create({
      imageUrl: imageUrl,
      name: name,
      price: price,
      description: description,
      quality: quality,
      categoryID: categoryID,
    })
      .then((product) => {
        res.status(200).json(product);
      })
      .catch((error) => {
        // Handle errors if necessary
        next(error);
      });
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
   async getProductUpdate(req,res,next) {
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
          where: { productID: req.params.id },
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
  async update(req, res, next) {
    console.log(req.body);
    const update = await Product.update(
      {
        imageUrl: req.body.imageUrl,
        name: req.body.name,
        price: req.body.price,
        category: req.body.category,
        quality: req.body.quality,
        description: req.body.description,
      },
      {
        where: { productId: 51 },
      }
    );
    try{
      console.log(update);
        res.status(200).json(update);
    }
     catch(err){
      res.status(501).json({message: err});
     }
  }
  remove(req, res, next) {
    sequelize
      .query(`DELETE FROM products WHERE productID = ?`, {
        replacements: [`${req.params.id}`],
        type: Sequelize.QueryTypes.DELETE,
      })
      .then((data) => {
        const cachedProduct = cache.del(req.params.id);
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
