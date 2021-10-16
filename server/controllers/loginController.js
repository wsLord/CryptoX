const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require('dotenv').config();

const User = require("../models/user");

const loginController = async (req, res, next) => {
	const { email, password } = req.body;

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

	let token;
	try {
		token = jwt.sign(
			{ userId: existingUser.id, email: existingUser.email },
			process.env.JWT_PRIVATE_KEY,
			{ expiresIn: "1h" }
		);
	} catch (err) {
		return next(new Error("User Registered! Failed to log in."));
	}

	res.status(201).json({
		message: "Logged in!",
		userId: existingUser.id,
		email: existingUser.email,
		token: token,
	});
};

module.exports = loginController;