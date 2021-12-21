const User = require("../../models/user");
const SellRequest = require("../../models/transactions/sellRequest");
const sellLimit = async (req, res) => {
	if (!req.userData) {
		return res.status(404).json('not authorized');
	}
	try{
		let user = await User.findById(req.userData.id);
		
		let minpri = BigInt(req.body.minPrice * 10000000);
		
		let newRequest = await SellRequest.create({
			coinId: req.body.coinId,
			from: user.walletId,
			quantity: req.body.quantity,
			mode: "1",
			minPrice: minpri.toString(),
			portfolioId: user.portfolioId,
		});

		return res.status(200).json('sellLimit order registered');
		
	}catch(err) {
		console.log(err);
		res.json('error in registering sellLimit request.Please retry with proper data');
	}
	
};

module.exports = sellLimit;
