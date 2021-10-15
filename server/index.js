const express = require("express");

const app = express();
require('dotenv').config();

const mainRouter = require('./routes/mainRouter');

const port = process.env.PORT || 5000;
const db = require('./config/mongoose')

app.use('/', mainRouter);

app.listen(port, (err) => {
	if(err){
		console.log(`Error in running the server:${err}`);
	}
	console.log(`Server Started on port:${port}`);
});
