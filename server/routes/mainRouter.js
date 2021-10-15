const express = require('express');

const router = express.Router();
const usersRouter = require('./usersRouter');
const homeController = require('../controllers/homeController');

router.get("/", homeController.home);
router.use("/user", usersRouter);

module.exports = router;