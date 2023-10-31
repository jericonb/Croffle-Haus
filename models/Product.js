// Dependencies and Modules
const mongoose = require("mongoose");

// Schema/Blueprint
const productSchema =  new mongoose.Schema({
	name : {
		type: String,
		required: [true, "Product is required"]
	},
	description: {
		type: String,
		required: [true, "Description is required"]
	},
	price: {
		type: Number,
		required: [true, "Price is required"]
	},
	isActive: {
		type: Boolean,
		default: true
	},
	createdOn: {
		type: Date,
		default: new Date()
	},
	image: {
		type: String,
		required: [true, "Image is required"]
	},
	userOrders : [
		{
			userId: {
				type: String,
				required: [true, "UserId is required"]
			},
		}
	]
})

module.exports = mongoose.model("Product", productSchema);