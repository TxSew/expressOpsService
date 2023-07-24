const Product = require("../app/models/products")

const resolvers = {
	// QUERY
	Query: {
		getClothes: async (parent, args, { mongoDataMethods }) =>
			await mongoDataMethods.getClothesAll(),
		getClothesOnly: async (parent, { id }, { mongoDataMethods }) =>
			await mongoDataMethods.getClothesOne(id),
	},

	// Book: {
	// 	author: async ({ authorId }, args, { mongoDataMethods }) =>
	// 		await mongoDataMethods.getAuthorById(authorId)
	// },


	// MUTATION
	// Mutation: {
	// 	createBook: async (parent, args, { mongoDataMethods }) =>
	// 		await mongoDataMethods.createBook(args)
	// }
}

module.exports = resolvers
