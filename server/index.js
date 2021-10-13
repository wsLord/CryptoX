const express = require("express");

const app = express();

const port = 5000;

app.get("/", (req, res, next) => {
	res.send("Testing!");
});

app.listen(port, () => {
	console.log("Server Started!");
});
