const axios = require("axios");
const User = require("../../models/user");
const Portfolio = require("../../models/portfolio");
const Exchange = require("../../models/transactions/exchange");
const CoinGecko = require("coingecko-api");
const CoinGeckoClient = new CoinGecko();
const senderTransaction = require("../../models/transactions/sender");
const recieverTransaction = require("../../models/transactions/reciever");
const Transaction = require("../../models/transaction");
const exchange = async (req, res,next) => {
    try{
        //ChargeForTransaction
        const ChargeOfTransaction = BigInt(200000000000);
        
        //needed values in req.body
        let {coinId1,coinId2,quantityToExchange} = req.body;
        quantityToExchange = BigInt(parseFloat(req.body.quantityToExchange).toFixed(7) * 10000000);
        
        //Finding the Users
        const User = await User.findById(req.userData.id)
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
		const currentPrice2 = BigInt(
			parseFloat(coinData2.market_data.current_price.inr).toFixed(2) * 100
		);

        //wallets and portfolio of user
        const walletOfUser = userSendingCoin.wallet;
		const portfolioOfUser = userSendingCoin.portfolio;
        
        
        let tcost = currentPrice * quantityToExchange;
		tcost = tcost.toString();

        //Making sure the cost is atleast greater than the charge
        // console.log(currentPrice,BigInt(tcost),ChargeOfTransaction);
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
			category: "sendRecieve",
			wallet: walletOfSender.id,
			sender: null,
            reciever: null
		});
        
        
        // Creating Sender And Reciever Transaction Instance
		let senTrans = await senderTransaction.create({
			wallet: walletOfSender.id,
			coinid: coinId,
			amount: cost.toString(),
			price: currentPrice.toString(),
			quantitySent: quantityToExchange.toString(),
            chargedQuantity:quantityRecievedByAdmin.toString(),
            chargedMoney:charge,
			status: "PENDING",
		});
        let recTrans = await recieverTransaction.create({
			wallet: walletOfReciever.id,
			coinid: coinId,
			amount: recMon,
			price: currentPrice.toString(),
			quantityRecieved:quantityRecievedByReciever.toString(),
			status: "PENDING",
		});
        
        //Linking Sender and Reciever to Transaction Instance
        transactionInstance.sender = senTrans.id;
        transactionInstance.reciever = recTrans.id;
        transactionInstance.save();

        // Checking if coin is already existent in Portfolio and getting its index
        let oldQuantity;
		let avgPrice;
		
		let coinIndex = portfolioOfSender.coinsOwned.findIndex((tcoin) => {
			if (tcoin.coinid === coinId) {
				oldQuantity = BigInt(tcoin.quantity);
				avgPrice = BigInt(tcoin.priceOfBuy);
				return true;
			}
			return false;
		});


        //In case of Insufficient coins In portfolio
        // console.log(BigInt(oldQuantity),quantityToSend);
        if (coinIndex === -1 || BigInt(oldQuantity)<quantityToExchange) {

            senTrans.status = 'FAILED';
            senTrans.statusMessage = 'Insufficient Coins in Assets Of Sender';
            await senTrans.save();

            recTrans.status = 'FAILED';
            recTrans.statusMessage = 'Insufficient Coins in Assets of Sender';
            await recTrans.save();

			const error = new Error("TRANSACTION DECLINED! Quantity of coin is Not Sufficient");
			error.code = 405;
			return next(error);
		}


        //Now transaction is possible


        //Updating Portfolio of Sender
        
        portfolioOfSender.coinsOwned.splice(coinIndex, 1);
		let newQuantity = oldQuantity - quantityToExchange;
		if (newQuantity > 0n) {
			portfolioOfSender.coinsOwned.push({
				coinid: coinId,
				quantity: newQuantity.toString(),
				priceOfBuy: avgPrice,
			});
		}
		await portfolioOfSender.save();

        //Updating portfolio of Recievers
        coinIndex = portfolioOfReciever.coinsOwned.findIndex((tcoin) => {
			if (tcoin.coinid === coinId) {
				oldQuantity = BigInt(tcoin.quantity);
				oldAvgPrice = BigInt(tcoin.priceOfBuy);
				return true;
			}
			return false;
		});
        
		// coinIndex is -1 if not found
        
		if (coinIndex >= 0) {
			let newQuantity = oldQuantity + quantityRecievedByReciever;
			let newAvgPrice = ((oldAvgPrice * oldQuantity) + ttcost) / newQuantity;

			portfolioOfReciever.coinsOwned[coinIndex].quantity = newQuantity.toString();
			portfolioOfReciever.coinsOwned[coinIndex].priceOfBuy = newAvgPrice.toString();
		} else {
			portfolioOfReciever.coinsOwned.push({
				coinid: coinId,
				quantity: quantityRecievedByReciever.toString(),
				priceOfBuy: newAvgPrice.toString(),
			});
		}
		await portfolioOfReciever.save();
        
        senTrans.status = 'SUCCESS';
        recTrans.status = 'SUCCESS';
        await senTrans.save();
        await recTrans.save();

        return res.status(200).json({
            success: true,
			message: "Transaction complete",
			transactionID: transactionInstance.id,
        });
    }
    catch(err){
        console.log("Error in SendRecieve, Err:",err);
    }
}
module.exports = exchange;


