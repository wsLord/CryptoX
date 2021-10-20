const express = require("express");
const router = express.Router();
const authVerify = require("../middlewares/authVerify");
const referralController = require('../controllers/referralController');
router.post("/invite",referralController.invite);

router.use(authVerify);

router.get("/getcode",referralController.getCode);

module.exports = router;
