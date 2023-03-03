const express = require("express");
const fs = require("fs");
const app = express();
const port = 4050;

app.use(express.static("public"));

app.get("/", (req, res) => {
    ip = req.get("CF-Connecting-IP");
    console.log(`Request received at ${new Date()} from ${ip} for ${req.url}`);
    res.sendFile(__dirname + "/index.html");
});

app.get("/fetch", (req, res) => {
    ip = req.get("CF-Connecting-IP");
    console.log(`Request received at ${new Date()} from ${ip} for ${req.url}`);
    if (req.query.number !== undefined && req.query.name !== undefined) {
        res.sendFile(__dirname + "/fetch.html");
        return;
    }

    const [fetchNumber, fetchName] = req.query.num_name.split(" ");
    console.log(`이름: ${fetchName}, 번호: ${fetchNumber}`);
    fs.readFile(__dirname + "/users.csv", "utf-8", (err, data) => {
        if (err) {
            console.log(err);
        } else {
            const users = data.split("\n");
            for (let i = 0; i < users.length; i++) {
                const user = users[i].split(",");
                if (user[0] === fetchNumber) {
                    let name = encodeURIComponent(user[1]);
                    let message = encodeURIComponent(user[2]);

                    res.redirect("/fetch?" + `number=${user[0]}&name=${name}&message=${message}`);
                    return;
                }
            }
        }
        res.sendFile(__dirname + "/notApplicationPeriod.html");
    });
});

app.get("/notapplicationperiod", (req, res) => {
    ip = req.get("CF-Connecting-IP");
    console.log(`Request received at ${new Date()} from ${ip} for ${req.url}`);
    res.sendFile(__dirname + "/notApplicationPeriod.html");
});

app.listen(port, () => console.log(`App is listening on port ${port}`));
