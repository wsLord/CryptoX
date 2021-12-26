const User = require("../../models/user");
const Transaction = require('../../models/transaction');
const sellLimitTransaction = require("../../models/transactions/sellLimit");
const SellRequest = require("../../models/transactions/sellRequest");
const sellLimit = async (req, res) => {
	try{

	let {quantity,coinId,minPrice} = req.body;
	//Finding  the user
	let user = await User.findById(req.userData.id);

	//getting the quantity and maxPrice 
	quantity = BigInt(Math.floor(parseFloat(quantity).toFixed(7) * 10000000));
	const minpri = BigInt(Math.floor(
		parseFloat(minPrice).toFixed(2) * 100
	));

	let transactionInstance = await Transaction.create({
		category: "sell_limit",
		wallet: user.wallet,
		sellLimit: null,
	});
	// Creating Buy Coin Transaction Instance
	let sellLimitTransactionInstance = await sellLimitTransaction.create({
		wallet:user.wallet,
		coinid: coinId,
		amount: 'unspecified',
		mode:"1",
		price: 'unspecified',
		minPrice: minpri.toString(),
		quantity: quantity.toString(),
		status: "PENDING",
	});
	//Linking the buyRequest to Transaction
	transactionInstance.sellLimit = sellLimitTransactionInstance.id;
	await transactionInstance.save();


	let newRequest = await SellRequest.create({
		coinId: coinId,
		from: user.wallet,
		quantity: quantity.toString(),
		mode: "1",
		minPrice: minpri.toString(),
		portfolioId: user.portfolio,
		transaction:transactionInstance.id,
		sellLimit:sellLimitTransactionInstance.id
	});

	
	return res.status(200).json("sellLimit order registered");
	
		
	}catch(err) {
		console.log(err);
		res.json('error in registering sellLimit request.Please retry with proper data');
	}
	
};

module.exports = sellLimit;
