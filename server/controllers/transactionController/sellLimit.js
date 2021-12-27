const User = require("../../models/user");
const Transaction = require("../../models/transaction");
const sellLimitTransaction = require("../../models/transactions/sellLimit");
const SellRequest = require("../../models/transactions/sellRequest");

const sellLimit = async (req, res) => {
	try {
		let { quantity, coinid, minPrice } = req.body;
		//Finding the user
		let user = await User.findById(req.userData.id).populate("wallet");

		//getting the quantity and minPrice
		quantity = BigInt(Math.trunc(quantity * 10000000));
		const minpri = BigInt(Math.trunc(minPrice * 100));

		let transactionInstance = await Transaction.create({
			category: "sell_limit",
			wallet: user.wallet.id,
			sellLimit: null,
		});

		// Creating Buy Coin Transaction Instance
		let sellLimitTransactionInstance = await sellLimitTransaction.create({
			wallet: user.wallet.id,
			coinid: coinid,
			amount: "unspecified",
			mode: "1",
			price: "unspecified",
			minPrice: minpri.toString(),
			quantity: quantity.toString(),
			status: "PENDING",
		});

		//Linking the buyRequest to Transaction
		transactionInstance.sellLimit = sellLimitTransactionInstance.id;
		await transactionInstance.save();

		user.wallet.transactionList.push(transactionInstance.id);
		await user.wallet.save();

		let newRequest = await SellRequest.create({
			coinId: coinid,
			from: user.wallet.id,
			quantity: quantity.toString(),
			mode: "1",
			minPrice: minpri.toString(),
			portfolioId: user.portfolio,
			transaction: transactionInstance.id,
			sellLimit: sellLimitTransactionInstance.id,
		});

		return res.status(200).json("sellLimit order registered");
	} catch (err) {
		console.log(err);
		return next(new Error("Error in registering SellLimit request. Please retry."));
	}
};

module.exports = sellLimit;
