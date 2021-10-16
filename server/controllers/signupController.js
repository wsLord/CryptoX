const { validationResult } = require("express-validator");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("../models/user");
const emailVerifyToken = require("../models/emailVerifyToken");

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

	//Mail Verification
	const token = new emailVerifyToken({
		userId: createdUser.id,
		token: crypto.randomBytes(16).toString("hex"),
	});

	// Save the verification token
	try {
		await token.save();
	} catch (err) {
		console.log(err);
		return next(
			new Error("Signing up! Email Verification Token generation failed")
		);
	}

	// Send the email
	let transporter = nodemailer.createTransport({
		host: "smtp.mailtrap.io",
		port: 2525,
		auth: {
			user: process.env.MAILTRAP_ID, //generated by Mailtrap
			pass: process.env.MAILTRAP_PWD, //generated by Mailtrap
		}
	});
	let mailOptions = {
		from: `"CryptoX" <${process.env.COMPANY_MAIL}>`,
		to: createdUser.email,
		subject: "Email Verification | CryptoX",
		text:
			"Hey " +
			createdUser.name +
			",\n\n" +
			"Please verify your account by clicking the link: \nhttp://" +
			req.headers.host +
			"/verify/email/" +
			token.token +
			"\n\n\nRegards,\nCryptoX\n\nKeep Minting! :)",
	};

	let info;
	try {
		info = await transporter.sendMail(mailOptions);
	} catch (err) {
		console.log(err);
		return next(new Error("Unable to send Email Verification mail."));
	}

	res.status(201).json({
		message: "Registered & a verification email has been sent.",
		userId: createdUser.id,
		email: createdUser.email,
		mailinfo: info.messageId,
	});
};

module.exports = signupController;