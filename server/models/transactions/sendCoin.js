const mongoose = require("mongoose");

const sendCoinSchema = new mongoose.Schema(
	{
		wallet: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Wallet",
		},
		coinid: {
			type: String,
			required: true,
		},
		// Total price of quantity being sent
		amount: {
			type: String,
			required: true,
		},
		// Price per coin at transaction time
		price: {
			type: String,
			required: true,
		},
		// Total quantity being sent
		quantitySent: {
			type: String,
			required: true,
		},
		// Quantity charged as Transaction fee
		chargedQuantity: {
			type: String,
			required: true,
		},
		// Transaction fee cost (chargedQuantity in Rupees)
		chargedMoney: {
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

module.exports = mongoose.model("sendCoin", sendCoinSchema);
