const { validationResult } = require("express-validator");

const User = require("../../models/user");
const Transaction = require("../../models/transaction");
const buyCoinTransaction = require("../../models/transactions/buyCoin");
const sellCoinTransaction = require("../../models/transactions/sellCoin");

const getTransactionList = async (req, res, next) => {
	try {
		const user = await User.findById(req.userData.id)
			.populate({
				path: "wallet",
				populate: {
					path: "transactionList",
					select: "-wallet -__v -createdAt -updatedAt",
					populate: [
						{
							path: "addMoney",
							select: "-_id amount status updatedAt",
						},
						{
							path: "buyCoin",
							select: "-_id amount status coinid updatedAt",
						},
						{
							path: "sellCoin",
							select: "-_id amount status coinid updatedAt",
						},
						{
							path: "buyRequest",
							select: "-_id amount status coinid updatedAt",
						},
						{
							path: "sellRequest",
							select: "-_id amount status coinid updatedAt",
						},
						{
							path: "withdrawMoney",
							select: "-_id amount status updatedAt",
						},
					],
				},
			})
			.exec();
		
		const transactionDataList = user.wallet.transactionList;
		return res.status(200).json(transactionDataList);
	} catch (err) {
		console.log(err);
		return next(new Error("ERR: Unable to retrieve Transaction data."));
	}
};



module.exports.getTransactionList = getTransactionList;
