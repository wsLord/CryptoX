const express = require("express");
const { check, body } = require("express-validator");
const router = express.Router();

const watchListController = require("../controllers/usersController/watchList");
const login = require("../controllers/usersController/login");
const getUserData = require("../controllers/usersController/getData");
const portfolio = require("../controllers/usersController/portfolio");
const resetPassword = require("../controllers/usersController/resetPassword");
const resetPasswordRequest = require("../controllers/usersController/resetPasswordRequest");
const signup = require("../controllers/usersController/signup");

const authVerify = require("../middlewares/authVerify");

router.post(
	"/signup",
	[
		check("name").not().isEmpty(),
		check("email").normalizeEmail().isEmail(),
		check("mobile").isLength({ min: 10, max: 10 }),
		check("password").isLength({ min: 6 }),
	],
	signup
);

router.post(
	"/login",
	[check("email").normalizeEmail().isEmail()],
	login
);

router.post(
	"/resetPasswordReq",
	body("email").normalizeEmail().isEmail(),
	resetPasswordRequest
);

router.post(
	"/reset",
	body("newPassword").isLength({ min: 6 }),
	resetPassword
);

// Verifying if Logged In
router.use(authVerify);

router.post("/data", getUserData);

router.get("/watchlist/add/:id", watchListController.addToWatchList);
router.get("/watchlist/remove/:id", watchListController.removeFromWatchList);

router.get("/assets/:id", portfolio.getCoinAssetsData);
router.get("/assets/report", portfolio.getReports);
router.get("/assets", portfolio.getAssetsData);

module.exports = router;
