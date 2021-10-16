const mongoose=require('mongoose');
const portfolioSchema=new mongoose.Schema({
    user: {
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    //include the ids of comments in an array

    coinsOwned: [{
        coidId: {
            type:String,
            required: true
        },
        quantity: {
            type: String,
            required: true
        },
        priceOfBuy: {
            type: String,
            required: true
        }
    }]
  

},{
    timestamps:true
});

const Portfolio = mongoose.model('Portfolio',portfolioSchema);
module.exports=Portfolio;