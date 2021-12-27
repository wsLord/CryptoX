const CoinGecko = require("coingecko-api");
const CoinGeckoClient = new CoinGecko();

const converter = require("./conversions");

const getData = async (req, res, next) => {
	const { id, listIds } = req.body;

	try {
		if(id) {
			const { data: coinData } = await CoinGeckoClient.coins.fetch(id, {
				tickers: false,
				community_data: false,
				developer_data: false,
				sparkline: false,
			});
	
			// Required Data
			let response = {
				id: id,
				...(req.body.name && { name: coinData.name }),
				...(req.body.symbol && { symbol: coinData.symbol.toUpperCase() }),
				...(req.body.price && { price: converter.marketPriceToDecimalString(coinData.market_data.current_price.inr) }),
				// ...(req.body.isEmailVerified && { isEmailVerified: coinData.isVerified }),
				// ...(req.body.referralID && { referralID: coinData.referralID }),
				// ...(req.body.referredBy && { referredBy: coinData.referredBy }),
				// ...(req.body.watchList && { watchList: coinData.watchList }),
				// ...(req.body.isInWatchList && { isInWatchList: isInWatchList }),
				// ...(req.body.balance && { balance: balance }),
			};
	
			// Sending Required Data
			return res.status(200).json(response);
		}
		else
		{
			let responseArray = [];

			let sz = listIds.length;
			for(let i = 0; i < sz; i++) {
				const coinid = listIds[i];

				const { data: coinData } = await CoinGeckoClient.coins.fetch(coinid, {
					tickers: false,
					community_data: false,
					developer_data: false,
					sparkline: false,
				});
		
				// Required Data
				let responseElement = {
					id: coinid,
					...(req.body.name && { name: coinData.name }),
					...(req.body.symbol && { symbol: coinData.symbol.toUpperCase() }),
					...(req.body.price && { price: converter.marketPriceToDecimalString(coinData.market_data.current_price.inr) }),
					// ...(req.body.isEmailVerified && { isEmailVerified: coinData.isVerified }),
					// ...(req.body.referralID && { referralID: coinData.referralID }),
					// ...(req.body.referredBy && { referredBy: coinData.referredBy }),
					// ...(req.body.watchList && { watchList: coinData.watchList }),
					// ...(req.body.isInWatchList && { isInWatchList: isInWatchList }),
					// ...(req.body.balance && { balance: balance }),
				};
		
				responseArray.push(responseElement);
			}

			// Sending Required Data
			return res.status(200).json(responseArray);
		}
	} catch (err) {
		console.log(err);
		return next(new Error("ERR: Unable to retrieve coins data."));
	}
};

module.exports.getData = getData;
