const express = require("express");
const router = express.Router();

const verificationController = require("../controllers/verificationController");
router.get("/email/:tokenID",verificationController.verification);
module.exports = router;
