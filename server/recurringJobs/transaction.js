const schedule =require('node-schedule');
const axios = require('axios');
const User = require('../models/user');
const Wallet=require('../models/wallet');
const Portfolio = require('../models/portfolio');
const Transaction = require('../models/transaction');
const buyRequest = require('../models/transactions/buyRequest');
const sellRequest = require('../models/transactions/sellRequest');
const buyLimitTransaction = require("../models/transactions/buyLimit");
const sellLimitTransaction = require("../models/transactions/sellLimit");
// export {queue};
// const {
//     PriorityQueue,
//     MinPriorityQueue,
//     MaxPriorityQueue
//   } = require('@datastructures-js/priority-queue');
//   let count =0;
//   let queue = new PriorityQueue({ compare: function(a, b) { return b - a; }});
//   exports.queue;
module.exports.entryBuyRequest=async(newRequestId)=>{
    console.log(newRequestId);
    queue.enqueue(7);
}
// const executeOrders=async(coinData)=>{
    
   
//     queue.enqueue(5);
//     queue.enqueue(3);
//     queue.enqueue(2);
//     var lowest = queue.front(); // returns 5
//     console.log(lowest,count++);
// }
const executeOrders2 = async (coin)=>{
    
    try{

        //getting the current Price of the coin
        const currentPrice = BigInt(Math.floor(
			parseFloat(coin.current_price).toFixed(2) * 100
        ));
        //finding all the buyRequest for the current coin and populated the transaction and buyLimit
        let buyReqs =await buyRequest.find({
            coinId:coin.id,
            mode:"1"           
        })
        .populate('transaction')
        .populate('buyLimit')
        .exec();
         
         //iterating over the request for the current coin
         for(req of buyReqs){      
             
            
            //if the price is less than or equals to the limit  price
            if(req.maxPrice>=currentPrice){
               
                //finding the wallet and portfolio of the user
                let walletOfUser=await Wallet.findById(req.from);
                let portfolioOfUser=await Portfolio.findById(req.portfolioId);
                
                //getting the quantity in BigInt
                let quantity = BigInt(req.quantity);
                
                //caculating the total cost for transaction
                let tcost = currentPrice * quantity;

                //storing the total cost as ttcost
                const ttcost = tcost;

                //converting tcost to paise 
                tcost = tcost.toString();     
                tcost = tcost.slice(0, -7);

                //having total cost in BigInt as well
                const cost = BigInt(tcost);

                //checking if the user has enough balance
                if(BigInt(walletOfUser.balance) >= cost){
                
                //storing the current Price and total ammount
                req.buyLimit.price = currentPrice.toString();
                req.buyLimit.amount = cost.toString();
                await req.buyLimit.save();
                
        
                
        
               
        
               
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
                    let newAvgPrice = (oldAvgPrice*oldQuantity + ttcost) / newQuantity;
        
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
                req.buyLimit.status = "SUCCESS";
                await req.buyLimit.save();
                await buyRequest.findByIdAndDelete(req._id);                //deleting the buy Request when request is processed
                
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

        
        
        //getting the current Price of the coin
        const currentPrice = BigInt(Math.floor(
			parseFloat(coin.current_price).toFixed(2) * 100
        ));

        //finding all the sellRequest for the current coin and populated the transaction and buyLimit
        let sellReqs =await sellRequest.find({
            coinId:coin.id,
            mode:"1"             
        })
        .populate('transaction')
        .populate('sellLimit')
        .exec();
            
        //iterating over the request for the current coin
         for(req of sellReqs){
            //if the price is greater than or equals to the limit  price
            if(BigInt(req.minPrice)<=currentPrice){

                //finding the wallet and portfolio of the user
                let walletOfUser=await Wallet.findById(req.from);
                let portfolioOfUser=await Portfolio.findById(req.portfolioId);


                //getting the quantity in BigInt
                const quantity = BigInt(req.quantity);
               
        
        
        
                //caculating the total cost for transaction with precision to 7 digits
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
                        
                    
                            
                            
                            
                            //storing the current Price and total ammount
                            req.sellLimit.price = currentPrice.toString();
                            req.sellLimit.amount = cost.toString();
                            await req.sellLimit.save();
                    
                    
                    
                    
                    
                            //updating the wallet balance
                            let newBalance = BigInt(walletOfUser.balance) + cost;
                            walletOfUser.balance = newBalance.toString();
                            await walletOfUser.save();
                    

                            //updating portfolio of the user
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
                            req.sellLimit.status = "SUCCESS";
                            await req.sellLimit.save();
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
			try {
        let coinData =  await axios.get(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=inr&order=market_cap_desc&per_page=100&page=1&sparkline=false`);
        console.log(coinData.data);
				for(coin of coinData.data){
        executeOrders2(coin);
        executeOrders3(coin);
        // executeOrders();
        }
			}
			catch(err) {
				// console.log(err);
				console.log("Schedule transaction Error");
			}
    });
}