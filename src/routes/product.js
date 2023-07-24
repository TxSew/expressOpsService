var express = require("express");
var router = express.Router();
const ProductController = require("../app/controllers/productController");
router.get("/", ProductController.index);
router.get("/collections/:id", ProductController.getProductCategory);
router.get("/:id", ProductController.show);
router.post("/store", ProductController.store);
router.delete("/delete", ProductController.remove);
module.exports = router;

