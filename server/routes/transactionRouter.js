const express = require("express");
const { check } = require("express-validator");

const router = express.Router();
const transactionController = require("../controllers/transactionController");
const authVerify = require("../middlewares/authVerify");
// router.get("/profile", usersController.profile);

router.use(authVerify);

router.post('/buy:id', transactionController.buy);
router.post('/sell:id', transactionController.sell)
router.post('/buyLimit', transactionController.buyLimit);
module.exports = router;