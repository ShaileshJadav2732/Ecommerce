import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, "Name is required"],
		},

		photo: {
			type: String,
			required: [true, "Photo is required"],
		},
		price: {
			type: Number,
			required: [true, "Price is required"],
		},

		stock: {
			type: Number,
			required: [true, "Stock is required"],
		},

		category: {
			type: String,
			required: [true, "Category is required"],
			trim: true,
		},
	},
	{ timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
