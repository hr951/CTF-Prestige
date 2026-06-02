const { SlashCommandBuilder } = require("discord.js");
require('dotenv').config();

const token = process.env.DISCORD_BOT_TOKEN;
const clientId = "1511027390061477940";

// ----- グローバルコマンドここから-----
const prestige = new SlashCommandBuilder()
    .setName('prestige')
    .setDescription('CTFにプレステージを適応します')
    .addStringOption(option =>
        option.setName('name')
            .setDescription('ユーザー名')
            .setRequired(true)
    );

const commands = [prestige];

// 登録用関数
const { REST, Routes } = require("discord.js")
const rest = new REST({ version: '10' }).setToken(token)
async function main() {
    await rest.put(
        Routes.applicationCommands(clientId),
        { body: commands },
    );
}

main().catch(err => console.log(err));