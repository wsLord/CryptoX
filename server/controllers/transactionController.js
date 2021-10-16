const axios = require('axios');
const User = require('../models/user');
const Wallet=require('../models/wallet');
const Portfolio = require('../models/portfolio');
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
    portfolioOfUser.coinsOwned.push({
        coidId: coinId,
        quantity: quantity.toString(),
        priceOfBuy:price.toString()
    })
    await portfolioOfUser.save()


}