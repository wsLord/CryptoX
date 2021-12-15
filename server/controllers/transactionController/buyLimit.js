const User = require("../../models/user");
const BuyRequest = require("../../models/transactions/buyRequest");

const buyLimit = async (req, res) => {
	if (!req.userData) {
		res.redirect("back");
	}
	let user = await User.findById(req.userData);
	if (!user) {
		res.redirect("back");
	}
	let maxpri = BigInt(req.body.maxPrice * 10000000);
	try {
		let newRequest = await BuyRequest.create({
			coinId: req.body.coinId,
			from: user.walletId,
			quantity: req.body.quantity,
			mode: "1",
			maxPrice: maxpri.toString(),
			portfolioId: user.portfolioId,
		});

		return res.redirect("back");
	} catch (err) {
		console.log("error", err);
		res.redirect("back");
	}
};

module.exports = buyLimit;