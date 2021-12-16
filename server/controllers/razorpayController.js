const { validationResult } = require("express-validator");
const RazorPay = require("razorpay");
const Users = require("../models/user");
require("dotenv").config();

const Transaction = require("../models/transaction");
const addMoneyTransaction = require("../models/transactions/addMoney");

const razorInstance = new RazorPay({
	key_id: process.env.RAZORPAY_KEY_ID,
	key_secret: process.env.RAZORPAY_SECRET,
});

const createOrder = async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return next(
			new Error("ERR: Invalid inputs passed, please check your data.")
		);
	}

	let { amount } = req.body;
	amount = amount * 100; // in paise

	try {
		// Getting walletID
		const userDetails = await Users.findById(req.userData.id);
		const walletID = userDetails.wallet;

		// Creating Transaction Instance
		let transactionInstance = await Transaction.create({
			category: "add_money",
			wallet: walletID,
			addMoney: null,
		});

		// Creating Add Money Transaction Instance
		let addMoneyTransactionInstance = await addMoneyTransaction.create({
			wallet: walletID,
			amount: amount.toString(),
			status: "PENDING"
		});

		// Linking  Transaction Instance to Add Money Transaction Instance
		transactionInstance.addMoney = addMoneyTransactionInstance.id;
		await transactionInstance.save();

		const options = {
			amount,
			currency: "INR",
			receipt: addMoneyTransactionInstance.id,
		};

		// Creating RazorPay Order
		const order = await razorInstance.orders.create(options);

		// Order created
		console.log(order);

		// Updating Add Money Transaction Instance with RazorPay OrderID
		addMoneyTransactionInstance.razorpay_order_id = order.id;
		await addMoneyTransactionInstance.save();

		// Sending order details
		return res.status(200).json({
			...order,
			userDetails: {
				name: userDetails.name,
				email: userDetails.email,
				mobile: userDetails.mobile,
			},
		});
	} catch (err) {
		console.log(err);
		return next(new Error("Unable to create order! ERR: " + err.message));
	}
};

const capturePayment = async (req, res, next) => {};

const failedPayment = async (req, res, next) => {};

module.exports.createOrder = createOrder;
module.exports.capturePayment = capturePayment;
module.exports.failedPayment = failedPayment;
