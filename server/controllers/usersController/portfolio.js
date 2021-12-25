const { validationResult } = require("express-validator");
const axios = require("axios");

const CoinGecko = require("coingecko-api");
const CoinGeckoClient = new CoinGecko();

const converter = require("../conversions");
const User = require("../../models/user");

const getCoinAssetsData = async (req, res, next) => {
	const coinid = req.params.id;

	try {
		let { data: coinData } = await CoinGeckoClient.coins.fetch(coinid, {
			tickers: false,
			market_data: true,
			community_data: false,
			developer_data: false,
			sparkline: false,
		});
		let userData = await User.findById(req.userData.id).populate("portfolio");

		// Finding coin assets in Portfolio
		let coinAsset = userData.portfolio.coinsOwned.find((tcoin) => {
			return tcoin.coinid === coinid;
		});

		if (!coinAsset) {
			return res.status(201).json({
				isAvailable: false,
				coinData: coinData,
				quantity: "0.00",
			});
		} else {
			// Calculating change Percentage
			let buyPrice = BigInt(coinAsset.priceOfBuy);
			let changePercentage =
				BigInt(
					parseFloat(coinData.market_data.current_price.inr).toFixed(2) * 100
				) - buyPrice;
			changePercentage = Number((changePercentage * 10000n) / buyPrice) / 100;

			return res.status(201).json({
				isAvailable: true,
				coinData: coinData,
				quantity: converter.quantityToDecimalString(coinAsset.quantity),
				purchasePrice: converter.amountToDecimalString(coinAsset.priceOfBuy),
				changePercentage,
			});
		}
	} catch (err) {
		const error = new Error("ERR: Unable to fetch Coin Assets data.");
		error.code = 405;
		return next(error);
	}
};

const getAssetsData = async (req, res, next) => {
	try {
		let userData = await User.findById(req.userData.id).populate("portfolio");

		// Finding coin assets in Portfolio
		let coinArray = userData.portfolio.coinsOwned;
		let coinAssetList = [];

		let sNo = 0;
		for (let index in coinArray) {
			sNo += 1;

			let { data: tcoinData } = await CoinGeckoClient.coins.fetch(
				coinArray[index].coinid,
				{
					tickers: false,
					community_data: false,
					developer_data: false,
					sparkline: false,
				}
			);

			// Calculating change Percentage
			let buyPrice = BigInt(coinArray[index].priceOfBuy);
			let changePercentage =
				BigInt(
					parseFloat(tcoinData.market_data.current_price.inr).toFixed(2) * 100
				) - buyPrice;
			changePercentage = Number((changePercentage * 10000n) / buyPrice) / 100;

			tcoinData.sNo = sNo;
			tcoinData.quantity = converter.quantityToDecimalString(
				coinArray[index].quantity
			);
			tcoinData.purchasePrice = converter.amountToRupeesPaise(
				coinArray[index].priceOfBuy
			);
			tcoinData.currentPrice = converter.marketPriceToRupeesPaise(
				tcoinData.market_data.current_price.inr
			);
			tcoinData.changePercentage = changePercentage;

			coinAssetList.push(tcoinData);
		}

		return res.status(201).json(coinAssetList);
	} catch (err) {
		console.log(err);
		const error = new Error("ERR: Unable to fetch Assets data.");
		error.code = 405;
		return next(error);
	}
};

const getReports = async (req, res, next) => {};

module.exports.getCoinAssetsData = getCoinAssetsData;
module.exports.getAssetsData = getAssetsData;
module.exports.getReports = getReports;
