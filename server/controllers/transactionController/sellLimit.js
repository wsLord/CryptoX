const User = require("../../models/user");
const SellRequest = require("../../models/transactions/sellRequest");
const sellLimit = async (req, res) => {
	if (!req.userData) {
		return res.status(404).json('not authorized');
	}
	try{
		let user = await User.findById(req.userData.id);
		
		let minpri = BigInt(req.body.minPrice * 100);
		console.log(minpri.toString());
		console.log(user);
		let quantity=BigInt(Math.floor(req.body.quantity*10000000));
		let newRequest = await SellRequest.create({
			coinId: req.body.coinId,
			from: user.wallet,
			quantity: quantity.toString(),
			mode: req.body.mode,
			minPrice: minpri.toString(),
			portfolioId:user.portfolio,
		});
		console.log(newRequest);
		return res.status(200).json('sellLimit order registered');
		
	}catch(err) {
		console.log(err);
		res.json('error in registering sellLimit request.Please retry with proper data');
	}
	
};

module.exports = sellLimit;
