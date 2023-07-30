var express = require("express");
var router = express.Router();
const ProductController = require("../app/controllers/productController");
const middleware = require("../middleware/middleware");
router.get("/", ProductController.index);
// router.get("/collections/:id", ProductController.getProductCategory);
router.get("/search", ProductController.search);
router.get("/:id",  ProductController.show);
router.post("/store", ProductController.store);
router.post("/update", ProductController.update);
router.delete("/delete/:id", ProductController.remove);
module.exports = router;

