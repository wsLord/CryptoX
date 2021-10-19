const express = require("express");
const { check } = require("express-validator");

const router = express.Router();
const signupController = require("../controllers/signupController");
const loginController = require("../controllers/loginController");
const authenticate = require("../middlewares/authVerify");
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

router.post("/login", loginController);

router.get("/portfolio",authenticate.verify,usersController.portfolio);
router.get("/addToWatchList:id",authenticate.verify,usersController.addToWatchList);
module.exports = router;
