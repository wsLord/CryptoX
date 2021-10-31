const User = require("../../models/user");

const sellLimit = async (req, res) => {
	if (!req.userData) {
		res.redirect("back");
	}
	let user = await User.findById(req.userData);
	if (!user) {
		res.redirect("back");
	}
	let minpri = BigInt(req.body.minPrice * 10000000);
	try {
		let newRequest = await SellRequest.create({
			coinId: req.body.coinId,
			from: user.walletId,
			quantity: req.body.quantity,
			mode: "1",
			minPrice: minpri.toString(),
			portfolioId: user.portfolioId,
		});

		return res.redirect("back");
	} catch (err) {
		console.log("error", err);
		res.redirect("back");
	}
};

module.exports = sellLimit;
