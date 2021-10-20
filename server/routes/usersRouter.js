const express = require("express");
const { check } = require("express-validator");
const { body } = require("express-validator");
const router = express.Router();
const signupController = require("../controllers/signupController");
const loginController = require("../controllers/loginController");
const usersController = require("../controllers/usersController");
const authVerify = require("../middlewares/authVerify");
// router.get("/profile", usersController.profile);

router.post(
	"/signup",
	[
		check("name").not().isEmpty(),
		check("email").normalizeEmail().isEmail(),
		check("mobile").isLength({ min: 10, max: 10 }),
		check("password").isLength({ min: 6 })
	],
	signupController
);

router.post("/login", usersController.login);
router.post("/resetPasswordReq",body("email").normalizeEmail().isEmail(),usersController.resetPasswordReq);
router.post("/reset",body("newPassword").isLength({ min: 6 }),usersController.reset);

router.use(authVerify);

router.get("/portfolio", usersController.portfolio);
router.get("/addToWatchList:id", usersController.addToWatchList);

module.exports = router;
