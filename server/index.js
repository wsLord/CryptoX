const express = require("express");

const app = express();

const mainRouter = require('./routes/mainRouter');

const port = 5000;

app.use('/', mainRouter);

app.listen(port, (err) => {
	if(err){
		console.log(`Error in running the server:${err}`);
	}
	console.log(`Server Started on port:${port}`);
});
