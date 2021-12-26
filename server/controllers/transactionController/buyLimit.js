const User = require("../../models/user");
const BuyRequest = require("../../models/transactions/buyRequest");
const Transaction = require('../../models/transaction');
const buyLimitTransaction = require("../../models/transactions/buyLimit");
const buyLimit = async (req, res, next) => {
	try {
		//Finding  the user
		let user = await User.findById(req.userData.id);

		//getting the quantity and maxPrice 
		let quantity = BigInt(Math.floor(parseFloat(req.body.quantity).toFixed(7) * 10000000));
		const maxpri = BigInt(Math.floor(
			parseFloat(req.body.maxPrice).toFixed(2) * 100
		));

		let transactionInstance = await Transaction.create({
			category: "buy_request",
			wallet: walletOfUser.id,
			buyRequest: null,
		});
		// Creating Buy Coin Transaction Instance
		let buyLimitTransactionInstance = await buyLimitTransaction.create({
			wallet: walletOfUser.id,
			coinid: coin.id,
			amount: cost.toString(),
			mode:"1",
			price: currentPrice.toString(),
			maxPrice: req.maxPrice,
			quantity: quantity.toString(),
			status: "PENDING",
		});
		//Linking the buyRequest to Transaction
		transactionInstance.buyRequest = buyLimitTransactionInstance.id;
		await transactionInstance.save();


        let newRequest = await BuyRequest.create({
			coinId: req.body.coinId,
			from: user.wallet,
			quantity: quantity.toString(),
			mode: "1",
			maxPrice: maxpri.toString(),
			portfolioId: user.portfolio,
			transaction:transactionInstance.id,
			buyLimit:buyLimitTransactionInstance.id
		});

		
		return res.status(200).json("buyLimit order registered");
	} catch (err) {
		console.log(err);
		res.json(
			"error in registering buyLimit request.Please retry with proper data"
		);
	}
};

module.exports = buyLimit;
