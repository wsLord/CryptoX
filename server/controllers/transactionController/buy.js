const { validationResult } = require("express-validator");
const CoinGecko = require("coingecko-api");
const CoinGeckoClient = new CoinGecko();

const User = require("../../models/user");
const Transaction = require("../../models/transaction");
const buyCoinTransaction = require("../../models/transactions/buyCoin");

const buy = async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return next(
			new Error("ERR: Invalid inputs passed, please check your data.")
		);
	}

	const coinid = req.body.coinid;

	// Quantity precise to 7 places
	const quantity = BigInt(parseFloat(req.body.quantity).toFixed(7) * 10000000);

	try {
		const user = await User.findById(req.userData.id)
			.populate("wallet")
			.populate("portfolio")
			.exec();

		const { data: coinData } = await CoinGeckoClient.coins.fetch(coinid, {
			tickers: false,
			community_data: false,
			developer_data: false,
			sparkline: false,
		});

		// Price in Paise
		const price = BigInt(
			parseFloat(coinData.market_data.current_price.inr).toFixed(2) * 100
		);

		const walletOfUser = user.wallet;
		const portfolioOfUser = user.portfolio;

		// Cost in BigInt with 7 extra precision digits
		let tcost = price * quantity;
		tcost = tcost.toString();

		// Length of tcost must be >= 10 so that transaction is worth Re. 1
		if (tcost.length < 10) {
			const error = new Error(
				"TRANSACTION DECLINED! Cost must be atleast Re. 1"
			);
			error.code = 405;
			return next(error);
		}

		// Trimming last 7 extra digits
		tcost = tcost.slice(0, -7);

		// Cost in paise in BigInt
		const cost = BigInt(tcost);

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

		// coinIndex is -1 if not found
		if (coinIndex >= 0) {
			let newQuantity = oldQuantity + quantity;
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
