const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require('dotenv').config();

const User = require("../models/user");

const axios = require('axios');
const Wallet=require('../models/wallet');
const Portfolio = require('../models/portfolio');
const Transaction = require('../models/transaction');

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
const getData = function(portfolioOfUser, coinData){
	return new Promise((resolve) => {
	  let arr=[];    
	  for(a of portfolioOfUser.coinsOwned) {
		 for(b of coinData){
			if(a.coinId==b.id){
				 arr.push({
					coinName:b.name,
					coinQuantity:a.quantity,
					currentCoinPrice:BigInt(b.current_price*10000000),
					profit:BigInt(b.current_price*10000000)-BigInt(a.priceOfBuy)
				  })
			 }
		 }
	  }
	  resolve(arr);
	})
}
module.exports.portfolio= async (req,res)=> {
	if(!req.userData){
        res.redirect('back');
    }
    let user = await User.findById(req.userData);
    if(!user){
        res.redirect('back');
    }
	let coinData = await axios.get(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=inr&order=market_cap_desc&per_page=100&page=1&sparkline=false`);
	let portfolioOfUser=await Portfolio.findById(user.portfolioId);
	let arr=await getData(portfolioOfUser,coinData);
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

	res.redirect('back');

}
module.exports.addToWatchList = async(req,res)=>{
	if(!req.userData){
        res.redirect('back');
    }
    let user = await User.findById(req.userData);
    if(!user){
        res.redirect('back');
    }
	let coinId=req.params.id;
	let isPresent=await user.watchList.find(element=>element==coinId);
	if(isPresent){
		console.log('already present');
		return res.redirect('back');
	}
	user.watchList.push(coinId);
	user.save();
	return res.redirect('back');

}
exports.signup = signup;
exports.login = login;
