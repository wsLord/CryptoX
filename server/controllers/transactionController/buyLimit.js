const User = require("../../models/user");
const BuyRequest = require("../../models/transactions/buyRequest");
const Transaction = require('../../models/transaction');
const buyLimitTransaction = require("../../models/transactions/buyLimit");
const buyLimit = async (req, res, next) => {
	try {
		let {quantity,coinId,maxPrice} = req.body;
		//Finding  the user
		let user = await User.findById(req.userData.id);

		//getting the quantity and maxPrice 
		quantity = BigInt(Math.floor(parseFloat(quantity).toFixed(7) * 10000000));
		const maxpri = BigInt(Math.floor(
			parseFloat(maxPrice).toFixed(2) * 100
		));

		let transactionInstance = await Transaction.create({
			category: "buy_limit",
			wallet: user.wallet,
			buyLimit: null,
		});
		// Creating Buy Coin Transaction Instance
		let buyLimitTransactionInstance = await buyLimitTransaction.create({
			wallet:user.wallet,
			coinid: coinId,
			amount: 'unspecified',
			mode:"1",
			price: 'unspecified',
			maxPrice: maxpri.toString(),
			quantity: quantity.toString(),
			status: "PENDING",
		});
		//Linking the buyRequest to Transaction
		transactionInstance.buyLimit = buyLimitTransactionInstance.id;
		await transactionInstance.save();


        let newRequest = await BuyRequest.create({
			coinId: coinId,
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
