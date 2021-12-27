const express = require("express");
const { check, body } = require("express-validator");
const router = express.Router();

const watchListController = require("../controllers/usersController/watchList");
const login = require("../controllers/usersController/login");
const userDataController = require("../controllers/usersController/dataController");
const portfolioController = require("../controllers/usersController/portfolio");
const forgotPasswordController = require("../controllers/usersController/forgotPassword");
const signup = require("../controllers/usersController/signup");
const changePassword = require("../controllers/usersController/changePassword");
const notificationsController = require("../controllers/notificationController");
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

router.post("/login", [check("email").normalizeEmail().isEmail()], login);

router.post(
	"/forgotpassword/request",
	body("email").normalizeEmail().isEmail(),
	forgotPasswordController.forgotPasswordRequest
);

router.post(
	"/forgotpassword/reset",
	body("newPassword").isLength({ min: 6 }),
	forgotPasswordController.forgotPassword
);

// Verifying if Logged In
router.use(authVerify);

router.post("/data", userDataController.getData);
router.post(
	"/data/update",
	[
		check("name").not().isEmpty(),
		check("mobile").isLength({ min: 10, max: 10 }),
	],
	userDataController.updateData
);

router.post(
	"/changepassword",
	[
		check("newPassword").isLength({ min: 6 }),
		check("oldPassword").isLength({ min: 6 }),
	],
	changePassword
);

router.get("/watchlist/add/:id", watchListController.addToWatchList);
router.get("/watchlist/remove/:id", watchListController.removeFromWatchList);

router.get("/assets/report", portfolioController.getReports);
router.get("/assets/:id", portfolioController.getCoinAssetsData);
router.get("/assets", portfolioController.getAssetsData);

router.get("/notifications/get", notificationsController.getNotifications);
router.post("/notifications/delete", notificationsController.deleteNotifications);

module.exports = router;
