const CoinGecko = require("coingecko-api");
const CoinGeckoClient = new CoinGecko();

const User = require("../../models/user");
const Transaction = require("../../models/transaction");
const converter = require("../conversions");

const getTransactionList = async (req, res, next) => {
	const count = req.query.count;

	try {
		const user = await User.findById(req.userData.id)
			.populate({
				path: "wallet",
				populate: {
					path: "transactionList",
					select: "-wallet -__v -createdAt -updatedAt",
					populate: [
						{
							path: "addMoney",
							select: "-_id amount status updatedAt",
						},
						{
							path: "buyCoin",
							select: "-_id amount status coinid updatedAt",
						},
						{
							path: "sellCoin",
							select: "-_id amount status coinid updatedAt",
						},
						{
							path: "buyRequest",
							select: "-_id amount status coinid updatedAt",
						},
						{
							path: "sellRequest",
							select: "-_id amount status coinid updatedAt",
						},
						{
							path: "withdrawMoney",
							select: "-_id amount status updatedAt",
						},
					],
				},
			})
			.exec();

		const transactionDataArray = user.wallet.transactionList;
		let transactionDataList = [];

		// Reverse loop so that recent transaction is shown first
		let size = transactionDataArray.length;
		let limit = count ? ((size > count) ? size - count : 0) : 0;
		for (let i = size - 1; i >= limit; i--) {
			let transItem = transactionDataArray[i];
			let tType, tDate, isPlus, tAmount, isSuccess, tStatus, tCoinID, tNextPath;

			if (transItem.category === "add_money") {
				tType = "Add Money";
				tDate = transItem.addMoney.updatedAt;
				isPlus = true;
				isSuccess = transItem.addMoney.status === "SUCCESS";
				tStatus = transItem.addMoney.status;
				tStatus = tStatus.charAt(0) + tStatus.toLowerCase().slice(1);
				tAmount =
					transItem.addMoney.amount.slice(0, -2) +
					"." +
					transItem.addMoney.amount.slice(-2);
				tCoinID = "-";
				tNextPath = "add";
			} else if (transItem.category === "buy_coin") {
				tType = "Buy";
				tDate = transItem.buyCoin.updatedAt;
				isPlus = false;
				isSuccess = transItem.buyCoin.status === "SUCCESS";
				tStatus = transItem.buyCoin.status;
				tStatus = tStatus.charAt(0) + tStatus.toLowerCase().slice(1);
				tAmount =
					transItem.buyCoin.amount.slice(0, -2) +
					"." +
					transItem.buyCoin.amount.slice(-2);
				tCoinID = transItem.buyCoin.coinid;
				tNextPath = "buysell";
			} else if (transItem.category === "sell_coin") {
				tType = "Sell";
				tDate = transItem.sellCoin.updatedAt;
				isPlus = true;
				isSuccess = transItem.sellCoin.status === "SUCCESS";
				tStatus = transItem.sellCoin.status;
				tStatus = tStatus.charAt(0) + tStatus.toLowerCase().slice(1);
				tAmount =
					transItem.sellCoin.amount.slice(0, -2) +
					"." +
					transItem.sellCoin.amount.slice(-2);
				tCoinID = transItem.sellCoin.coinid;
				tNextPath = "buysell";
			} else if (transItem.category === "buy_request") {
				tType = "Buy Request";
				tDate = transItem.buyRequest.updatedAt;
				isPlus = true;
				isSuccess = transItem.buyRequest.status === "SUCCESS";
				tStatus = transItem.buyRequest.status;
				tStatus = tStatus.charAt(0) + tStatus.toLowerCase().slice(1);
				tAmount = "-"; // transItem.buyRequest.amount.slice(0, -2) + "." + transItem.buyRequest.amount.slice(-2);
				tCoinID = transItem.buyRequest.coinid;
				tNextPath = "order";
			} else if (transItem.category === "sell_request") {
				tType = "Sell Request";
				tDate = transItem.sellRequest.updatedAt;
				isPlus = true;
				isSuccess = transItem.sellRequest.status === "SUCCESS";
				tStatus = transItem.sellRequest.status;
				tStatus = tStatus.charAt(0) + tStatus.toLowerCase().slice(1);
				tAmount = "-"; // transItem.sellRequest.amount.slice(0, -2) + "." + transItem.sellRequest.amount.slice(-2);
				tCoinID = transItem.sellRequest.coinid;
				tNextPath = "order";
			} else if (transItem.category === "withdraw_money") {
				tType = "Withdraw Money";
				tDate = transItem.withdrawMoney.updatedAt;
				isPlus = false;
				isSuccess = transItem.withdrawMoney.status === "SUCCESS";
				tStatus = transItem.withdrawMoney.status;
				tStatus = tStatus.charAt(0) + tStatus.toLowerCase().slice(1);
				tAmount =
					transItem.withdrawMoney.amount.slice(0, -2) +
					"." +
					transItem.withdrawMoney.amount.slice(-2);
				tCoinID = "-";
				tNextPath = "withdraw";
			}

			let transactionElement = {
				tID: transItem.id,
				tType,
				tDate,
				isPlus,
				tAmount,
				isSuccess,
				tStatus,
				tCoinID,
				tNextPath,
			};

			transactionDataList.push(transactionElement);
		}

		return res.status(200).json(transactionDataList);
	} catch (err) {
		console.log(err);
		return next(new Error("ERR: Unable to retrieve Transaction List."));
	}
};

