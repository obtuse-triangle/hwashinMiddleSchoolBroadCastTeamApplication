const express = require("express");
const app = express();
const port = 40000;

app.use(express.static("public"));

app.get("/", (req, res) => {
	console.log(`Request received at ${new Date()} from ${req.ip}`);
	res.sendFile(__dirname + "/index.html");
});

app.get("/notapplicationperiod", (req, res) => {
	console.log(`Request received at ${new Date()} from ${req.ip}`);
	res.sendFile(__dirname + "/notapplicationperiod.html");
});

app.listen(port, () => console.log(`App is listening on port ${port}`));
