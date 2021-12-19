const CoinGecko = require("coingecko-api");
const CoinGeckoClient = new CoinGecko();

const User = require("../../models/user");
const Transaction = require("../../models/transaction");
const buyCoinTransaction = require("../../models/transactions/buyCoin");

const buy = async (req, res, next) => {
	const coinid = req.body.coinid;
	const quantity = BigInt(req.body.quantity);

	try {
		const user = await User.findById(req.userData.id)
			.populate("wallet")
			.populate("portfolio")
			.exec();

		const { data: coinData } = await CoinGeckoClient.coins.fetch(coinid);

		const price = BigInt(coinData.market_data.current_price.inr * 10000000);

		const walletOfUser = user.wallet;
		const portfolioOfUser = user.portfolio;
		const cost = price * quantity;

		// Creating Transaction Instance
		let transactionInstance = await Transaction.create({
			category: "buy_coin",
			wallet: walletOfUser.id,
			buyCoin: null,
		});

		// Creating Buy Coin Transaction Instance
		let buyCoinTransactionInstance = await buyCoinTransaction.create({
			wallet: walletOfUser.id,
			coinid: coinid,
			amount: cost.toString(),
			price: price.toString(),
			quantity: quantity.toString(),
			status: "PENDING",
		});

		// Linking Transaction Instance to Add Money Transaction Instance
		transactionInstance.buyCoin = buyCoinTransactionInstance.id;
		await transactionInstance.save();

		console.log(BigInt(walletOfUser.balance));

		if (BigInt(walletOfUser.balance) < cost) {
			console.log("Insufficient Balance");

			// const err = new Error("");
			try {
				buyCoinTransactionInstance.status = "FAILED";
				buyCoinTransactionInstance.statusMessage =
					"Insufficient funds in wallet.";
				await buyCoinTransactionInstance.save();
			} catch (err) {
				const error = new Error("Some error occured. Details: " + err.message);
				error.code = 405;
				return next(error);
			}

			return res.status(200).json({
				success: false,
				message: "ERR: Insufficient funds in wallet!",
				transactionID: transactionInstance.id,
			});
		}

		let newBalance = BigInt(walletOfUser.balance) - cost;
		walletOfUser.balance = newBalance.toString();
		await walletOfUser.save();

		let oldQuantity;
		let oldAvgPrice;
		// Checking if coin is already existent in Portfolio and getting its index
		let coinIndex = portfolioOfUser.coinsOwned.findIndex((tcoin) => {
			if (tcoin.coinid === coinid) {
				oldQuantity = BigInt(tcoin.quantity);
				oldAvgPrice = BigInt(tcoin.priceOfBuy);
				return true;
			}
			return false;
		});

		if (coinIndex) {
			let newQuantity = quantityBought + quantity;
			let newAvgPrice = (oldAvgPrice + cost) / newQuantity;

			portfolioOfUser.coinsOwned[coinIndex].quantity = newQuantity.toString();
			portfolioOfUser.coinsOwned[coinIndex].priceOfBuy = newAvgPrice.toString();
		} else {
			portfolioOfUser.coinsOwned.push({
				coinid: coinid,
				quantity: quantity.toString(),
				priceOfBuy: price.toString(),
			});
		}
		await portfolioOfUser.save();

		buyCoinTransactionInstance.status = "SUCCESS";
		await buyCoinTransactionInstance.save();

		return res.status(200).json({
			success: true,
			message: "Transaction complete",
			transactionID: transactionInstance.id,
		});
	} catch (err) {
		const error = new Error("Some error occured. Details: " + err.message);
		error.code = 405;
		return next(error);
	}
};

module.exports = buy;
