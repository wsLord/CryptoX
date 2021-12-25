const axios = require("axios");
const User = require("../../models/user");
const Portfolio = require("../../models/portfolio");
const Exchange = require("../../models/exchange");
const CoinGecko = require("coingecko-api");
const CoinGeckoClient = new CoinGecko();
const senderTransaction = require("../../models/transactions/sender");
const recieverTransaction = require("../../models/transactions/reciever");
const Transaction = require("../../models/transaction");
const sendRecieve = async (req, res,next) => {
    try{
        //ChargeForTransaction
        const ChargeOfTransaction = BigInt(200000000000);
        
        //needed values in req.body
        let {coinId,emailOfReciever,quantityToSend} = req.body;
        quantityToSend = BigInt(parseFloat(req.body.quantityToSend).toFixed(7) * 10000000);
        
        //Finding the two Users
        const userSendingCoin = await User.findById(req.userData.id)
        .populate("wallet")
        .populate("portfolio")
        .exec();
        const userRecievingCoin = await User.findOne({
            email:emailOfReciever
        })
        .populate('portfolio')
        .populate('wallet')
        .exec();
        // console.log(userSendingCoin,userRecievingCoin);

        //Making Sure there is a reciever
        if(!userRecievingCoin) {
            return res.json('Incorrect Email Provided for reciever');
        }

        //getting the coinData through api
        const { data: coinData } = await CoinGeckoClient.coins.fetch(coinId, {
			tickers: false,
			community_data: false,
			developer_data: false,
			sparkline: false,
		});
        
        //getting the current Price
        const currentPrice = BigInt(
			parseFloat(coinData.market_data.current_price.inr).toFixed(2) * 100
		);

        //wallets and portfolios of both users
        const walletOfSender = userSendingCoin.wallet;
		const portfolioOfSender = userSendingCoin.portfolio;
        const walletOfReciever = userRecievingCoin.wallet;
		const portfolioOfReciever = userRecievingCoin.portfolio;
        
        let tcost = currentPrice * quantityToSend;
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
        const moneyForReciever = ttcost - ChargeOfTransaction;
        const moneyForAdmin = ChargeOfTransaction;

        // Trimming last 7 extra digits and Cost in paise in BigInt
        const cost = BigInt(tcost.slice(0, -7));

        //Trimming last 7 extra digits
        const charge = ChargeOfTransaction.toString().slice(0,-7);
        const recMon = moneyForReciever.toString().slice(0,-7);
        
        
        
        //Finding Quantity of coins To Buy By both Admin And Reciever
        let quantityRecievedByAdmin = moneyForAdmin/currentPrice;
        let quantityRecievedByReciever = moneyForReciever/currentPrice;
        
        
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
			quantitySent: quantityToSend.toString(),
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
        if (coinIndex === -1 || BigInt(oldQuantity)<quantityToSend) {

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
		let newQuantity = oldQuantity - quantityToSend;
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
module.exports = sendRecieve;
