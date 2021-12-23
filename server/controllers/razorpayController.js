const { validationResult } = require("express-validator");
const RazorPay = require("razorpay");
const crypto = require("crypto");
require("dotenv").config();

const Users = require("../models/user");
const Transaction = require("../models/transaction");
const addMoneyTransaction = require("../models/transactions/addMoney");
const converter = require("./conversions");

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
		const userDetails = await Users.findById(req.userData.id).populate("wallet");
		const walletOfUser = userDetails.wallet;
		const walletID = userDetails.wallet.id;

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
			status: "PENDING",
		});

		// Linking  Transaction Instance to Add Money Transaction Instance
		transactionInstance.addMoney = addMoneyTransactionInstance.id;
		await transactionInstance.save();

		walletOfUser.transactionList.push(transactionInstance.id);
		await walletOfUser.save();

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

const capturePayment = async (req, res, next) => {
	const response = req.body;

	try {
		const addMoneyInstance = await addMoneyTransaction.findById(
			response.transaction_id
		);

		// Verifying the payment
		const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET);
		hmac.update(
			addMoneyInstance.razorpay_order_id + "|" + response.razorpay_payment_id
		);
		const generated_signature = hmac.digest("hex");

		let verified_payment = false; //generated_signature == response.razorpay_signature;

		// Updating Add Money Transaction Info
		let AMTData = {
			razorpay_payment_id: response.razorpay_payment_id,
			razorpay_signature: response.razorpay_signature,
			status: verified_payment ? "SUCCESS" : "UNVERIFIED_SUCCESS",
			verified_payment: verified_payment,
			...(!verified_payment) && {statusMessage: "Payment was tampered! Signature unverified."},
		};
		await addMoneyTransaction.findByIdAndUpdate(response.transaction_id, AMTData);

		// Unverifed Payment
		if (!verified_payment) {
			return res.status(200).json({
				is_verified: false,
				message: "Payment may be tampered! Balance not updated",
				amount: converter.amountToDecimalString(addMoneyInstance.amount),
				// balance: converter.amountToDecimalString(newBalance),
				transaction_id: response.transaction_id,
				razorpay_order_id: response.razorpay_order_id,
				error_message: "Payment may be tampered! Signature unverified.",
			});
		}

		// Updating Balance
		const userDetails = await Users.findById(req.userData.id).populate(
			"wallet"
		);
		let newBalance =
			BigInt(userDetails.wallet.balance) + BigInt(addMoneyInstance.amount);
		newBalance = newBalance.toString();
		userDetails.wallet.balance = newBalance;
		await userDetails.wallet.save();

		return res.status(200).json({
			is_verified: true,
			message: "Payment Successful! Balance Updated.",
			amount: converter.amountToDecimalString(addMoneyInstance.amount),
			balance: converter.amountToDecimalString(newBalance),
			transaction_id: response.transaction_id,
			razorpay_order_id: response.razorpay_order_id,
		});
	} catch (err) {
		console.log(err);
		return next(new Error("ERR: Unable to process Transaction."));
	}
};

const failedPayment = async (req, res, next) => {
	const {
		transaction_id,
		razorpay_payment_id,
		razorpay_order_id,
		status_message,
	} = req.body;

	try {
		const addMoneyInstance = await addMoneyTransaction.findByIdAndUpdate(
			transaction_id,
			{
				razorpay_payment_id: razorpay_payment_id,
				status: "FAILED",
				statusMessage: status_message,
			}
		);
	} catch (err) {
		console.log(err);
		return next(new Error("ERR: Unable to log failed Transaction."));
	}

	// Sending info for failed msg
	return res.status(200).json({
		message: "Payment status updated to 'FAILED'",
		transaction_id,
		razorpay_order_id,
		error_message: status_message,
	});
};

module.exports.createOrder = createOrder;
module.exports.capturePayment = capturePayment;
module.exports.failedPayment = failedPayment;
