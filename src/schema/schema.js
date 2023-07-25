const {gql} = require('apollo-server-express')

const typeDefs = gql`
	type clothes {
		productID: ID!
		name: String
		imageUrl:String
	    price:String
		slug:String
	}



	# ROOT TYPE
	type Query {
		getClothes: [clothes!]!
		getClothesOnly(id: ID!): clothes
	}

`

module.exports = typeDefs
