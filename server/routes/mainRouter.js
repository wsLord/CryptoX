const express = require('express');

const router = express.Router();
const usersRouter = require('./usersRouter');
const homeController = require('../controllers/homeController');
const verification = require('../controllers/verificationController');

router.get("/", homeController.home);
router.use("/user", usersRouter);
router.use("/verify", verification);

module.exports = router;