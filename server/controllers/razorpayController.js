const { validationResult } = require("express-validator");
const RazorPay = require("razorpay");
const Users = require("../models/user");
require("dotenv").config();

const walletTransaction = require("../models/walletTransaction");

const razorInstance = new RazorPay({
	key_id: process.env.RAZORPAY_KEY_ID,
	key_secret: process.env.RAZORPAY_SECRET,
});

const createOrder = async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return next(new Error("Invalid inputs passed, please check your data."));
	}

	const { amount } = req.body;

	const options = {
		amount: amount * 100,
		currency: "INR",
		receipt: walletTransaction.id,
		payment_capture: false,
	};

	try {
		const order = await razorInstance.orders.create(options);
		console.log(order);

		const userDetails = await Users.findById(req.userData.id).populate(
			"wallet"
		);

		const currWalletTransaction = walletTransaction.create({
			category: "ADD",
			amount: amount.toString(),
			status: 2,
			razorpay_order_id: order.id,
		});

		// Order created
		return res.status(200).json({
			...order,
			userDetails: {
				name: userDetails.name,
				email: userDetails.email,
				mobile: userDetails.mobile,
			},
		});
	} catch (err) {
		return next(new Error("Unable to create order! ERR: " + err.message));
	}
};

const capturePayment = async (req, res, next) => {};

module.exports.createOrder = createOrder;
module.exports.capturePayment = capturePayment;
