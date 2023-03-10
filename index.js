const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const app = express();
const port = 40000;

// app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
    ip = req.get("CF-Connecting-IP");
    console.log(`Request received at ${new Date()} from ${ip} for ${req.url}`);
    res.sendFile(__dirname + "/index.html");
});

app.post("/fetch", (req, res) => {
    ip = req.get("CF-Connecting-IP");
    console.log(`Request received at ${new Date()} from ${ip} for ${req.url}`);
    const numName = req.body.num_name.replace(/\s/g, "");

    // Validate that the num_name parameter matches the expected format
    const numNameRegex = /^[0-9]{4}\s?[가-힣]+$/;
    // numName = numName.replace(/[^\w]/g, "");
    console.log(numName);
    if (!numName || !numName.match(numNameRegex)) {
        res.status(400).send("Error: Invalid input format. Please enter a valid num_name parameter.");
        return;
    }
    //const [fetchNumber, fetchName] = numName.split(" ");
    const fetchNumber = numName.slice(0, 4);
    const fetchName = numName.slice(4);
    console.log(`이름: ${fetchName}, 번호: ${fetchNumber}`);
    fs.readFile(__dirname + "/users.csv", "utf-8", (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).send("Error: An unexpected error occurred while processing your request. Please try again later.");
            return;
        }
        const lines = data.split("\n");

        let userData;
        for (let line of lines) {
            const [userNum, userName, userMessage] = line.split(",");
            if (userNum === fetchNumber && userName === fetchName) {
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

            const sanitizedHtml = html.replace("{{num_name}}", `${fetchNumber} ${userData.name}`).replace("{{message}}", userData.message);

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
