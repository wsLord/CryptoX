const { validationResult } = require("express-validator");

const User = require("../models/user");

const signup = async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return next(
			new HttpError("Invalid inputs passed, please check your data.", 422)
		);
	}

	const { name, email, password } = req.body;

	let existingUser;
	try {
		existingUser = await User.findOne({ email: email });
	} catch (err) {
		const error = new HttpError(
			"Signing up failed, please try again later.",
			500
		);
		return next(error);
	}

	if (existingUser) {
		const error = new HttpError(
			"User exists already, please login instead.",
			422
		);
		return next(error);
	}

	const createdUser = new User({
		name,
		email,
		password,
	});

	try {
		await createdUser.save();
	} catch (err) {
		const error = new HttpError(
			"Signing up failed, please try again later.",
			500
		);
		return next(error);
	}

	res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

const login = async (req, res, next) => {
	const { email, password } = req.body;

	let existingUser;
	try {
		existingUser = await User.findOne({ email: email });
	} catch (err) {
		const error = new HttpError(
			"Loggin in failed, please try again later.",
			500
		);
		return next(error);
	}

	if (!existingUser || existingUser.password !== password) {
		const error = new HttpError(
			"Invalid credentials, could not log you in.",
			401
		);
		return next(error);
	}

	res.json({
		message: "Logged in!",
		user: existingUser.toObject({ getters: true }),
	});
};

// module.exports.profile = (req,res)=>{
//     return res.end('<h1>User Profile</h1>');
// }

exports.signup = signup;
exports.login = login;
