const schedule =require('node-schedule');
const axios = require('axios');
const User = require('../models/user');
const Wallet=require('../models/wallet');
const Portfolio = require('../models/portfolio');
const Transaction = require('../models/transaction');
const buyRequest = require('../models/buyRequest');
const executeOrders=async(coinData)=>{
    for(a of coinData){
        let buyReqs =await buyRequest.find({
            coinId:a.id,
            maxPrice:{$lte:a.price}
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
module.exports.checkLimitBuy=async()=>{
    const mJob =schedule.scheduleJob('*/5 * * * * *',async ()=>{
        let coinData = await axios.get(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=inr&order=market_cap_desc&per_page=100&page=1&sparkline=false`);
        // console.log(coinData);
		executeOrders(coinData);
    });
}
