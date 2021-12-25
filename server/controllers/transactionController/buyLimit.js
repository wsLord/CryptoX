const User = require("../../models/user");
const BuyRequest = require("../../models/transactions/buyRequest");
const mySchedule = require("../../recurringJobs/transaction");
const {
    PriorityQueue,
    MinPriorityQueue,
    MaxPriorityQueue
  } = require('@datastructures-js/priority-queue');
const buyLimit = async (req, res) => {
	
	if (!req.userData) {
		return res.status(404).json('not authorized');
	}
	try{
		let user = await User.findById(req.userData.id);
		
		let maxpri = BigInt(req.body.maxPrice * 100);
		let quantity = BigInt(Math.floor(req.body.quantity*10000000));
		let newRequest = await BuyRequest.create({
			coinId: req.body.coinId,
			from: user.wallet,
			quantity: quantity.toString(),
			mode: req.body.mode,
			maxPrice: maxpri.toString(),
			portfolioId: user.portfolio,
		});
		console.log(mySchedule);
		mySchedule.entryBuyRequest(newRequest.id);

		return res.status(200).json('buyLimit order registered');
		
	}catch(err) {
		console.log(err);
		res.json('error in registering buyLimit request.Please retry with proper data');
	}
	
};

module.exports = buyLimit;