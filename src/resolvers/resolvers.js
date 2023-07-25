const Product = require("../app/models/products");
const Redis = require("ioredis");
const resolvers = {
  // QUERY
  Query: {
    getClothes: async (parent, args, { mongoDataMethods }) => {
      return await mongoDataMethods.getClothesAll();
    },
    getClothesOnly: async (parent, { id }, { mongoDataMethods }) => {
          return await mongoDataMethods.getClothesOne(id);
    }
    },
 };

module.exports = resolvers;
