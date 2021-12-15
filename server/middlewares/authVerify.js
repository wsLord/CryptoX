const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = async (req, res, next) => {
	if (req.method === "OPTIONS") {
		return next();
	}

	try {
		const token = req.headers.authorization.split(" ")[1]; // Authorization: 'Bearer TOKEN'
		if (!token) {
			throw new Error("ERR: Authentication failed!");
		}
		const decodedToken = await jwt.verify(token, process.env.JWT_PRIVATE_KEY);
		req.userData = { id: decodedToken.userId, email: decodedToken.email };
		console.log('Authenticated with token!');
		next();
	} catch (err) {
		const error = new Error("ERR: Authentication failed!");
		return next(error);
	}
};