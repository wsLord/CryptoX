const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const User = require("../models/user");

const axios = require("axios");
const Wallet = require("../models/wallet");
const Portfolio = require("../models/portfolio");
const Transaction = require("../models/transaction");

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
module.exports.portfolio = async (req, res) => {
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
module.exports.addToWatchList = async (req, res) => {
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
