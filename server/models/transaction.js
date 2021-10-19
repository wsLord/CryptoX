const mongoose=require('mongoose');
const transactionSchema=new mongoose.Schema({
    catagory: { type: String, required: true },
	walletId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Wallet",
	},
	quantity: { type: String, required: true },
    price:{ type: String, required: true},
	// user: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "User",
    // },
    // portfolioId: {
	// 	type: mongoose.Schema.Types.ObjectId,
	// 	ref: "Portfolio",
	// },
    coinId:{ type: String, required: true}
  

},{
    timestamps:true
});

const Transaction = mongoose.model('Transaction',transactionSchema);
module.exports=Transaction;