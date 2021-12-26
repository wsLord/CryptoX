const { validationResult } = require("express-validator");
const CoinGecko = require("coingecko-api");
const CoinGeckoClient = new CoinGecko();
require("dotenv").config();

const User = require("../../models/user");
const Portfolio = require("../../models/portfolio");
// const Exchange = require("../../models/exchange");
const senderTransaction = require("../../models/transactions/sendCoin");
const receiverTransaction = require("../../models/transactions/receiveCoin");
const Transaction = require("../../models/transaction");

const sendRecieve = async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return next(
			new Error("ERR: Invalid inputs passed, please check your data.")
		);
	}

	try {
		//ChargeForTransaction
		const chargeOfTransaction = BigInt(process.env.SEND_CHARGES * 100);

		//needed values in req.body
		const { coinid: coinId, email: emailOfReciever } = req.body;
		const quantityToSend = BigInt(Math.trunc(req.body.quantity * 10000000));

		//Finding the two Users
		const userSendingCoin = await User.findById(req.userData.id)
			.populate("wallet")
			.populate("portfolio")
			.exec();
		const userRecievingCoin = await User.findOne({
			email: emailOfReciever,
		})
			.populate("portfolio")
			.populate("wallet")
			.exec();
		// console.log(userSendingCoin,userRecievingCoin);

		//Making Sure there is a reciever
		if (!userRecievingCoin) {
			return next(new Error("Incorrect Email provided for reciever"));
		}

		//getting the coinData through api
		const { data: coinData } = await CoinGeckoClient.coins.fetch(coinId, {
			tickers: false,
			community_data: false,
			developer_data: false,
			sparkline: false,
		});

		//getting the current Price
		const currentPrice = BigInt(
			Math.trunc(coinData.market_data.current_price.inr * 100)
		);

		//wallets and portfolios of both users
		const walletOfSender = userSendingCoin.wallet;
		const portfolioOfSender = userSendingCoin.portfolio;
		const walletOfReciever = userRecievingCoin.wallet;
		const portfolioOfReciever = userRecievingCoin.portfolio;

		// Cost in BigInt with 7 extra precision digits
		let tcost = currentPrice * quantityToSend;
		tcost = tcost.toString();

		// Length of tcost must be >= 12 so that transaction is worth Rs.100
		if (tcost.length < 12) {
			const error = new Error(
				"TRANSACTION DECLINED! Value must be atleast Rs. 100"
			);
			error.code = 405;
			return next(error);
		}

		// Cost in paise in BigInt after Trimming last 7 extra digits
		const cost = BigInt(tcost.slice(0, -7));

		// Making sure the cost is atleast greater than the charge
		// console.log(currentPrice,BigInt(tcost),chargeOfTransaction);
		if (cost <= chargeOfTransaction) {
			const error = new Error(
				"TRANSACTION DECLINED! Cost must be greater than Rs. " +
					process.env.SEND_CHARGES +
					" i.e. send charges."
			);
			error.code = 405;
			return next(error);
		}

		//Finding the Money For transactions that
		const moneyForReciever = cost - chargeOfTransaction;
		const moneyForAdmin = chargeOfTransaction;

		//Finding Quantity of coins To Buy By Admin precise to 7 digs
		const quantityRecievedByAdmin = (moneyForAdmin * 10000000n) / currentPrice;

		//Finding Quantity of coins To Buy By Reciever
		const quantityRecievedByReciever = quantityToSend - quantityRecievedByAdmin;

		//Creating Transaction Instance
		let transactionInstance = await Transaction.create({
			category: "send_receive",
			wallet: walletOfSender.id,
			sendCoin: null,
			receiveCoin: null,
		});

		// Creating Sender And Reciever Transaction Instance
		let senTrans = await senderTransaction.create({
			wallet: walletOfSender.id,
			to: emailOfReciever,
			coinid: coinId,
			amount: cost.toString(),
			price: currentPrice.toString(),
			quantitySent: quantityToSend.toString(),
			chargedQuantity: quantityRecievedByAdmin.toString(),
			chargedMoney: moneyForAdmin.toString(),
			status: "PENDING",
		});
		let recTrans = await receiverTransaction.create({
			wallet: walletOfReciever.id,
			from: userSendingCoin.email,
			coinid: coinId,
			amount: moneyForReciever.toString(),
			price: currentPrice.toString(),
			quantityRecieved: quantityRecievedByReciever.toString(),
			status: "PENDING",
		});

		//Linking Sender and Reciever to Transaction Instance
		transactionInstance.sendCoin = senTrans.id;
		transactionInstance.receiveCoin = recTrans.id;
		await transactionInstance.save();

		walletOfSender.transactionList.push(transactionInstance.id);
		await walletOfSender.save();
		walletOfReciever.transactionList.push(transactionInstance.id);
		await walletOfReciever.save();

		// Checking if coin is already existent in Portfolio and getting its index
		let oldQuantity;
		let avgPrice;

		let coinIndex = portfolioOfSender.coinsOwned.findIndex((tcoin) => {
			if (tcoin.coinid === coinId) {
				oldQuantity = BigInt(tcoin.quantity);
				avgPrice = BigInt(tcoin.priceOfBuy);
				return true;
			}
			return false;
		});

		//In case of Insufficient coins In portfolio
		// console.log(BigInt(oldQuantity),quantityToSend);
		if (coinIndex === -1 || oldQuantity < quantityToSend) {
			senTrans.status = "FAILED";
			senTrans.statusMessage = "Insufficient Coins in Assets";
			await senTrans.save();

			recTrans.status = "FAILED";
			recTrans.statusMessage = "Insufficient Coins in Assets of Sender";
			await recTrans.save();

			const error = new Error(
				"TRANSACTION DECLINED! Quantity of coin is Not Sufficient"
			);
			error.code = 405;
			return next(error);
		}

		//Now transaction is possible

		//Updating Portfolio of Sender
		portfolioOfSender.coinsOwned.splice(coinIndex, 1);
		let newQuantity = oldQuantity - quantityToSend;
		if (newQuantity > 0n) {
			portfolioOfSender.coinsOwned.push({
				coinid: coinId,
				quantity: newQuantity.toString(),
				priceOfBuy: avgPrice,
			});
		}
		await portfolioOfSender.save();

		//Updating portfolio of Recievers
		coinIndex = portfolioOfReciever.coinsOwned.findIndex((tcoin) => {
			if (tcoin.coinid === coinId) {
				oldQuantity = BigInt(tcoin.quantity);
				oldAvgPrice = BigInt(tcoin.priceOfBuy);
				return true;
			}
			return false;
		});

		// coinIndex is -1 if not found
		if (coinIndex >= 0) {
			let newQuantity = oldQuantity + quantityRecievedByReciever;
			let newAvgPrice =
				(oldAvgPrice * oldQuantity +
					quantityRecievedByReciever * currentPrice) /
				newQuantity;

			portfolioOfReciever.coinsOwned[coinIndex].quantity =
				newQuantity.toString();
			portfolioOfReciever.coinsOwned[coinIndex].priceOfBuy =
				newAvgPrice.toString();
		} else {
			portfolioOfReciever.coinsOwned.push({
				coinid: coinId,
				quantity: quantityRecievedByReciever.toString(),
				priceOfBuy: currentPrice.toString(),
			});
		}
		await portfolioOfReciever.save();

		senTrans.status = "SUCCESS";
		recTrans.status = "SUCCESS";
		await senTrans.save();
		await recTrans.save();

		return res.status(200).json({
			success: true,
			message: "Transaction complete",
			transactionID: transactionInstance.id,
		});
	} catch (err) {
		console.log("Error in SendRecieve, Err:", err);
		return next(new Error("Error in SendRecieve"));
	}
};

const verifyUser = async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return next(
			new Error("ERR: Invalid inputs passed, please check your data.")
		);
	}

	const email = req.body.email;

	try {
		const userData = await User.findOne({ email: email });

		// If found
		if (userData) {
			return res.status(200).json({
				isFound: true,
				name: userData.name,
				message: "User Found!",
			});
		} else {
			return res.status(200).json({
				isFound: false,
				message: "No such user found!",
			});
		}
	} catch (err) {
		return next(new Error("ERR: Unable to verify user. Please try again!"));
	}
};

module.exports.verifyUser = verifyUser;
module.exports.sendRecieve = sendRecieve;
