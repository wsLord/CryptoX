const User = require("../../models/user");
const BuyRequest = require("../../models/transactions/buyRequest");
const Transaction = require("../../models/transaction");
const buyLimitTransaction = require("../../models/transactions/buyLimit");

const buyLimit = async (req, res, next) => {
	try {
		let { quantity, coinid, maxPrice } = req.body;
		//Finding the user
		let user = await User.findById(req.userData.id).populate("wallet");

		//getting the quantity and maxPrice
		quantity = BigInt(Math.trunc(quantity * 10000000));
		maxPrice = BigInt(Math.trunc(maxPrice * 100));

		let transactionInstance = await Transaction.create({
			category: "buy_limit",
			wallet: user.wallet.id,
			buyLimit: null,
		});

		// Creating Buy Coin Transaction Instance
		let buyLimitTransactionInstance = await buyLimitTransaction.create({
			wallet: user.wallet.id,
			coinid: coinid,
			amount: "unspecified",
			mode: "1",
			price: "unspecified",
			maxPrice: maxPrice.toString(),
			quantity: quantity.toString(),
			status: "PENDING",
		});

		//Linking the buyRequest to Transaction
		transactionInstance.buyLimit = buyLimitTransactionInstance.id;
		await transactionInstance.save();

		user.wallet.transactionList.push(transactionInstance.id);
		await user.wallet.save();

		let newRequest = await BuyRequest.create({
			coinId: coinid,
			from: user.wallet.id,
			quantity: quantity.toString(),
			mode: "1",
			maxPrice: maxPrice.toString(),
			portfolioId: user.portfolio,
			transaction: transactionInstance.id,
			buyLimit: buyLimitTransactionInstance.id,
		});

		return res.status(200).json("buyLimit order registered");
	} catch (err) {
		console.log(err);
		return next(new Error("Error in registering BuyLimit request. Please retry."));
	}
};

module.exports = buyLimit;
