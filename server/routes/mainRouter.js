const express = require('express');

const router = express.Router();
const usersRouter = require('./usersRouter');
const transactionRouter=require('./transactionRouter');

const homeController = require('../controllers/homeController');
const verification = require('../controllers/verificationController');
const referralController = require('../controllers/referralController');
// const forgotPasswordController = require('../controllers/forgotPasswordController');

router.get("/", homeController.home);
router.use("/user", usersRouter);
router.use("/verify", verification);
router.use("/referral", referralController);
router.use("/transaction", transactionRouter);
// router.use("/forgotpassword", forgotPasswordController);

module.exports = router;