const axios = require("axios");
const User = require("../../models/user");
const Portfolio = require("../../models/portfolio");
const Exchange = require("../../models/exchange");
const CoinGecko = require("coingecko-api");
const CoinGeckoClient = new CoinGecko();
const exchangePrice = async (req, res) => {
	
	try{
		const {coinId1,coinId2}=req.body;
        const { data: coinData } = await CoinGeckoClient.coins.fetch(coinId1, {
			tickers: false,
			community_data: false,
			developer_data: false,
			sparkline: false,
		});
        const { data: coinData2 } = await CoinGeckoClient.coins.fetch(coinId2, {
			tickers: false,
			community_data: false,
			developer_data: false,
			sparkline: false,
		});
        // const Price1 = coinData.market_data.current_price.inr;
        // const { data: coinData } = await CoinGeckoClient.coins.fetch(coinid2, {
		// 	tickers: false,
		// 	community_data: false,
		// 	developer_data: false,
		// 	sparkline: false,
		// });
		// Price in Paise
        const Prices = {
            coinId1:coinId1,
            coinId2:coinId2,
            price1:coinData.market_data.current_price.inr,
            price2:coinData2.market_data.current_price.inr
        };
        // const Price2 = coinData.market_data.current_price.inr
		const price = BigInt(
			parseFloat(coinData.market_data.current_price.inr).toFixed(2) * 100
		);
        
		return res.status(200).json(Prices);
		
	}catch(err) {
		console.log(err);
		res.json('error in registering buyLimit request.Please retry with proper data');
	}
	
};


module.exports = exchangePrice;