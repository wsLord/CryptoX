const CoinGecko = require("coingecko-api");
const CoinGeckoClient = new CoinGecko();

const User = require("../../models/user");
const Transaction = require("../../models/transaction");

const buy = async (req, res, next) => {
	let coinId = req.body.id;
	let quantity = BigInt(req.body.quantity);

	try {
		let user = await User.findById(req.userData.id)
			.populate("wallet")
			.populate("portfolio")
			.exec();

		let { data: coinData } = await CoinGeckoClient.coins.fetch(coinId);

		let price = BigInt(coinData.market_data.current_price.inr * 10000000);

		let walletOfUser = user.wallet;
		let portfolioOfUser = user.portfolio;

		console.log(BigInt(walletOfUser.balance));

		if (BigInt(walletOfUser.balance) < price * quantity) {
			console.log("Insufficient Balance");

			const err = new Error("Insufficient funds in wallet!");
			err.code = 405;
			return next(err);
		}

		let newBalance = BigInt(walletOfUser.balance) - price * quantity;
		walletOfUser.balance = newBalance.toString();
		await walletOfUser.save();

		let quantityBought;
		let avgPrice;
		let index = 0;
		let found;
		for (a of portfolioOfUser.coinsOwned) {
			if (a.coidId == coinId) {
				quantityBought = BigInt(a.quantity);
				avgPrice = BigInt(a.priceOfBuy);
				found = "yes";
			}
			if (!found) index = index + 1;
		}

		if (found) {
			let newAvgPrice =
				(avgPrice * quantityBought + price * quantity) /
				(quantityBought + quantity);
			let newQuantity = quantityBought + quantity;
			portfolioOfUser.coinsOwned[index].quantity = newQuantity.toString();
			portfolioOfUser.coinsOwned[index].priceOfBuy = newAvgPrice.toString();
		} else {
			portfolioOfUser.coinsOwned.push({
				coidId: coinId,
				quantity: quantity.toString(),
				priceOfBuy: price.toString(),
			});
		}
		await portfolioOfUser.save();

		let currTransaction = await Transaction.create({
			category: "buy",
			walletId: walletOfUser._id,
			quantity: quantity.toString(),
			price: price.toString(),
			coinId: coinId,
		});
		return res
			.status(200)
			.json({
				message: "Transaction complete",
				transactionID: currTransaction.id,
			});
	} catch (err) {
		const error = new Error("Some error occured. Details: " + err.message);
		error.code = 405;
		return next(error);
	}
};

module.exports = buy;
