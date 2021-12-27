const mongoose = require("mongoose");

// Only for scheduler to process transactions

const sellRequestSchema = new mongoose.Schema(
	{
		coinId: {
			type: String,
			required: true,
		},
		from: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Wallet",
		},
		//include the ids of comments in an array
		quantity: {
			type: String,
			required: true,
		},
		mode: {
			type: String,
			required: true,
		},
		minPrice: {
			type: String,
			required: true,
		},
		portfolioId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Portfolio",
		},
		transaction: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Transaction",
		},
		sellLimit: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "sellLimit",
		},
	},
	{
		timestamps: true,
	}
);

const SellRequest = mongoose.model("SellRequest", sellRequestSchema);
module.exports = SellRequest;
