const mongoose = require("mongoose");

const portfolioSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
		coinsOwned: [
			{
				coinid: {
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
				_id: false,
			},
		],
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("Portfolio", portfolioSchema);
