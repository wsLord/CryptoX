const axios = require('axios');
const User = require('../models/user');
const Wallet=require('../models/wallet');
const Portfolio = require('../models/portfolio');
const Transaction = require('../models/transaction');
const BuyRequest = require('../models/buyRequest');
const Exchange = require('../models/exchange');
module.exports.buy= async(req,res)=>{
    console.log(req.userData);
    if(!req.userData){
        res.redirect('back');
    }
    let user = await User.findById(req.userData.id);
    if(!user){
        res.redirect('back');
    }
    // console.log(user);
    let coinId=req.params.id;
    console.log(coinId);
    let quantity=BigInt(req.body.quantity);
    
    let coinData =  await axios.get(`https://api.coingecko.com/api/v3/coins/${coinId}`);//axios by default parses Json response
    // console.log(coinData);
    let price=BigInt(coinData.data.market_data.current_price.inr*10000000);
    console.log(price);
    // let WalletOfUser=await Wallet.findById(user.walletId);
    
    // if(BigInt(WalletOfUser.balance)<price*quantity){
    //     console.log('Insufficient Balance');
    //     res.redirect('back');
    // }

    // let newBalance = BigInt(WalletOfUser.balance)-price*quantity;
    // WalletOfUser.balance=newBalance.toString();
    // await WalletOfUser.save();
    // let portfolioOfUser=await Portfolio.findById(user.portfolioId);
    // var quantityBought;
    // var avgPrice;
    // var index;
    // for(a of portfolioOfUser.coinsOwned){
    //     if(a.coidId==coinId){
    //         quantityBought=a.quantity;
    //         avgPrice=a.priceOfBuy;
    //         index=portfolioOfUser.coinsOwned.findIndex(a);
    //     }
    // }
    // if(index){
    //     portfolioOfUser.coinsOwned.slice(index, 1);
    //     let newAvgPrice=(avgPrice*quantityBought+price*quantity)/(quantityBought+quantity);
    //     let newQuantity=quantityBought+quantity;
    //     portfolioOfUser.coinsOwned.push({
    //         coidId: coinId,
    //         quantity: newQuantity.toString(),
    //         priceOfBuy:newAvgPrice.toString()
    //     })
    // }
    // else{
    //     portfolioOfUser.coinsOwned.push({
    //         coidId: coinId,
    //         quantity: quantity.toString(),
    //         priceOfBuy:price.toString()
    //     })
    // }
    // await portfolioOfUser.save()
    // try{
    //     let transac = await Transaction.create({
    //         category: 'buy',
    //         walletId: WalletOfUser._id,
    //         quantity: quantity.toString(),
    //         price:price.toString(),
    //         // user:user._id,
    //         // portfolioId:portfolioOfUser._id,
    //         coinId:coinId

    //     });

       
    //     return res.redirect('back');
    // }
    // catch(err) {
    //     console.log('error',err);
    //     return;
    // }
    return res.status(200).json('success');
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
                // user:user._id,
                // portfolioId:portfolioOfUser._id,
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
module.exports.buyLimit=async (req,res)=>{
    if(!req.userData){
        res.redirect('back');
    }
    let user = await User.findById(req.userData);
    if(!user){
        res.redirect('back');
    }
    let maxpri=BigInt(req.body.maxPrice*10000000);
    try{
        let newRequest = await BuyRequest.create({
            coinId:req.body.coinId,
            from:user.walletId,
            quantity:req.body.quantity,
            mode:'1',
            maxPrice:maxpri.toString(),
            portfolioId:user.portfolioId
        });

       
        return res.redirect('back');
    }
    catch(err) {
        console.log('error',err);
        res.redirect('back');
    }
}

module.exports.sellLimit=async (req,res)=>{
    if(!req.userData){
        res.redirect('back');
    }
    let user = await User.findById(req.userData);
    if(!user){
        res.redirect('back');
    }
    let minpri=BigInt(req.body.minPrice*10000000);
    try{
        let newRequest = await SellRequest.create({
            coinId:req.body.coinId,
            from:user.walletId,
            quantity:req.body.quantity,
            mode:'1',
            minPrice:minpri.toString(),
            portfolioId:user.portfolioId
        });

       
        return res.redirect('back');
    }
    catch(err) {
        console.log('error',err);
        res.redirect('back');
    }
}

module.exports.exchange = async ()=>{
    if(!req.userData){
        res.redirect('back');
    }
    let user = await User.findById(req.userData);
    if(!user){
        res.redirect('back');
    }
    let coinIdToSell=req.body.sellCoin;
    let coinIdToBuy=req.body.buyCoin;
    
    let coinDataSell = await axios.get(`https://api.coingecko.com/api/v3/coins/$(coinIdToSell)`);//axios by default parses Json response
    let coinDataBuy = await axios.get(`https://api.coingecko.com/api/v3/coins/$(coinIdToBuy)`);
    let priceOfBuyCoin=BigInt(coinDataBuy.market_data.current_price.inr*10000000);
    let priceOfSellCoin=BigInt(coinDataSell.market_data.current_price.inr*10000000);
    
    // let portfolioOfUser=await Portfolio.findById(user.portfolioId);

 

    //sellPart
    let quantity=BigInt(req.body.quantity);


    let portfolioOfUser=await Portfolio.findById(user.portfolioId);

    var quantityOfCoinsOwned;
    var avgPrice;
    var index;


    for(a of portfolioOfUser.coinsOwned){
        if(a.coinId==coinIdToSell){
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
                coidId: coinIdToSell,
                quantity: newQuantity.toString(),
                priceOfBuy:avgPrice
            })
        }
        // await portfolioOfUser.save();
        
        let MoneyHeld=priceOfSellCoin*quantity;
        // let charge=MoneyHeld-

        let quantityBoughtAgain=MoneyHeld/priceOfBuyCoin;

        

        for(a of portfolioOfUser.coinsOwned){
            if(a.coidId==coinIdToBuy){
                quantityBought=a.quantity;
                avgPrice=a.priceOfBuy;
                index=portfolioOfUser.coinsOwned.findIndex(a);
            }
        }
        if(index){
            portfolioOfUser.coinsOwned.slice(index, 1);
            let newAvgPrice=(avgPrice*quantityBought+MoneyHeld)/(quantityBought+quantityBoughtAgain);
            let newQuantity=quantityBought+quantityBoughtAgain;
            portfolioOfUser.coinsOwned.push({
                coidId: coinIdToBuy,
                quantity: newQuantity.toString(),
                priceOfBuy:newAvgPrice.toString()
            })
        }
        else{
            portfolioOfUser.coinsOwned.push({
                coidId: coinIdToBuy,
                quantity: quantityBoughtAgain.toString(),
                priceOfBuy:priceOfBuyCoin.toString()
            })
        }
        await portfolioOfUser.save()
        

        try{
            let xchange = await Exchange.create({
                walletId: user.walletId,
                quantitySold: quantity,
                quantityBought: quantityBoughtAgain,
                coinIdSold:coinIdToSell,
                coinIdBought:coinIdToBuy
    
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