const mongoose = require("mongoose");

const TransactionSchema = require("./transaction");

const walletSchema = new mongoose.Schema(
	{
		// in paise
		balance: {
			type: String,
			required: true,
		},
		referralBalance: {
			type: String,
			required: true,
		},
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
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
