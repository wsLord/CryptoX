const mongoose = require("mongoose");

const receiveCoinSchema = new mongoose.Schema(
	{
		wallet: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Wallet",
		},
		from: {
			type: String,
			required: true,
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
		// Quantity received by user
		quantityRecieved: {
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
		note: {
			type: String,
		}
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("receiveCoin", receiveCoinSchema);
