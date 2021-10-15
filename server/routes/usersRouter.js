const express = require('express');

const router = express.Router();
const usersController = require('../controllers/usersController');

router.get("/profile",usersController.profile);

router.post('/signup', 
	[
		check('name')
      .not()
      .isEmpty(),
    check('email')
      .normalizeEmail()
      .isEmail(),
    check('password').isLength({ min: 6 })
	],
	usersController.signup
);

router.post('/login',	usersController.login);

module.exports = router;