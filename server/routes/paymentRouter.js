const express = require("express");
const router = express.Router();
const { check } = require("express-validator");

const authVerify = require("../middlewares/authVerify");
const razorpayController = require("../controllers/razorpayController");

router.use(authVerify);

router.post(
	"/order",
	[check("amount").isInt({ min: 100, max: 100000 })],
	razorpayController.createOrder
);

router.post(
	"/capture",
	[check("amount").isInt({ min: 100, max: 100000 })],
	razorpayController.capturePayment
);

router.post(
	"/failed",
	// [check("amount").isInt({ min: 100, max: 100000 })],
	razorpayController.failedPayment
);

module.exports = router;
