const schedule =require('node-schedule');
const axios = require('axios');
const User = require('../models/user');
const Wallet=require('../models/wallet');
const Portfolio = require('../models/portfolio');
const Transaction = require('../models/transaction');
const buyRequest = require('../models/transactions/buyRequest');
const buyCoinTransaction = require("../models/transactions/buyCoin");
const executeOrders=async(coinData)=>{
    for(a of coinData){
        let buyReqs =await buyRequest.find({
            coinId:a.id,
            // maxPrice:{$gte:a.price}
        })
        let price=BigInt(a.price*10000000);
        buyReqs.forEach(async (buyReq)=>{
            let WalletOfUser=await Wallet.findById(buyReq.from);//finding wallet
            if(BigInt(buyReq.quantity)*price<=BigInt(WalletOfUser.balance)){//if sufficient balance in wallet
                try{
                    //complete the transaction
                    let transac = await Transaction.create({
                        category: 'buy',
                        walletId: buyRed.from,
                        quantity: buyReq.quantity,
                        price:price.toString(),
                        // user:user._id,
                        // portfolioId:portfolioOfUser._id,
                        coinId:buyReq.coinId
            
                    });
                    let quantity = BigInt(buyReq.quantity)
                    let newBalance = BigInt(WalletOfUser.balance)-BigInt(buyReq.quantity)*price;
                    WalletOfUser.balance=newBalance.toString();
                    await WalletOfUser.save();//balance updated in wallet update
                    
                    let portfolioOfUser=await Portfolio.findById(buyReq.portfolioId);
                    var quantityBought;
                    var avgPrice;
                    var index;
                    for(coin of portfolioOfUser.coinsOwned){
                        if(coin.coidId==coinId){
                            quantityBought=coins.quantity;
                            avgPrice=a.priceOfBuy;
                            index=portfolioOfUser.coinsOwned.findIndex(coin);
                        }
                    }
                    if(index){
                        portfolioOfUser.coinsOwned.slice(index, 1);
                        let newAvgPrice=(avgPrice*quantityBought+price*quantity)/(quantityBought+quantity);
                        let newQuantity=quantityBought+quantity;
                        portfolioOfUser.coinsOwned.push({
                            coidId: coinId,
                            quantity: newQuantity.toString(),
                            priceOfBuy:newAvgPrice.toString()
                        })
                    }
                    else{
                        portfolioOfUser.coinsOwned.push({
                            coidId: coinId,
                            quantity: quantity.toString(),
                            priceOfBuy:price.toString()
                        })
                    }
                    await portfolioOfUser.save()//portfolio is updated
                    buyReq.remove();
                }
                catch(err) {
                    console.log('error',err);
                }
            }
            else{

            }
            
        })

    }
}
const executeOrders2 = async (coinData)=>{
    try{

        for(coin of coinData){
        
        let currentPrice=BigInt(Math.floor(coin.current_price*10000000));
        let buyReqs =await buyRequest.find({
            coinId:coin.id,
            mode:"1"           
        })
        
         for(req of buyReqs){
            if(req.maxPrice>=currentPrice){
               
                let walletOfUser=await Wallet.findById(req.from);
                
                let portfolioOfUser=await Portfolio.findById(req.portfolioId);
                
                let quantity = BigInt(req.quantity);
                let cost = currentPrice * quantity;
                if(BigInt(walletOfUser.balance) >= cost){
                
                let transactionInstance = await Transaction.create({
                    category: "buy_request",
                    wallet: walletOfUser.id,
                    buyCoin: null,
                });
                // Creating Buy Coin Transaction Instance
                let buyCoinTransactionInstance = await buyCoinTransaction.create({
                    wallet: walletOfUser.id,
                    coinid: coin.id,
                    amount: cost.toString(),
                    price: currentPrice.toString(),
                    quantity: quantity.toString(),
                    status: "SUCCESS",
                });
        
                // Linking Transaction Instance to Add Money Transaction Instance
                transactionInstance.buyCoin = buyCoinTransactionInstance.id;
                await transactionInstance.save();
        
               
        
               
                let newBalance = BigInt(walletOfUser.balance) - cost;
                walletOfUser.balance = newBalance.toString();
                await walletOfUser.save();
        
                let oldQuantity;
                let oldAvgPrice;
                // Checking if coin is already existent in Portfolio and getting its index
                let coinIndex = portfolioOfUser.coinsOwned.findIndex((tcoin) => {
                    if (tcoin.coinid === coin.id) {
                        oldQuantity = BigInt(tcoin.quantity);
                        oldAvgPrice = BigInt(tcoin.priceOfBuy);
                        return true;
                    }
                    return false;
                });
                if (coinIndex!=-1) {
                    let newQuantity = BigInt(oldQuantity) + quantity;
                    let newAvgPrice = (oldAvgPrice*oldQuantity + cost) / newQuantity;
        
                    portfolioOfUser.coinsOwned[coinIndex].quantity = newQuantity.toString();
                    portfolioOfUser.coinsOwned[coinIndex].priceOfBuy = newAvgPrice.toString();
                } else {
                    portfolioOfUser.coinsOwned.push({
                        coinid: coin.id,
                        quantity: quantity.toString(),
                        priceOfBuy: currentPrice.toString(),
                    });
                }
                await portfolioOfUser.save();
                await buyRequest.findByIdAndDelete(req._id);
                buyCoinTransactionInstance.status = "SUCCESS";
                await buyCoinTransactionInstance.save();

                }
            }
         }
        }
    }catch(err)
    {
        console.log(err);
    }
}
module.exports.checkLimitBuy=async()=>{
    const mJob =schedule.scheduleJob('*/5 * * * * *',async ()=>{//my place
        let coinData =  await axios.get(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=inr&order=market_cap_desc&per_page=100&page=1&sparkline=false`);
        executeOrders2(coinData.data);
    });
}
