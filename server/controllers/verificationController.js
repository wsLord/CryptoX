const emailVerifyToken = require("../models/emailVerifyToken");
const emailVerifyTokenSender = require("../middlewares/emailToken");
const referralController = require("../controllers/referralController");

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
				"ERR: We were unable to find a valid token. Your token may have expired."
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

	// Verify and give Referral amount if referred
	try {
		user.isVerified = true;

		// Check and add referral amount
		await referralController.addReferralAmount(user.id);

		await user.save();
	} catch (err) {
		console.log(err);
		return next(new Error("ERR: Unable to verify or Referral Amount Error!"));
	}

	res.status(201).json({
		message: "The account has been verified. Please log in.",
	});
};

const verifyEmailRequest = async (req, res, next) => {
	try {
		//Mail Verification
		let info = await emailVerifyTokenSender(req.userData.id, req.headers.host);

		res.status(201).json({
			message: "Verification email has been sent. Check your mailbox.",
			mailinfo: info.messageId,
		});
	} catch (err) {
		console.log(err);
		return next(new Error("ERR: Unable to send verification mail."));
	}
};

module.exports.verification = verification;
module.exports.verifyEmailRequest = verifyEmailRequest;
