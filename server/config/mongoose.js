const mongoose = require("mongoose");
const RecurringJobs = require('../recurringjobs/transaction');
require('dotenv').config();

const url = process.env.MONGODB_URL;

mongoose.connect(url);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Error connecting to mongodb"));
db.once("open", () => {
	console.log("Connected to Database :: MongoDB");
	// RecurringJobs.checkLimitBuy();
});

module.exports = db;