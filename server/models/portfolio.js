const mongoose = require("mongoose");
const portfolioSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
		coinsOwned: [
			{
				coidId: {
					type: String,
					required: true,
				},
				quantity: {
					type: String,
					required: true,
				},
				priceOfBuy: {
					type: String,
					required: true,
				},
			},
		],
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("Portfolio", portfolioSchema);
