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
        type:Integer,
        required :true
    },
    mode: {
        type:String,//1 means limit order from the main market and 2 means limit order from the user in the app itself
        required :true
        
        
    },
    maxPrice: {
        type:String,
        required :true
    }

  

},{
    timestamps:true
});

const BuyRequest = mongoose.model('BuyRequest',buyRequestSchema);
module.exports=BuyRequest;