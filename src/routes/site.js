var express = require("express");
const productController = require("../app/controllers/productController");
const middleware = require("../middleware/middleware");
var router = express.Router();
router.get("/", (req, res)=> {
     res.json('home page')
});
router.get("/collections", productController.sortPage)

module.exports = router;
