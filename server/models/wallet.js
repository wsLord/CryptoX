const mongoose = require("mongoose");

const walletTransactionSchema = require("./walletTransaction");

const walletSchema = new mongoose.Schema(
	{
		balance: {
			type: String,
			required: true,
		},
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
		walletTransactionsList: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "WalletTransaction",
			}
		],
		transactionList: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Transaction",
			},
		],
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("Wallet", walletSchema);
