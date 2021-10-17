const axios = require('axios');
const User = require('../models/user');
const Wallet=require('../models/wallet');
const Portfolio = require('../models/portfolio');
const Transaction = require('../models/transaction');
module.exports.buy= async(req,res)=>{
    if(!req.userData){
        res.redirect('back');
    }
    let user = await User.findById(req.userData);
    if(!user){
        res.redirect('back');
    }

    let coinId=req.params.id;
    let quantity=BigInt(req.body.quantity);

    let coinData = await axios.get(`https://api.coingecko.com/api/v3/coins/$(coinId)`);//axios by default parses Json response
    let price=BigInt(coinData.market_data.current_price.inr*10000000);
    
    let WalletOfUser=await Wallet.findById(user.walletId);
    
    if(BigInt(WalletOfUser.balance)<price*quantity){
        console.log('Insufficient Balance');
        res.redirect('back');
    }

    let newBalance = BigInt(WalletOfUser.balance)-price*quantity;
    WalletOfUser.balance=newBalance.toString();
    await WalletOfUser.save();
    let portfolioOfUser=await Portfolio.findById(user.portfolioId);
    var quantityBought;
    var avgPrice;
    var index;
    for(a of portfolioOfUser.coinsOwned){
        if(a.coidId==coinId){
            quantityBought=a.quantity;
            avgPrice=a.priceOfBuy;
            index=portfolioOfUser.coinsOwned.findIndex(a);
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
    await portfolioOfUser.save()
    try{
        let transac = await Transaction.create({
            category: 'buy',
            walletId: WalletOfUser._id,
            quantity: quantity.toString(),
            price:price.toString(),
            user:user._id,
            portfolioId:portfolioOfUser._id,
            coinId:coinId

        });

       
        return res.redirect('back');
    }
    catch(err) {
        console.log('error',err);
        return;
    }

}


module.exports.sell= async(req,res)=>{
    if(!req.userData){
        res.redirect('back');
    }
    let user = await User.findById(req.userData);
    if(!user){
        res.redirect('back');
    }

    let coinId=req.params.id;
    let quantity=BigInt(req.body.quantity);

    let coinData = await axios.get(`https://api.coingecko.com/api/v3/coins/$(coinId)`);//axios by default parses Json response
    let price=BigInt(coinData.market_data.current_price.inr*10000000);
    
    let portfolioOfUser=await Portfolio.findById(user.portfolioId);

    var quantityOfCoinsOwned;
    var avgPrice;
    var index;


    for(a of portfolioOfUser.coinsOwned){
        if(a.coinId==coinId){
            quantityOfCoinsOwned = BigInt(a.quantity);
            avgPrice=a.priceOfBuy
            index=portfolioOfUser.coinsOwned.findIndex(a);
        }
    }
    if(index&&quantityOfCoinsOwned>=quantity){
        portfolioOfUser.coinsOwned.slice(index, 1);
        let newQuantity=quantityOfCoinsOwned-quantity;
        if(newQuantity>0n){
            portfolioOfUser.coinsOwned.push({
                coidId: coinId,
                quantity: newQuantity.toString(),
                priceOfBuy:avgPrice
            })
        }
        await portfolioOfUser.save();
        let newBalance = BigInt(WalletOfUser.balance)+price*quantity;

        let WalletOfUser=await Wallet.findById(user.walletId);
        WalletOfUser.balance=newBalance.toString();
        await WalletOfUser.save();
        try{
            let transac = await Transaction.create({
                category: 'sell',
                walletId: WalletOfUser._id,
                quantity: quantity.toString(),
                price:price.toString(),
                user:user._id,
                portfolioId:portfolioOfUser._id,
                coinId:coinId
    
            });
    
           
            return res.redirect('back');
        }
        catch(err) {
            console.log('error',err);
            return;
        }
        


    }
    else{
        console.log('the transaction is not possible');
        res.redirect('back');
    }

    
    


}