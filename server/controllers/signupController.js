const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const shortuid = require("short-unique-id");

const User = require("../models/user");
const emailVerifyTokenSender = require("../middlewares/emailToken");

const signupController = async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return next(new Error("Invalid inputs passed, please check your data."));
	}

	const { name, email, mobile, password } = req.body;

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

	const shortUIDGenerator = new shortuid({ length: 5, dictionary: 'alphanum_upper' });
	let referralCode = shortUIDGenerator();

	const createdUser = new User({
		name,
		email,
		mobile,
		password: hashedPassword,
		referralID: referralCode
	});

	try {
		await createdUser.save();
	} catch (err) {
		return next(new Error("Signing up failed, please try again later."));
	}

	//Mail Verification
	let info = await emailVerifyTokenSender(createdUser, req.headers.host);

	res.status(201).json({
		message: "Registered & a verification email has been sent.",
		userId: createdUser.id,
		email: createdUser.email,
		mailinfo: info.messageId,
	});
};

module.exports = signupController;
