const User = require("../../models/user");
const BuyRequest = require("../../models/transactions/buyRequest");

const buyLimit = async (req, res, next) => {
	try {
		let user = await User.findById(req.userData.id);

		let maxpri = BigInt(req.body.maxPrice * 100);
		let quantity = BigInt(Math.floor(req.body.quantity * 10000000));
		let newRequest = await BuyRequest.create({
			coinId: req.body.coinId,
			from: user.wallet,
			quantity: quantity.toString(),
			mode: "1",
			maxPrice: maxpri.toString(),
			portfolioId: user.portfolio,
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
