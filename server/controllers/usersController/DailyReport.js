const User = require("../../models/user");
const converter = require("../conversions");

const getData = async (req, res, next) => {
	try {
		const user = await User.findById(req.userData.id).populate("wallet").populate("portfolio");

		let balance = null;
		if (req.body.balance) {
			balance = converter.amountToRupeesPaise(user.wallet.balance);
		}
        let coins = user.portfolio.coinsOwned;
        
        let wallet = user.wallet;
        for(coin of coins) {
            coin.priceOfBuy = converter.amountToRupeesPaise(coin.priceOfBuy);
        }
        return res.json({user:user,coins:coins});
		

		// Required Data
		
	} catch (err) {
		return next(new Error("ERR: Unable to retrieve user data."));
	}
};

module.exports = getData;