const mongoose=require('mongoose');
const exchangeSchema=new mongoose.Schema({
    walletId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Wallet",
	},
	quantitySold: { type: String, required: true },
    quantityBought: { type: String, required: true },
    coinIdSold:{ type: String, required: true},
    coinIdBought:{ type: String, required: true}
  

},{
    timestamps:true
});

const Exchange = mongoose.model('Exchange',exchangeSchema);
module.exports=Exchange;