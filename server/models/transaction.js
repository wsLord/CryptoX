const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
	{
		category: {
			type: String,
			required: true,
			enum: ['add_money', 'withdraw_money', 'buy_coin', 'sell_coin', 'buy_request', 'sell_request','sendRecieve','exchange']
		},
		wallet: {
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
		sender:{
			type: mongoose.Schema.Types.ObjectId,
			ref: "sender",
		},
		reciever:{
			type: mongoose.Schema.Types.ObjectId,
			ref: "reciever",
		},
		exchange:{
			type: mongoose.Schema.Types.ObjectId,
			ref: "exchange",
		}
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("Transaction", transactionSchema);

// Categories
// 1_add_money
// 2_withdraw_money
// 3_buy_coin
// 4_sell_coin
// 5_buy_request
// 6_sell_request