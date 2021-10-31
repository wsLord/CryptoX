const axios = require("axios");
const User = require("../../models/user");
const Portfolio = require("../../models/portfolio");
const Exchange = require("../../models/exchange");

const exchange = async () => {
	if (!req.userData) {
		res.redirect("back");
	}
	let user = await User.findById(req.userData);
	if (!user) {
		res.redirect("back");
	}
	let coinIdToSell = req.body.sellCoin;
	let coinIdToBuy = req.body.buyCoin;

	let coinDataSell = await axios.get(
		`https://api.coingecko.com/api/v3/coins/$(coinIdToSell)`
	); //axios by default parses Json response
	let coinDataBuy = await axios.get(
		`https://api.coingecko.com/api/v3/coins/$(coinIdToBuy)`
	);
	let priceOfBuyCoin = BigInt(
		coinDataBuy.market_data.current_price.inr * 10000000
	);
	let priceOfSellCoin = BigInt(
		coinDataSell.market_data.current_price.inr * 10000000
	);

	// let portfolioOfUser=await Portfolio.findById(user.portfolioId);

	//sellPart
	let quantity = BigInt(req.body.quantity);

	let portfolioOfUser = await Portfolio.findById(user.portfolioId);

	var quantityOfCoinsOwned;
	var avgPrice;
	var index;

	for (a of portfolioOfUser.coinsOwned) {
		if (a.coinId == coinIdToSell) {
			quantityOfCoinsOwned = BigInt(a.quantity);
			avgPrice = a.priceOfBuy;
			index = portfolioOfUser.coinsOwned.findIndex(a);
		}
	}
	if (index && quantityOfCoinsOwned >= quantity) {
		portfolioOfUser.coinsOwned.slice(index, 1);
		let newQuantity = quantityOfCoinsOwned - quantity;
		if (newQuantity > 0n) {
			portfolioOfUser.coinsOwned.push({
				coidId: coinIdToSell,
				quantity: newQuantity.toString(),
				priceOfBuy: avgPrice,
			});
		}
		// await portfolioOfUser.save();

		let MoneyHeld = priceOfSellCoin * quantity;
		// let charge=MoneyHeld-

		let quantityBoughtAgain = MoneyHeld / priceOfBuyCoin;

		for (a of portfolioOfUser.coinsOwned) {
			if (a.coidId == coinIdToBuy) {
				quantityBought = a.quantity;
				avgPrice = a.priceOfBuy;
				index = portfolioOfUser.coinsOwned.findIndex(a);
			}
		}
		if (index) {
			portfolioOfUser.coinsOwned.slice(index, 1);
			let newAvgPrice =
				(avgPrice * quantityBought + MoneyHeld) /
				(quantityBought + quantityBoughtAgain);
			let newQuantity = quantityBought + quantityBoughtAgain;
			portfolioOfUser.coinsOwned.push({
				coidId: coinIdToBuy,
				quantity: newQuantity.toString(),
				priceOfBuy: newAvgPrice.toString(),
			});
		} else {
			portfolioOfUser.coinsOwned.push({
				coidId: coinIdToBuy,
				quantity: quantityBoughtAgain.toString(),
				priceOfBuy: priceOfBuyCoin.toString(),
			});
		}
		await portfolioOfUser.save();

		try {
			let xchange = await Exchange.create({
				walletId: user.walletId,
				quantitySold: quantity,
				quantityBought: quantityBoughtAgain,
				coinIdSold: coinIdToSell,
				coinIdBought: coinIdToBuy,
			});

			return res.redirect("back");
		} catch (err) {
			console.log("error", err);
			return;
		}
	} else {
		console.log("the transaction is not possible");
		res.redirect("back");
	}
};

module.exports = exchange;
