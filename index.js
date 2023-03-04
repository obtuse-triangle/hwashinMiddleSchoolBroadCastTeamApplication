const express = require("express");
const fs = require("fs");
const app = express();
const port = 40000;

app.use(express.static("public"));

app.get("/", (req, res) => {
    ip = req.get("CF-Connecting-IP");
    console.log(`Request received at ${new Date()} from ${ip} for ${req.url}`);
    res.sendFile(__dirname + "/index.html");
});

app.get("/fetch", (req, res) => {
    ip = req.get("CF-Connecting-IP");
    console.log(`Request received at ${new Date()} from ${ip} for ${req.url}`);
    const numName = req.query.num_name;

    // Validate that the num_name parameter matches the expected format
    const numNameRegex = /^[0-9]{4}\s[가-힣]+$/;
    if (!numName || !numName.match(numNameRegex)) {
        res.status(400).send("Error: Invalid input format. Please enter a valid num_name parameter.");
        return;
    }
    const [fetchNumber, fetchName] = numName.split(" ");
    console.log(`이름: ${fetchName}, 번호: ${fetchNumber}`);
    fs.readFile(__dirname + "/users.csv", "utf-8", (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).send("Error: An unexpected error occurred while processing your request. Please try again later.");
            return;
        }
        const lines = data.split("\n");

        // Search for a user with a matching number in the CSV data
        let userData;
        for (let line of lines) {
            const [userNum, userName, userMessage] = line.split(",");
            if (userNum === fetchNumber) {
                userData = { name: userName, message: userMessage };
                break;
            }
        }
        if (!userData) {
            res.sendFile(__dirname + "/notApplicationPeriod.html");
            return;
        }
        fs.readFile(__dirname + "/fetch.html", "utf-8", (err, html) => {
            if (err) {
                console.error(err);
                res.status(500).send("Error: An unexpected error occurred while processing your request. Please try again later.");
                return;
            }

            const sanitizedHtml = html.replace("{{num_name}}", `${fetchNumber} ${userData.name}`).replace("{{message}}", userData.message).replace("{{name}}", userData.name);

            res.send(sanitizedHtml);
        });
    });
});

app.get("/notapplicationperiod", (req, res) => {
    ip = req.get("CF-Connecting-IP");
    console.log(`Request received at ${new Date()} from ${ip} for ${req.url}`);
    res.sendFile(__dirname + "/notApplicationPeriod.html");
});

app.listen(port, () => console.log(`App is listening on port ${port}`));
