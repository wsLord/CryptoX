const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
	{
		category: {
			type: String,
			required: true,
		},
		walletId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Wallet",
			required: true,
		},
		addMoney: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "addMoney",
		},
		buyCoin: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "buyCoin",
		},
		sellCoin: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "sellCoin",
		},
		buyRequest: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "buyRequest",
		},
		sellRequest: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "sellRequest",
		},
		withdrawMoney: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "withdrawMoney",
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("Transaction", transactionSchema);
