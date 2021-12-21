const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const User = require("../../models/user");
const emailVerifyTokenSender = require("../../middlewares/emailToken");

const login = async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return next(new Error("Invalid inputs passed, please check your data."));
	}

	const { email, password, toRemember } = req.body;

	let existingUser;
	try {
		existingUser = await User.findOne({ email: email });
	} catch (err) {
		return next(new Error("Loggin in failed, please try again later."));
	}

	if (!existingUser) {
		return next(new Error("Invalid credentials, no such user found."));
	}

	let isValidPassword = false;
	try {
		isValidPassword = await bcrypt.compare(password, existingUser.password);
	} catch (err) {
		return next(new Error("Cannot login, please try again."));
	}

	if (!isValidPassword) {
		return next(new Error("Invalid credentials, could not log you in."));
	}

	let info;
	if (!existingUser.isVerified) {
		try {
			//Mail Verification
			info = await emailVerifyTokenSender(existingUser, req.headers.host);
		} catch (err) {
			console.log(err);
		}
		return next(
			new Error(
				"E-mail ID not verified! Check your mailbox and try again."
			)
		);
	}

	let tokenExpireTime = 3600; //seconds
	if(toRemember)
		tokenExpireTime = 7 * 24 * 3600; // 7 days (in seconds)

	let token;
	try {
		token = jwt.sign(
			{ userId: existingUser.id, email: existingUser.email },
			process.env.JWT_PRIVATE_KEY,
			{ expiresIn: tokenExpireTime }
		);
	} catch (err) {
		return next(new Error("User Registered! Failed to log in."));
	}

	res.status(201).json({
		message: "Logged in!",
		userId: existingUser.id,
		email: existingUser.email,
		token: token,
		expiresIn: tokenExpireTime
	});
};

module.exports = login;