const getTransactionData = async (req, res, next) => {
	const transactionID = req.body.tid;
	try {
		const transactionData = await Transaction.findById(transactionID).populate([
			{
				path: "addMoney",
				select: "-_id -wallet -razorpay_signature -razorpay_payment_id -__v",
			},
			{
				path: "buyCoin",
				select: "-_id -wallet -__v",
			},
			{
				path: "sellCoin",
				select: "-_id -wallet -__v",
			},
			{
				path: "buyRequest",
			},
			{
				path: "sellRequest",
			},
			{
				path: "withdrawMoney",
			},
		]);

		let transactionElement = {};

		if (transactionData.category === "add_money") {
			let innerData = transactionData.addMoney.toJSON();
			transactionElement = {
				id: transactionData.id,
				category: transactionData.category,
				isSuccess: innerData.status === "SUCCESS",
				...innerData,
			};
			transactionElement.amount = converter.amountToDecimalString(
				innerData.amount
			);
		} else if (transactionData.category === "buy_coin") {
			let innerData = transactionData.buyCoin.toJSON();
			const { data: coinData } = await CoinGeckoClient.coins.fetch(
				innerData.coinid,
				{
					tickers: false,
					market_data: false,
					community_data: false,
					developer_data: false,
					localization: false,
					sparkline: false,
				}
			);

			transactionElement = {
				id: transactionData.id,
				category: transactionData.category,
				isSuccess: innerData.status === "SUCCESS",
				coinName: coinData.name,
				coinSymbol: coinData.symbol.toUpperCase(),
				...innerData,
			};

			transactionElement.amount = converter.amountToDecimalString(
				innerData.amount
			);
			transactionElement.quantity = converter.quantityToDecimalString(
				innerData.quantity
			);
			transactionElement.price = converter.amountToDecimalString(
				innerData.price
			);
		} else if (transactionData.category === "sell_coin") {
			let innerData = transactionData.sellCoin.toJSON();
			const { data: coinData } = await CoinGeckoClient.coins.fetch(
				innerData.coinid,
				{
					tickers: false,
					market_data: false,
					community_data: false,
					developer_data: false,
					localization: false,
					sparkline: false,
				}
			);

			transactionElement = {
				id: transactionData.id,
				category: transactionData.category,
				isSuccess: innerData.status === "SUCCESS",
				coinName: coinData.name,
				coinSymbol: coinData.symbol.toUpperCase(),
				...innerData,
			};

			transactionElement.amount = converter.amountToDecimalString(
				innerData.amount
			);
			transactionElement.quantity = converter.quantityToDecimalString(
				innerData.quantity
			);
			transactionElement.price = converter.amountToDecimalString(
				innerData.price
			);
		} else if (transactionData.category === "buy_request") {
			// tType = "Buy Request";
			// tDate = transactionData.buyRequest.updatedAt;
			// isPlus = true;
			// isSuccess = transactionData.buyRequest.status === "SUCCESS";
			// tStatus = transactionData.buyRequest.status;
			// tStatus = tStatus.charAt(0) + tStatus.toLowerCase().slice(1);
			// tAmount = "-"; // transactionData.buyRequest.amount.slice(0, -2) + "." + transactionData.buyRequest.amount.slice(-2);
			// tCoinID = transactionData.buyRequest.coinid;
			// tNextPath = "order";
		} else if (transactionData.category === "sell_request") {
			// tType = "Sell Request";
			// tDate = transactionData.sellRequest.updatedAt;
			// isPlus = true;
			// isSuccess = transactionData.sellRequest.status === "SUCCESS";
			// tStatus = transactionData.sellRequest.status;
			// tStatus = tStatus.charAt(0) + tStatus.toLowerCase().slice(1);
			// tAmount = "-"; // transactionData.sellRequest.amount.slice(0, -2) + "." + transactionData.sellRequest.amount.slice(-2);
			// tCoinID = transactionData.sellRequest.coinid;
			// tNextPath = "order";
		} else if (transactionData.category === "withdraw_money") {
			let innerData = transactionData.withdrawMoney;
			transactionElement = {
				id: transactionData.id,
				category: transactionData.category,
				isSuccess: innerData.status === "SUCCESS",
				...innerData,
			};
			transactionElement.amount = converter.amountToDecimalString(
				innerData.amount
			);
		}

		console.log(transactionElement);

		return res.status(200).json(transactionElement);
	} catch (err) {
		console.log(err);
		return next(new Error("ERR: Unable to retrieve Transaction data."));
	}
};

module.exports.getTransactionList = getTransactionList;
module.exports.getTransactionData = getTransactionData;
