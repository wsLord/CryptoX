const { validationResult } = require("express-validator");

const User = require("../../models/user");
const converter = require("../conversions");

const getData = async (req, res, next) => {
	try {
		const user = await User.findById(req.userData.id).populate("wallet");

		let balance = null;
		if (req.body.balance) {
			balance = converter.amountToRupeesPaise(user.wallet.balance);
		}

		let isInWatchList;
		if (req.body.isInWatchList) {
			isInWatchList = user.watchList.includes(req.body.isInWatchList);
		}

		// Required Data
		let response = {
			...(req.body.name && { name: user.name }),
			...(req.body.email && { email: user.email }),
			...(req.body.mobile && { mobile: user.mobile }),
			...(req.body.isEmailVerified && { isEmailVerified: user.isVerified }),
			...(req.body.referralID && { referralID: user.referralID }),
			...(req.body.referredBy && { referredBy: user.referredBy }),
			...(req.body.watchList && { watchList: user.watchList }),
			...(req.body.isInWatchList && { isInWatchList: isInWatchList }),
			...(req.body.balance && { balance: balance }),
		};

		// Sending Required Data
		return res.status(200).json(response);
	} catch (err) {
		return next(new Error("ERR: Unable to retrieve user data."));
	}
};

const updateData = async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return next(new Error("Invalid input provided!"));
	}

	const { name, mobile } = req.body;

	try {
		const userData = await User.findById(req.userData.id);

		userData.name = name;
		userData.mobile = mobile;
		await userData.save();

		return res.status(200).json({
			message: "User Info updated Successfully!",
		});
	} catch (err) {
		return next(new Error("ERR: Unable to update user data."));
	}
};

module.exports.getData = getData;
module.exports.updateData = updateData;
