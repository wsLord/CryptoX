// const verification = require("express").Router();

const emailVerifyToken = require("../models/emailVerifyToken");


const verification = async (req, res, next) => {
	// Find a matching token
	let tokenData;
	try {
		tokenData = await emailVerifyToken
			.findOne({ token: req.params.tokenID })
			.populate("userId")
			.exec();
	} catch (err) {
		console.log(err);
		return next(new Error(err.message));
	}

	if (tokenData == null) {
		return next(
			new Error(
				"We were unable to find a valid token. Your token may have expired."
			)
		);
	}

	// If we found a token, accessing the populated matching user
	const user = tokenData.userId;
	if (user.isVerified === true) {
		res.status(201).json({
			message: "This user has already been verified.",
		});
	}

	// Verify and save the user
	user.isVerified = true;
	try {
		await user.save();
	} catch (err) {
		console.log(err);
		return next(new Error("Unable to verify. Please try later."));
	}

	res.status(201).json({
		message: "The account has been verified. Please log in.",
	});
}
module.exports.verification = verification;
