const { validationResult } = require("express-validator");
const CoinGecko = require("coingecko-api");
const CoinGeckoClient = new CoinGecko();

const User = require("../../models/user");
const Transaction = require("../../models/transaction");
const sellCoinTransaction = require("../../models/transactions/sellCoin");
const converter = require("../conversions");

const sellQuantity = async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return next(
			new Error("ERR: Invalid inputs passed, please check your data.")
		);
	}
	const coinid = req.body.coinid;

	// Quantity precise to 7 places
	const quantity = BigInt(Math.trunc(req.body.quantity * 10000000));

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
			Math.trunc(coinData.market_data.current_price.inr * 100)
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

		let oldQuantity;
		let avgPrice;
		// Checking if coin is already existent in Portfolio and getting its index
		let coinIndex = portfolioOfUser.coinsOwned.findIndex((tcoin) => {
			if (tcoin.coinid === coinid) {
				oldQuantity = BigInt(tcoin.quantity);
				avgPrice = BigInt(tcoin.priceOfBuy);
				return true;
			}
			return false;
		});

		// Declining transaction when coin doesn't exist
		if (coinIndex === -1) {
			const error = new Error("TRANSACTION DECLINED! Quantity of coin is 0.");
			error.code = 405;
			return next(error);
		}

		// Creating Transaction Instance
		let transactionInstance = await Transaction.create({
			category: "sell_coin",
			wallet: walletOfUser.id,
			sellCoin: null,
		});

		// Creating Buy Coin Transaction Instance
		let sellCoinTransactionInstance = await sellCoinTransaction.create({
			wallet: walletOfUser.id,
			coinid: coinid,
			amount: cost.toString(),
			price: price.toString(),
			quantity: quantity.toString(),
			status: "PENDING",
		});

		// Linking Transaction Instance to Add Money Transaction Instance
		transactionInstance.sellCoin = sellCoinTransactionInstance.id;
		await transactionInstance.save();

		walletOfUser.transactionList.push(transactionInstance.id);
		await walletOfUser.save();

		if (oldQuantity < quantity) {
			console.log("Insufficient Coins");

			try {
				sellCoinTransactionInstance.status = "FAILED";
				sellCoinTransactionInstance.statusMessage =
					"Insufficient coins in assets.";
				await sellCoinTransactionInstance.save();
			} catch (err) {
				const error = new Error("Some error occured. Details: " + err.message);
				error.code = 405;
				return next(error);
			}

			return res.status(200).json({
				success: false,
				message: "ERR: Insufficient coins in assets.",
				transactionID: transactionInstance.id,
			});
		}

		let newBalance = BigInt(walletOfUser.balance) + cost;
		walletOfUser.balance = newBalance.toString();
		await walletOfUser.save();

		portfolioOfUser.coinsOwned.splice(coinIndex, 1);
		let newQuantity = oldQuantity - quantity;
		if (newQuantity > 0n) {
			portfolioOfUser.coinsOwned.push({
				coinid: coinid,
				quantity: newQuantity.toString(),
				priceOfBuy: avgPrice,
			});
		}
		await portfolioOfUser.save();

		sellCoinTransactionInstance.status = "SUCCESS";
		await sellCoinTransactionInstance.save();

		return res.status(200).json({
			success: true,
			message: "Transaction complete",
			transactionID: transactionInstance.id,
			quantity: converter.quantityToDecimalString(
				sellCoinTransactionInstance.quantity
			),
			amount: converter.amountToDecimalString(
				sellCoinTransactionInstance.amount
			),
			coinSymbol: coinData.symbol,
		});
	} catch (err) {
		const error = new Error("Some error occured. Details: " + err.message);
		error.code = 405;
		return next(error);
	}
};

const sellAmount = async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return next(
			new Error("ERR: Invalid inputs passed, please check your data.")
		);
	}
	const coinid = req.body.coinid;

	// Amount in paise in BigInt
	const amount = BigInt(Math.trunc(req.body.amount * 100));

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
			Math.trunc(coinData.market_data.current_price.inr * 100)
		);

		const walletOfUser = user.wallet;
		const portfolioOfUser = user.portfolio;

		// Quantity precise to 7 places
		const quantity = (amount * 10000000n) / price;

		// Quantity must be > 0 so that transaction is performed
		if (quantity === 0n) {
			const error = new Error(
				"TRANSACTION DECLINED! Quantity too less to perform transaction"
			);
			error.code = 405;
			return next(error);
		}

		let oldQuantity;
		let avgPrice;
		// Checking if coin is already existent in Portfolio and getting its index
		let coinIndex = portfolioOfUser.coinsOwned.findIndex((tcoin) => {
			if (tcoin.coinid === coinid) {
				oldQuantity = BigInt(tcoin.quantity);
				avgPrice = BigInt(tcoin.priceOfBuy);
				return true;
			}
			return false;
		});

		// Declining transaction when coin doesn't exist
		if (coinIndex === -1) {
			const error = new Error("TRANSACTION DECLINED! Quantity of coin is 0.");
			error.code = 405;
			return next(error);
		}

		// Creating Transaction Instance
		let transactionInstance = await Transaction.create({
			category: "sell_coin",
			wallet: walletOfUser.id,
			sellCoin: null,
		});

		// Creating Buy Coin Transaction Instance
		let sellCoinTransactionInstance = await sellCoinTransaction.create({
			wallet: walletOfUser.id,
			coinid: coinid,
			amount: amount.toString(),
			price: price.toString(),
			quantity: quantity.toString(),
			status: "PENDING",
		});

		// Linking Transaction Instance to Add Money Transaction Instance
		transactionInstance.sellCoin = sellCoinTransactionInstance.id;
		await transactionInstance.save();

		walletOfUser.transactionList.push(transactionInstance.id);
		await walletOfUser.save();

		if (oldQuantity < quantity) {
			console.log("Insufficient Coins");

			try {
				sellCoinTransactionInstance.status = "FAILED";
				sellCoinTransactionInstance.statusMessage =
					"Insufficient coins in assets.";
				await sellCoinTransactionInstance.save();
			} catch (err) {
				const error = new Error("Some error occured. Details: " + err.message);
				error.code = 405;
				return next(error);
			}

			return res.status(200).json({
				success: false,
				message: "ERR: Insufficient coins in assets.",
				transactionID: transactionInstance.id,
			});
		}

		let newBalance = BigInt(walletOfUser.balance) + amount;
		walletOfUser.balance = newBalance.toString();
		await walletOfUser.save();

		portfolioOfUser.coinsOwned.splice(coinIndex, 1);
		let newQuantity = oldQuantity - quantity;
		if (newQuantity > 0n) {
			portfolioOfUser.coinsOwned.push({
				coinid: coinid,
				quantity: newQuantity.toString(),
				priceOfBuy: avgPrice,
			});
		}
		await portfolioOfUser.save();

		sellCoinTransactionInstance.status = "SUCCESS";
		await sellCoinTransactionInstance.save();

		return res.status(200).json({
			success: true,
			message: "Transaction complete",
			transactionID: transactionInstance.id,
			quantity: converter.quantityToDecimalString(
				sellCoinTransactionInstance.quantity
			),
			amount: converter.amountToDecimalString(
				sellCoinTransactionInstance.amount
			),
			coinSymbol: coinData.symbol,
		});
	} catch (err) {
		const error = new Error("Some error occured. Details: " + err.message);
		error.code = 405;
		return next(error);
	}
};

module.exports.sellQuantity = sellQuantity;
module.exports.sellAmount = sellAmount;
