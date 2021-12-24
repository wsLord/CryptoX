const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("../../models/user");

const changePassword = async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return next(new Error("New Password must be of length 6."));
	}

	const { oldPassword, newPassword } = req.body;

	try {
		const userData = await User.findById(req.userData.id);
		let isValidPassword = await bcrypt.compare(oldPassword, userData.password);

		if (!isValidPassword) {
			return next(new Error("Wrong Password! Please try again."));
		}

		let hashedPassword = await bcrypt.hash(newPassword, 12);

		// Updating password and saving the user
		userData.password = hashedPassword;
		try {
			await userData.save();
		} catch (err) {
			console.log(err);
			return next(new Error("ERR: Unable to reset. Please try later."));
		}

		res.status(201).json({
			message: "Password reset successfull.",
		});
	} catch (err) {
		console.log(err);
		return next(new Error("Could not reset password, please try again."));
	}
};

module.exports = changePassword;
