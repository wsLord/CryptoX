const mongoose=require('mongoose');
const walletSchema=new mongoose.Schema({
    balance:{
        type :Integer,
        required :true
    },
    user: {
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    //include the ids of comments in an array

    transactionList: [{
        
            type:mongoose.Schema.Types.ObjectId,
            ref: 'Transaction'
        
        
    }]
  

},{
    timestamps:true
});

const Wallet = mongoose.model('Wallet',walletSchema);
module.exports=Wallet;