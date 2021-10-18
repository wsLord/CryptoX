const express = require('express');

const router = express.Router();
const usersRouter = require('./usersRouter');
const homeController = require('../controllers/homeController');
const verification = require('../controllers/verificationController');
const referralController = require('../controllers/referralController');

router.get("/", homeController.home);
router.use("/user", usersRouter);
router.use("/verify", verification);
router.use("/referral", referralController);

module.exports = router;