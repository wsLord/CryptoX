const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = new mongoose.Schema({
	name: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	mobile: { type: String, required: true },
	walletId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Wallet",
	},
	portfolioId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Portfolio",
	},
	// image: { type: String, required: true }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
