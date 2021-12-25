const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const shortuid = require("short-unique-id");

const User = require("../../models/user");
const Wallet = require("../../models/wallet");
const Portfolio = require("../../models/portfolio");
const emailVerifyTokenSender = require("../../middlewares/emailToken");

const signup = async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return next(new Error("Invalid inputs passed, please check your data."));
	}

	const { name, email, mobile, password, referral } = req.body;

	let existingUser;
	try {
		existingUser = await User.findOne({ email: email });
	} catch (err) {
		return next(new Error("Signing up failed, please try again later."));
	}

	if (existingUser) {
		return next(new Error("User exists already, please login instead."));
	}

	let hashedPassword;
	try {
		hashedPassword = await bcrypt.hash(password, 12);
	} catch (err) {
		return next(
			new Error("Could not create user, please try again." + err.message)
		);
	}

	const shortUIDGenerator = new shortuid({
		length: 5,
		dictionary: "alphanum_upper",
	});
	let referralCode = shortUIDGenerator();

	let referredBy = null;
	if (referral) {
		try {
			const referralUser = await User.findOne({ referralID: referral });

			// Only check if such user found
			if (referralUser) {
				referredBy = referralUser.email;
			}

			// Add money to referred user wallet
			// .........
			// .........
		} catch (err) {
			return next(new Error("Signing up failed, please try again later."));
		}
	}

	const createdUser = new User({
		name,
		email,
		mobile,
		password: hashedPassword,
		referralID: referralCode,
		referredBy: referredBy,
		wallet: null,
		portfolio: null
	});

	let zero = "0";
	let wallet = await Wallet.create({
		balance: zero,
		user: createdUser._id,
	});
	let portfo = await Portfolio.create({
		user: createdUser._id,
	});
	createdUser.wallet = wallet._id;
	createdUser.portfolio = portfo._id;

	try {
		await createdUser.save();
	} catch (err) {
		return next(new Error("Signing up failed, please try again later."));
	}

	//Mail Verification
	let info = await emailVerifyTokenSender(createdUser.id, req.headers.host);

	res.status(201).json({
		message:
			"Registered and verification email has been sent. Check your mailbox.",
		userId: createdUser.id,
		email: createdUser.email,
		mailinfo: info.messageId,
	});
};

module.exports = signup;
