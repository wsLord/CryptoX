const mongoose=require('mongoose');
const sellRequestSchema=new mongoose.Schema({
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
        type:String,
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

const SellRequest = mongoose.model('SellRequest',sellRequestSchema);
module.exports=SellRequest;