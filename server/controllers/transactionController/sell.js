const axios = require("axios");
const User = require("../../models/user");
const Wallet = require("../../models/wallet");
const Portfolio = require("../../models/portfolio");
const Transaction = require("../../models/transaction");

const sell = async (req, res) => {
	if (!req.userData) {
		res.redirect("back");
	}
	let user = await User.findById(req.userData.id);
	if (!user) {
		res.redirect("back");
	}

	let coinId = req.params.id;

	let quantity = BigInt(req.body.quantity);

	let coinData = await axios.get(
		`https://api.coingecko.com/api/v3/coins/${coinId}`
	); //axios by default parses Json response

	let price = BigInt(coinData.data.market_data.current_price.inr * 10000000);

	let portfolioOfUser = await Portfolio.findById(user.portfolioId);

	var quantityOfCoinsOwned;
	var avgPrice;
	var index = 0;
	var found;
	for (a of portfolioOfUser.coinsOwned) {
		if (a.coidId == coinId) {
			quantityOfCoinsOwned = BigInt(a.quantity);
			avgPrice = BigInt(a.priceOfBuy);
			found = "yes";
		}
		if (!found) index = index + 1;
	}

	if (found && quantityOfCoinsOwned >= quantity) {
		portfolioOfUser.coinsOwned.splice(index, 1);
		let newQuantity = quantityOfCoinsOwned - quantity;
		if (newQuantity > 0n) {
			portfolioOfUser.coinsOwned.push({
				coidId: coinId,
				quantity: newQuantity.toString(),
				priceOfBuy: avgPrice,
			});
		}
		await portfolioOfUser.save();
		let WalletOfUser = await Wallet.findById(user.walletId);

		let newBalance = BigInt(WalletOfUser.balance) + price * quantity;

		WalletOfUser.balance = newBalance.toString();
		await WalletOfUser.save();
		try {
			let transac = await Transaction.create({
				category: "sell",
				walletId: WalletOfUser._id,
				quantity: quantity.toString(),
				price: price.toString(),
				// user:user._id,
				// portfolioId:portfolioOfUser._id,
				coinId: coinId,
			});

			return res.status(200).json("transaction complete");
		} catch (err) {
			console.log(err);
			return res.status(500).json("internal server error");
		}
	} else {
		console.log("Insufficient Coins");
		return res.status(405).json("Insufficient Coins");
	}
};

module.exports = sell;
