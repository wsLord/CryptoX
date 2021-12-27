const { validationResult } = require("express-validator");
const CoinGecko = require("coingecko-api");
const CoinGeckoClient = new CoinGecko();
require("dotenv").config();

const User = require("../../models/user");
const Portfolio = require("../../models/portfolio");
const Exchange = require("../../models/transactions/exchange");
const exchangeTransaction = require("../../models/transactions/exchange");
const Transaction = require("../../models/transaction");
const converter = require("../conversions");

const exchange = async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return next(new Error("ERR: Invalid inputs passed, please check your data."));
	}

	try {
		//ChargeForTransaction
		const chargeOfTransaction = BigInt(process.env.EXCHANGE_CHARGES * 100);

		//needed values in req.body
		const { coinid1: coinId1, coinid2: coinId2, quantity } = req.body;
		const quantityToExchange = BigInt(Math.trunc(quantity * 10000000));

		//Finding the Users
		const user = await User.findById(req.userData.id)
			.populate("wallet")
			.populate("portfolio")
			.exec();

		// console.log(userSendingCoin,userRecievingCoin);

		//getting the coinData of Both th coins through api
		const { data: coinData } = await CoinGeckoClient.coins.fetch(coinId1, {
			tickers: false,
			community_data: false,
			developer_data: false,
			sparkline: false,
		});
		const { data: coinData2 } = await CoinGeckoClient.coins.fetch(coinId2, {
			tickers: false,
			community_data: false,
			developer_data: false,
			sparkline: false,
		});

		//getting the current Prices
		const currentPrice1 = BigInt(Math.trunc(coinData.market_data.current_price.inr * 100));
		const currentPrice2 = BigInt(Math.trunc(coinData2.market_data.current_price.inr * 100));

		//wallets and portfolio of user
		const walletOfUser = user.wallet;
		const portfolioOfUser = user.portfolio;

		// Cost in BigInt with 7 extra precision digits
		let tcost = currentPrice1 * quantityToExchange;
		tcost = tcost.toString();

		// Length of tcost must be >= 12 so that transaction is worth Rs.100
		if (tcost.length < 12) {
			const error = new Error("TRANSACTION DECLINED! Value must be atleast Rs. 100");
			error.code = 405;
			return next(error);
		}

		// Cost in paise in BigInt after Trimming last 7 extra digits
		const cost = BigInt(tcost.slice(0, -7));

		//Making sure the cost is atleast greater than the charge
		// console.log(currentPrice1, BigInt(tcost), chargeOfTransaction);
		if (cost <= chargeOfTransaction) {
			const error = new Error(
				"TRANSACTION DECLINED! Cost must be greater than Rs. " +
					process.env.EXCHANGE_CHARGES +
					" i.e. exchange charges."
			);
			error.code = 405;
			return next(error);
		}

		//Finding the Money For transactions that
		const moneyForUser = cost - chargeOfTransaction;
		const moneyForAdmin = chargeOfTransaction;

		// //Trimming last 7 extra digits
		// const charge = moneyForAdmin.toString().slice(0, -7);
		// const recMon = moneyForUser.toString().slice(0, -7);

		//Finding Quantity of coins To Buy By Admin precise to 7 digs
		const quantityRecievedByAdmin = (moneyForAdmin * 10000000n) / currentPrice1;

		//Finding Quantity of coins To Buy By User precise to 7 digs
		const quantityRecievedByUser = (moneyForUser * 10000000n) / currentPrice2;

		//Creating Transaction Instance
		let transactionInstance = await Transaction.create({
			category: "exchange",
			wallet: walletOfUser.id,
			exchange: null,
		});

		// Creating Sender And Reciever Transaction Instance
		let excTrans = await exchangeTransaction.create({
			wallet: walletOfUser.id,
			coinid1: coinId1,
			coinid2: coinId2,
			amount: cost.toString(),
			price1: currentPrice1.toString(),
			price2: currentPrice2.toString(),
			quantitySendForExchange: quantityToExchange.toString(),
			quantityRecieved: quantityRecievedByUser.toString(),
			chargedQuantity: quantityRecievedByAdmin.toString(),
			chargedMoney: chargeOfTransaction.toString(),
			status: "PENDING",
		});

		//Linking Sender and Reciever to Transaction Instance
		transactionInstance.exchange = excTrans.id;
		await transactionInstance.save();

		// Checking if coin is already existent in Portfolio and getting its index
		let oldQuantity;
		let avgPrice;

		let coinIndex = portfolioOfUser.coinsOwned.findIndex((tcoin) => {
			if (tcoin.coinid === coinId1) {
				oldQuantity = BigInt(tcoin.quantity);
				avgPrice = BigInt(tcoin.priceOfBuy);
				return true;
			}
			return false;
		});

		//In case of Insufficient coins In portfolio
		// console.log(BigInt(oldQuantity),quantityToSend);
		if (coinIndex === -1 || oldQuantity < quantityToExchange) {
			excTrans.status = "FAILED";
			excTrans.statusMessage = "Insufficient Coins in Assets Of User";
			await excTrans.save();

			return res.status(200).json({
				success: false,
				message: "Quantity of coin is Not Sufficient",
				transactionID: transactionInstance.id,
				status: excTrans.status,
				fromCoinSymbol: coinData.symbol.toUpperCase(),
				totalQuantity: converter.quantityToDecimalString(quantityToExchange.toString()),
				fromCoinName: coinData.name,
				toCoinSymbol: coinData2.symbol.toUpperCase(),
				toCoinQuantity: converter.quantityToDecimalString(quantityToExchange.toString()),
				toCoinName: coinData2.name,
			});
		}

		//Now transaction is possible

		//Updating Portfolio of User

		portfolioOfUser.coinsOwned.splice(coinIndex, 1);
		let newQuantity = oldQuantity - quantityToExchange;
		if (newQuantity > 0n) {
			portfolioOfUser.coinsOwned.push({
				coinid: coinId1,
				quantity: newQuantity.toString(),
				priceOfBuy: avgPrice,
			});
		}
		await portfolioOfUser.save();

		//Updating portfolio of User while recieving
		coinIndex = portfolioOfUser.coinsOwned.findIndex((tcoin) => {
			if (tcoin.coinid === coinId2) {
				oldQuantity = BigInt(tcoin.quantity);
				oldAvgPrice = BigInt(tcoin.priceOfBuy);
				return true;
			}
			return false;
		});

		// coinIndex is -1 if not found
		if (coinIndex >= 0) {
			let newQuantity = oldQuantity + quantityRecievedByUser;
			let newAvgPrice =
				(oldAvgPrice * oldQuantity + quantityRecievedByUser * currentPrice2) / newQuantity;

			portfolioOfUser.coinsOwned[coinIndex].quantity = newQuantity.toString();
			portfolioOfUser.coinsOwned[coinIndex].priceOfBuy = newAvgPrice.toString();
		} else {
			portfolioOfUser.coinsOwned.push({
				coinid: coinId2,
				quantity: quantityRecievedByUser.toString(),
				priceOfBuy: currentPrice2.toString(),
			});
		}
		await portfolioOfUser.save();

		excTrans.status = "SUCCESS";
		await excTrans.save();

		return res.status(200).json({
			success: true,
			message: "Transaction complete",
			transactionID: transactionInstance.id,
			fromCoinSymbol: coinData.symbol.toUpperCase(),
			totalCoinQuantity: converter.quantityToDecimalString(quantityToExchange.toString()),
			fromCoinName: coinData.name,
			toCoinSymbol: coinData2.symbol.toUpperCase(),
			totalQuantity: converter.quantityToDecimalString(quantityToExchange.toString()),
			toCoinName: coinData2.name,
			chargedQuantity: converter.quantityToDecimalString(quantityRecievedByAdmin.toString()),
			chargedMoney: chargeOfTransaction.toString(),
			fromUpdatedQuantity: converter.quantityToDecimalString(newQuantity.toString()),
		});
	} catch (err) {
		console.log("Error in SendRecieve, Err:", err);
		return next(new Error("Error in Exchange"));
	}
};

module.exports = exchange;
