// const newsRouter = require("./news");
const productRouter = require('./product')
const accountRouter = require('./account')
const siteRouter = require('./site')
function route(app) {
  app.use("/accounts",accountRouter);
  app.use("/products",productRouter);
  app.use("/",siteRouter);
}
module.exports = route;