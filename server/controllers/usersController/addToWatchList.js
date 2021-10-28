const { validationResult } = require("express-validator");

const User = require("../../models/user");

const addToWatchList = async (req, res) => {
	if (!req.userData) {
		res.redirect("back");
	}
	let user = await User.findById(req.userData);
	if (!user) {
		res.redirect("back");
	}
	let coinId = req.params.id;
	let isPresent = await user.watchList.find((element) => element == coinId);
	if (isPresent) {
		console.log("already present");
		return res.redirect("back");
	}
	user.watchList.push(coinId);
	user.save();
	return res.redirect("back");
};

module.exports = addToWatchList;