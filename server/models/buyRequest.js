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
    //include the ids of comments in an array
    quantity: {
        type:Integer,
        required :true
    },
    mode: {
        
            type:String,
            required :true
        
        
    },
    price: {
        
    }

  

},{
    timestamps:true
});

const BuyRequest = mongoose.model('BuyRequest',buyRequestSchema);
module.exports=BuyRequest;