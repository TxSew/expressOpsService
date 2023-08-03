var express = require("express");
const multer = require('multer');
var router = express.Router();
const ProductController = require("../app/controllers/productController");


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/'); // Destination folder for uploaded files
    },
    filename: function (req, file, cb) {
      cb(null,  file.originalname); // File naming
    },
  });
  // Create a multer instance with the specified storage options
 const upload = multer({ storage });

router.get("/", ProductController.index);
// router.get("/collections/:id", ProductController.getProductCategory);
router.get("/search", ProductController.search);
router.get("/getUpdate/:id", ProductController.getProductUpdate);
router.get("/:id",  ProductController.show);
router.post("/store",  ProductController.store);
router.post("/update", ProductController.update);
router.delete("/delete/:id", ProductController.remove);
module.exports = router;

