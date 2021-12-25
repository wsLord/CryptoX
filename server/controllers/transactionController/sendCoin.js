const { validationResult } = require("express-validator");

const User = require("../../models/user");

const verifyUser = async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return next(
			new Error("ERR: Invalid inputs passed, please check your data.")
		);
	}

	const email = req.body.email;

	try {
		const userData = await User.findOne({ email: email });

		// If found
		if (userData) {
			return res.status(200).json({
				isFound: true,
				name: userData.name,
				message: "User Found!",
			});
		} else {
			return res.status(200).json({
				isFound: false,
				message: "No such user found!",
			});
		}
	} catch (err) {
		return next(new Error("ERR: Unable to verify user. Please try again!"));
	}
};

module.exports.verifyUser = verifyUser;
