const schedule =require('node-schedule');
const axios = require('axios');
const User = require('../models/user');
const Wallet=require('../models/wallet');
const Portfolio = require('../models/portfolio');
const Transaction = require('../models/transaction');
const buyRequest = require('../models/transactions/buyRequest');
const sellRequest = require('../models/transactions/sellRequest');
const buyCoinTransaction = require("../models/transactions/buyCoin");
const sellCoinTransaction = require("../models/transactions/sellCoin");
// export {queue};
const {
    PriorityQueue,
    MinPriorityQueue,
    MaxPriorityQueue
  } = require('@datastructures-js/priority-queue');
  let count =0;
  let queue = new PriorityQueue({ compare: function(a, b) { return b - a; }});
  exports.queue;
module.exports.entryBuyRequest=async(newRequestId)=>{
    console.log(newRequestId);
    queue.enqueue(7);
}
const executeOrders=async(coinData)=>{
    
   
    queue.enqueue(5);
    queue.enqueue(3);
    queue.enqueue(2);
    var lowest = queue.front(); // returns 5
    console.log(lowest,count++);
}
const executeOrders2 = async (coin)=>{
    
    try{

        let currentPrice=BigInt(Math.floor(coin.current_price*100));
        let buyReqs =await buyRequest.find({
            coinId:coin.id,
            mode:"1"           
        }).exec();
        
         for(req of buyReqs){                   //iterating over the request for the current coin
        //    console.log(req.maxPrice,currentPrice);
            // console.log(req.coinId,coin.id);
            if(req.maxPrice>=currentPrice){
               
                let walletOfUser=await Wallet.findById(req.from);
                
                let portfolioOfUser=await Portfolio.findById(req.portfolioId);
                
                let quantity = BigInt(req.quantity);
                let tcost = currentPrice * quantity;
                tcost = tcost.toString();     // convert the cost of proper format
                tcost = tcost.slice(0, -7);
                const cost = BigInt(tcost);

                // console.log(cost,walletOfUser.balance);
                // console.log(coin.id);
                if(BigInt(walletOfUser.balance) >= cost){           //check for proper balance
                
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
                //updating the portfolio
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
                await buyRequest.findByIdAndDelete(req._id);                //deleting the buy Request when request is processed
                buyCoinTransactionInstance.status = "SUCCESS";
                await buyCoinTransactionInstance.save();
                console.log('transaction done');
                }
            }
         }
        
    }catch(err)
    {
        console.log(err);
    }
}

const executeOrders3 = async (coin)=>{
    try{

        
        
        let currentPrice=BigInt(Math.floor(coin.current_price*100));
        
      
        let sellReqs =await sellRequest.find({
            coinId:coin.id,
            mode:"1"             
        }).exec();
        
            
        //  }
         for(req of sellReqs){
            
            if(BigInt(req.minPrice)<=currentPrice){

                let walletOfUser=await Wallet.findById(req.from);
                let portfolioOfUser=await Portfolio.findById(req.portfolioId);
                const quantity = BigInt(req.quantity);
               
        
        
        
                // Cost in BigInt with 7 extra precision digits
                let tcost = currentPrice * quantity;
                tcost = tcost.toString();
                
                // Length of tcost must be >= 10 so that transaction is worth Re. 1
                if (tcost.length >= 10) 
                {               
                    
                    // Trimming last 7 extra digits
                    tcost = tcost.slice(0, -7);
            
                    // Cost in paise in BigInt
                    const cost = BigInt(tcost);
                    let oldQuantity;
                    let avgPrice;
                    // Checking if coin is already existent in Portfolio and getting its index
                    
                    let coinIndex = portfolioOfUser.coinsOwned.findIndex((tcoin) => {
                        if (tcoin.coinid ==req.coinId) {
                            oldQuantity = BigInt(tcoin.quantity);
                            avgPrice = BigInt(tcoin.priceOfBuy);
                            return true;
                        }
                        return false;
                    });
                   
                    // Declining transaction when coin doesn't exist
               
                    if (coinIndex != -1&& oldQuantity >= quantity) {
                        
                    
                            
                            // Creating Transaction Instance
                            let transactionInstance = await Transaction.create({
                                category: "sell_request",
                                wallet: walletOfUser.id,
                                sellCoin: null,
                            });
                    
                            // Creating Buy Coin Transaction Instance
                            let sellCoinTransactionInstance = await sellCoinTransaction.create({
                                wallet: walletOfUser.id,
                                coinid: coin.id,
                                amount: cost.toString(),
                                price: currentPrice.toString(),
                                quantity: quantity.toString(),
                                status: "SUCCESS",
                            });
                    
                            // Linking Transaction Instance to Add Money Transaction Instance
                            transactionInstance.sellCoin = sellCoinTransactionInstance.id;
                            await transactionInstance.save();
                            await sellCoinTransactionInstance.save();
                            
                    
                    
                    
                    
                    
                    
                    
                            let newBalance = BigInt(walletOfUser.balance) + cost;
                            walletOfUser.balance = newBalance.toString();
                            await walletOfUser.save();
                    
                            portfolioOfUser.coinsOwned.splice(coinIndex, 1);
                            let newQuantity = oldQuantity - quantity;
                            if (newQuantity > 0n) {
                                portfolioOfUser.coinsOwned.push({
                                    coinid: coin.id,
                                    quantity: newQuantity.toString(),
                                    priceOfBuy: avgPrice,
                                });
                            }
                            await portfolioOfUser.save();
                            await sellRequest.findByIdAndDelete(req._id);
                            console.log('transaction done');
                            
                    
                    

                    
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
        for(coin of coinData.data){
        executeOrders2(coin);
        executeOrders3(coin);
        // executeOrders();
        }
    });
}
