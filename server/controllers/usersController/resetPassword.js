const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const passResetToken = require("../../models/passResetToken");

const resetPassword = async (req, res, next) => {
	const { newPassword, token } = req.body;

	// Find a matching token
	let tokenData;
	try {
		tokenData = await passResetToken
			.findOne({ token: token })
			.populate("userId")
			.exec();
	} catch (err) {
		console.log(err);
		return next(new Error(err.message));
	}

	if (tokenData == null) {
		return next(new Error("Invalid token. Your token may have expired."));
	}

	// If we found a token, accessing the populated matching user
	const user = tokenData.userId;

	let hashedPassword;
	try {
		hashedPassword = await bcrypt.hash(newPassword, 12);
	} catch (err) {
		return next(
			new Error("Could not reset password, please try again. " + err.message)
		);
	}

	// Updating password and saving the user
	user.password = hashedPassword;
	try {
		await user.save();
	} catch (err) {
		console.log(err);
		return next(new Error("Unable to reset. Please try later."));
	}

	res.status(201).json({
		message: "Password reset successfull.",
	});
}

module.exports = resetPassword;