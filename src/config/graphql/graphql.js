const Book = require('../../app/models/products')
const Account = require('../../app/models/account')
const mongoDataMethods = {
	// getClothesAll: async (condition = null) =>
	// 	condition === null ? await Book.find() : await Book.find(condition),
	getClothesOne: async id =>{
          return await Book.findOne(id)
	},
	getClothesAll: async () => await Book.findAll(),
	createBook: async args => {
		const newBook = new Book(args)
		return await newBook.save()
	}
}

module.exports = mongoDataMethods
