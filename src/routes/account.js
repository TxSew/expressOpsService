var express = require("express");
var router = express.Router();
const AccountController = require("../app/controllers/accountController");
router.post("/store", AccountController.store);
router.post("/checkUser", AccountController.checkUser);
module.exports = router;
