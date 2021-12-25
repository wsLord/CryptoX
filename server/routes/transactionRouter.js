const express = require("express");
const router = express.Router();
const { check } = require("express-validator");

const authVerify = require("../middlewares/authVerify");
const dataController = require("../controllers/transactionController/getData");
const buy = require("../controllers/transactionController/buy");
const buyLimit = require("../controllers/transactionController/buyLimit");
const exchange = require("../controllers/transactionController/exchange");
const sell = require("../controllers/transactionController/sell");
const sellLimit = require("../controllers/transactionController/sellLimit");
const exchangePrice = require("../controllers/transactionController/exchangePrice");
router.use(authVerify);

router.get("/data/list", dataController.getTransactionList);
router.post("/data", dataController.getTransactionData);

router.post(
	"/buy",
	[check("quantity").not().isEmpty(), check("coinid").not().isEmpty()],
	buy
);
router.post(
	"/sell",
	[check("quantity").not().isEmpty(), check("coinid").not().isEmpty()],
	sell
);
router.post(
	"/buyLimit",
	[
		check("mode").not().isEmpty(),
		check("quantity").not().isEmpty(),
		check("maxPrice").not().isEmpty(),
		check("coinid").isLength({ min: 3, max: 3 }),
	],
	buyLimit
);
router.post(
	"/sellLimit",
	[
		check("mode").not().isEmpty(),
		check("quantity").not().isEmpty(),
		check("maxPrice").not().isEmpty(),
		check("coinid").isLength({ min: 3, max: 3 }),
	],
	sellLimit
);
router.post("/exchange", exchange);
router.get("/exchangePrice",
[
	check("coinId1").not().isEmpty(),
	check("coinId2").not().isEmpty(),
	
],
exchangePrice);

module.exports = router;
