const mongoose = require("mongoose");

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