// const axios = require("axios");
// const User = require("../../models/user");
// const Portfolio = require("../../models/portfolio");
// const Exchange = require("../../models/transactions/exchange");

// const exchange = async () => {
// 	if (!req.userData) {
// 		res.redirect("back");
// 	}
// 	let user = await User.findById(req.userData);
// 	if (!user) {
// 		res.redirect("back");
// 	}
// 	let coinIdToSell = req.body.sellCoin;
// 	let coinIdToBuy = req.body.buyCoin;

// 	let coinDataSell = await axios.get(
// 		`https://api.coingecko.com/api/v3/coins/$(coinIdToSell)`
// 	); //axios by default parses Json response
// 	let coinDataBuy = await axios.get(
// 		`https://api.coingecko.com/api/v3/coins/$(coinIdToBuy)`
// 	);
// 	let priceOfBuyCoin = BigInt(
// 		coinDataBuy.market_data.current_price.inr * 10000000
// 	);
// 	let priceOfSellCoin = BigInt(
// 		coinDataSell.market_data.current_price.inr * 10000000
// 	);

// 	// let portfolioOfUser=await Portfolio.findById(user.portfolioId);

// 	//sellPart
// 	let quantity = BigInt(req.body.quantity);

// 	let portfolioOfUser = await Portfolio.findById(user.portfolioId);

// 	var quantityOfCoinsOwned;
// 	var avgPrice;
// 	var index;

// 	for (a of portfolioOfUser.coinsOwned) {
// 		if (a.coinId == coinIdToSell) {
// 			quantityOfCoinsOwned = BigInt(a.quantity);
// 			avgPrice = a.priceOfBuy;
// 			index = portfolioOfUser.coinsOwned.findIndex(a);
// 		}
// 	}
// 	if (index && quantityOfCoinsOwned >= quantity) {
// 		portfolioOfUser.coinsOwned.slice(index, 1);
// 		let newQuantity = quantityOfCoinsOwned - quantity;
// 		if (newQuantity > 0n) {
// 			portfolioOfUser.coinsOwned.push({
// 				coidId: coinIdToSell,
// 				quantity: newQuantity.toString(),
// 				priceOfBuy: avgPrice,
// 			});
// 		}
// 		// await portfolioOfUser.save();

// 		let MoneyHeld = priceOfSellCoin * quantity;
// 		// let charge=MoneyHeld-

// 		let quantityBoughtAgain = MoneyHeld / priceOfBuyCoin;

// 		for (a of portfolioOfUser.coinsOwned) {
// 			if (a.coidId == coinIdToBuy) {
// 				quantityBought = a.quantity;
// 				avgPrice = a.priceOfBuy;
// 				index = portfolioOfUser.coinsOwned.findIndex(a);
// 			}
// 		}
// 		if (index) {
// 			portfolioOfUser.coinsOwned.slice(index, 1);
// 			let newAvgPrice =
// 				(avgPrice * quantityBought + MoneyHeld) /
// 				(quantityBought + quantityBoughtAgain);
// 			let newQuantity = quantityBought + quantityBoughtAgain;
// 			portfolioOfUser.coinsOwned.push({
// 				coidId: coinIdToBuy,
// 				quantity: newQuantity.toString(),
// 				priceOfBuy: newAvgPrice.toString(),
// 			});
// 		} else {
// 			portfolioOfUser.coinsOwned.push({
// 				coidId: coinIdToBuy,
// 				quantity: quantityBoughtAgain.toString(),
// 				priceOfBuy: priceOfBuyCoin.toString(),
// 			});
// 		}
// 		await portfolioOfUser.save();

// 		try {
// 			let xchange = await Exchange.create({
// 				walletId: user.walletId,
// 				quantitySold: quantity,
// 				quantityBought: quantityBoughtAgain,
// 				coinIdSold: coinIdToSell,
// 				coinIdBought: coinIdToBuy,
// 			});

// 			return res.redirect("back");
// 		} catch (err) {
// 			console.log("error", err);
// 			return;
// 		}
// 	} else {
// 		console.log("the transaction is not possible");
// 		res.redirect("back");
// 	}
// };

// module.exports = exchange;
