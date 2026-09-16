const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
require("dotenv").config();
require('./utils/createLogs');

require('./server.js');

const dns = require('node:dns');

dns.setServers(['8.8.8.8', '8.8.4.4']);

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages
    ],
    partials: [
        Partials.Channel,
        Partials.Message,
        Partials.Reaction,
        Partials.User
    ]
});

// 設定
const token = process.env.DISCORD_BOT_TOKEN;
const uri = process.env.DB;

mongoose
    .connect(uri)
    .then(() => {
        custom.log('Connected DataBase - index.js');
    })
    .catch((error) => {
        custom.error(error);
    });

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
    } else {
        custom.log(`${filePath} に必要な "data" か "execute" がありません。`);
    }
}

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client));
    } else {
        client.on(event.name, (...args) => event.execute(...args, client));
    }
}

client.login(token);