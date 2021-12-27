const express = require("express");

const router = express.Router();
const usersRouter = require("./usersRouter");
const transactionRouter = require("./transactionRouter");
const verificationRouter = require("./verificationRouter");
const referralRouter = require("./referralRouter");
const paymentRouter = require("./paymentRouter");
const coinDataController = require("../controllers/coinDataController");
const homeController = require("../controllers/homeController");

router.get("/", homeController.home);
router.use("/user", usersRouter);
router.use("/verify", verificationRouter);
router.use("/referral", referralRouter);
router.use("/transaction", transactionRouter);
router.use("/payment", paymentRouter);

router.post("/coin/data", coinDataController.getData);

module.exports = router;
