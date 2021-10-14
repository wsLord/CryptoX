const express = require("express");

const app = express();

const mainRouter = require('./routes/mainRouter');

const port = 5000;

app.use('/', mainRouter);

app.listen(port, () => {
	console.log("Server Started!");
});
