const express = require("express");
const router = express.Router();
const { check, body } = require("express-validator");

const authVerify = require("../middlewares/authVerify");
const dataController = require("../controllers/transactionController/getData");
const buyController = require("../controllers/transactionController/buy");
const buyLimit = require("../controllers/transactionController/buyLimit");
const exchange = require("../controllers/transactionController/exchange");
const sellController = require("../controllers/transactionController/sell");
const sellLimit = require("../controllers/transactionController/sellLimit");
const sendReceiveController = require("../controllers/transactionController/sendReceive");
const sendRecieve = require("../controllers/transactionController/sendReceive");

router.use(authVerify);

// Transaction Details
router.get("/data/list", dataController.getTransactionList);
router.post("/data", dataController.getTransactionData);

// Buy Coin Normally
router.post(
	"/buy/quantity",
	[check("quantity").not().isEmpty(), check("coinid").not().isEmpty()],
	buyController.buyQuantity
);
router.post(
	"/buy/amount",
	[
		check("amount").isFloat({ min: 100, max: 100000 }),
		check("coinid").not().isEmpty(),
	],
	buyController.buyAmount
);

// Sell Coin Normally
router.post(
	"/sell/quantity",
	[check("quantity").not().isEmpty(), check("coinid").not().isEmpty()],
	sellController.sellQuantity
);
router.post(
	"/sell/amount",
	[
		check("amount").isFloat({ min: 100, max: 100000 }),
		check("coinid").not().isEmpty(),
	],
	sellController.sellAmount
);

router.post(
	"/buyLimit",
	[
		check("quantity").not().isEmpty(),
		check("maxPrice").not().isEmpty(),
		check("coinid").not().isEmpty(),
	],
	buyLimit
);
router.post(
	"/sellLimit",
	[
		check("quantity").not().isEmpty(),
		check("maxPrice").not().isEmpty(),
		check("coinid").not().isEmpty(),
	],
	sellLimit
);

// Send Coins - User Verify
router.post(
	"/send/verify",
	body("email").normalizeEmail().isEmail(),
	sendReceiveController.verifyUser
);
router.post(
	"/send",
	[
		check("quantity").not().isEmpty(),
		check("email").normalizeEmail().isEmail(),
		check("coinid").not().isEmpty(),
	],
	sendReceiveController.sendRecieve
);

router.post("/exchange", exchange);

module.exports = router;
