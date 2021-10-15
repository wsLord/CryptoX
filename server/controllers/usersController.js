const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require('dotenv').config();

const User = require("../models/user");

const signup = async (req, res, next) => {
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

	const createdUser = new User({
		name,
		email,
		mobile,
		password: hashedPassword,
	});

	try {
		await createdUser.save();
	} catch (err) {
		return next(new Error("Signing up failed, please try again later."));
	}

	let token;
	try {
		token = jwt.sign(
			{ userId: createdUser.id, email: createdUser.email },
			process.env.JWT_PRIVATE_KEY,
			{ expiresIn: "1h" }
		);
	} catch (err) {
		return next(new Error("User Registered! Failed to log in."));
	}

	res
		.status(201)
		.json({
			message: "Logged in!",
			userId: createdUser.id,
			email: createdUser.email,
			token: token,
		});
};

const login = async (req, res, next) => {
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

exports.signup = signup;
exports.login = login;
