const mongoose = require("mongoose");

const buyLimitSchema = new mongoose.Schema(
	{
		wallet: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Wallet",
		},
		coinid: {
			type: String,
			required: true,
		},
		amount: {
			type: String,
			required: true,
		},
		// 1 means limit order from the main market and 2 means limit order from the user in the app itself
		mode: {
			type: String,
			required: true,
		},
		price: {
			type: String,
			required: true,
		},
		maxPrice: {
			type: String,
			required: true,
		},
		quantity: {
			type: String,
			required: true,
		},
		status: {
			type: String,
			required: true,
			enum: ["SUCCESS", "PENDING", "FAILED"],
		},
		statusMessage: {
			type: String,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("buyLimit", buyLimitSchema);
