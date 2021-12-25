const express = require("express");
const router = express.Router();

const authVerify = require("../middlewares/authVerify");
const verificationController = require("../controllers/verificationController");

// Verifying token
router.get("/email/:tokenID",verificationController.verification);

router.use(authVerify);

// Resending Email Verification Mail
router.get("/email",verificationController.verifyEmailRequest);

module.exports = router;
