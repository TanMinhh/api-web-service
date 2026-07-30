const { WebhookClient } = require("discord.js");
const readline = require("readline-sync");
require("dotenv").config();

var question = "Your name?: ";
var name = readline.question(question);

const discordWebhookID = process.env.DISCORD_ID;
const discordWebhookToken = process.env.DISCORD_TOKEN;
const webhook = new WebhookClient({ id: discordWebhookID, token: discordWebhookToken });//new WebhookClient({url:""});

webhook.send(question);
webhook.send(name);