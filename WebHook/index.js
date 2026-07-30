const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(bodyParser.json());

const token = process.env.TOKEN; // Your Meta access token
const myToken = process.env.MY_TOKEN; // Your custom verify token

app.listen(process.env.PORT || 8000, () => {
    console.log("Webhook is working");
});

app.get("/webhook", (req, res) => {
    let mode = req.query["hub.mode"];
    let challenge = req.query["hub.challenge"];
    let verify_token = req.query["hub.verify_token"];

    if (mode && verify_token) {
        if (mode === "subscribe" && verify_token === myToken) {
            res.status(200).send(challenge);
        } else {
            res.sendStatus(403);
        }
    }
});

app.post("/webhook", (req, res) => {
    let bodyParam = req.body;
    console.log(JSON.stringify(bodyParam, null, 2));

    if (bodyParam.object) {
        let entry = bodyParam.entry?.[0];
        let changes = entry?.changes?.[0];
        let value = changes?.value;
        let message = value?.messages?.[0];

        if (message) {
            let phoneID = value.metadata.phone_number_id;
            let from = message.from;

            axios({
                method: "POST",
                url: "https://graph.facebook.com/v17.0/" + phoneID + "/messages",
                data: {
                    messaging_product: "whatsapp",
                    to: from,
                    text: {
                        body: "Hi, I'm Meh"
                    }
                },
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                }
            }).then(() => {
                res.sendStatus(200);
            }).catch(() => {
                res.sendStatus(500);
            });
        } else {
            res.sendStatus(200);
        }
    } else {
        res.sendStatus(404);
    }
});