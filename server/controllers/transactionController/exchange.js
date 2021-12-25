const axios = require("axios");
const User = require("../../models/user");
const Portfolio = require("../../models/portfolio");
const Exchange = require("../../models/transactions/exchange");
const CoinGecko = require("coingecko-api");
const CoinGeckoClient = new CoinGecko();
const exchangeTransaction = require("../../models/transactions/exchange");
const Transaction = require("../../models/transaction");
const exchange = async (req, res,next) => {
    try{
        //ChargeForTransaction
        const ChargeOfTransaction = BigInt(200000000000);
        
        //needed values in req.body
        let {coinId1,coinId2,quantityToExchange} = req.body;
        quantityToExchange = BigInt(Math.floor(parseFloat(req.body.quantityToExchange).toFixed(7) * 10000000));
        
        //Finding the Users
        const user = await User.findById(req.userData.id)
        .populate("wallet")
        .populate("portfolio")
        .exec();
        
        // console.log(userSendingCoin,userRecievingCoin);

        

        //getting the coinData of Both th coins through api
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
        
        //getting the current Prices
        const currentPrice1 = BigInt(
			parseFloat(coinData.market_data.current_price.inr).toFixed(2) * 100
		);
		const currentPrice2 = BigInt(Math.floor(
			parseFloat(coinData2.market_data.current_price.inr).toFixed(2) * 100
		));

        //wallets and portfolio of user
        const walletOfUser = user.wallet;
		const portfolioOfUser = user.portfolio;
        
        
        let tcost = currentPrice1 * quantityToExchange;
		tcost = tcost.toString();

        //Making sure the cost is atleast greater than the charge
        console.log(currentPrice1,BigInt(tcost),ChargeOfTransaction);
        if(BigInt(tcost)<=ChargeOfTransaction){
            const error = new Error(
				"TRANSACTION DECLINED! Cost must be atleast Re. 200"
			);
			error.code = 405;
			return next(error);
        }
        const ttcost = BigInt(tcost);
        //Finding the Money For transactions that
        const moneyForUser = ttcost - ChargeOfTransaction;
        const moneyForAdmin = ChargeOfTransaction;

        // Trimming last 7 extra digits and Cost in paise in BigInt
        const cost = BigInt(tcost.slice(0, -7));

        //Trimming last 7 extra digits
        const charge = moneyForAdmin.toString().slice(0,-7);
        const recMon = moneyForUser.toString().slice(0,-7);
        
        
        
        //Finding Quantity of coins To Buy By both Admin And Reciever
        let quantityRecievedByAdmin = moneyForAdmin/currentPrice1;
        let quantityRecievedByUser = moneyForUser/currentPrice2;
        
        
        //Creating Transaction Instance
        let transactionInstance = await Transaction.create({
			category: "exchange",
			wallet: walletOfUser.id,
			exchange: null
		});
        
        
        // Creating Sender And Reciever Transaction Instance
		let excTrans = await exchangeTransaction.create({
			wallet: walletOfUser.id,
			coinid1: coinId1,
			coinid2: coinId2,
			amount: cost.toString(),
			price1: currentPrice1.toString(),
			price2: currentPrice2.toString(),
			quantitySendForExchange: quantityToExchange.toString(),
			quantityRecieved:quantityRecievedByUser.toString(),
            chargedQuantity:quantityRecievedByAdmin.toString(),
            chargedMoney:charge,
			status: "PENDING",
		});
        
        
        //Linking Sender and Reciever to Transaction Instance
        transactionInstance.exchange = excTrans.id;
		transactionInstance.save();

        // Checking if coin is already existent in Portfolio and getting its index
        let oldQuantity;
		let avgPrice;
		
		let coinIndex = portfolioOfUser.coinsOwned.findIndex((tcoin) => {
			if (tcoin.coinid === coinId1) {
				oldQuantity = BigInt(tcoin.quantity);
				avgPrice = BigInt(tcoin.priceOfBuy);
				return true;
			}
			return false;
		});


        //In case of Insufficient coins In portfolio
        // console.log(BigInt(oldQuantity),quantityToSend);
        if (coinIndex === -1 || BigInt(oldQuantity)<quantityToExchange) {

            excTrans.status = 'FAILED';
            excTrans.statusMessage = 'Insufficient Coins in Assets Of User';
            await excTrans.save();


			const error = new Error("TRANSACTION DECLINED! Quantity of coin is Not Sufficient");
			error.code = 405;
			return next(error);
		}


        //Now transaction is possible


        //Updating Portfolio of User
        
        portfolioOfUser.coinsOwned.splice(coinIndex, 1);
		let newQuantity = oldQuantity - quantityToExchange;
		if (newQuantity > 0n) {
			portfolioOfUser.coinsOwned.push({
				coinid: coinId1,
				quantity: newQuantity.toString(),
				priceOfBuy: avgPrice,
			});
		}
		await portfolioOfUser.save();

        //Updating portfolio of User while recieving
        coinIndex = portfolioOfUser.coinsOwned.findIndex((tcoin) => {
			if (tcoin.coinid === coinId2) {
				oldQuantity = BigInt(tcoin.quantity);
				oldAvgPrice = BigInt(tcoin.priceOfBuy);
				return true;
			}
			return false;
		});
        
		// coinIndex is -1 if not found
        
		if (coinIndex >= 0) {
			let newQuantity = oldQuantity + quantityRecievedByUser;
			let newAvgPrice = ((oldAvgPrice * oldQuantity) + ttcost) / newQuantity;

			portfolioOfUser.coinsOwned[coinIndex].quantity = newQuantity.toString();
			portfolioOfUser.coinsOwned[coinIndex].priceOfBuy = newAvgPrice.toString();
		} else {
			portfolioOfUser.coinsOwned.push({
				coinid: coinId2,
				quantity: quantityRecievedByUser.toString(),
				priceOfBuy: currentPrice2.toString(),
			});
		}
		await portfolioOfUser.save();
        
        excTrans.status = 'SUCCESS';
        
        await excTrans.save();
        

        return res.status(200).json({
            success: true,
			message: "Transaction complete",
			transactionID: transactionInstance.id,
        });
    }
    catch(err){
        console.log("Error in SendRecieve, Err:",err);

		return res.next(err);
    }
}
module.exports = exchange;


