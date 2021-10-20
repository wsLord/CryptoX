const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const shortuid = require("short-unique-id");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const User = require("../models/user");
const axios = require("axios");
const Wallet = require("../models/wallet");
const Portfolio = require("../models/portfolio");
const Transaction = require("../models/transaction");
const emailVerifyTokenSender = require("../middlewares/emailToken");
const passResetToken = require("../models/passResetToken");
const getData = function (portfolioOfUser, coinData) {
	return new Promise((resolve) => {
		let arr = [];
		for (a of portfolioOfUser.coinsOwned) {
			for (b of coinData) {
				if (a.coinId == b.id) {
					arr.push({
						coinName: b.name,
						coinQuantity: a.quantity,
						currentCoinPrice: BigInt(b.current_price * 10000000),
						profit: BigInt(b.current_price * 10000000) - BigInt(a.priceOfBuy),
					});
				}
			}
		}
		resolve(arr);
	});
};
const portfolio = async (req, res) => {
	if (!req.userData) {
		res.redirect("back");
	}
	let user = await User.findById(req.userData);
	if (!user) {
		res.redirect("back");
	}
	let coinData = await axios.get(
		`https://api.coingecko.com/api/v3/coins/markets?vs_currency=inr&order=market_cap_desc&per_page=100&page=1&sparkline=false`
	);
	let portfolioOfUser = await Portfolio.findById(user.portfolioId);
	let arr = await getData(portfolioOfUser, coinData);
	// for(a of portfolioOfUser.coinsOwned) {
	// 	for(b of coinData){
	// 		if(a.coinId==b.id){
	// 			arr.push({
	// 				coinName:b.name,
	// 				coinQuantity:a.quantity,
	// 				currentCoinPrice:BigInt(b.current_price*10000000),
	// 				profit:BigInt(b.current_price*10000000)-BigInt(a.priceOfBuy)
	// 			})
	// 		}
	// 	}
	// }
	// async.eachSeries(portfolioOfUser.coinsOwned,(a)=>{
	// 	async.eachSeries(coinData,(b)=>{
	// 		if(a.coinId==b.id){
	// 			arr.push({
	// 				coinName:b.name,
	// 				coinQuantity:a.quantity,
	// 				currentCoinPrice:BigInt(b.current_price*10000000),
	// 				profit:BigInt(b.current_price*10000000)-BigInt(a.priceOfBuy)
	// 			})
	// 		}
	// 	})
	// })

	res.redirect("back");
};

const addToWatchList = async (req, res) => {
	if (!req.userData) {
		res.redirect("back");
	}
	let user = await User.findById(req.userData);
	if (!user) {
		res.redirect("back");
	}
	let coinId = req.params.id;
	let isPresent = await user.watchList.find((element) => element == coinId);
	if (isPresent) {
		console.log("already present");
		return res.redirect("back");
	}
	user.watchList.push(coinId);
	user.save();
	return res.redirect("back");
};




const login = async (req, res, next) => {
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

const signup = async (req, res, next) => {
	console.log('yaha aya');
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
		referredBy: referredBy
	});

	try {
		await createdUser.save();
	} catch (err) {
		return next(new Error("Signing up failed, please try again later."));
	}

	//Mail Verification
	let info = await emailVerifyTokenSender(createdUser, req.headers.host);

	res.status(201).json({
		message: "Registered and verification email has been sent. Check your mailbox.",
		userId: createdUser.id,
		email: createdUser.email,
		mailinfo: info.messageId
	});
};

const resetPasswordReq = async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return next(new Error("Invalid email, please check your input."));
	}

	const { email } = req.body;

	let bhulakkadUser;
	try {
		bhulakkadUser = await User.findOne({ email: email });
	} catch (err) {
		return next(new Error("Something went wrong! Please try again."));
	}

	if (!bhulakkadUser) {
		return next(new Error("No such user found!"));
	}

	const token = new passResetToken({
		userId: bhulakkadUser.id,
		token: crypto.randomBytes(16).toString("hex"),
	});

	// Save the verification token
	try {
		await token.save();
	} catch (err) {
		console.log(err);
		return next(new Error("Password Reset Token generation failed"));
	}

	// Send the email
	let transporter = nodemailer.createTransport({
		host: "smtp.mailtrap.io",
		port: 2525,
		auth: {
			user: process.env.MAILTRAP_ID, //generated by Mailtrap
			pass: process.env.MAILTRAP_PWD, //generated by Mailtrap
		},
	});

	let mailOptions = {
		from: `"CryptoX" <${process.env.COMPANY_MAIL}>`,
		to: bhulakkadUser.email,
		subject: "Reset Password | CryptoX",
		text:
			"Hey " +
			bhulakkadUser.name +
			",\n\n" +
			"You can reset your account's password by clicking the link: \n" +
			req.header('Referer') +
			"/user/reset/" +
			token.token +
			"\n\nThis link will expire in 10 mins. Ignore the mail if not requested." +
			"\n\n\n\nRegards,\nCryptoX\n\nKeep Minting! :)",
	};

	let info;
	try {
		info = await transporter.sendMail(mailOptions);
	} catch (err) {
		console.log(err);
		return next(new Error("Unable to send Password Reset mail."));
	}

	res.status(200).json({
		message: "Password Reset Email sent!",
		mailinfo: info.messageId,
	});
}
const reset = async (req, res, next) => {
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

module.exports.portfolio = portfolio;
module.exports.addToWatchList = addToWatchList;
module.exports.login = login;
module.exports.signup = signup;
module.exports.resetPasswordReq=resetPasswordReq;
module.exports.reset=reset;