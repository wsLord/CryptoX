const express = require('express');

const router = express.Router();
const usersRouter = require('./usersRouter');
const transactionRouter=require('./transactionRouter');

const homeController = require('../controllers/homeController');

router.get("/", homeController.home);
router.use("/user", usersRouter);
router.use("/transaction", transactionRouter);

module.exports = router;