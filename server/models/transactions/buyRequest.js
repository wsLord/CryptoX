const mongoose=require('mongoose');
const buyRequestSchema=new mongoose.Schema({
    coinId:{
        type :String,
        required :true
    },
    from: {
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Wallet'
    },
    //comment 
    quantity: {
        type:String,
        required :true
    },
    mode: {
        type:String,//1 means limit order from the main market and 2 means limit order from the user in the app itself
        required :true
        
        
    },
    maxPrice: {
        type:String,
        required :true
    },
    portfolioId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Portfolio",
	},
    transaction: {
        type: mongoose.Schema.Types.ObjectId,
		ref: "Transaction",
    },
    buyLimit:{
        type: mongoose.Schema.Types.ObjectId,
		ref: "buyLimit",
    }
},{
    timestamps:true
});

const BuyRequest = mongoose.model('BuyRequest',buyRequestSchema);
module.exports=BuyRequest;