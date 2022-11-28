const express = require("express");
const app = express();
const port = 40000;

app.use(express.static("public"));

app.get("/", (req, res) => {
	ip = req.get("CF-Connecting-IP");
	console.log(`Request received at ${new Date()} from ${ip} for ${req.url}`);
	res.sendFile(__dirname + "/index.html");
});

app.get("/notapplicationperiod", (req, res) => {
	ip = req.get("CF-Connecting-IP");
	console.log(`Request received at ${new Date()} from ${ip} for ${req.url}`);
	res.sendFile(__dirname + "/notApplicationPeriod.html");
});

app.listen(port, () => console.log(`App is listening on port ${port}`));
