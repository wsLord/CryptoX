const mongoose=require('mongoose');
const portfolioSchema=new mongoose.Schema({
    user: {
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    //include the ids of comments in an array

    coinsOwned: [{
        coidId: {
            type:string,
            required: true
        },
        quantity: {
            type: Integer,
            required: true
        },
        priceOfBuy: {
            type: Double,
            required: true
        }
    }]
  

},{
    timestamps:true
});

const Portfolio = mongoose.model('Portfolio',portfolioSchema);
module.exports=Portfolio;