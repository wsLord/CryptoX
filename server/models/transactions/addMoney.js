const mongoose = require("mongoose");

const addMoneySchema = new mongoose.Schema(
	{
		wallet: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Wallet",
		},
		amount: {
			type: String,
			required: true,
		},
		status: {
			type: String,
			required: true,
			enum: ["SUCCESS", "UNVERIFIED_SUCCESS", "PENDING", "FAILED"],
		},
		razorpay_payment_id: {
			type: String,
			required: true,
			default: "$$",
		},
		razorpay_order_id: {
			type: String,
			required: true,
			default: "$$",
		},
		razorpay_signature: {
			type: String,
		},
		verified_payment: {
			type: Boolean,
			required: true,
			default: false,
		}
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("addMoney", addMoneySchema);

// STATUS CODE
// 1: SUCCESS/CAPTURED
// 2: PENDING
