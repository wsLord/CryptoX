const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports.verify = (req, res, next) => {
	if (req.method === "OPTIONS") {
		return next();
	}

	try {
		const token = req.headers.authorization.split(" ")[1]; // Authorization: 'Bearer TOKEN'
		if (!token) {
			throw new Error("Authentication failed!");
		}
		const decodedToken = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
		req.userData = { id: decodedToken.userId, email: decodedToken.email };
		next();
	} catch (err) {
		const error = new Error("Authentication failed!");
		return next(error);
	}
};
